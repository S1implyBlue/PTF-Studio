# PTF Studio Beta 0.9.5 Test Report

## Static checks

- JavaScript syntax validated for `app.js`, `asset_maker.js`, `rlz.js`, and `sample.js`.
- Every Asset Maker DOM reference is present in `index.html`.
- Main and macOS app resources are synchronized.
- Version and cache identifiers are consistent.

## Regression checks

- Bundled `PTF_STUDIO_SAMPLE_THEME.ptf` matches the embedded sample byte-for-byte.
- Correct Title, Product ID, fixed-colour metadata records, RLZ/LZR, Deflate, and stored import/export code paths remain present.
- Exact-size Import and alpha-safe bicubic Downscale & Import remain present.

## Asset Maker checks

- All eight PSP canvas presets are declared with the correct dimensions.
- Layer import, shapes, transforms, ordering, duplication, deletion, undo, and redo are wired.
- Indexed palette preview is available only as a non-destructive preview.
- Output applies at native preset dimensions to compatible theme slots.
- Wallpaper XMB overlay is preview-only and is not baked into the wallpaper.
- Sample icon library is not bundled.

Real PSP testing remains recommended before public distribution.
