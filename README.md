# PTF Studio Beta 0.9.1

<img width="1463" height="904" alt="Image" src="https://github.com/user-attachments/assets/913684f3-fa94-4c29-8c4d-384bb754a8c7" />

<img width="1463" height="904" alt="Image" src="https://github.com/user-attachments/assets/e60d2bc0-0558-4d54-a910-50298cbf3c50" />

PTF Studio is a portable PSP PTF theme maker, editor, live XMB viewer, and exporter for macOS and Windows. It is intended for the PSP modding community and runs locally in a modern browser.

## Launch

### macOS

Double-click `PTF Studio.command`, or right-click `PTF Studio.app` and choose **Open**.

### Windows

Double-click `PTF Studio.bat`.

You may also open `index.html` directly in a current Safari, Chrome, Edge, or Firefox browser.

## Main capabilities

- Import existing `.ptf` themes.
- Preview the real wallpaper, category icons, first-level icons, second-level icons, and focus graphics.
- Navigate the preview using the arrow keys, Enter, and Escape.
- Replace assets from common image formats.
- Automatically resize and convert indexed assets for PSP PTF requirements.
- Bulk-apply one image to every first-level focus slot.
- Restore all first-level focus slots to the imported originals.
- Edit supported metadata and monthly colour selection.
- Export rebuilt PSP-compatible `.ptf` themes.
- Export individual theme assets as PNG.
- Load a local PSP-style OTF/TTF font for more accurate preview text.
- Restore edited assets to their imported originals.

## Beta 0.9.1 changes

- Renamed the `PlayStation Network` asset category to `Extras`.
- Corrected the Game category labels:
  - slot 10: `Save Data Utility`
  - slot 12: `UMD Update`
- Corrected first-level vertical scrolling so outgoing icons move above the category row instead of overlapping it.
- Added **Bulk change first-level focus**.
- Added **Restore all first-level focus**.

## Preview behaviour retained from Beta 0.9

- Correct PSP-style second-level navigation.
- The existing hierarchy shifts left when Theme Settings is opened.
- Child items appear to the right without an artificial background panel.
- Second-level focus images are used as glow overlays.
- Focus glow pulses between 10% and 100% opacity over a 1000 ms cycle.
- PSP-style selected-row pointer and child-item dimming.
- Help/About and credits interface.

## Navigation

- `Left` / `Right`: change category.
- `Up` / `Down`: change first-level item.
- `Enter`: open Theme Settings when selected.
- `Up` / `Down` inside Theme Settings: select Theme, Color, or Background.
- `Escape` or `Left`: return to the first-level menu.

## Credits

Created by Blue with the use and assistance of ChatGPT. See `CREDITS.md`.

## Notes

- The live viewer approximates the standard PSP XMB presentation; it is not a PSP emulator.
- PTF themes cannot change firmware-level XMB coordinates, system fonts, waves, or PRX/RCO behaviour.
- The preview font is loaded locally and is not bundled.
- Test exported themes from `/PSP/THEME/` before public distribution.
