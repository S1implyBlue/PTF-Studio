# PTF Studio Beta 0.9.5.4

PTF Studio is a portable PSP PTF theme maker, editor, live XMB viewer, and exporter for macOS and Windows. It runs locally in a modern browser and is intended for the PSP modding community.

## Launch

### macOS

Double-click `PTF Studio.command`, or right-click `PTF Studio.app` and choose **Open**.

### Windows

Double-click `PTF Studio.bat`.

You may also open `index.html` directly in a current Safari, Chrome, Edge, or Firefox browser.

## Main capabilities

- Import and edit existing `.ptf` themes, including legacy RLZ/LZR and modern Deflate/stored themes.
- Preview wallpapers, category icons, first-level icons, second-level icons, focus graphics, XMB scrolling, date/time, and battery status.
- Replace assets individually or through folder-based bulk tools.
- Convert edited artwork to the standard PSP canvas sizes and indexed GIM formats during export.
- Edit theme metadata and theme-colour selection.
- Export rebuilt PSP-compatible `.ptf` files, individual PNG assets, theme variants, analysis reports, and release ZIP packages.
- Use PSP model profiles for PSP-1000, PSP-2000, PSP-3000, PSP Go, PSP Street, or a universal asset view.
- Generate matching focus artwork individually or in bulk from each normal icon, while retaining the older apply-one-image bulk tool.

## New in Beta 0.9.5.4

### Bulk Generate Matching Focuses

- Added a dedicated **Bulk generate matching focuses** tool.
- Automatically pairs every normal first-level or second-level icon with its corresponding focus slot.
- Supports all first-level icons, all second-level icons, both levels together, the current XMB category, or one selected icon pair.
- **Generate missing only** preserves focus artwork that already exists.
- **Replace every matching focus** regenerates the complete selected set.
- Displays a contact-sheet preview and a count of generated, preserved, and skipped assets before applying.
- Preserves transparent alignment and uses the correct 64 × 64 or 48 × 48 focus canvas automatically.
- Added one-click undo for the most recent bulk generation, including removal of newly created synthetic focus slots.

## New in Beta 0.9.5.2

### Complete PSP Go asset profile

- Added **System Storage** body and focus slots.
- Added **Saved Data Utility — System Storage** body and focus slots.
- Added **Resume Game** body and focus slots.
- The PSP Go preview keeps **Memory Stick** and **Saved Data Utility — Memory Stick** separate from the internal-storage entries.
- Photo, Music, Video, and Game categories now use PSP Go-specific item lists.
- UMD and UMD Update remain hidden for the PSP Go profile.
- The Universal profile exposes the new resources with **PSP Go only** compatibility badges.
- Use **Add missing profile slots** after selecting PSP Go or Universal to create absent body/focus pairs from fallback artwork, then replace them normally.

## New in Beta 0.9.5.1

### Asset Maker display correction

- Fixed the central Asset Maker canvas being squeezed or stretched by the responsive modal layout.
- Square icon and focus presets now display as exact squares.
- Category icons, preview images, and wallpapers retain their correct aspect ratios.
- The canvas now synchronizes its internal pixel buffer with its displayed browser size, including Retina/HiDPI scaling.
- Grid lines, transparent canvas borders, imported artwork, selection outlines, dragging, and pointer coordinates remain aligned after resizing.

### Asset Maker introduced in Beta 0.9.5

PTF Studio includes a layer-based workspace for creating wallpapers, preview assets, category icons, first- and second-level icons, and focus graphics. It provides shapes, transforms, basic PSP-safe effects, palette preview, focus generation, direct slot assignment, undo/redo, and PNG export.

The planned sample icon library is intentionally not bundled yet and will be added after the distributable asset set is ready.

## Previous metadata fixes — Beta 0.9.4.3

- Corrected Title and Product ID import/export field mapping.
- Corrected fixed-colour export so the PSP applies the selected value instead of falling back to By Month.
- Added strict metadata and colour-record verification after every build.
- Added official byte-length and Product ID character validation.

## New in Beta 0.9.4.2

### Corrected metadata and colour export

- Corrected the reversed **Title** and **Product ID** controls.
- Theme colour values from 0 through 12 are now normalised and written explicitly during export.
- Export performs a post-build colour-record check and stops with an error instead of silently producing a monthly-colour theme when the selected value was not encoded.

### Two deliberate image-import modes

Every editable asset now provides two separate actions:

- **Import** accepts only an image already matching the exact required dimensions. It performs no resizing.
- **Downscale & Import** resizes a larger source using alpha-safe bicubic smooth filtering.

The same separation is available for folder imports and bulk first-level focus replacement.

Required target sizes are:

| Asset | Size |
|---|---:|
| Category icon | 64 × 48 |
| First-level icon | 48 × 48 |
| First-level focus | 64 × 64 |
| Second-level icon | 32 × 32 |
| Second-level focus | 48 × 48 |
| Preview icon | 16 × 16 |
| Preview image | 300 × 170 |
| Wallpaper | 480 × 272 |

Icon and focus downscaling preserves the complete source canvas, including transparent borders. The editor does not trim to visible pixels or crop the artwork. Different-aspect icon canvases are fitted inside the required PSP canvas and centred on transparent padding. Preview images and wallpapers resize the complete source canvas to the exact destination size. Images that would require enlargement are rejected.

### Clickable live preview

- Single-click an icon in the XMB preview to select its asset, reveal it in the left asset list, and scroll directly to it.
- Double-click an icon to open a dedicated import choice window for that slot.
- The wallpaper and the current asset view are also selectable from the preview where applicable.

## Legacy compression compatibility

- RLZ/LZR resources are decoded during import.
- Untouched LZR resources remain preserved during export.
- Edited LZR resources export through PSP-compatible Deflate or stored compression.
- Modern Deflate and uncompressed themes continue to use their existing paths.

## Credits

Created by Blue with the use and assistance of ChatGPT. See `CREDITS.md`.

## Notes

- The live viewer approximates the standard PSP XMB presentation; it is not a PSP emulator.
- PTF themes cannot change firmware-level coordinates, system fonts, waves, or PRX/RCO behaviour.
- The PSP system font is not bundled.
- Test exported themes from `/PSP/THEME/` on the intended PSP model before public distribution.
