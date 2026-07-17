# Test Report — PTF Studio Beta 0.9.5.3

Passed static and package regression checks:

- JavaScript syntax checks for app, Asset Maker, RLZ decoder, and embedded sample.
- Bulk focus generator UI controls and matching body-to-focus pairing.
- First-level focus output uses 64 × 64; second-level focus output uses 48 × 48.
- Both-level, first-level, second-level, current-category, and selected-pair scopes.
- Missing-only and replace-all generation modes.
- Contact-sheet preview, count summary, and empty-source handling.
- Undo restores prior focus images and removes newly created synthetic focus slots.
- Existing PSP Go profile, metadata, colour, RLZ/LZR, bicubic resizing, Asset Maker, and sample-theme checks remain intact.
- Top-level browser files and macOS application resources are synchronized.

Real-hardware validation is still recommended for exported themes.
