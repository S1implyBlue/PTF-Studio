# PTF Studio Beta 0.9.5.4

## Added

- Restored a dedicated **Generate focus for selected icon** action in the asset Inspector.
- Kept **Bulk generate matching focuses** as a separate batch tool.
- Added semantic button colour coding across the interface:
  - Blue for importing, opening and selecting
  - Green for applying, generating and exporting
  - Purple for Asset Maker and creative tools
  - Orange for downscaling, conversion, analysis and batch operations
  - Red for restore and delete actions
  - Grey for close, help, undo and secondary controls
- Added a consistent built-in SVG icon beside button labels.
- Added matching hover, pressed, disabled and keyboard-focus states.

## Focus generator behaviour

The selected-icon action automatically targets the selected first- or second-level icon and replaces its matching focus slot. The bulk generator still supports all pairs, each level, the current category, selected pair, missing-only mode and replace-all mode.
