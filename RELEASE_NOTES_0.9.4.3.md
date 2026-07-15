# PTF Studio Beta 0.9.4.3

## Fixed

- Corrected the PTF header mapping so Title is written to the 128-byte field at `0x08` and Product ID to the 48-byte field at `0x88`.
- Corrected import display, dirty-state tracking, theme variants, exported filenames, and saved project state for Title and Product ID.
- Corrected theme-colour export by emitting the canonical PSP colour record: group 0, slot 2, file type 5, compression marker 2, four-byte uncompressed value.
- Added strict post-build verification for Title, Product ID, Version, colour value, and colour-record header.
- Added byte-length and Product ID character validation before export.

All image downscaling, transparent-canvas preservation, RLZ/LZR compatibility, and the new sample theme remain unchanged.
