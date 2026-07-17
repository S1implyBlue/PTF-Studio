# PTF Studio Beta 0.9.5.2

## PSP Go profile completion

- Added **System Storage** first-level body and focus resources.
- Added **Saved Data Utility — System Storage** first-level body and focus resources.
- Added **Resume Game** first-level body and focus resources.
- Kept **Memory Stick** and **Saved Data Utility — Memory Stick** as distinct entries.
- Added PSP Go-specific Photo, Music, Video, and Game preview ordering.
- UMD and UMD Update remain excluded from the PSP Go profile.
- Added **PSP Go only** compatibility badges in the Universal asset view.
- Extended **Add missing profile slots** and PTF export to first-level record pairs 60/61, 62/63, and 64/65.

## Compatibility note

The new records follow the extended first-level slot sequence used by the firmware 6.20-era theme format. Test an exported theme on a PSP Go before public distribution, particularly when starting from an older PTF that did not originally contain these slots.

All Beta 0.9.5.1 Asset Maker and PTF import/export features remain available.
