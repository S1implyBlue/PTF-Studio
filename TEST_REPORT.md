# PTF Studio Beta 0.9.5.1 Test Report

## Regression checks

- JavaScript syntax checks passed for `app.js`, `asset_maker.js`, `rlz.js`, and `sample.js`.
- Embedded sample PTF matches the distributed sample byte-for-byte.
- Title, Product ID, version, theme-colour record, RLZ/LZR, Deflate, stored-resource, and image-import checks remain present.
- Asset Maker preset dimensions and role mappings remain intact.
- Responsive canvas synchronization is present in both the portable browser files and macOS application resources.
- Browser layout test confirms that the canvas backing-store ratio matches its CSS display ratio.
- Browser layout test confirms that a 48 × 48 document is displayed as a square after the Asset Maker modal opens.
- Pointer mapping remains based on the synchronized backing-store-to-CSS scale.

## Scope

Beta 0.9.5.1 changes only Asset Maker display sizing and responsive rendering. Theme asset generation and PTF export data are unchanged from Beta 0.9.5.
