# PTF Studio 1.0 — User and PSP Asset Design Guide

Project: https://github.com/S1implyBlue/PTF-Studio

## Required dimensions

| Asset | Size |
|---|---:|
| Category icon | 64 × 48 px |
| First-level icon | 48 × 48 px |
| First-level focus | 64 × 64 px |
| Second-level icon | 32 × 32 px |
| Second-level focus | 48 × 48 px |
| Preview icon | 16 × 16 px |
| Preview image | 300 × 170 px |
| Wallpaper | 480 × 272 px |

Category icons do not use a separate focus image. First- and second-level focus canvases provide 8 pixels of room around the matching normal icon.

## Formats and palettes

Design with transparent PNG files. PTF Studio converts supported artwork into PSP-compatible indexed GIM assets during export. Icon artwork is limited to no more than 256 RGBA palette entries. Use restrained gradients and transparency; complex glass, blur, or glow effects may band, dither, or create oversized resources.

**Import** requires an exact-size image and does not resize it. **Downscale & Import** uses alpha-safe bicubic filtering, preserves the complete canvas and transparent borders, and will not trim visible artwork or enlarge an undersized image.

## Focus graphics

A safe focus is a white outer halo whose intensity is stored primarily in alpha. It should not contain a coloured duplicate of the icon. Keep the normal icon centred, retain 8 pixels of transparent room on each side, and use a restrained blur. PTF Studio validates generated focuses for dimensions, palette count, transparency, GIM round-trip, and final PTF size.

## PSP limitations

- Keep the final PTF below approximately 768 KB.
- Tiny details can disappear on the PSP LCD; favour clean silhouettes and limited colour ramps.
- Do not crop transparent margins from the icon canvas.
- Use the Default/Fallback asset for later XMB entries that have no safe dedicated PTF slot.
- The live viewer is a close recreation, not firmware emulation. Always test the final theme on real hardware.

## Safe workflow

1. Import an existing PTF or begin with the bundled sample.
2. Replace assets with exact-size artwork or use Downscale & Import.
3. Check the indexed-colour preview and analysis report.
4. Export to a new filename.
5. Reopen the export in PTF Studio.
6. Test it on a PSP before distribution.

## Exporting a theme

Open **Export** from the left navigation rail or use **Export PTF** in the top toolbar. The export dialog lets you review or change:

- output filename
- Theme Title
- Product ID
- Version
- Monthly / automatic colour or a fixed January–December colour

PTF Studio validates the metadata, every editable asset, focus dimensions and palettes, compression records, unsupported virtual slots, final file structure, and the PSP 768 KB theme-size limit. A theme cannot be exported until the validation result is green or yellow and you confirm that you reviewed the report. Yellow warnings do not block export, but they should be read carefully.
