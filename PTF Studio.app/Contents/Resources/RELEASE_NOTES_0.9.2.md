# PTF Studio Beta 0.9.2

This compatibility release adds support for older PSP PTF themes that store resources with Sony's RLZ/LZR compression.

## Changes

- Automatic detection and decompression of legacy LZR resources.
- Existing Deflate and uncompressed support remains unchanged.
- Untouched legacy resources are preserved byte-for-byte when exported.
- Edited legacy resources use PSP-compatible Deflate or stored compression.
- Compression type is shown alongside each asset.
- Malformed and truncated legacy streams now produce a clear import error.

## Compatibility note

LZR recompression is not required. PTF Studio preserves original LZR payloads until an asset is changed; changed resources use the same modern export path already used successfully by newer themes.
