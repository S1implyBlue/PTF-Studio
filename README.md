# PTF Studio Beta 0.9.5

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
- Generate focus glows and apply one focus image to every first-level focus slot.

## New in Beta 0.9.5

### Built-in Asset Maker

PTF Studio now includes a layer-based workspace for creating PSP theme artwork without leaving the editor.

- Native presets for wallpapers, preview images, category icons, first- and second-level icons, focus graphics, and the 16 × 16 preview icon.
- Import transparent artwork as editable layers.
- Add rectangles, rounded rectangles, circles, and lines.
- Move, resize, rotate, reorder, duplicate, hide, and delete layers.
- Undo and redo support.
- Solid fills, simple two-colour gradients, strokes, opacity, tint, brightness, contrast, and saturation controls.
- Conservative baked outline, solid-shadow, and low-radius glow controls limited for PSP-friendly output.
- Live 256-colour indexed preview for icon and focus presets.
- Wallpaper readability overlay using the current theme’s XMB icons and labels.
- Generate a restrained matching focus asset from a first- or second-level body icon.
- Apply artwork directly to a compatible PTF slot, apply and return to the XMB preview, or export the canvas as PNG.
- Open any supported asset directly in the Asset Maker from the Inspector.

The planned sample icon library is intentionally not bundled in this release and will be added after the distributable asset set is ready.

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
