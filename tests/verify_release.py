#!/usr/bin/env python3
"""Static and binary regression checks for PTF Studio 1.0."""
from __future__ import annotations

import base64
import re
import struct
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def fixed(data: bytes, offset: int, length: int) -> str:
    return data[offset : offset + length].split(b"\0", 1)[0].decode("utf-8", "replace")


def theme_color_record(data: bytes) -> dict[str, int]:
    for pointer_offset in range(0x100, 0x120, 4):
        object_offset = struct.unpack_from("<I", data, pointer_offset)[0]
        if not object_offset:
            continue
        object_index, sub_count = struct.unpack_from("<HH", data, object_offset)
        if object_index != 0:
            continue
        position = struct.unpack_from("<I", data, object_offset + 8)[0]
        for _ in range(sub_count):
            sub_index, _, file_type, compression = struct.unpack_from("<4H", data, position)
            packed_size, unpacked_size = struct.unpack_from("<II", data, position + 8)
            if sub_index == 2 and unpacked_size == 4:
                return {
                    "offset": position,
                    "file_type": file_type,
                    "compression": compression,
                    "packed_size": packed_size,
                    "unpacked_size": unpacked_size,
                    "value": struct.unpack_from("<I", data, position + 0x20)[0],
                }
            position += 0x20 + packed_size
    raise AssertionError("Theme colour record not found")


