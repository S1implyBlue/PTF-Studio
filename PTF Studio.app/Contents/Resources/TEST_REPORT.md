# Test Report — PTF Studio 1.0

Passed release checks:

- JavaScript syntax validation for the main editor, Asset Maker, RLZ/LZR decoder, and embedded sample.
- Static HTML/CSS/ID linkage checks.
- Browser smoke test in Chromium with the embedded sample loaded.
- Browser export smoke test produced a valid `SAMPLE.ptf` with the expected PTF magic, Title, Product ID, and file size.
- Main UI and Asset Maker modal rendered without console or page errors.
- PTF metadata layout checks for Title, Product ID, Version, and theme colour.
- Embedded sample matches the distributed sample PTF byte-for-byte.
- Legacy RLZ/LZR, Deflate/stored export paths, PSP Go slots, focus generation, import modes, bicubic resizing, and Asset Maker checks remain intact.
- Release 1.0 navigation rail, responsive UI styles, live-view calibration constants, neighbouring label rendering, and storage-label layout are present.
- Root browser files and macOS application resources are synchronized.

Hardware validation was not performed in this build environment. Exported themes should be tested on the intended PSP model before public distribution.

- PSP-safe focus generation: 8 px margins, white alpha-only palette, GIM round-trip validation and 768 KB preflight.

## PSP-safe focus regression

- 48×48 normal icon → 64×64 focus: passed.
- 32×32 normal icon → 48×48 focus: passed.
- Generated RGB: pure white on visible pixels; zeroed on transparent pixels.
- Sharp source core removal: passed.
- Used palette entries: 21 in the representative fixture, below the 64-entry limit.
- GIM encode/decode round trip: passed for both focus sizes.
- Static release verification and JavaScript syntax checks: passed.

- Export workflow dialog, metadata fields, fixed/monthly colour selector, validation report, explicit confirmation, and final-size gate are present.
