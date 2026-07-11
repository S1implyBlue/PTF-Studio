# PTF Studio Beta 0.9.1 — Test Report

## Automated checks completed

- JavaScript syntax verified with Node.js 22.
- All 47 DOM element references used by `app.js` resolve to IDs present in `index.html`.
- The bundled `S1mplyBlue.ptf` structure was parsed successfully.
- The sample contains 29 first-level focus slots, all targeted by the new bulk-focus operation.
- Corrected labels are present for Extras, Save Data Utility, and UMD Update.
- The upper-lane positioning rule is present for first-level icons above the category row.
- Root browser files and macOS app resources match byte-for-byte.
- Version strings and cache identifiers report Beta 0.9.1.

## Export behaviour

- Batch-edited focus images use the same normal asset pipeline as individual replacements.
- Each focus image is resized according to its PTF slot requirements and the selected fit mode.
- Indexed focus assets remain subject to the existing 256-colour quantisation during PTF export.
- Restore-all reloads each first-level focus asset from the imported PTF data.

## Recommended release check

Test one bulk-edited export from `/PSP/THEME/` on real PSP hardware before public distribution.
