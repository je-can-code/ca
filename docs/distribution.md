# Distribution

How Chef Adventure gets from this repo to a player: one bundle per OS, with NW.js inside, and nothing to install.
Planned 2026-10-14. The bundle script and the start-position check were built 2026-10-15; the release workflow is
not built yet.

## What we're making

Chef Adventure is free, and always will be. The bundles exist so a player never thinks about NW.js versions or
plugins: unzip, plug in a controller, double-click, play.

Four bundles, all on the same pinned NW.js version:

| Target | NW.js build | Where the game goes | What the player double-clicks | Packed as |
|---|---|---|---|---|
| `windows` | `win-x64` | `package.nw/`, beside the runtime | `nw.exe`, renamed `Chef Adventure.exe` | `.zip` |
| `linux` | `linux-x64` | `package.nw/`, beside the runtime | `nw`, renamed `chef-adventure` | `.tar.gz`, which keeps the executable bit |
| `macos-arm64` | `osx-arm64` | `Chef Adventure.app/Contents/Resources/app.nw/` | `Chef Adventure.app` | `.zip` |
| `macos-x64` | `osx-x64` (Intel Macs; see Open questions) | same as above | `Chef Adventure.app` | `.zip` |

NW.js loads a `package.nw/` folder sitting beside its binary without being told to (and `app.nw/` inside a Mac
app), so the renamed binary is the play button and no launcher script is needed. Keeping the game in its own
folder also keeps it apart from the runtime's own files. A bundle never passes the `test` argument, so it never
runs in playtest mode.

**In the bundle:** `audio/`, `css/`, `data/`, `effects/`, `fonts/`, `icon/`, `img/`, `js/`, `movies/`,
`index.html`, `package.json`.

**Left out:** `save/` (the dev saves), `docs/`, `jmz-editor/`, `.codegraph/`, `.cursor/`, `game.rmmzproject`,
`play.sh`.

The shipped `package.json` is generated, not copied: it is named `chef-adventure` rather than MZ's default
`rmmz-game`, because NW.js stores an app's data in a directory named after that field and every MZ game that kept
the default shares one, and it carries the bundle's version. MZ owns the project's own copy and rewrites it.

## Building one

```bash
bun run bundle                               # every target, labelled `dev`
bun run bundle --version v0.7.1              # what the release workflow will pass
bun run bundle --targets windows,linux       # a subset
```

It runs every `bun run validate` check first and refuses to build if any fails. NW.js runtimes download once into
the gitignored `.cache/nwjs/`, each verified against the checksum list NW.js publishes, and the archives land in
the gitignored `dist/` as `chef-adventure-<version>-<target>.<zip|tar.gz>`. All four take about 100 seconds; most
of that is packing. Built off a Mac, the Mac apps come out unsigned, and the run says so.

A Linux bundle can be smoke-tested headless: extract it, run `chef-adventure` under `xvfb-run` with
`--mute-audio` (always), `--ozone-platform=x11` and `WAYLAND_DISPLAY` unset (or it opens on the real desktop),
plus `--use-gl=angle --use-angle=gl --ignore-gpu-blocklist`, then photograph the virtual screen with ImageMagick's
`import -window root`. The normal NW.js flavor has no DevTools, so a remote-debugging probe cannot connect to it.
The first one, 2026-10-15, reached the title screen and wrote `save/config.json` from a fresh install.

## Decisions

- **Free, forever.**
- **No paid signing or notarization.** Each bundle carries a README for its OS with the one-time steps:
  - Windows: SmartScreen may say "Windows protected your PC". Choose More info, then Run anyway.
  - macOS: move the app out of Downloads first (Applications is fine), open it once, then go to
    System Settings > Privacy & Security and choose Open Anyway. After that it opens with a double-click.
  - Linux: extract it and run `chef-adventure`.
- **The Mac bundle gets a free ad-hoc signature** (`codesign --force --deep --sign -`) after the game goes inside
  it. Without one, macOS tends to call the app damaged instead of offering Open Anyway.
- **Saves stay in the game's own `save/` folder** (vanilla `StorageManager.fileDirectoryPath`, which J-Base-Save
  inherits). That is why the Mac README says to move the app first: a downloaded app launched where it landed can
  run from a read-only copy (App Translocation), and saving fails there.
- **`main` always starts where a player does.** The real start is Map 4 "Cave - 1 - START" at (8, 11). A new
  `bun run validate` check fails any pull request whose `System.json` starts anywhere else, so a branch can point
  at a test map freely and still never land one. `main` has shipped starting in Test Oasis (March to May 2026),
  Jafting Oasis (late August) and three test maps in September.
- **CI builds and publishes the bundles.** Each landing on `main`, once validation passes, builds every target and
  publishes them as a GitHub Release on this repo. The same Bun script runs locally, so a bundle can always be
  built and tested by hand. Free for a public repo; each file must be under 2 GiB, and releases have no cap on
  total size or downloads.
- **Every merge into `main` is its own release, with its own version.** One release per merge, holding every
  bundle.
- **Not MZ's built-in Deployment.** It has no Linux output, it is a button in the editor that CI cannot press, it
  packs MZ's own NW.js (v0.51 from January 2021, Intel-only on Mac), and its Exclude Unused Files drops files
  that plugins load themselves. The bundle script does the same job, scriptable.
- **One script, two places.** `bun run bundle` is written and tested locally first; the release workflow later
  runs that same script on GitHub's machines. On a Mac runner it also signs the Mac app, because `codesign` only
  exists on macOS; a local Linux build leaves that one step for the tester's Mac.
