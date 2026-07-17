# PTF Studio 1.0

PTF Studio 1.0 is the first full release of the portable PSP PTF theme maker, editor, live XMB viewer, Asset Maker, and exporter for macOS and Windows.

## PSP-safe focus generation update

The 1.0 package now uses a PSP-specific focus pipeline for both single-icon and bulk generation:

- 48×48 first-level bodies are centred on 64×64 focus canvases.
- 32×32 second-level bodies are centred on 48×48 focus canvases.
- The required transparent border is preserved at 8 pixels on every side.
- The source icon is used only as an alpha silhouette and is removed from the final focus, leaving the outer illumination.
- Visible pixels are pure white; intensity is stored entirely in alpha.
- Generated assets use at most 64 palette entries, reserve transparent index 0, and do not use colour dithering.
- Every generated GIM is decoded again for validation before the change is accepted.
- PTF Studio rebuilds the theme in memory and rejects the operation if the result would exceed the PSP's 768 KB PTF limit.

This replaces the earlier general-purpose glow generator that could create focus assets unsuitable for real PSP hardware.

## Major release changes

### Complete UI redesign

- New dark navy creative-workspace design with cyan and violet accents.
- Added a compact navigation rail for Theme, Assets, Preview, Asset Maker, Analysis, Export, and About.
- Rebuilt the main three-panel workspace with rounded cards, clearer hierarchy, improved spacing, and responsive layouts.
- Refined buttons, SVG action icons, input fields, asset rows, dialogs, notifications, scrollbars, and selection states.
- Redesigned the Asset Maker workspace to match the main application.

### More accurate PSP XMB preview

- Recalibrated icon coordinates and spacing against direct 480 × 272 PSP captures.
- Refined selected and inactive category opacity.
- Added visible dimmed labels for neighbouring first-level menu items.
- Corrected vertical-list clipping and the upper lane used by outgoing rows.
- Added PSP-style two-line storage labels with divider and preview free-space text.
- Disabled unnecessary icon interpolation at exact PSP scaling for cleaner asset rendering.
- Refined text shadow softness, status spacing, and long menu-label handling.
- Preserved the 10%–100% focus pulse, second-level submenu shift, native icon canvases, PSP battery, date/time, and model-specific layouts.

## Included feature set

- Import and export standard PSP PTF themes.
- Legacy RLZ/LZR, modern Deflate, and stored-resource support.
- Metadata and theme-colour editing with post-export verification.
- Exact-size Import and alpha-safe Bicubic Smooth Downscale & Import.
- Individual, folder-based, and bulk asset replacement.
- Click/double-click live-view asset navigation.
- PSP-native Asset Maker with layers and palette preview.
- Single and bulk matching-focus generation.
- Model profiles for PSP-1000, PSP-2000, PSP-3000, PSP Go, PSP Street, and Universal.
- PSP Go System Storage, Saved Data Utility — System Storage, and Resume Game slots.
- Asset analysis, CSV export, theme variants, and release-package generation.

## Credits

Created by Blue  
Developed with the assistance of ChatGPT

## Hardware note

The release passed browser, syntax, binary-layout, metadata, sample-theme, compression, Asset Maker, and packaging regression checks. Final exported themes should still be tested on the intended PSP model before distribution.
