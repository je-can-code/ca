/**
 * png — read the icon sheet just far enough to know which tiles somebody painted.
 *
 * `\I[n]` names a 32x32 tile of `img/system/IconSet.png` by index, and MZ draws whatever is there.
 * An index past the end of the sheet, or on a tile nobody ever painted, draws nothing at all and
 * complains about nothing, so telling those apart from a real icon needs the pixels. This decodes the
 * one channel that answers the question - alpha - and reports, per tile, whether any of it is opaque.
 *
 * It reads exactly the encoding RPG Maker MZ ships the sheet in: 8-bit RGBA, not interlaced. Anything
 * else is refused with a message naming the file, because a sheet re-exported in some other encoding
 * should be re-exported again rather than half-read.
 */

import zlib from 'node:zlib';

/**
 * The eight bytes every PNG opens with.
 * @type {number[]}
 */
const SIGNATURE = [ 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a ];

/**
 * The colour type of an RGBA image, the only one this reader accepts.
 * @type {number}
 */
const RGBA = 6;

/**
 * Bytes per pixel of an 8-bit RGBA image.
 * @type {number}
 */
const BYTES_PER_PIXEL = 4;

/**
 * Where alpha sits within a pixel's four bytes.
 * @type {number}
 */
const ALPHA_OFFSET = 3;

/**
 * The width and height of one icon, which MZ fixes.
 * @type {number}
 */
export const ICON_SIZE = 32;

/**
 * Splits a PNG into its header fields and its compressed image data.
 * @param {Uint8Array} bytes The whole file.
 * @param {string} file The file's name, for the report.
 * @returns {{ width: number, height: number, depth: number, colourType: number, interlace: number,
 *   compressed: Uint8Array }}
 */
const readChunks = (bytes, file) =>
{
  if (SIGNATURE.some((byte, index) => bytes[index] !== byte)) throw new Error(`${file} is not a PNG`);

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const header = {};
  const dataChunks = [];
  let offset = SIGNATURE.length;

  // every chunk is a length, a four-letter type, the data, and a checksum this reader does not verify.
  while (offset < bytes.length)
  {
    const length = view.getUint32(offset);
    const type = String.fromCharCode(...bytes.subarray(offset + 4, offset + 8));
    const data = bytes.subarray(offset + 8, offset + 8 + length);

    if (type === 'IHDR')
    {
      header.width = view.getUint32(offset + 8);
      header.height = view.getUint32(offset + 12);
      header.depth = data[8];
      header.colourType = data[9];
      header.interlace = data[12];
    }

    if (type === 'IDAT') dataChunks.push(data);
    if (type === 'IEND') break;

    offset += 12 + length;
  }

  // the image data may be split across any number of chunks; joined, it is one zlib stream.
  const compressed = new Uint8Array(dataChunks.reduce((total, chunk) => total + chunk.length, 0));
  dataChunks.reduce((position, chunk) =>
  {
    compressed.set(chunk, position);

    return position + chunk.length;
  }, 0);

  return { ...header, compressed };
};

/**
 * The Paeth predictor: whichever of the left, above and above-left bytes is closest to their sum
 * less the corner.
 * @param {number} left The byte one pixel to the left.
 * @param {number} above The byte one scanline up.
 * @param {number} corner The byte one pixel to the left, one scanline up.
 * @returns {number}
 */
const paeth = (left, above, corner) =>
{
  const estimate = left + above - corner;
  const toLeft = Math.abs(estimate - left);
  const toAbove = Math.abs(estimate - above);
  const toCorner = Math.abs(estimate - corner);

  if (toLeft <= toAbove && toLeft <= toCorner) return left;
  if (toAbove <= toCorner) return above;

  return corner;
};

/**
 * What a scanline filter predicted for one byte, given its neighbours.
 * @param {number} filter The scanline's filter type, 0 to 4.
 * @param {number} left The byte one pixel to the left, or 0 at the left edge.
 * @param {number} above The byte one scanline up, or 0 on the first line.
 * @param {number} corner The byte one pixel to the left, one scanline up, or 0 at either edge.
 * @returns {number}
 */
const predicted = (filter, left, above, corner) =>
{
  switch (filter)
  {
    case 0:
      return 0;
    case 1:
      return left;
    case 2:
      return above;
    case 3:
      return (left + above) >> 1;
    case 4:
      return paeth(left, above, corner);
    default:
      throw new Error(`png: unknown scanline filter ${filter}`);
  }
};

/**
 * Undoes the per-scanline filtering, leaving raw pixel bytes.
 * @param {Uint8Array} filtered The inflated image data: each scanline is a filter byte then its pixels.
 * @param {number} width The image width in pixels.
 * @param {number} height The image height in pixels.
 * @returns {Uint8Array} `width * height * 4` bytes of RGBA.
 */
const unfilter = (filtered, width, height) =>
{
  const stride = width * BYTES_PER_PIXEL;
  const pixels = new Uint8Array(stride * height);
  let offset = 0;

  for (let y = 0; y < height; y++)
  {
    const filter = filtered[offset++];
    const line = y * stride;
    const previous = line - stride;

    for (let x = 0; x < stride; x++)
    {
      // each byte is predicted from the already-decoded byte to its left, above it, and diagonally.
      const left = x >= BYTES_PER_PIXEL ? pixels[line + x - BYTES_PER_PIXEL] : 0;
      const above = y > 0 ? pixels[previous + x] : 0;
      const corner = (x >= BYTES_PER_PIXEL && y > 0) ? pixels[previous + x - BYTES_PER_PIXEL] : 0;

      pixels[line + x] = (filtered[offset++] + predicted(filter, left, above, corner)) & 0xff;
    }
  }

  return pixels;
};

/**
 * Reads an icon sheet and records which of its tiles carry any opaque pixel.
 * @param {Uint8Array} bytes The whole PNG.
 * @param {string} file The file's name, for the report.
 * @returns {{ file: string, columns: number, drawn: Uint8Array }} `drawn[index]` is 1 for a tile with
 *   at least one opaque pixel and 0 for one nobody painted; its length is the number of tiles the
 *   sheet holds.
 */
export const readIconSheet = (bytes, file) =>
{
  const { width, height, depth, colourType, interlace, compressed } = readChunks(bytes, file);

  if (depth !== 8 || colourType !== RGBA || interlace !== 0)
  {
    throw new Error(`${file} is not an 8-bit, non-interlaced RGBA PNG (depth ${depth}, colour type ${colourType}, `
      + `interlace ${interlace}); re-export it the way RPG Maker MZ ships it`);
  }

  const pixels = unfilter(zlib.inflateSync(compressed), width, height);
  const columns = Math.floor(width / ICON_SIZE);
  const rows = Math.floor(height / ICON_SIZE);
  const drawn = new Uint8Array(columns * rows);

  // one opaque pixel anywhere in a tile is enough for the tile to count as painted.
  for (let y = 0; y < rows * ICON_SIZE; y++)
  {
    const tileRow = Math.floor(y / ICON_SIZE) * columns;

    for (let x = 0; x < columns * ICON_SIZE; x++)
    {
      if (pixels[(y * width + x) * BYTES_PER_PIXEL + ALPHA_OFFSET] !== 0) drawn[tileRow + Math.floor(x / ICON_SIZE)] = 1;
    }
  }

  return { file, columns, drawn };
};