- **A label on the pull request picks the bump.** No label is a patch bump, so most PRs need nothing. `bump:minor`
  marks a dungeon landing and `bump:major` marks the release that becomes `v1.0.0`. The names follow
  [action-bumpr](https://github.com/haya14busa/action-bumpr)'s convention; there is no single industry standard.

## Release history

This repo has published releases since 2021, tagged by chapter: `ch1-v1.0.0` (2021-05-09), `ch2-v1.0.0` through
`ch2-v2.0.0` (2021-12 to 2022-04), `ch3-v0.0.1` through `ch3-v0.5.0` (2022-05 to 2024-04), and `ch4-v1.0.0`
(2026-02-09), titled "CA - Chapter N - vX.Y.Z". Each was a hand-cut alpha snapshot with hand-written notes and a
single zip; the chapter 4 zip was about 400 MB.

## Testing

A new NW.js version is tested before it gets pinned:

- **Linux:** Jeremy plays on it day to day. His local `nw` (`/mnt/exdrive/dev/utilities/nwjs`) is the SDK build,
  so swap in the SDK build of the candidate version.
- **Windows:** run the Windows bundle in Proton (`umu-run`) or `wine-staging`. A pass proves the bundle is put
  together right; it does not show what real Windows adds, like SmartScreen.
- **macOS:** Madeleine's 16-inch MacBook Pro.
- **Performance:** F2 toggles MZ's FPS meter, so the same map can be compared before and after a bump.

## Sizes, measured 2026-10-14

- Game files: about 365 MB raw, 290 MB zipped. Images and audio are about 140 MB each and barely compress.
- NW.js v0.118.0 downloads: Windows ~206 MB, Linux ~187 MB, macOS arm64 ~167 MB.
- Measured bundles, 2026-10-15: Windows 494 MB, Linux 479 MB, macOS arm64 456 MB, macOS x64 472 MB. A full set of
  four is about 1.9 GB.
- NW.js is a fixed floor under every bundle. If half of `img/` and `audio/` turns out to be dead (see Later), and
  `fonts/Iosevka-Light.ttc` goes too, the game zip drops to roughly 145 MB and each bundle to about 310-350 MB.

## Open questions

- **Version scheme:** Jeremy puts the game at `v0.7.0` today, with one minor version per remaining dungeon:
  Nimbus lands `v0.8.0`, the Subterranean Depths `v0.9.0`, and the Frozen Fortress is `v1.0.0`. Every other merge
  bumps the patch (`v0.7.1`, `v0.7.2`, ...) automatically. The chapter tags stay as history.
- **Merges that never touch `chef-adventure/`** (docs, tools): release anyway, or skip?
- **Which NW.js to pin:** v0.118.0 (Chromium 155, released 2026-10-10) is the candidate. Jeremy's local install
  moved to it on 2026-10-14, and on 2026-10-15 he reported it plays CA fine on Linux, so it is the pin unless the
  Windows or Mac bundle tests turn something up. The previous v0.110.1 (Chromium 147) is kept at
  `/mnt/exdrive/dev/utilities/nwjs-v0.110.1`; rolling back means swapping the two folder names.
- **Intel Macs:** NW.js ships `osx-arm64` and `osx-x64` separately, and the script builds both for now, so
  whichever chip Madeleine's MacBook has can be tested. Whether releases keep the Intel one is open.
- **Icons:** the Windows exe and the Mac app should show CA's icon rather than NW.js's.
- **The Mac app's display name:** the app's `Info.plist` still says `nwjs`, so the Privacy & Security pane, the
  menu bar and the dock all say "nwjs". It has to say Chef Adventure before a real release, or the Mac README's
  "Open Anyway next to Chef Adventure" points at a name the player will not see. Renaming has to happen before
  the app is signed.

## Steps

1. **Done 2026-10-15.** Pin the NW.js version in one file the script reads: `tools/bundle/nwjs.json`.
2. **Done 2026-10-15.** Add the start-position check to `tools/validate`, with selftest controls that plant a
   test-map start and a start one tile off.
3. **Done 2026-10-15.** Write the bundle script (`bun run bundle`): download and cache NW.js per OS, copy the game
   in, rename the binary, add the README, and pack each bundle into a gitignored `dist/`.
4. Build the bundles locally and test them (see Testing). The Linux one boots to the title screen headless.
5. Add the release workflow: on a push to `main`, after validate, build the bundles (the Mac one on a macOS runner,
   for `codesign`), read the merged PR's `bump:*` label to pick the next version, and publish the release.
6. Create the `bump:minor` and `bump:major` labels, and put the label reminder in the PR template and in the git
   section of `CLAUDE.md`.

## Later, before 1.0.0

Prune every image and audio file the game never uses. Jeremy expects half or more of `img/` and `audio/` is dead.
Proving a file unused means checking every place a file name can live: database fields, map and common events,
plugin parameters in `plugins.js`, `config.*.json`, notetags, text codes, and plugin code that builds a file name.
Already known: `fonts/Iosevka-Light.ttc` is 44 MB and nothing references it.

## Sources

- [Apple: opening apps that aren't notarized](https://support.apple.com/en-us/102445)
- [NW.js: Package and Distribute](https://docs.nwjs.io/For%20Users/Package%20and%20Distribute/)
- [NW.js: Manifest Format](https://docs.nwjs.io/References/Manifest%20Format/)
- [GitHub: About releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)
- [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions)
- [Eclectic Light: what causes App Translocation](https://eclecticlight.co/2023/05/09/what-causes-app-translocation)
