# PTF Studio Beta 0.9.5.4

## Bulk Generate Matching Focuses

This release adds a dedicated tool for generating a separate matching focus graphic from every normal icon in a theme.

### Generation scopes

- All first- and second-level icon pairs
- All first-level icon pairs
- All second-level icon pairs
- The current XMB category
- One selected icon pair

### Generation modes

- **Generate missing focus assets only** preserves every existing focus image.
- **Replace every matching focus asset** rebuilds the entire selected set using the current generator settings.

### Additional behaviour

- Automatically maps each body icon to its corresponding focus slot.
- Uses 64 × 64 for first-level focuses and 48 × 48 for second-level focuses.
- Preserves transparent padding and icon alignment.
- Shows a contact-sheet preview before applying.
- Reports generated, preserved, and skipped slots.
- Supports colour, opacity, blur, padding, and optional sharp-core settings.
- Adds **Undo last bulk generation**, restoring overwritten assets and removing focus slots created by the operation.

All Beta 0.9.5.2 PSP Go profile, Asset Maker, compression, metadata, preview, and export features remain available.
