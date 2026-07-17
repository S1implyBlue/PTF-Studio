# Changelog

## 1.0 — PSP focus compatibility refresh
- Replaced the bundled sample theme with the final custom `SAMPLE.ptf` artwork supplied for the 1.0 release.

- Fixed the second-level XMB preview so all parent first-level labels are hidden while the child menu is open; parent icons remain visible as on real PSP firmware.
- Rebuilt single and bulk focus generation around Sony-compatible PSP constraints.
- Normal icons remain at native 48×48 or 32×32 size and are centred on focus canvases with an exact 8 px transparent margin.
- Generated focus artwork now contains only an outer halo; the sharp icon core is removed.
- Visible focus pixels use pure white RGB, with glow intensity stored only in alpha.
- Generated focus palettes are capped at 64 RGBA entries and exported without colour dithering.
- Added GIM encode/decode round-trip validation before generated focuses are accepted.
- Added automatic 768 KB PTF size preflight and rollback when generation would make a theme invalid.
- Asset Maker focus generation now uses the same PSP-safe pipeline.

## 1.0 — 2026-07-17

- Redesigned the full application interface with a new cyan/violet creative-workspace visual system.
- Added the vertical navigation rail and release-quality responsive three-panel layout.
- Restyled the Asset Maker, dialogs, asset browser, controls, viewer frame, notifications, and status areas.
- Recalibrated live XMB coordinates against direct PSP screenshots.
- Added dimmed neighbouring first-level labels and refined icon opacity.
- Added PSP-style two-line storage labels, divider lines, and preview free-space text.
- Improved exact-scale icon rendering, soft text shadows, status positioning, and long label handling.
- Promoted the project from Beta to the first full release.

## Beta 0.9.5.5 — 2026-07-17

- Changed all coloured action-button labels and SVG icons to white.
- Replaced the hard XMB icon-title shadow with a softer blurred PSP-style shadow.
- Applied the same soft title shadow to the Asset Maker wallpaper XMB overlay.

## Beta 0.9.5.4

- Restored single-icon focus generation as a separate Inspector action.
- Retained the bulk matching-focus generator.
- Added semantic colour coding to all primary action buttons.
- Added built-in SVG icons beside button labels.
- Added consistent hover, active, disabled and keyboard-focus styling.

## Beta 0.9.5.4 — 2026-07-17

- Added Bulk Generate Matching Focuses for paired first- and second-level body icons.
- Added scopes for both levels, one level, the current XMB category, or the selected icon pair.
- Added missing-only and replace-all generation modes.
- Added a multi-icon contact-sheet preview and generation summary.
- Added one-step undo that restores overwritten focus artwork and removes newly created focus slots.
- Preserved transparent icon alignment and automatic 64 × 64 / 48 × 48 focus sizing.

## Beta 0.9.5.2 — 2026-07-17

- Completed the PSP Go profile with System Storage body/focus slots.
- Added Saved Data Utility — System Storage body/focus slots.
- Added Resume Game body/focus slots.
- Kept Memory Stick and Saved Data Utility — Memory Stick as distinct PSP Go entries.
- Added PSP Go-specific ordering for Photo, Music, Video, and Game previews.
- Kept UMD and UMD Update hidden in the PSP Go profile.
- Added PSP Go-only compatibility badges in the Universal profile.
- Added missing-slot creation and export coverage for first-level PTF records 60–65.

## Beta 0.9.5.1 — 2026-07-15

- Fixed non-uniform stretching of the Asset Maker drawing surface.
- Added responsive canvas backing-store synchronization with Retina/HiDPI support.
- Preserved correct aspect ratios for every Asset Maker preset.
- Kept grid, artwork, selection outlines, dragging, and pointer mapping aligned after modal or window resizing.
- Retained all Beta 0.9.5 Asset Maker and PTF import/export functionality.

## Beta 0.9.5 — 2026-07-15

- Added the integrated Asset Maker with PSP-native canvas presets.
- Added layer-based artwork composition, shapes, transforms, opacity, ordering, duplicate/delete, undo, and redo.
- Added PSP palette preview and wallpaper XMB readability overlay.
- Added conservative baked gradients, outline, shadow, glow, tint, and colour adjustments.
- Added direct assignment to compatible PTF slots, matching-focus generation, and PNG export.
- Added Edit in Asset Maker to the asset inspector.
- Deferred the sample icon library to the following release.

## Beta 0.9.4.3 — 2026-07-15

