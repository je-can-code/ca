//region Journal
const fs = globalThis.require('fs');
const { Buffer } = globalThis.require('buffer');

/**
 * What a run leaves behind: a plain text account of what the bot did and saw, the screenshots that go
 * with it, and the report that says how it ended.
 *
 * Lines are appended the moment they happen rather than held until the end, because the runs worth
 * reading most are the ones that died halfway through.
 */
class Journal
{
  /**
   * The quality of a screenshot. Good enough to read a dialogue box, small enough to keep hundreds.
   * @type {number}
   */
  static ShotQuality = 0.8;

  /**
   * The folder this run writes into.
   * @type {string}
   */
  #directory;

  /**
   * How many screenshots have been taken, which orders them in the folder.
   * @type {number}
   */
  #shots = 0;

  /**
   * Complaints the game itself made, each kept once with how many times it came up.
   * @type {Map<string, number>}
   */
  #complaints = new Map();

  /**
   * @param {string} directory The folder this run writes into.
   */
  constructor(directory)
  {
    this.#directory = directory;
  }

  /**
   * Formats how long the game has been running, in game time. Frames are the game's own clock, so a
   * stamp means the same thing no matter how slowly the machine drew them.
   * @returns {string}
   */
  static clock()
  {
    // the engine is not loaded yet for the first few lines of a run.
    const frames = globalThis.Graphics ? Graphics.frameCount : 0;

    return Journal.formatFrames(frames);
  }

  /**
   * Formats a frame count as minutes and seconds of game time.
   * @param {number} frames The frames to format.
   * @returns {string}
   */
  static formatFrames(frames)
  {
    const totalSeconds = Math.floor(frames / 60);
    const minutes = String(Math.floor(totalSeconds / 60))
      .padStart(2, '0');
    const seconds = String(totalSeconds % 60)
      .padStart(2, '0');

    return `${minutes}:${seconds}`;
  }

  /**
   * Adds a line to the account of the run.
   * @param {string} line What happened.
   */
  note(line)
  {
    fs.appendFileSync(`${this.#directory}/journal.log`, `${Journal.clock()}  ${line}\n`);
  }

  /**
   * Remembers something the game complained about. The same complaint from every frame of a run would
   * bury the journal, so only its first appearance gets a line.
   * @param {string} kind The kind of complaint.
   * @param {string} text What the game said.
   */
  complain(kind, text)
  {
    const complaint = `${kind}: ${text}`.slice(0, 400);
    const seen = this.#complaints.get(complaint) ?? 0;
    this.#complaints.set(complaint, seen + 1);

    if (seen === 0) this.note(`!! ${complaint}`);
  }

  /**
   * Takes a screenshot of what the game is showing right now, drawn from the scene itself so that it
   * works whether or not the game is drawing to the screen at all.
   * @param {string} label What the picture is of, which becomes part of its name.
   */
  snap(label)
  {
    this.#shots += 1;

    const bitmap = SceneManager.snap();
    const [ , encoded ] = bitmap.canvas.toDataURL('image/jpeg', Journal.ShotQuality)
      .split(',');
    bitmap.destroy();

    const number = String(this.#shots)
      .padStart(3, '0');
    const name = `${number}-${label}.jpg`;
    fs.writeFileSync(`${this.#directory}/shots/${name}`, Buffer.from(encoded, 'base64'));

    this.note(`shot: ${name}`);
  }

  /**
   * Writes the report that says how the run ended.
   * @param {object} report The numbers.
   */
  writeReport(report)
  {
    const complaints = Array.from(this.#complaints, ([ text, count ]) => ({ text, count }));
    const body = JSON.stringify({ ...report, complaints }, null, 2);

    fs.writeFileSync(`${this.#directory}/report.json`, body);
  }
}

export default Journal;
//endregion Journal
