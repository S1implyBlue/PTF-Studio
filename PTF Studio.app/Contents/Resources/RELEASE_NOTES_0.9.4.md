# PTF Studio Beta 0.9.4

Beta 0.9.4 focuses on safer image importing and direct interaction with the live XMB preview.

## Fixes

- Title and Product ID are mapped to the correct project fields.
- Selected theme colours are retained during export instead of reverting to **Monthly / automatic**.
- A post-build check confirms the selected colour value is present in the finished PTF.

## Image importing

- **Import**: exact-size images only, with no resize.
- **Downscale & Import**: larger images are resized using alpha-safe bicubic smooth filtering.
- Transparent borders and the complete icon canvas are preserved.
- Artwork is never trimmed to visible pixels or cropped during icon downscaling.
- Undersized images are not enlarged.
- Exact and downscale modes are also available for folder imports and bulk first-level focus changes.

## Live preview interaction

- Single-click an icon to select and reveal the corresponding asset.
- Double-click an icon to open the Import / Downscale & Import choice window.

## Credits

Created by Blue with the use and assistance of ChatGPT.