def main() -> None:
    app = (ROOT / "app.js").read_text(encoding="utf-8")
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    sample_js = (ROOT / "sample.js").read_text(encoding="utf-8")
    maker = (ROOT / "asset_maker.js").read_text(encoding="utf-8")
    css = (ROOT / "styles.css").read_text(encoding="utf-8")

    assert "PTF Studio 1.0" in app and "PTF Studio 1.0" in html

    assert "Beta 0.9.5.3" not in app
    assert "Beta 0.9.5.3" not in html
    assert "0.9.5.3-beta" not in app
    assert "0.9.5.3-beta" not in html
    assert (ROOT / "PTF Studio.app/Contents/Resources/app.js").read_bytes() == (ROOT / "app.js").read_bytes()
    assert (ROOT / "PTF Studio.app/Contents/Resources/index.html").read_bytes() == (ROOT / "index.html").read_bytes()
    assert (ROOT / "PTF Studio.app/Contents/Resources/styles.css").read_bytes() == (ROOT / "styles.css").read_bytes()
    assert "title: readFixedString(bytes,8,128)" in app
    assert "productId:readFixedString(bytes,136,48)" in app
    assert "els.themeName.value=t.title" in app
    assert "els.productId.value=t.productId" in app
    assert "writeFixedString(out,8,128,metadata.title,'Title')" in app
    assert "writeFixedString(out,136,48,metadata.productId,'Product ID')" in app
    assert "forceRaw:true" in app
    assert "packed=raw;comp=2" in app
    assert "verifyBuiltPtfMetadata(result.bytes,result.metadata)" in app
    assert "Product ID may contain only letters" in app
    assert 'id="exportModal"' in html
    assert 'id="exportFileName"' in html
    assert 'id="exportThemeColor"' in html
    assert 'id="exportConfirmCheck"' in html
    assert "openExportDialog" in app
    assert "validateExportDialog" in app
    assert "confirmExportPtf" in app
    assert "Theme is valid for export" in app
    assert "replaceSelectedAsset(f,'exact')" in app
    assert "replaceSelectedAsset(f,'downscale')" in app
    assert "resizeBicubicPremultiplied" in app
    assert "previewAssetAtEvent" in app
    assert "buildBicubicContributions" in app
    assert "bicubicSmoothWeight" in app
    assert "PTF_STUDIO_SAMPLE_THEME.ptf" in app
    assert "S1mplyBlue.ptf" not in app
    assert "60:'System Storage'" in app
    assert "62:'Saved Data Utility — System Storage'" in app
    assert "64:'Resume Game'" in app
    assert "PROFILE_CATEGORY_ITEMS" in app
    assert "2:[6,60,2]" in app
    assert "3:[60,2]" in app
    assert "4:[60,2]" in app
    assert "6:[64,8,60,62,10,2]" in app
    assert "bodyId===60 || bodyId===62 || bodyId===64" in app
    assert "Saved Data Utility — Memory Stick" in app
    assert "const PTF_FIRST_LEVEL_MAX_SUB = 59" in app
    assert "const PSP_GO_VIRTUAL_FIRST_LEVEL_IDS = new Set([60,62,64])" in app
    assert "{obj:3,sub:60}" not in app and "{obj:3,sub:65}" not in app
    assert "excludedItems:[4,12]" in app
    assert "assetVisibleForProfile(asset)" in app
    assert "Bulk generate matching focuses" in html
    assert 'id="selectedFocusGeneratorBtn"' in html
    assert "Generate focus for selected icon" in html
    assert "openFocusGenerator('selected')" in app
    assert "selectedBodyForDirectFocus" in app
    assert "focusGenerationMode.value='replace'" in app
    assert "UI_ICON_PATHS" in app and "installButtonIcons" in app
    for cls in ['action-open','action-generate','action-creative','action-batch','action-danger','action-secondary']:
        assert cls in html and cls in (ROOT / 'styles.css').read_text(encoding='utf-8')
    assert 'class="appRail"' in html
    assert 'data-rail-action="preview"' in html
    assert 'PTF Studio 1.0 · PTF v1' in html
    assert '.release10 .appRail' in css
    assert '.release10 .workspace' in css
    assert 'firstLevelDimAlpha' in app
    assert 'drawStorageItemLabel' in app
    assert 'all parent-level text disappears' in app
    assert 'if(state.nav.level!==2)' in app
    assert "40:'Online Instruction Manuals'" in app
    assert 'categorySpacing: 82 * PSP_SCALE' in app
    assert 'drawImageDataFit(ctx,a.imageData' in app and ',false);' in app
    assert '.button.primary' in css and 'color: #fff' in css
    assert 'color:#fff;' in css
    assert "ctx.shadowColor='rgba(0,0,0,.54)'" in app
    assert 'ctx.shadowBlur=4.5' in app
    assert "makerCtx.shadowColor='rgba(0,0,0,.56)'" in maker
    assert 'makerCtx.shadowBlur=2.5' in maker
    assert 'id="focusGenerationMode"' in html
    assert 'id="focusBatchSummary"' in html
    assert 'id="undoFocusGeneratorBtn"' in html
    assert "target==='both'" in app
    assert "target==='category'" in app
    assert "focusGenerationPlan" in app
    assert "Generate missing focus assets only" in html
    assert "Replace every matching focus asset" in html
    assert "drawFocusPreviewSheet" in app
    assert "undoLastFocusGeneration" in app
    assert "state.lastFocusGenerationBackup" in app
    assert "const PSP_FOCUS_MARGIN = 8" in app
    assert "const PSP_FOCUS_ALPHA_LEVELS = 64" in app
    assert "blurAlphaChannel" in app and "gaussianKernel" in app
    assert "blurred[i]*strength-core[i]" in app
    assert "Generated focus RGB must remain pure white" in app
    assert "encodeGimPspFocus" in app
    assert "asset.pspGeneratedFocus" in app
    assert "failed GIM round-trip validation" in app
    assert "Generated focuses would make the theme" in app
    assert "PSP-safe focuses generated" in app
    assert "Sony canvas margin" in html and 'value="8"' in html
    assert "pure white RGB" in html and "maximum 64-entry alpha palette" in html
    assert "generatedPspFocus" in maker
    assert "Sony-guideline focus" in maker

    referenced = set(re.findall(r"\$\('#([^']+)'\)", app))
    referenced |= set(re.findall(r"querySelector\('#([^']+)'\)", maker))
    declared = set(re.findall(r'\bid="([^"]+)"', html))
    missing = sorted(referenced - declared)
    assert not missing, f"Missing HTML IDs: {missing}"

    assert "const MAKER_PRESETS" in maker
    for token in [
        "wallpaper:{label:'Wallpaper',width:480,height:272",
        "previewImage:{label:'Preview image',width:300,height:170",
        "category:{label:'Category icon',width:64,height:48",
        "firstBody:{label:'First-level icon',width:48,height:48",
        "firstFocus:{label:'First-level focus',width:64,height:64",
        "secondBody:{label:'Second-level icon',width:32,height:32",
        "secondFocus:{label:'Second-level focus',width:48,height:48",
        "previewIcon:{label:'Preview icon',width:16,height:16",
    ]:
        assert token in maker, token
    assert "makerQuantizedImageData" in maker
    assert "makerSyncCanvasResolution" in maker
    assert "ResizeObserver" in maker
    assert "requestAnimationFrame(()=>requestAnimationFrame(makerRenderAll))" in maker
    assert "makerApplyToAsset" in maker
    assert "makerCreateFocus" in maker
    assert "makerUndo" in maker and "makerRedo" in maker
    assert "sample asset library" in html.lower()
    assert "sample-assets" not in html.lower()

    sample = (ROOT / "samples" / "PTF_STUDIO_SAMPLE_THEME.ptf").read_bytes()
    assert fixed(sample, 8, 128) == "PTF_STUDIO_SAMPLE_THEME"  # Title
    assert fixed(sample, 136, 48) == "SAMPLE"  # Product ID
    assert theme_color_record(sample)["value"] == 8

    # Canonical export-layout fixture: Title at 0x08, Product ID at 0x88,
    # and group 0 / slot 2 as file type 5, marker 2, 4-byte value.
    fixture = bytearray(sample)
    fixture[8:136] = b"\0" * 128
    fixture[8:8 + len(b"Metadata Test Theme")] = b"Metadata Test Theme"
    fixture[136:184] = b"\0" * 48
    fixture[136:136 + len(b"META_TEST")] = b"META_TEST"
    record = theme_color_record(fixture)
    struct.pack_into("<H", fixture, record["offset"] + 4, 5)
    struct.pack_into("<H", fixture, record["offset"] + 6, 2)
    struct.pack_into("<I", fixture, record["offset"] + 8, 4)
    struct.pack_into("<I", fixture, record["offset"] + 12, 4)
    struct.pack_into("<I", fixture, record["offset"] + 0x20, 6)
    checked = theme_color_record(fixture)
    assert fixed(fixture, 8, 128) == "Metadata Test Theme"
    assert fixed(fixture, 136, 48) == "META_TEST"
    assert checked == {
        "offset": record["offset"], "file_type": 5, "compression": 2,
        "packed_size": 4, "unpacked_size": 4, "value": 6,
    }

    match = re.fullmatch(r"const SAMPLE_PTF_BASE64 = '([A-Za-z0-9+/=]+)';\n?", sample_js)
    assert match, "Embedded sample format is invalid"
    assert base64.b64decode(match.group(1)) == sample

    subprocess.run(["node", "--check", str(ROOT / "app.js")], check=True)
    subprocess.run(["node", "--check", str(ROOT / "asset_maker.js")], check=True)
    subprocess.run(["node", "--check", str(ROOT / "rlz.js")], check=True)
    subprocess.run(["node", "--check", str(ROOT / "sample.js")], check=True)
    print("PTF Studio 1.0 verification passed")


if __name__ == "__main__":
    main()