- Corrected Title and Product ID mapping across import, editing, export, variants, and filenames.
- Corrected theme-colour export to use the canonical four-byte PSP record with file type 5 and compression marker 2.
- Added strict post-build metadata and colour-record verification.
- Added Title, Product ID, and Version byte-length validation plus official Product ID character validation.

## Beta 0.9.4.2 — 2026-07-15

- Replaced the bundled sample theme with `PTF_STUDIO_SAMPLE_THEME.ptf`.
- Removed the previous sample from the package.
- Regenerated the embedded sample and synchronized macOS/browser resources.
- Added regression checks confirming the embedded payload matches the distributed PTF.

## Beta 0.9.4.1 — 2026-07-15

- Corrected severe-downscale aliasing in Downscale & Import.
- Added adaptive antialiased bicubic-smooth resampling.
- Improved premultiplied-alpha edge handling and preview smoothing.

## Beta 0.9.4 — 2026-07-15

- Added the first metadata-field mapping revision; the definitive PTF header correction is included in Beta 0.9.4.3.
- Fixed theme-colour persistence with explicit 0–12 validation and post-build colour verification.
- Replaced the ambiguous single image-replacement action with separate Import and Downscale & Import actions.
- Added exact-dimension validation for non-resizing imports.
- Added alpha-safe bicubic smooth downscaling for icons, focuses, preview assets, and wallpapers.
- Preserved complete transparent icon canvases and borders without trimming or visible-pixel cropping.
- Rejected sources that would require enlargement.
- Added separate exact and downscale modes to folder import and bulk first-level focus replacement.
- Added single-click preview-to-asset navigation and automatic sidebar scrolling.
- Added double-click preview import selection for the clicked asset.
- Added import-mode guidance, dedicated import modal, and fresh cache identifiers.

## Beta 0.9.3.1

- Fixed the left asset browser being unreachable on displays where the expanded project tools exceeded the available window height.
- The entire left sidebar now scrolls, so every asset remains available for individual replacement.
- Added a visible, stable sidebar scrollbar and fresh cache identifiers.

## Beta 0.9.3 — 2026-07-12

- Added PSP-1000, PSP-2000, PSP-3000, PSP Go, PSP Street, and Universal model profiles.
- Added compatibility badges and profile-aware live-view filtering.
- Added creation of missing model-specific and fallback PTF slots.
- Added automatic bulk folder import using numeric or descriptive asset names.
- Added a visual focus-glow generator for selected, first-level, and second-level icon sets.
- Added a palette, dimensions, compression, and final-file-size analyser with CSV export.
- Added theme variants with metadata colour changes and optional icon tinting.
- Added a release-package generator for PTF, preview, icon sheet, instructions, credits, and manifest.
- Added direct selection and editing of the Default/Fallback icon pair.
- Retained RLZ/LZR, Deflate, and stored-resource compatibility from Beta 0.9.2.
- Screenshot comparison was deliberately left out of this release.

## Beta 0.9.2 — 2026-07-11

- Added RLZ/LZR decompression for firmware 3.70-era and other legacy PTF themes.
- Preserved untouched legacy compressed payloads during export.
- Edited LZR resources now export through the proven Deflate/stored pipeline.
- Added legacy and modern compression regression coverage.
- Added compression labels and more precise import/export status messages.


## Beta 0.9.1 — 2026-07-11

- Renamed the PlayStation Network asset category to Extras.
- Corrected Game-category slot labels to Save Data Utility and UMD Update.
- Fixed first-level vertical scrolling so outgoing icons move above the category icon row rather than overlapping it.
- Added a batch tool that applies one selected image to all first-level focus slots.
- Added a matching restore-all action for first-level focus slots.
- Updated browser cache identifiers and synchronized the macOS app resources.

## Beta 0.9 — 2026-07-11

- Promoted the project from Alpha to Beta.
- Rebuilt second-level XMB menu preview behaviour.
- Opening Theme Settings now shifts the existing hierarchy left and displays the child menu on the right.
- Removed the incorrect rectangular submenu background.
- Second-level focus images are now rendered only as pulsing glow overlays.
- Added selected-row pointer, dimmed unselected child items, and PSP-style vertical scrolling.
- Slowed the focus glow cycle by 50%, from 500 ms to 1000 ms.
- Added Help → About PTF Studio and a dedicated credits view.
- Added CREDITS.md and release/build information.
- Preserved the corrected monthly colour naming, PSP font sizing, battery artwork, and hardware-calibrated spacing from 0.2.3.
