# PTF Studio 1.0 — Quick User Guide

## Open a theme

Use **Import PTF**, drag a `.ptf` onto the live viewer, or choose **Load sample**.

## Replace an asset

Select an item in the Assets list, or click its icon in the live XMB viewer.

- **Import** requires the image to already match the exact PSP dimensions.
- **Downscale & Import** accepts a larger image and resizes the complete canvas with alpha-safe bicubic smooth filtering.

Double-clicking an icon in the live viewer opens the two import choices directly.

## Navigate the live XMB

- Left/Right: categories
- Up/Down: menu items
- Enter: open supported second-level menus
- Escape: return

## Create artwork

Open **Asset Maker**, select a PSP asset preset, import artwork or add shapes, then apply the canvas to a compatible slot. Enable the 256-colour preview to inspect the indexed result.

## Generate focus graphics

Use **Generate focus for selected icon** in the Inspector for one icon, or **Bulk generate matching focuses** for multiple paired assets.

## Export

Choose **Export PTF**. PTF Studio validates metadata, image records, and the rebuilt theme before downloading it.

## PSP-safe focus generation

Use **Generate focus for selected icon** or **Bulk generate matching focuses** only after the normal icon has the correct body dimensions. PTF Studio keeps the body at native size, centres it with an 8 px transparent margin, creates an outer white alpha-only halo, and removes the sharp source core. Generated focus assets are limited to 64 palette entries and validated by encoding and decoding the GIM before use. The operation is automatically rolled back if the rebuilt PTF would exceed 768 KB.
