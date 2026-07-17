/* PTF Studio 1.0 — dependency-free PSP PTF viewer/editor */
'use strict';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];


const UI_ICON_PATHS = Object.freeze({
  upload:'<path d="M12 16V4m0 0-4 4m4-4 4 4"/><path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>',
  download:'<path d="M12 4v12m0 0 4-4m-4 4-4-4"/><path d="M4 19h16"/>',
  sample:'<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  palette:'<path d="M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 0-5H12a1.5 1.5 0 0 1 0-3h2a7 7 0 0 0-2-10Z"/><circle cx="7.5" cy="10" r="1"/><circle cx="9.5" cy="6.5" r="1"/><circle cx="14" cy="6.5" r="1"/><circle cx="17" cy="10" r="1"/>',
  analyze:'<path d="M4 19V9m5 10V5m5 14v-7m5 7V3"/>',
  package:'<path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="m4 7 8 4 8-4v10l-8 4-8-4V7Z"/><path d="M12 11v10"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.3 2.3 0 1 1 3.2 2.1c-.8.4-1 1-1 1.9M12 17h.01"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  book:'<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z"/><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22V5.5Z"/>',
  github:'<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.3 4 5 5 0 0 0 19.2.5S18 0 15 2a13.4 13.4 0 0 0-7 0C5-.1 3.8.5 3.8.5A5 5 0 0 0 3.7 4a5.4 5.4 0 0 0-1.5 3.7c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4"/><path d="M8 19c-3 .9-3-1.5-4-2"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  font:'<path d="M5 20 11 4h2l6 16M7 15h10"/>',
  folder:'<path d="M3 6h7l2 2h9v11H3z"/>',
  downscale:'<path d="M4 4h7v2H6v5H4V4Zm16 16h-7v-2h5v-5h2v7Z"/><path d="m14 10 6-6m0 0h-5m5 0v5M10 14l-6 6m0 0h5m-5 0v-5"/>',
  sparkles:'<path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z"/><path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14ZM5 13l.8 2.2L8 16l-2.2.8L5 19l-.8-2.2L2 16l2.2-.8L5 13Z"/>',
  restore:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
  target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  reset:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  grid:'<path d="M4 4h16v16H4zM4 10h16M10 4v16"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>',
  undo:'<path d="M9 7 4 12l5 5"/><path d="M4 12h9a6 6 0 0 1 6 6"/>',
  redo:'<path d="m15 7 5 5-5 5"/><path d="M20 12h-9a6 6 0 0 0-6 6"/>',
  new:'<path d="M5 3h10l4 4v14H5z"/><path d="M15 3v5h5M12 11v6M9 14h6"/>',
  rectangle:'<rect x="4" y="6" width="16" height="12" rx="1"/>',
  rounded:'<rect x="4" y="5" width="16" height="14" rx="4"/>',
  circle:'<circle cx="12" cy="12" r="8"/>',
  line:'<path d="m5 19 14-14"/>',
  up:'<path d="m6 15 6-6 6 6"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  copy:'<rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  preview:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="2"/><path d="m21 15-5-5L5 20"/>'
});
function installButtonIcons(){
  document.querySelectorAll('[data-icon]').forEach(el=>{
    if(el.querySelector(':scope > .buttonIcon'))return;
    const path=UI_ICON_PATHS[el.dataset.icon];
    if(!path)return;
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('class','buttonIcon');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');
    svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.8');
    svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.innerHTML=path;
    el.prepend(svg);
  });
}
installButtonIcons();

const els = {
  ptfInput: $('#ptfInput'), loadSampleBtn: $('#loadSampleBtn'), exportBtn: $('#exportBtn'),
  analyzeBtn: $('#analyzeBtn'), releasePackageBtn: $('#releasePackageBtn'),
  themeName: $('#themeName'), productId: $('#themeProductId'), version: $('#themeVersion'), themeColor: $('#themeColor'),
  modelProfile: $('#modelProfile'), modelHint: $('#modelHint'), addModelSlotsBtn: $('#addModelSlotsBtn'),
  assetSearch: $('#assetSearch'), assetGroups: $('#assetGroups'), xmbCanvas: $('#xmbCanvas'), dropZone: $('#dropZone'),
  dropOverlay: $('#dropOverlay'), viewerStatus: $('#viewerStatus'), resetNavBtn: $('#resetNavBtn'), toggleGridBtn: $('#toggleGridBtn'),
  inspectorEmpty: $('#inspectorEmpty'), inspector: $('#inspector'), assetPreview: $('#assetPreview'), assetTitle: $('#assetTitle'),
  assetSlot: $('#assetSlot'), requiredSize: $('#requiredSize'), currentSize: $('#currentSize'), currentFormat: $('#currentFormat'),
  paletteInfo: $('#paletteInfo'), packedInfo: $('#packedInfo'), compatibilityInfo: $('#compatibilityInfo'),
  replaceInput: $('#replaceInput'), downscaleInput: $('#downscaleInput'), restoreAssetBtn: $('#restoreAssetBtn'), exportAssetBtn: $('#exportAssetBtn'),
  fontInput: $('#fontInput'), fontStatus: $('#fontStatus'), bulkFocusBtn: $('#bulkFocusBtn'),
  bulkFocusInput: $('#bulkFocusInput'), bulkFocusDownscaleBtn: $('#bulkFocusDownscaleBtn'),
  bulkFocusDownscaleInput: $('#bulkFocusDownscaleInput'), restoreBulkFocusBtn: $('#restoreBulkFocusBtn'),
  bulkFolderBtn: $('#bulkFolderBtn'), bulkFolderInput: $('#bulkFolderInput'),
  bulkFolderDownscaleBtn: $('#bulkFolderDownscaleBtn'), bulkFolderDownscaleInput: $('#bulkFolderDownscaleInput'),
  focusGeneratorBtn: $('#focusGeneratorBtn'), selectedFocusGeneratorBtn: $('#selectedFocusGeneratorBtn'), variantsBtn: $('#variantsBtn'), selectFallbackBtn: $('#selectFallbackBtn'),
  ditherToggle: $('#ditherToggle'), pulseToggle: $('#pulseToggle'), validationBox: $('#validationBox'),
  validationText: $('#validationText'), statusText: $('#statusText'), dirtyState: $('#dirtyState'), toastHost: $('#toastHost'),
  helpMenuBtn: $('#helpMenuBtn'), helpMenu: $('#helpMenu'), aboutBtn: $('#aboutBtn'), guideBtn: $('#guideBtn'), creditsBtn: $('#creditsBtn'),
  aboutModal: $('#aboutModal'), closeAboutBtn: $('#closeAboutBtn'), modalCloseButton: $('#modalCloseButton'),
  guideModal: $('#guideModal'), closeGuideBtn: $('#closeGuideBtn'), guideCloseButton: $('#guideCloseButton'),
  focusModal: $('#focusModal'), focusTitle: $('#focusTitle'), focusSubtitle: $('#focusSubtitle'), focusPreviewCanvas: $('#focusPreviewCanvas'), focusPreviewLabel: $('#focusPreviewLabel'),
  focusTarget: $('#focusTarget'), focusColor: $('#focusColor'), focusOpacity: $('#focusOpacity'), focusOpacityValue: $('#focusOpacityValue'),
  focusBlur: $('#focusBlur'), focusBlurValue: $('#focusBlurValue'), focusPadding: $('#focusPadding'),
  focusPaddingValue: $('#focusPaddingValue'), focusIncludeCore: $('#focusIncludeCore'), focusGenerationMode: $('#focusGenerationMode'),
  focusBatchSummary: $('#focusBatchSummary'), applyFocusGeneratorBtn: $('#applyFocusGeneratorBtn'), undoFocusGeneratorBtn: $('#undoFocusGeneratorBtn'),
  analysisModal: $('#analysisModal'), analysisSummary: $('#analysisSummary'), analysisStatus: $('#analysisStatus'),
  analysisTableBody: $('#analysisTableBody'), runAnalysisBtn: $('#runAnalysisBtn'), exportAnalysisCsvBtn: $('#exportAnalysisCsvBtn'),
  variantsModal: $('#variantsModal'), variantName: $('#variantName'), variantThemeColor: $('#variantThemeColor'),
  variantTint: $('#variantTint'), variantTintStrength: $('#variantTintStrength'), variantTintValue: $('#variantTintValue'),
  addVariantBtn: $('#addVariantBtn'), variantList: $('#variantList'), exportVariantsBtn: $('#exportVariantsBtn'),
  importAssetModal: $('#importAssetModal'), importAssetModalTitle: $('#importAssetModalTitle'), importAssetModalSub: $('#importAssetModalSub'),
  importExactModalBtn: $('#importExactModalBtn'), importDownscaleModalBtn: $('#importDownscaleModalBtn'),
  exportModal: $('#exportModal'), exportFileName: $('#exportFileName'), exportTitle: $('#exportTitle'),
  exportProductId: $('#exportProductId'), exportVersion: $('#exportVersion'), exportThemeColor: $('#exportThemeColor'),
  exportValidationCard: $('#exportValidationCard'), exportValidationTitle: $('#exportValidationTitle'),
  exportValidationSummary: $('#exportValidationSummary'), exportValidationList: $('#exportValidationList'),
  exportSizePill: $('#exportSizePill'), exportConfirmRow: $('#exportConfirmRow'), exportConfirmCheck: $('#exportConfirmCheck'),
  refreshExportValidationBtn: $('#refreshExportValidationBtn'), confirmExportBtn: $('#confirmExportBtn')
};
const ctx = els.xmbCanvas.getContext('2d');
const previewCtx = els.assetPreview.getContext('2d');

const APP_VERSION = '1.0';
const APP_BUILD = '2026.07.17-focusfix';

const CATEGORY_LABELS = {1:'Settings',2:'Photo',3:'Music',4:'Video',5:'TV',6:'Game',7:'Network',8:'Extras'};
const FIRST_LABELS = {
  2:'Memory Stick',4:'UMD',6:'Camera',8:'Game Sharing',10:'Save Data Utility',12:'UMD Update',
  14:'Network Update',16:'USB Connection',18:'Video Settings',20:'Photo Settings',22:'System Settings',
  24:'Theme Settings',26:'Date & Time Settings',28:'Power Save Settings',30:'External Display Settings',
  32:'Sound Settings',34:'Security Settings',36:'RSS Channel Settings',38:'Network Settings',40:'Online Instruction Manuals',
  42:'Remote Play',44:'Internet Radio',46:'RSS Channel',48:'Internet Browser',50:'Internet Search',
  52:'Account Management',54:'Default / Fallback',56:'Bluetooth Settings',58:'SensMe Channels',
  60:'System Storage',62:'Saved Data Utility — System Storage',64:'Resume Game'
};
const CATEGORY_ITEMS = {
  1:[14,16,18,20,22,24,26,28,30,32,34,36,38],
  2:[6,2],
  3:[4,2],
  4:[4,2],
  5:[54],
  6:[8,12,4,10,2],
  7:[40,42,44,46,48,50],
  8:[52,56,58,40]
};
// The PSP Go uses internal System Storage alongside Memory Stick storage and
// adds a Resume Game entry. Keeping the ordering profile-specific avoids
// exposing these N1000-only items on the standard PSP layouts.
const PROFILE_CATEGORY_ITEMS = Object.freeze({
  go: {
    2:[6,60,2],
    3:[60,2],
    4:[60,2],
    6:[64,8,60,62,10,2]
  }
});
const GROUP_NAMES = {0:'Preview & metadata',1:'Wallpaper',2:'Category icons',3:'First-level icons',4:'Second-level icons'};
const THEME_COLORS = ['Monthly / automatic','January — Gray','February — Yellow','March — Lime','April — Pink','May — Green','June — Lilac','July — Turquoise','August — Blue','September — Purple','October — Orange','November — Brown','December — Red'];

const MODEL_PROFILES = Object.freeze({
  universal: {
    label:'Universal', hint:'Shows all known PTF slots, including model-specific and fallback resources.',
    categories:null, excludedItems:[]
  },
  '1000': {
    label:'PSP-1000', hint:'Standard PSP-1000 layout. TV and External Display Settings are hidden.',
    categories:[1,2,3,4,6,7,8], excludedItems:[30,56]
  },
  '2000': {
    label:'PSP-2000', hint:'Includes TV and External Display Settings. PSP Go-only Bluetooth is hidden.',
    categories:[1,2,3,4,5,6,7,8], excludedItems:[56]
  },
  '3000': {
    label:'PSP-3000', hint:'Includes TV and External Display Settings. PSP Go-only Bluetooth is hidden.',
    categories:[1,2,3,4,5,6,7,8], excludedItems:[56]
  },
  go: {
    label:'PSP Go', hint:'Shows the PSP Go menu structure. System Storage and Resume Game use the standard PTF first-level fallback artwork; UMD entries are hidden.',
    categories:[1,2,3,4,6,7,8], excludedItems:[4,12]
  },
  street: {
    label:'PSP Street', hint:'Offline E1000 profile. Network, Extras, TV and External Display entries are hidden.',
    categories:[1,2,3,4,6], excludedItems:[14,30,36,38,40,42,44,46,48,50,52,56,58]
  }
});

const MODEL_SLOT_REQUIREMENTS = Object.freeze({
  universal: [{obj:2,sub:5},{obj:2,sub:8},{obj:3,sub:30},{obj:3,sub:31},{obj:3,sub:54},{obj:3,sub:55},{obj:3,sub:56},{obj:3,sub:57},{obj:3,sub:58},{obj:3,sub:59}],
  '1000': [{obj:2,sub:8},{obj:3,sub:54},{obj:3,sub:55}],
  '2000': [{obj:2,sub:5},{obj:2,sub:8},{obj:3,sub:30},{obj:3,sub:31},{obj:3,sub:54},{obj:3,sub:55}],
  '3000': [{obj:2,sub:5},{obj:2,sub:8},{obj:3,sub:30},{obj:3,sub:31},{obj:3,sub:54},{obj:3,sub:55}],
  go: [{obj:2,sub:8},{obj:3,sub:30},{obj:3,sub:31},{obj:3,sub:54},{obj:3,sub:55},{obj:3,sub:56},{obj:3,sub:57},{obj:3,sub:58},{obj:3,sub:59}],
  street: [{obj:2,sub:8},{obj:3,sub:54},{obj:3,sub:55}]
});

const PTF_MAX_SIZE = 768 * 1024;
// Sony's final PTF schema ends the first-level asset group at sub-slot 59.
// PSP Go entries introduced later (System Storage, its Saved Data Utility and
// Resume Game) are rendered by firmware with the standard first-level fallback
// icon rather than dedicated PTF records. Writing invented slots 60–65 causes
// the PSP to reject the complete first-level group.
const PTF_FIRST_LEVEL_MAX_SUB = 59;
const PSP_GO_VIRTUAL_FIRST_LEVEL_IDS = new Set([60,62,64]);


// Native PSP coordinates are doubled because the preview canvas is 960 × 544.
const PSP_SCALE = 2;
const XMB_LAYOUT = Object.freeze({
  // Calibrated from direct 480 × 272 PSP captures supplied for the 1.0 release.
  categoryX: 110 * PSP_SCALE,
  categoryY: 72 * PSP_SCALE,
  categorySpacing: 82 * PSP_SCALE,
  categoryWidth: 64 * PSP_SCALE,
  categoryHeight: 48 * PSP_SCALE,
  categoryLabelY: 103 * PSP_SCALE,
  categoryFontSize: 11 * PSP_SCALE,
  itemX: 110 * PSP_SCALE,
  itemY: 137 * PSP_SCALE,
  itemSpacing: 64 * PSP_SCALE,
  bodyWidth: 48 * PSP_SCALE,
  bodyHeight: 48 * PSP_SCALE,
  focusWidth: 64 * PSP_SCALE,
  focusHeight: 64 * PSP_SCALE,
  itemLabelX: 149 * PSP_SCALE,
  itemLabelOffsetY: 6 * PSP_SCALE,
  itemFontSize: 14 * PSP_SCALE,
  itemSubFontSize: 11 * PSP_SCALE,
  itemLineRightX: 474 * PSP_SCALE,
  statusBaselineY: 18 * PSP_SCALE,
  statusRightX: 444 * PSP_SCALE,
  batteryX: 452 * PSP_SCALE,
  batteryY: 6 * PSP_SCALE,
  batteryWidth: 24 * PSP_SCALE,
  batteryHeight: 12 * PSP_SCALE
});

const PSP_FONT_STACK = '"PSP New Rodin", "FOT-NewRodin Pro DB", "NewRodin Pro DB", Arial, sans-serif';

const PSP_BATTERY_IMAGE = new Image();
PSP_BATTERY_IMAGE.src = 'assets/psp_battery.png?v=1.0-focusfix';

const state = {
  theme: null,
  assets: [],
  selectedAsset: null,
  dirty: false,
  viewMode: 'xmb',
  showGuides: false,
  nav: { categoryPos: 0, itemPos: 0, secondPos: 0, level: 1 },
  animationStart: performance.now(),
  sourceName: '',
  fontObjectUrl: null,
  fontLoaded: false,
  modelProfile: 'universal',
  variants: [],
  analysisRows: [],
  analysisEstimate: 0,
  previewHitRegions: [],
  lastFocusGenerationBackup: null,
  exportValidation: null,
  exportValidationToken: 0
};

function toast(title, text='', type='') {
  const n = document.createElement('div');
  n.className = `toast ${type}`;
  n.innerHTML = `<div class="toastTitle"></div><div class="toastText"></div>`;
  n.querySelector('.toastTitle').textContent = title;
  n.querySelector('.toastText').textContent = text;
  els.toastHost.appendChild(n);
  setTimeout(() => n.remove(), 3600);
}
function setStatus(text) { els.statusText.textContent = text; }
function setDirty(value=true) {
  state.dirty = value;
  els.dirtyState.textContent = state.theme ? (value ? 'Modified' : 'Saved state') : 'No project';
}

function readFixedString(bytes, start, length) {
  let end = start;
  while (end < start + length && bytes[end] !== 0) end++;
  return new TextDecoder().decode(bytes.slice(start,end));
}
function writeFixedString(target, start, length, text, fieldName='Text') {
  const enc = new TextEncoder().encode(String(text ?? ''));
  if(enc.length>length)throw new Error(`${fieldName} exceeds the ${length}-byte PTF limit.`);
  target.fill(0,start,start+length);
  target.set(enc,start);
}
function validateThemeMetadata({title,productId,version}){
  const cleanTitle=String(title??'').trim();
  const cleanProductId=String(productId??'').trim();
  const cleanVersion=String(version??'').trim();
  if(!cleanTitle)throw new Error('Title cannot be empty.');
  if(new TextEncoder().encode(cleanTitle).length>128)throw new Error('Title exceeds the 128-byte PTF limit.');
  if(!cleanProductId)throw new Error('Product ID cannot be empty.');
  if(new TextEncoder().encode(cleanProductId).length>48)throw new Error('Product ID exceeds the 48-byte PTF limit.');
  if(!/^[A-Za-z0-9_-]+$/.test(cleanProductId))throw new Error('Product ID may contain only letters, numbers, hyphens, and underscores.');
  if(new TextEncoder().encode(cleanVersion).length>8)throw new Error('Version exceeds the 8-byte PTF limit.');
  return {title:cleanTitle,productId:cleanProductId,version:cleanVersion};
}
function align(value, multiple) { return value % multiple === 0 ? value : value + multiple - (value % multiple); }
function u16(view,o,little=true){return view.getUint16(o,little)}
function u32(view,o,little=true){return view.getUint32(o,little)}
function setU16(view,o,v,little=true){view.setUint16(o,v,little)}
function setU32(view,o,v,little=true){view.setUint32(o,v,little)}
function normalizeThemeColor(value){
  const n=Number(value);
  return Number.isInteger(n)&&n>=0&&n<=12?n:0;
}
function readThemeColorRecord(bytes){
  const data=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes);
  if(data.length<0x120)return null;
  const view=new DataView(data.buffer,data.byteOffset,data.byteLength);
  for(let p=0x100;p<0x120;p+=4){
    const off=u32(view,p);if(!off||off+0x20>data.length)continue;
    const objIdx=u16(view,off),subCount=u16(view,off+2),dataOffset=u32(view,off+8);
    if(objIdx!==0)continue;
    let pos=dataOffset;
    for(let i=0;i<subCount;i++){
      if(pos+0x20>data.length)return null;
      const subIdx=u16(view,pos),fileType=u16(view,pos+4),comp=u16(view,pos+6),size=u32(view,pos+8),ucSize=u32(view,pos+12);
      if(subIdx===2&&ucSize===4&&size>=4&&pos+0x24<=data.length){
        return {value:u32(view,pos+0x20),fileType,comp,size,ucSize,offset:pos};
      }
      pos+=0x20+size;
    }
  }
  return null;
}
function readThemeColorFromPtf(bytes){return readThemeColorRecord(bytes)?.value??null;}
function verifyBuiltPtfMetadata(bytes,expected){
  const data=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes);
  if(readFixedString(data,8,128)!==expected.title)throw new Error('Title verification failed after export.');
  if(readFixedString(data,136,48)!==expected.productId)throw new Error('Product ID verification failed after export.');
  if(readFixedString(data,192,8)!==expected.version)throw new Error('Version verification failed after export.');
  const color=readThemeColorRecord(data);
  if(!color)throw new Error('Theme colour record is missing after export.');
  if(color.fileType!==5||color.comp!==2||color.size!==4||color.ucSize!==4){
    throw new Error(`Theme colour record has an invalid PSP header (type ${color.fileType}, compression ${color.comp}, size ${color.size}/${color.ucSize}).`);
  }
  if(color.value!==expected.themeColor)throw new Error(`Theme colour verification failed: expected ${expected.themeColor}, encoded ${color.value}.`);
  return true;
}

async function decompressDeflate(bytes) {
  if (!('DecompressionStream' in window)) throw new Error('This browser does not support Deflate decompression. Use current Safari, Chrome, Edge, or Firefox.');
  let lastError = null;
  // PTF records are padded to four bytes. Chromium rejects trailing padding,
  // so retry after removing up to three zero padding bytes.
  for (let trim = 0; trim <= 3 && trim < bytes.length; trim++) {
    if (trim > 0 && bytes[bytes.length - trim] !== 0) continue;
    try {
      const input = trim ? bytes.slice(0, bytes.length - trim) : bytes;
      const ds = new DecompressionStream('deflate');
      const ab = await new Response(new Blob([input]).stream().pipeThrough(ds)).arrayBuffer();
      return new Uint8Array(ab);
    } catch (e) { lastError = e; }
  }
  throw lastError || new Error('Could not decompress PTF asset.');
}
async function compressDeflate(bytes) {
  if (!('CompressionStream' in window)) throw new Error('This browser does not support Deflate compression. Use current Safari, Chrome, Edge, or Firefox.');
  const cs = new CompressionStream('deflate');
  const ab = await new Response(new Blob([bytes]).stream().pipeThrough(cs)).arrayBuffer();
  return new Uint8Array(ab);
}

function roleFor(obj, sub) {
  if (obj===0 && sub===0) return {type:'previewIcon',label:'Theme preview icon',required:[16,16],indexed:true};
  if (obj===0 && sub===1) return {type:'previewImage',label:'Theme preview image',required:[300,170],indexed:false};
  if (obj===1 && sub===0) return {type:'wallpaper',label:'Wallpaper',required:[480,272],indexed:false};
  if (obj===2) return {type:'category',label:CATEGORY_LABELS[sub] || `Category icon ${sub}`,required:[64,48],indexed:true};
  if (obj===3) {
    const bodyId = sub % 2 === 0 ? sub : sub-1;
    const focus = sub % 2 === 1;
    return {type:focus?'firstFocus':'firstBody',label:`${FIRST_LABELS[bodyId] || `First-level slot ${bodyId/2}`} — ${focus?'Focus':'Body'}`,required:focus?[64,64]:[48,48],indexed:true,pair:bodyId};
  }
  if (obj===4) {
    const bodyId = sub % 2 === 0 ? sub : sub-1;
    const focus = sub % 2 === 1;
    const slotName = bodyId===0 ? 'Second-level icon A' : bodyId===2 ? 'Second-level icon B' : `Second-level slot ${bodyId/2+1}`;
    return {type:focus?'secondFocus':'secondBody',label:`${slotName} — ${focus?'Focus':'Body'}`,required:focus?[48,48]:[32,32],indexed:true,pair:bodyId};
  }
  return {type:'unknown',label:`Asset ${obj}:${sub}`,required:null,indexed:false};
}


function currentProfile(){
  return MODEL_PROFILES[state.modelProfile] || MODEL_PROFILES.universal;
}
function assetCompatibility(asset){
  if(asset.objIdx===2 && asset.subIdx===5) return {label:'2000/3000 · JP/KR',className:'model',models:['2000','3000','universal']};
  if(asset.objIdx===2 && asset.subIdx===8) return {label:'Extras · category fallback',className:'fallback',models:['1000','2000','3000','go','street','universal']};
  if(asset.objIdx===3){
    const bodyId=asset.subIdx%2===0?asset.subIdx:asset.subIdx-1;
    if(bodyId===30) return {label:'2000/3000/Go',className:'model',models:['2000','3000','go','universal']};
    if(bodyId===56) return {label:'PSP Go',className:'go',models:['go','universal']};
    if(bodyId===58) return {label:'6.xx / Go',className:'go',models:['go','2000','3000','1000','universal']};
    if(bodyId===60 || bodyId===62 || bodyId===64) return {label:'PSP Go only',className:'go',models:['go','universal']};
    if(bodyId===54) return {label:'Fallback',className:'fallback',models:['1000','2000','3000','go','street','universal']};
  }
  return {label:'Standard',className:'',models:['1000','2000','3000','go','street','universal']};
}
function assetVisibleForProfile(asset){
  if(state.modelProfile==='universal')return true;
  const comp=assetCompatibility(asset);
  return comp.models.includes(state.modelProfile);
}
function visibleCategoryAssets(){
  const profile=currentProfile();
  return categoryAssets().filter(a=>!profile.categories || profile.categories.includes(a.subIdx));
}
function visibleItemsForCategory(categorySub){
  const profile=currentProfile();
  const profileItems=PROFILE_CATEGORY_ITEMS[state.modelProfile]?.[categorySub];
  const base=profileItems || CATEGORY_ITEMS[categorySub] || state.assets.filter(a=>a.objIdx===3&&a.subIdx%2===0).map(a=>a.subIdx);
  return base.filter(id=>{
    const asset=resolvedBodyAsset(id);
    return !profile.excludedItems.includes(id) && !!asset && assetVisibleForProfile(asset);
  });
}
function firstLevelDisplayLabel(bodyId){
  if(state.modelProfile==='go' && bodyId===10)return 'Saved Data Utility — Memory Stick';
  return FIRST_LABELS[bodyId] || `Item ${bodyId/2}`;
}
function updateModelUi(){
  const profile=currentProfile();
  els.modelHint.textContent=profile.hint;
  els.viewerStatus.textContent=state.theme?`${els.themeName.value || state.theme.title || state.sourceName} · ${profile.label} · ${state.assets.length} assets`:'No theme loaded';
}
function blankImageData(width,height){
  return new ImageData(new Uint8ClampedArray(width*height*4),width,height);
}
function cloneImageData(imageData){
  return new ImageData(new Uint8ClampedArray(imageData.data),imageData.width,imageData.height);
}
function createSyntheticAsset(objIdx,subIdx,sourceAsset=null){
  const role=roleFor(objIdx,subIdx);
  const [w,h]=role.required || [16,16];
  const imageData=sourceAsset?.imageData ? bitmapToSizedImageData(imageDataToCanvas(sourceAsset.imageData),w,h,'contain') : blankImageData(w,h);
  return {
    objIdx,subIdx,fileType:5,comp:2,packedSize:0,ucSize:0,packedOriginal:null,rawOriginal:null,rawCurrent:null,
    role,edited:true,imageData,gimMeta:{format:3,pixelOrder:0,width:w,height:h},paletteCount:countColors(imageData,257),
    decodeError:null,synthetic:true,pspGeneratedFocus:false
  };
}
function sourceForSynthetic(objIdx,subIdx){
  if(objIdx===2)return getAsset(2,8) || categoryAssets()[0] || null;
  if(objIdx===3){
    const isFocus=subIdx%2===1;
    return getAsset(3,isFocus?55:54) || state.assets.find(a=>a.objIdx===3&&a.role.type===(isFocus?'firstFocus':'firstBody')) || null;
  }
  return null;
}
function addMissingModelSlots(){
  if(!state.theme)return;
  const requirements=MODEL_SLOT_REQUIREMENTS[state.modelProfile] || MODEL_SLOT_REQUIREMENTS.universal;
  let added=0;
  for(const req of requirements){
    if(getAsset(req.obj,req.sub))continue;
    const asset=createSyntheticAsset(req.obj,req.sub,sourceForSynthetic(req.obj,req.sub));
    state.assets.push(asset);added++;
  }
  state.assets.sort((a,b)=>a.objIdx-b.objIdx||a.subIdx-b.subIdx);
  const goFallbackNote=(state.modelProfile==='go'||state.modelProfile==='universal')
    ? ' PSP Go System Storage and Resume Game remain preview aliases of the standard first-level fallback; PTF has no safe dedicated records for them.'
    : '';
  if(added){
    setDirty(true);renderAssetList();updateUiEnabled();
    toast('Model slots added',`${added} supported missing slot${added===1?' was':'s were'} created from the fallback artwork.${goFallbackNote}`,'success');
  }else toast('Profile is complete',`No supported model-specific slots were missing.${goFallbackNote}`,'success');
}
function slugify(value){
  return String(value||'').toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
}
function assetImportKey(asset){
  if(asset.role.type==='previewIcon')return 'preview_icon';
  if(asset.role.type==='previewImage')return 'preview_image';
  if(asset.role.type==='wallpaper')return 'wallpaper';
  if(asset.role.type==='category')return `category_${slugify(asset.role.label)}`;
  if(asset.objIdx===3){
    const base=asset.role.label.replace(/\s+—\s+(Body|Focus)$/,'');
    return `first_${slugify(base)}_${asset.role.type==='firstFocus'?'focus':'body'}`;
  }
  if(asset.objIdx===4){
    const base=asset.role.label.replace(/\s+—\s+(Body|Focus)$/,'');
    return `second_${slugify(base)}_${asset.role.type==='secondFocus'?'focus':'body'}`;
  }
  return `${asset.objIdx}_${String(asset.subIdx).padStart(4,'0')}`;
}
function aliasesForAsset(asset){
  const slot1=`${asset.objIdx}_${String(asset.subIdx).padStart(4,'0')}`;
  const slot2=`${asset.objIdx}_${asset.subIdx}`;
  const key=assetImportKey(asset);
  const label=slugify(asset.role.label);
  const aliases=new Set([slot1,slot2,key,label]);
  if(asset.role.type==='firstBody'||asset.role.type==='firstFocus'){
    const base=slugify(asset.role.label.replace(/\s+—\s+(Body|Focus)$/,''));
    aliases.add(`${base}_${asset.role.type==='firstFocus'?'focus':'body'}`);
    aliases.add(`${base}${asset.role.type==='firstFocus'?'_focus':''}`);
  }
  if(asset.role.type==='category')aliases.add(slugify(asset.role.label));
  return [...aliases];
}
function normalizeImportName(file){
  const path=(file.webkitRelativePath||file.name).toLowerCase();
  const noExt=path.replace(/\.[^.\/]+$/,'');
  return slugify(noExt.replace(/^.*\//,''));
}
function matchFileToAsset(file){
  const normalized=normalizeImportName(file);
  let best=null,bestScore=0;
  for(const asset of state.assets){
    for(const alias of aliasesForAsset(asset)){
      const norm=slugify(alias);
      let score=0;
      if(normalized===norm)score=100;
      else if(normalized.endsWith(`_${norm}`))score=80;
      else if(normalized.includes(norm)&&norm.length>=8)score=50;
      if(score>bestScore){best=asset;bestScore=score;}
    }
  }
  return bestScore>=50?best:null;
}

async function parsePtf(arrayBuffer, sourceName='theme.ptf') {
  const bytes = new Uint8Array(arrayBuffer);
  if (bytes.length < 0x120 || String.fromCharCode(...bytes.slice(0,4)) !== '\0PTF') throw new Error('Not a valid version 1 PTF file.');
  if (!(bytes[4]===0 && bytes[5]===1)) throw new Error('Unsupported PTF version.');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const theme = {
    title: readFixedString(bytes,8,128), productId:readFixedString(bytes,136,48),
    pspVersion:readFixedString(bytes,184,8), version:readFixedString(bytes,192,8), value8:u32(view,200),
    backgroundMode:0, categories:new Map(), sourceBytes:bytes
  };
  const offsets=[];
  for(let p=0x100;p<0x120;p+=4){const v=u32(view,p); if(v) offsets.push(v);}
  if (!offsets.length) throw new Error('PTF contains no asset groups.');
  const assets=[];
  for (const off of offsets) {
    if (off+0x20>bytes.length) throw new Error('Corrupt PTF object offset.');
    const objIdx=u16(view,off), subCount=u16(view,off+2), objSize=u32(view,off+4), dataOffset=u32(view,off+8);
    if(dataOffset+objSize>bytes.length) throw new Error(`Corrupt PTF object ${objIdx}.`);
    let pos=dataOffset;
    const category=[];
    for(let i=0;i<subCount;i++){
      if(pos+0x20>bytes.length) throw new Error(`Corrupt asset header in group ${objIdx}.`);
      const subIdx=u16(view,pos), fileType=u16(view,pos+4), comp=u16(view,pos+6), size=u32(view,pos+8), ucSize=u32(view,pos+12);
      if(pos+0x20+size>bytes.length) throw new Error(`Corrupt asset payload in group ${objIdx}.`);
      const packed=bytes.slice(pos+0x20,pos+0x20+size);
      let raw;
      if(comp===2 && size<ucSize) raw=await decompressDeflate(packed);
      else if(comp===1 && size<ucSize) raw=decompressLzr(packed,ucSize);
      else if(comp===0 || size===ucSize) raw=packed.slice(0,ucSize);
      else throw new Error(`Unsupported PTF compression type ${comp} in group ${objIdx}, slot ${subIdx}.`);
      if(raw.length!==ucSize) throw new Error(`Asset ${objIdx}:${subIdx} decompressed to ${raw.length} bytes; expected ${ucSize}.`);
      if(objIdx===0 && subIdx===2 && raw.length>=4){ theme.backgroundMode=new DataView(raw.buffer,raw.byteOffset,raw.byteLength).getUint32(0,true); }
      else {
        const role=roleFor(objIdx,subIdx);
        const asset={objIdx,subIdx,fileType,comp,packedSize:size,ucSize,packedOriginal:packed,rawOriginal:raw,rawCurrent:raw,role,edited:false,imageData:null,gimMeta:null,paletteCount:null,decodeError:null,pspGeneratedFocus:false};
        try { await decodeAsset(asset); } catch(e){ asset.decodeError=e.message; }
        assets.push(asset); category.push(asset);
      }
      pos += 0x20 + size;
    }
    theme.categories.set(objIdx,category);
  }
  return {theme,assets,sourceName};
}

async function decodeAsset(asset) {
  if(asset.fileType===5){
    const d=decodeGim(asset.rawCurrent); asset.imageData=d.imageData; asset.gimMeta=d.meta; asset.paletteCount=d.paletteCount;
  } else {
    const mime={0:'image/png',1:'image/jpeg',2:'image/tiff',3:'image/gif',4:'image/bmp'}[asset.fileType] || 'application/octet-stream';
    const bmp=await createImageBitmap(new Blob([asset.rawCurrent],{type:mime}));
    const c=document.createElement('canvas'); c.width=bmp.width; c.height=bmp.height; const cctx=c.getContext('2d'); cctx.drawImage(bmp,0,0); asset.imageData=cctx.getImageData(0,0,bmp.width,bmp.height); bmp.close();
    asset.paletteCount=countColors(asset.imageData,257);
  }
}

function decodeGim(bytes) {
  if(bytes.length<32) throw new Error('GIM is too small.');
  const magic=String.fromCharCode(...bytes.slice(0,4));
  const little=magic==='MIG.';
  if(!little && magic!=='.GIM') throw new Error('Invalid GIM header.');
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  const U16=(o)=>view.getUint16(o,little), U32=(o)=>view.getUint32(o,little);
  let pos=16, image=null, palette=null, guard=0;
  while(pos+16<=bytes.length && guard++<64){
    const blockStart=pos, type=U16(pos), next=U32(pos+8); const content=pos+16;
    if(type===4 || type===5){
      const structure=U16(content); if(structure!==0x30) throw new Error('Unsupported GIM image block.');
      const format=U16(content+4), pixelOrder=U16(content+6), width=U16(content+8), height=U16(content+10), bpp=U16(content+12);
      const pitchAlign=U16(content+14) || 1, nextIndex=U32(content+24), frameEnd=U32(content+32);
      const frameOffset=U32(content+nextIndex); const frame=bytes.slice(content+frameOffset,content+frameEnd);
      const tileWidth=0x80/bpp, tileHeight=8;
      const rw=pixelOrder===1?align(width,tileWidth):width, rh=pixelOrder===1?align(height,tileHeight):height;
      const rows=[]; let bytePos=0;
      for(let y=0;y<rh;y++){
        const row=[]; let bitPos=bytePos*8;
        for(let x=0;x<rw;x++){
          let val;
          if(bpp===4){const bi=bitPos>>3,sh=bitPos&7; val=(frame[bi]>>sh)&15;}
          else if(bpp===8) val=frame[bitPos>>3];
          else if(bpp===16) val=frame[(bitPos>>3)] | (frame[(bitPos>>3)+1]<<8);
          else if(bpp===32){const bi=bitPos>>3; val=(frame[bi] | frame[bi+1]<<8 | frame[bi+2]<<16 | frame[bi+3]<<24)>>>0;}
          else throw new Error(`Unsupported GIM ${bpp}bpp.`);
          row.push(val); bitPos+=bpp;
        }
        const rowBytes=Math.ceil(rw*bpp/8); bytePos+=align(rowBytes,pitchAlign);
        rows.push(row);
      }
      let pixels=rows;
      if(pixelOrder===1){
        const out=Array.from({length:height},()=>Array(width).fill(0)); let ox=0,oy=0,tp=0;
        for(let y=0;y<rh;y++) for(let x=0;x<rw;x++){
          const dx=ox+(tp%tileWidth), dy=oy+Math.floor(tp/tileWidth); if(dx<width&&dy<height) out[dy][dx]=rows[y][x];
          tp++; if(tp===tileWidth*tileHeight){tp=0;ox+=tileWidth;if(ox>=rw){ox=0;oy+=tileHeight;}}
        }
        pixels=out;
      } else pixels=rows.slice(0,height).map(r=>r.slice(0,width));
      const obj={format,width,height,pixels}; if(type===4) image=obj; else palette=obj;
    }
    if(!next) break; pos=blockStart+next; if(pos<=blockStart) break;
  }
  if(!image) throw new Error('GIM image block missing.');
  let format=image.format, pixels=image.pixels, paletteCount=null;
  if(palette){
    const pal=palette.pixels[0]; paletteCount=new Set(pixels.flat()).size;
    pixels=pixels.map(row=>row.map(v=>pal[v]??0)); format=palette.format;
  }
  const out=new Uint8ClampedArray(image.width*image.height*4); let o=0;
  for(const row of pixels) for(let v of row){
    let r,g,b,a;
    if(format===3){r=v&255;g=(v>>>8)&255;b=(v>>>16)&255;a=(v>>>24)&255;}
    else if(format===0){r=(v&31)*255/31;g=((v>>>5)&63)*255/63;b=((v>>>11)&31)*255/31;a=255;}
    else if(format===1){r=(v&31)*255/31;g=((v>>>5)&31)*255/31;b=((v>>>10)&31)*255/31;a=(v&0x8000)?255:0;}
    else if(format===2){r=(v&15)*17;g=((v>>>4)&15)*17;b=((v>>>8)&15)*17;a=((v>>>12)&15)*17;}
    else throw new Error(`Unsupported GIM format ${format}.`);
    out[o++]=r;out[o++]=g;out[o++]=b;out[o++]=a;
  }
  return {imageData:new ImageData(out,image.width,image.height),meta:{format,pixelOrder:0,width:image.width,height:image.height},paletteCount};
}

function countColors(imageData, limit=257){
  const s=new Set(),d=imageData.data;
  for(let i=0;i<d.length;i+=4){s.add(`${d[i]},${d[i+1]},${d[i+2]},${d[i+3]}`);if(s.size>=limit)break;}
  return s.size;
}
function formatBytes(value){
  const n=Number(value)||0;
  if(n<1024)return `${n} B`;
  if(n<1024*1024)return `${(n/1024).toFixed(n<10240?1:0)} KB`;
  return `${(n/(1024*1024)).toFixed(2)} MB`;
}

function imageDataToCanvas(imageData){const c=document.createElement('canvas');c.width=imageData.width;c.height=imageData.height;c.getContext('2d').putImageData(imageData,0,0);return c;}
function drawImageDataFit(targetCtx,imageData,x,y,w,h,alpha=1,smoothing=true){
  if(!imageData)return;
  const c=imageDataToCanvas(imageData);
  targetCtx.save();
  targetCtx.globalAlpha=alpha;
  targetCtx.imageSmoothingEnabled=smoothing;
  if(smoothing)targetCtx.imageSmoothingQuality='high';
  targetCtx.drawImage(c,x,y,w,h);
  targetCtx.restore();
}
function getAsset(obj,sub){return state.assets.find(a=>a.objIdx===obj&&a.subIdx===sub)||null;}
function categoryAssets(){return state.assets.filter(a=>a.objIdx===2).sort((a,b)=>a.subIdx-b.subIdx);}
function bodyAsset(bodyId){return getAsset(3,bodyId);}
function focusAsset(bodyId){return getAsset(3,bodyId+1);}
function isPspGoVirtualFirstLevel(bodyId){return PSP_GO_VIRTUAL_FIRST_LEVEL_IDS.has(bodyId);}
function resolvedBodyAsset(bodyId){return bodyAsset(bodyId)||(isPspGoVirtualFirstLevel(bodyId)?bodyAsset(54):null);}
function resolvedFocusAsset(bodyId){return focusAsset(bodyId)||(isPspGoVirtualFirstLevel(bodyId)?focusAsset(54):null);}

function populateThemeColors(){
  for(const select of [els.themeColor,els.variantThemeColor,els.exportThemeColor]){
    select.innerHTML='';
    THEME_COLORS.forEach((v,i)=>{const o=document.createElement('option');o.value=i;o.textContent=v;select.appendChild(o);});
  }
}
populateThemeColors();

async function loadThemeBuffer(buffer,name){
  setStatus('Reading PTF…');
  try{
    const parsed=await parsePtf(buffer,name);
    state.theme=parsed.theme;state.assets=parsed.assets;state.sourceName=name;state.selectedAsset=null;state.nav={categoryPos:0,itemPos:0,secondPos:0,level:1};state.modelProfile='universal';state.variants=[];state.lastFocusGenerationBackup=null;els.modelProfile.value='universal';
    if(els.undoFocusGeneratorBtn)els.undoFocusGeneratorBtn.disabled=true;
    state.animationStart=performance.now();setDirty(false); bindThemeFields(); renderAssetList(); updateUiEnabled();updateModelUi();renderVariantList();
    els.dropOverlay.classList.add('hidden');
    const errors=state.assets.filter(a=>a.decodeError).length;
    const lzrCount=state.assets.filter(a=>a.comp===1).length;
    updateModelUi();
    setStatus(errors?`Loaded with ${errors} unsupported asset(s)`:lzrCount?`Legacy LZR theme loaded · ${lzrCount} compressed assets`:'Theme loaded');
    const compressionNote=lzrCount?` Legacy RLZ/LZR compression detected in ${lzrCount} asset${lzrCount===1?'':'s'}.`:'';
    toast('Theme loaded',`${state.assets.length} editable assets found.${compressionNote}${errors?` ${errors} could not be previewed.`:''}`,errors?'error':'success');
  }catch(e){console.error(e);setStatus('Import failed');toast('Could not import theme',e.message,'error');}
}

function bindThemeFields(){
  const t=state.theme;
  // PTF v1 stores the display Title at 0x08 (128 bytes) and Product ID at 0x88 (48 bytes).
  els.themeName.value=t.title;
  els.productId.value=t.productId;
  els.version.value=t.version;
  els.themeColor.value=String(normalizeThemeColor(t.backgroundMode));
}
function updateUiEnabled(){
  const on=!!state.theme;
  [els.exportBtn,els.analyzeBtn,els.releasePackageBtn,els.themeName,els.productId,els.version,els.themeColor,els.modelProfile,
   els.addModelSlotsBtn,els.assetSearch,els.resetNavBtn,els.toggleGridBtn,els.bulkFocusBtn,els.bulkFocusDownscaleBtn,
   els.bulkFolderBtn,els.bulkFolderDownscaleBtn,els.focusGeneratorBtn,els.variantsBtn,els.selectFallbackBtn].forEach(e=>e.disabled=!on);
  updateBulkFocusButtons();
  updateSelectedFocusButton();
}
function updateBulkFocusButtons(){
  const focusAssets=state.assets.filter(a=>a.role.type==='firstFocus');
  els.restoreBulkFocusBtn.disabled=!state.theme || !focusAssets.some(a=>a.edited);
}

function renderAssetList(){
  updateBulkFocusButtons();
  const query=els.assetSearch.value.trim().toLowerCase(); els.assetGroups.innerHTML=''; els.assetGroups.classList.remove('emptyState');
  for(const objIdx of [0,1,2,3,4]){
    const group=state.assets.filter(a=>{
      if(a.objIdx!==objIdx)return false;
      const comp=assetCompatibility(a);
      const haystack=`${a.role.label} ${comp.label} ${a.objIdx}:${a.subIdx} ${assetImportKey(a)}`.toLowerCase();
      return haystack.includes(query);
    }); if(!group.length)continue;
    const wrap=document.createElement('div');wrap.className='assetGroup';
    const head=document.createElement('div');head.className='assetGroupHeader';head.innerHTML=`<strong>${GROUP_NAMES[objIdx]}</strong><span>${group.length}</span>`;wrap.appendChild(head);
    const list=document.createElement('div');list.className='assetList';
    for(const asset of group){
      const row=document.createElement('div');row.className='assetRow'+(asset===state.selectedAsset?' selected':'');row.dataset.assetKey=`${asset.objIdx}:${asset.subIdx}`;
      const thumb=document.createElement('canvas');thumb.className='assetThumb';thumb.width=84;thumb.height=68;drawThumb(thumb,asset);
      const txt=document.createElement('div');txt.className='assetRowText';txt.innerHTML=`<div class="assetRowTitle"></div><div class="assetRowSub">${asset.imageData?`${asset.imageData.width} × ${asset.imageData.height}`:'Unavailable'} · ${formatName(asset)}</div>`;txt.querySelector('.assetRowTitle').textContent=asset.role.label;
      const meta=document.createElement('div');meta.className='assetRowMeta';
      const comp=assetCompatibility(asset);
      if(comp.label!=='Standard'){
        const compat=document.createElement('span');compat.className=`compatPill ${comp.className}`;compat.textContent=comp.label;meta.appendChild(compat);
      }
      const badge=document.createElement('div');badge.className='assetBadge'+(asset.edited?' edited':'');badge.textContent=asset.synthetic?'NEW':asset.edited?'EDITED':`${asset.objIdx}:${asset.subIdx}`;meta.appendChild(badge);
      row.append(thumb,txt,meta);row.addEventListener('click',()=>selectAsset(asset));list.appendChild(row);
    }
    wrap.appendChild(list);els.assetGroups.appendChild(wrap);
  }
}
function drawThumb(canvas,asset){const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);checker(c,0,0,canvas.width,canvas.height,8);if(asset.imageData){const s=Math.min(64/asset.imageData.width,50/asset.imageData.height);const w=asset.imageData.width*s,h=asset.imageData.height*s;drawImageDataFit(c,asset.imageData,(84-w)/2,(68-h)/2,w,h);}}
function compressionName(asset){return asset.comp===1?'LZR':asset.comp===2?'Deflate':'Stored';}
function formatName(asset){const base=asset.fileType===5?(asset.gimMeta?`GIM ${asset.role.indexed?'P8':'RGBA'}`:'GIM'):({0:'PNG',1:'JPEG',2:'TIFF',3:'GIF',4:'BMP'}[asset.fileType]||'Binary');return `${base} · ${compressionName(asset)}`;}

function scrollAssetIntoView(asset){
  requestAnimationFrame(()=>{
    const row=els.assetGroups.querySelector(`[data-asset-key="${asset.objIdx}:${asset.subIdx}"]`);
    if(row){row.scrollIntoView({behavior:'smooth',block:'center'});row.classList.add('previewLinked');setTimeout(()=>row.classList.remove('previewLinked'),900);}
  });
}
function selectAsset(asset,{scroll=false}={}){
  if(scroll&&els.assetSearch.value)els.assetSearch.value='';
  state.selectedAsset=asset;renderAssetList();els.inspectorEmpty.style.display='none';els.inspector.classList.remove('hidden');
  els.assetTitle.textContent=asset.role.label;els.assetSlot.textContent=`PTF group ${asset.objIdx}, slot ${asset.subIdx}${asset.synthetic?' · newly added':''}`;
  els.requiredSize.textContent=asset.role.required?asset.role.required.join(' × '):'Original';
  els.currentSize.textContent=asset.imageData?`${asset.imageData.width} × ${asset.imageData.height}`:'Unavailable';
  els.currentFormat.textContent=formatName(asset);
  els.paletteInfo.textContent=asset.role.indexed?(asset.paletteCount!=null?`${asset.paletteCount} used / 256`:'≤ 256 colors'):'24/32-bit';
  els.packedInfo.textContent=asset.packedSize?formatBytes(asset.packedSize):asset.synthetic?'Pending export':'—';
  els.compatibilityInfo.textContent=assetCompatibility(asset).label;
  els.restoreAssetBtn.disabled=!asset.edited;updateValidation();drawInspectorPreview();updateFocusGeneratorPreview();updateSelectedFocusButton();
  if(scroll)scrollAssetIntoView(asset);
}
function checker(c,x,y,w,h,s=12){for(let yy=0;yy<h;yy+=s)for(let xx=0;xx<w;xx+=s){c.fillStyle=((xx/s+yy/s)&1)?'#20252c':'#171b20';c.fillRect(x+xx,y+yy,Math.min(s,w-xx),Math.min(s,h-yy));}}
function drawInspectorPreview(){const a=state.selectedAsset;previewCtx.clearRect(0,0,els.assetPreview.width,els.assetPreview.height);checker(previewCtx,0,0,els.assetPreview.width,els.assetPreview.height,14);if(!a?.imageData)return;const s=Math.min((els.assetPreview.width-30)/a.imageData.width,(els.assetPreview.height-30)/a.imageData.height);const w=a.imageData.width*s,h=a.imageData.height*s;drawImageDataFit(previewCtx,a.imageData,(els.assetPreview.width-w)/2,(els.assetPreview.height-h)/2,w,h);}
function updateValidation(){const a=state.selectedAsset;if(!a)return;let status='ok',title='Asset is valid',text='Ready for export.';if(a.decodeError){status='bad';title='Cannot decode this asset';text=a.decodeError;}else if(a.role.required&&(a.imageData.width!==a.role.required[0]||a.imageData.height!==a.role.required[1])){status='bad';title='Incorrect dimensions';text=`Expected ${a.role.required.join(' × ')} pixels.`;}else if(a.role.indexed&&a.paletteCount>256){status='warn';title='Will be reduced to 256 colors';text='PTF Studio will quantize the asset when exporting.';}els.validationBox.querySelector('.validationDot').className=`validationDot ${status}`;els.validationBox.querySelector('strong').textContent=title;els.validationText.textContent=text;}

function bitmapToSizedImageData(bmp,tw,th,mode='contain'){
  const c=document.createElement('canvas');c.width=tw;c.height=th;
  const cctx=c.getContext('2d',{willReadFrequently:true});cctx.clearRect(0,0,tw,th);
  let dx=0,dy=0,dw=tw,dh=th;
  if(mode!=='stretch'){
    const scale=mode==='cover'?Math.max(tw/bmp.width,th/bmp.height):Math.min(tw/bmp.width,th/bmp.height);
    dw=bmp.width*scale;dh=bmp.height*scale;dx=(tw-dw)/2;dy=(th-dh)/2;
  }
  cctx.imageSmoothingEnabled=true;cctx.imageSmoothingQuality='high';cctx.drawImage(bmp,dx,dy,dw,dh);
  return cctx.getImageData(0,0,tw,th);
}
function bitmapToImageData(bmp){
  const c=document.createElement('canvas');c.width=bmp.width;c.height=bmp.height;
  const cctx=c.getContext('2d',{willReadFrequently:true});cctx.clearRect(0,0,c.width,c.height);cctx.drawImage(bmp,0,0);
  return cctx.getImageData(0,0,c.width,c.height);
}
function bicubicSmoothWeight(value){
  // Cubic B-spline kernel: smooth, non-ringing and well suited to icon reduction.
  const x=Math.abs(value);
  if(x<1)return (4-6*x*x+3*x*x*x)/6;
  if(x<2){const t=2-x;return t*t*t/6;}
  return 0;
}
function buildBicubicContributions(sourceSize,destSize){
  const sourcePerDest=sourceSize/destSize;
  // Widen the reconstruction kernel while reducing. This is the antialiasing
  // step missing from a simple 4 × 4 bicubic sample and prevents source pixels
  // from being skipped when a large image is reduced to a PSP icon.
  const filterScale=Math.max(1,sourcePerDest);
  const radius=2*filterScale;
  const contributions=new Array(destSize);
  for(let d=0;d<destSize;d++){
    const center=(d+.5)*sourcePerDest-.5;
    const left=Math.ceil(center-radius);
    const right=Math.floor(center+radius);
    const merged=new Map();
    let total=0;
    for(let s=left;s<=right;s++){
      const weight=bicubicSmoothWeight((center-s)/filterScale);
      if(weight<=0)continue;
      const clamped=Math.max(0,Math.min(sourceSize-1,s));
      merged.set(clamped,(merged.get(clamped)||0)+weight);
      total+=weight;
    }
    const indices=new Int32Array(merged.size);
    const weights=new Float64Array(merged.size);
    let i=0;
    for(const [index,weight] of merged){
      indices[i]=index;
      weights[i]=total?weight/total:0;
      i++;
    }
    contributions[d]={indices,weights};
  }
  return contributions;
}
function resizeBicubicPremultiplied(source,destWidth,destHeight){
  if(source.width===destWidth&&source.height===destHeight)return cloneImageData(source);
  if(destWidth<1||destHeight<1)throw new Error('Invalid resize dimensions.');
  const sw=source.width,sh=source.height,src=source.data;
  const xContributions=buildBicubicContributions(sw,destWidth);
  const yContributions=buildBicubicContributions(sh,destHeight);

  // Horizontal pass in premultiplied-alpha space. Premultiplication keeps
  // transparent borders from producing dark or light fringes.
  const horizontal=new Float32Array(destWidth*sh*4);
  for(let y=0;y<sh;y++){
    for(let x=0;x<destWidth;x++){
      const contribution=xContributions[x];
      let r=0,g=0,b=0,a=0;
      for(let n=0;n<contribution.indices.length;n++){
        const sx=contribution.indices[n],weight=contribution.weights[n];
        const pos=(y*sw+sx)*4,alpha=src[pos+3]/255;
        a+=alpha*weight;
        r+=(src[pos]/255)*alpha*weight;
        g+=(src[pos+1]/255)*alpha*weight;
        b+=(src[pos+2]/255)*alpha*weight;
      }
      const out=(y*destWidth+x)*4;
      horizontal[out]=r;horizontal[out+1]=g;horizontal[out+2]=b;horizontal[out+3]=a;
    }
  }

  // Vertical pass, then unpremultiply only once at the final size.
  const out=new Uint8ClampedArray(destWidth*destHeight*4);
  for(let y=0;y<destHeight;y++){
    const contribution=yContributions[y];
    for(let x=0;x<destWidth;x++){
      let r=0,g=0,b=0,a=0;
      for(let n=0;n<contribution.indices.length;n++){
        const sy=contribution.indices[n],weight=contribution.weights[n];
        const pos=(sy*destWidth+x)*4;
        r+=horizontal[pos]*weight;
        g+=horizontal[pos+1]*weight;
        b+=horizontal[pos+2]*weight;
        a+=horizontal[pos+3]*weight;
      }
      const alpha=Math.max(0,Math.min(1,a));
      const outPos=(y*destWidth+x)*4;
      if(alpha>1e-7){
        out[outPos]=Math.max(0,Math.min(255,Math.round((r/alpha)*255)));
        out[outPos+1]=Math.max(0,Math.min(255,Math.round((g/alpha)*255)));
        out[outPos+2]=Math.max(0,Math.min(255,Math.round((b/alpha)*255)));
        out[outPos+3]=Math.round(alpha*255);
      }else{
        out[outPos]=0;out[outPos+1]=0;out[outPos+2]=0;out[outPos+3]=0;
      }
    }
  }
  return new ImageData(out,destWidth,destHeight);
}
function placeImageDataOnTransparentCanvas(source,targetWidth,targetHeight,dx,dy){
  const out=new ImageData(new Uint8ClampedArray(targetWidth*targetHeight*4),targetWidth,targetHeight);
  for(let y=0;y<source.height;y++){
    const ty=y+dy;if(ty<0||ty>=targetHeight)continue;
    for(let x=0;x<source.width;x++){
      const tx=x+dx;if(tx<0||tx>=targetWidth)continue;
      const sp=(y*source.width+x)*4,dp=(ty*targetWidth+tx)*4;
      out.data[dp]=source.data[sp];out.data[dp+1]=source.data[sp+1];out.data[dp+2]=source.data[sp+2];out.data[dp+3]=source.data[sp+3];
    }
  }
  return out;
}
function usesFullCanvasStretch(asset){return asset.role.type==='wallpaper'||asset.role.type==='previewImage';}
async function prepareImageDataForImport(asset,file,mode='exact'){
  if(!asset?.role.required)throw new Error('This asset does not have a defined PSP canvas size.');
  const bmp=await createImageBitmap(file);
  try{
    const source=bitmapToImageData(bmp),[tw,th]=asset.role.required;
    if(mode==='exact'){
      if(source.width!==tw||source.height!==th)throw new Error(`${asset.role.label} requires exactly ${tw} × ${th} pixels. The selected image is ${source.width} × ${source.height}. Use Downscale & Import for a larger source.`);
      return source;
    }
    if(mode!=='downscale')throw new Error(`Unknown import mode: ${mode}.`);
    if(source.width===tw&&source.height===th)return source;
    if(usesFullCanvasStretch(asset)){
      if(source.width<tw||source.height<th)throw new Error(`${asset.role.label} cannot be enlarged. Use a source at least ${tw} × ${th} pixels.`);
      return resizeBicubicPremultiplied(source,tw,th);
    }
    const scale=Math.min(tw/source.width,th/source.height);
    if(scale>1)throw new Error(`${asset.role.label} cannot be enlarged. Use a source canvas at least as large as ${tw} × ${th}, or import an exact-size image.`);
    const dw=Math.max(1,Math.round(source.width*scale)),dh=Math.max(1,Math.round(source.height*scale));
    const resized=resizeBicubicPremultiplied(source,dw,dh);
    return placeImageDataOnTransparentCanvas(resized,tw,th,Math.floor((tw-dw)/2),Math.floor((th-dh)/2));
  }finally{bmp.close();}
}
async function replaceAssetWithFile(asset,file,{silent=false,mode='exact'}={}){
  if(!asset||!asset.role.required)return false;
  asset.imageData=await prepareImageDataForImport(asset,file,mode);
  asset.paletteCount=countColors(asset.imageData,257);asset.edited=true;asset.decodeError=null;asset.pspGeneratedFocus=false;
  if(!silent){
    const [tw,th]=asset.role.required;
    toast(mode==='downscale'?'Image downscaled':'Image imported',mode==='downscale'?`${asset.role.label} was resized to ${tw} × ${th} with bicubic smooth filtering.`:`${asset.role.label} was imported without resizing.`,'success');
  }
  return true;
}
async function replaceSelectedAsset(file,mode='exact'){
  const a=state.selectedAsset;if(!a||!a.role.required)return;
  try{
    await replaceAssetWithFile(a,file,{mode});
    setDirty(true);selectAsset(a);renderAssetList();
  }catch(e){toast(mode==='downscale'?'Could not downscale image':'Could not import image',e.message,'error');}
}
async function bulkImportFolder(fileList,mode='exact'){
  const files=[...fileList].filter(f=>f.type.startsWith('image/')||/\.(png|jpe?g|webp|bmp|gif|tiff?|tga)$/i.test(f.name));
  if(!files.length){toast('No images found','Choose a folder containing supported image files.','error');return;}
  let matched=0,failed=0;const skipped=[],errors=[];
  setStatus(`${mode==='downscale'?'Downscaling':'Importing'} ${files.length} folder assets…`);
  for(const file of files){
    const asset=matchFileToAsset(file);
    if(!asset){skipped.push(file.name);continue;}
    try{await replaceAssetWithFile(asset,file,{silent:true,mode});matched++;}catch(e){console.error(e);failed++;if(errors.length<3)errors.push(`${file.name}: ${e.message}`);}
  }
  if(matched){setDirty(true);renderAssetList();if(state.selectedAsset)selectAsset(state.selectedAsset);}
  setStatus(`Folder import · ${matched} matched · ${skipped.length} skipped · ${failed} failed`);
  const detail=`${matched} file${matched===1?'':'s'} matched PTF slots.${skipped.length?` ${skipped.length} unmatched.`:''}${failed?` ${failed} rejected.${errors.length?` ${errors.join(' | ')}`:''}`:''}`;
  toast(matched?'Folder imported':'No assets imported',detail,matched?'success':'error');
}
async function bulkReplaceFirstLevelFocus(file,mode='exact'){
  const targets=state.assets.filter(a=>a.role.type==='firstFocus'&&a.role.required);
  if(!targets.length){toast('No focus assets found','This PTF does not contain first-level focus slots.','error');return;}
  try{
    const prepared=await prepareImageDataForImport(targets[0],file,mode);
    for(const a of targets){a.imageData=cloneImageData(prepared);a.paletteCount=countColors(a.imageData,257);a.edited=true;a.decodeError=null;a.pspGeneratedFocus=false;}
    setDirty(true);renderAssetList();if(state.selectedAsset?.role.type==='firstFocus')selectAsset(state.selectedAsset);
    toast('First-level focus changed',`${targets.length} focus slots now use the ${mode==='downscale'?'downscaled':'exact-size'} image.`,'success');
  }catch(e){console.error(e);toast('Could not apply focus image',e.message,'error');}
}
async function restoreAllFirstLevelFocus(){
  const targets=state.assets.filter(a=>a.role.type==='firstFocus'&&a.edited);
  if(!targets.length)return;
  try{
    for(const a of [...targets]){
      if(a.synthetic){state.assets.splice(state.assets.indexOf(a),1);continue;}
      a.rawCurrent=a.rawOriginal;a.edited=false;a.pspGeneratedFocus=false;await decodeAsset(a);
    }
    setDirty(state.assets.some(x=>x.edited)||metadataDirty());renderAssetList();
    if(state.selectedAsset?.role.type==='firstFocus'&&!state.assets.includes(state.selectedAsset)){state.selectedAsset=null;els.inspector.classList.add('hidden');els.inspectorEmpty.style.display='block';}
    else if(state.selectedAsset?.role.type==='firstFocus')selectAsset(state.selectedAsset);
    toast('Focus assets restored',`${targets.length} first-level focus slots were restored.`,'success');
  }catch(e){console.error(e);toast('Could not restore focus assets',e.message,'error');}
}
async function restoreSelected(){
  const a=state.selectedAsset;if(!a)return;
  if(a.synthetic){
    state.assets.splice(state.assets.indexOf(a),1);state.selectedAsset=null;els.inspector.classList.add('hidden');els.inspectorEmpty.style.display='block';
    setDirty(state.assets.some(x=>x.edited)||metadataDirty());renderAssetList();toast('Added slot removed',a.role.label,'success');return;
  }
  a.rawCurrent=a.rawOriginal;a.edited=false;a.pspGeneratedFocus=false;await decodeAsset(a);setDirty(state.assets.some(x=>x.edited)||metadataDirty());selectAsset(a);renderAssetList();toast('Original restored',a.role.label,'success');
}
function metadataDirty(){if(!state.theme)return false;return els.themeName.value!==state.theme.title||els.productId.value!==state.theme.productId||els.version.value!==state.theme.version||normalizeThemeColor(els.themeColor.value)!==normalizeThemeColor(state.theme.backgroundMode);}


function clamp01(v){return Math.max(0,Math.min(1,v));}
function easeOutCubic(v){v=clamp01(v);return 1-Math.pow(1-v,3);}
function setPspFont(sizePx,weight=500){ctx.font=`${weight} ${sizePx}px ${PSP_FONT_STACK}`;}
function drawPspText(text,x,y,{size=30,weight=500,align='left',alpha=1,shadow=true,maxWidth=null}={}){
  ctx.save();
  setPspFont(size,weight);
  ctx.textAlign=align;
  ctx.textBaseline='alphabetic';
  ctx.globalAlpha=alpha;
  ctx.fillStyle='rgba(248,248,246,.985)';
  if(shadow){
    // Soft PSP-style text shadow. It remains readable on bright wallpapers
    // without producing the harsh duplicate-text outline used in early builds.
    ctx.shadowColor='rgba(0,0,0,.54)';
    ctx.shadowBlur=4.5;
    ctx.shadowOffsetX=2;
    ctx.shadowOffsetY=2.5;
  }
  if(maxWidth)ctx.fillText(text,x,y,maxWidth);else ctx.fillText(text,x,y);
  ctx.restore();
}
function formatPspDateTime(date=new Date()){
  const day=date.getDate();
  const month=date.getMonth()+1;
  const hours=date.getHours();
  const minutes=String(date.getMinutes()).padStart(2,'0');
  return `${day}/${month} ${hours}:${minutes}`;
}
async function loadPreviewFont(file){
  if(!file)return;
  try{
    if(state.fontObjectUrl)URL.revokeObjectURL(state.fontObjectUrl);
    state.fontObjectUrl=URL.createObjectURL(file);
    const face=new FontFace('PSP New Rodin',`url(${state.fontObjectUrl})`);
    await face.load();
    document.fonts.add(face);
    state.fontLoaded=true;
    els.fontStatus.textContent=file.name;
    toast('Preview font loaded','XMB labels and status text now use the selected font.','success');
  }catch(e){
    console.error(e);
    state.fontLoaded=false;
    els.fontStatus.textContent='System fallback';
    toast('Could not load font',e.message,'error');
  }
}


function selectedBodyForDirectFocus(){
  const a=state.selectedAsset;
  if(a?.role.type==='firstBody'||a?.role.type==='secondBody')return a;
  if(a?.role.type==='firstFocus')return getAsset(3,a.subIdx-1);
  if(a?.role.type==='secondFocus')return getAsset(4,a.subIdx-1);
  return null;
}
function updateSelectedFocusButton(){
  const body=selectedBodyForDirectFocus();
  els.selectedFocusGeneratorBtn.disabled=!state.theme||!body?.imageData||!imageHasVisiblePixels(body.imageData);
}
function selectedBodyForFocusGenerator(){
  const a=state.selectedAsset;
  if(a?.role.type==='firstBody'||a?.role.type==='secondBody')return a;
  if(a?.role.type==='firstFocus')return getAsset(3,a.subIdx-1);
  if(a?.role.type==='secondFocus')return getAsset(4,a.subIdx-1);
  return state.assets.find(x=>x.role.type==='firstBody'&&x.imageData) || null;
}
function hexToRgb(hex){
  const v=String(hex).replace('#','');
  return {r:parseInt(v.slice(0,2),16)||255,g:parseInt(v.slice(2,4),16)||255,b:parseInt(v.slice(4,6),16)||255};
}
const PSP_FOCUS_MARGIN = 8;
const PSP_FOCUS_ALPHA_LEVELS = 64; // Transparent + 63 visible white-alpha levels.

function gaussianKernel(radius){
  const r=Math.max(1,Math.min(8,Math.round(radius))),sigma=Math.max(.8,r/2),kernel=new Float32Array(r*2+1);
  let sum=0;
  for(let i=-r;i<=r;i++){const value=Math.exp(-(i*i)/(2*sigma*sigma));kernel[i+r]=value;sum+=value;}
  for(let i=0;i<kernel.length;i++)kernel[i]/=sum;
  return kernel;
}
function blurAlphaChannel(alpha,width,height,radius){
  const kernel=gaussianKernel(radius),r=(kernel.length-1)/2,temp=new Float32Array(alpha.length),out=new Float32Array(alpha.length);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    let sum=0;
    for(let k=-r;k<=r;k++){const sx=Math.max(0,Math.min(width-1,x+k));sum+=alpha[y*width+sx]*kernel[k+r];}
    temp[y*width+x]=sum;
  }
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    let sum=0;
    for(let k=-r;k<=r;k++){const sy=Math.max(0,Math.min(height-1,y+k));sum+=temp[sy*width+x]*kernel[k+r];}
    out[y*width+x]=sum;
  }
  return out;
}
function quantizeFocusAlpha(alpha){
  if(alpha<3)return 0;
  const visibleLevels=PSP_FOCUS_ALPHA_LEVELS-1;
  const level=Math.max(1,Math.min(visibleLevels,Math.round(alpha/255*visibleLevels)));
  return Math.round(level*255/visibleLevels);
}
function validatePspGeneratedFocus(imageData,targetW,targetH){
  if(!imageData||imageData.width!==targetW||imageData.height!==targetH)throw new Error(`Generated focus must be exactly ${targetW} × ${targetH} pixels.`);
  const colors=new Set(),alphas=new Set(),d=imageData.data;
  for(let i=0;i<d.length;i+=4){
    const a=d[i+3];
    if(a===0){if(d[i]||d[i+1]||d[i+2])throw new Error('Transparent focus pixels contain stray RGB data.');}
    else if(d[i]!==255||d[i+1]!==255||d[i+2]!==255)throw new Error('Generated focus RGB must remain pure white.');
    colors.add(`${d[i]},${d[i+1]},${d[i+2]},${a}`);alphas.add(a);
  }
  if(colors.size>PSP_FOCUS_ALPHA_LEVELS)throw new Error(`Generated focus uses ${colors.size} palette entries; PSP-safe maximum is ${PSP_FOCUS_ALPHA_LEVELS}.`);
  return {paletteEntries:colors.size,alphaLevels:alphas.size};
}
function generateFocusImage(bodyImage,targetW,targetH,{opacity=.9,blur=6}={}){
  const expectedW=targetW-PSP_FOCUS_MARGIN*2,expectedH=targetH-PSP_FOCUS_MARGIN*2;
  if(bodyImage.width!==expectedW||bodyImage.height!==expectedH){
    throw new Error(`The matching normal icon must be ${expectedW} × ${expectedH} pixels before focus generation.`);
  }
  const pixelCount=targetW*targetH,core=new Float32Array(pixelCount),source=bodyImage.data;
  for(let sy=0;sy<bodyImage.height;sy++)for(let sx=0;sx<bodyImage.width;sx++){
    const sourceIndex=(sy*bodyImage.width+sx)*4;
    core[(sy+PSP_FOCUS_MARGIN)*targetW+(sx+PSP_FOCUS_MARGIN)]=source[sourceIndex+3];
  }
  const blurred=blurAlphaChannel(core,targetW,targetH,Math.max(2,Math.min(6,Math.round(blur))));
  const data=new Uint8ClampedArray(pixelCount*4),strength=Math.max(.1,Math.min(1,Number(opacity)||.9));
  for(let i=0;i<pixelCount;i++){
    // Sony-style focus artwork is the outer illumination only. The source
    // silhouette is removed so the normal icon remains the sole sharp core.
    const halo=Math.max(0,blurred[i]*strength-core[i]);
    const a=quantizeFocusAlpha(halo),o=i*4;
    if(a){data[o]=255;data[o+1]=255;data[o+2]=255;data[o+3]=a;}
  }
  const result=new ImageData(data,targetW,targetH);
  validatePspGeneratedFocus(result,targetW,targetH);
  return result;
}
function focusOptionsFromUi(){
  return {
    opacity:Number(els.focusOpacity.value)/100,
    blur:Number(els.focusBlur.value)
  };
}
function imageHasVisiblePixels(imageData){
  if(!imageData?.data)return false;
  for(let i=3;i<imageData.data.length;i+=4)if(imageData.data[i]>7)return true;
  return false;
}
function focusAssetForBody(body){
  return body?getAsset(body.objIdx,body.subIdx+1):null;
}
function currentCategoryFocusBodies(){
  const categories=visibleCategoryAssets();
  const selected=categories[state.nav.categoryPos];
  if(!selected)return [];
  return visibleItemsForCategory(selected.subIdx).map(bodyAsset).filter(a=>a?.role.type==='firstBody');
}
function focusTargetsForSelection(){
  const target=els.focusTarget.value;
  let bodies=[];
  if(target==='first')bodies=state.assets.filter(a=>a.role.type==='firstBody');
  else if(target==='second')bodies=state.assets.filter(a=>a.role.type==='secondBody');
  else if(target==='both')bodies=state.assets.filter(a=>a.role.type==='firstBody'||a.role.type==='secondBody');
  else if(target==='category')bodies=currentCategoryFocusBodies();
  else{
    const selected=selectedBodyForFocusGenerator();
    bodies=selected?[selected]:[];
  }
  const unique=new Map();
  for(const body of bodies)unique.set(`${body.objIdx}:${body.subIdx}`,body);
  return [...unique.values()].sort((a,b)=>a.objIdx-b.objIdx||a.subIdx-b.subIdx);
}
function focusGenerationPlan(){
  const allTargets=focusTargetsForSelection();
  const populated=allTargets.filter(a=>a.imageData&&imageHasVisiblePixels(a.imageData));
  const missingSources=allTargets.length-populated.length;
  const missingOnly=els.focusGenerationMode?.value!=='replace';
  const existing=populated.filter(body=>{
    const focus=focusAssetForBody(body);
    return focus?.imageData&&imageHasVisiblePixels(focus.imageData);
  });
  const affected=missingOnly?populated.filter(body=>!existing.includes(body)):populated;
  return {allTargets,populated,existing,affected,missingSources,missingOnly};
}
function drawFocusPreviewSheet(pc,bodies,opts){
  pc.clearRect(0,0,256,256);checker(pc,0,0,256,256,16);
  if(!bodies.length)return;
  if(bodies.length===1){
    const body=bodies[0],target=body.role.type==='secondBody'?[48,48]:[64,64];
    const generated=generateFocusImage(body.imageData,target[0],target[1],opts);
    const scale=3.2,gw=generated.width*scale,gh=generated.height*scale,bw=body.imageData.width*scale,bh=body.imageData.height*scale;
    drawImageDataFit(pc,generated,(256-gw)/2,(256-gh)/2,gw,gh,1);
    drawImageDataFit(pc,body.imageData,(256-bw)/2,(256-bh)/2,bw,bh,1);
    return;
  }
  const previewBodies=bodies.slice(0,16),cols=4,rows=Math.ceil(previewBodies.length/cols),cellW=256/cols,cellH=256/Math.max(1,rows);
  previewBodies.forEach((body,index)=>{
    const target=body.role.type==='secondBody'?[48,48]:[64,64];
    const generated=generateFocusImage(body.imageData,target[0],target[1],opts);
    const scale=Math.min((cellW-8)/target[0],(cellH-8)/target[1]);
    const gw=target[0]*scale,gh=target[1]*scale,x=(index%cols)*cellW+(cellW-gw)/2,y=Math.floor(index/cols)*cellH+(cellH-gh)/2;
    drawImageDataFit(pc,generated,x,y,gw,gh,1);
    const bodyScale=Math.min((cellW-20)/body.imageData.width,(cellH-20)/body.imageData.height);
    const bw=body.imageData.width*bodyScale,bh=body.imageData.height*bodyScale;
    drawImageDataFit(pc,body.imageData,(index%cols)*cellW+(cellW-bw)/2,Math.floor(index/cols)*cellH+(cellH-bh)/2,bw,bh,1);
  });
}
function updateFocusGeneratorPreview(){
  if(!els.focusPreviewCanvas)return;
  els.focusOpacityValue.textContent=`${els.focusOpacity.value}%`;
  els.focusBlurValue.textContent=`${els.focusBlur.value} px`;
  els.focusPaddingValue.textContent=`${PSP_FOCUS_MARGIN} px`;
  const plan=focusGenerationPlan(),pc=els.focusPreviewCanvas.getContext('2d');
  drawFocusPreviewSheet(pc,plan.affected,focusOptionsFromUi());
  if(!plan.populated.length){
    els.focusPreviewLabel.textContent='No matching normal icons are available';
  }else if(!plan.affected.length){
    els.focusPreviewLabel.textContent='Every matching focus slot already contains artwork';
  }else if(plan.affected.length===1){
    els.focusPreviewLabel.textContent=`Preview from ${plan.affected[0].role.label.replace(/\s+—\s+Body$/,'')}`;
  }else{
    els.focusPreviewLabel.textContent=`Previewing ${Math.min(plan.affected.length,16)} of ${plan.affected.length} generated focus assets`;
  }
  const existingSkipped=plan.missingOnly?plan.existing.length:0;
  const parts=[`${plan.populated.length} matching normal icon${plan.populated.length===1?'':'s'}`,`${plan.affected.length} focus asset${plan.affected.length===1?'':'s'} will be generated`];
  if(existingSkipped)parts.push(`${existingSkipped} existing focus asset${existingSkipped===1?'':'s'} will remain unchanged`);
  if(plan.missingSources)parts.push(`${plan.missingSources} empty source slot${plan.missingSources===1?'':'s'} skipped`);
  els.focusBatchSummary.textContent=parts.join(' · ');
  els.applyFocusGeneratorBtn.disabled=!plan.affected.length;
}
function ensureFocusPair(body){
  const focusSub=body.subIdx+1;let focus=getAsset(body.objIdx,focusSub);
  if(!focus){
    focus=createSyntheticAsset(body.objIdx,focusSub,null);state.assets.push(focus);state.assets.sort((a,b)=>a.objIdx-b.objIdx||a.subIdx-b.subIdx);
  }
  return focus;
}
function snapshotFocusForUndo(body){
  const focus=focusAssetForBody(body);
  if(!focus)return {objIdx:body.objIdx,subIdx:body.subIdx+1,existed:false};
  return {
    objIdx:focus.objIdx,subIdx:focus.subIdx,existed:true,
    imageData:focus.imageData?cloneImageData(focus.imageData):null,
    paletteCount:focus.paletteCount,edited:focus.edited,decodeError:focus.decodeError,synthetic:focus.synthetic,pspGeneratedFocus:!!focus.pspGeneratedFocus
  };
}
async function applyFocusGenerator(){
  const plan=focusGenerationPlan();
  if(!plan.affected.length){
    toast('Nothing to generate',plan.missingOnly?'All matching focus slots already contain artwork.':'No populated source icons match the selected scope.','error');
    return;
  }
  const opts=focusOptionsFromUi(),dirtyBefore=state.dirty,entries=plan.affected.map(snapshotFocusForUndo);
  try{
    for(const body of plan.affected){
      const focus=ensureFocusPair(body),[tw,th]=focus.role.required;
      focus.imageData=generateFocusImage(body.imageData,tw,th,opts);
      const validated=validatePspGeneratedFocus(focus.imageData,tw,th);
      focus.paletteCount=validated.paletteEntries;focus.edited=true;focus.decodeError=null;focus.pspGeneratedFocus=true;
      const encoded=encodeGimPspFocus(focus.imageData),decoded=decodeGim(encoded.bytes);
      if(decoded.imageData.width!==tw||decoded.imageData.height!==th||decoded.paletteCount>PSP_FOCUS_ALPHA_LEVELS)throw new Error(`${focus.role.label} failed GIM round-trip validation.`);
    }
    state.lastFocusGenerationBackup={entries,dirtyBefore};
    const preflight=await buildPtf({status:false});
    verifyBuiltPtfMetadata(preflight.bytes,preflight.metadata);
    if(preflight.bytes.length>PTF_MAX_SIZE)throw new Error(`Generated focuses would make the theme ${formatBytes(preflight.bytes.length)}. The PSP PTF limit is 768 KB.`);
    els.undoFocusGeneratorBtn.disabled=false;
    setDirty(true);renderAssetList();if(state.selectedAsset)selectAsset(state.selectedAsset);
    updateFocusGeneratorPreview();
    toast('PSP-safe focuses generated',`${plan.affected.length} focus asset${plan.affected.length===1?' was':'s were'} generated with white RGB, alpha-only halos and a 64-entry palette.`,'success');
  }catch(error){
    const backup={entries,dirtyBefore};
    for(const entry of [...backup.entries].reverse()){
      const current=getAsset(entry.objIdx,entry.subIdx);
      if(!entry.existed){if(current)state.assets=state.assets.filter(asset=>asset!==current);continue;}
      if(!current)continue;
      current.imageData=entry.imageData?cloneImageData(entry.imageData):null;current.paletteCount=entry.paletteCount;current.edited=entry.edited;current.decodeError=entry.decodeError;current.synthetic=entry.synthetic;current.pspGeneratedFocus=entry.pspGeneratedFocus;
    }
    state.lastFocusGenerationBackup=null;els.undoFocusGeneratorBtn.disabled=true;setDirty(dirtyBefore);renderAssetList();if(state.selectedAsset&&state.assets.includes(state.selectedAsset))selectAsset(state.selectedAsset);
    updateFocusGeneratorPreview();
    toast('Focus generation cancelled',error.message,'error');
  }
}
function undoLastFocusGeneration(){
  const backup=state.lastFocusGenerationBackup;
  if(!backup?.entries?.length)return;
  for(const entry of [...backup.entries].reverse()){
    const current=getAsset(entry.objIdx,entry.subIdx);
    if(!entry.existed){
      if(current){
        if(state.selectedAsset===current)state.selectedAsset=null;
        state.assets=state.assets.filter(a=>a!==current);
      }
      continue;
    }
    if(!current)continue;
    current.imageData=entry.imageData?cloneImageData(entry.imageData):null;
    current.paletteCount=entry.paletteCount;current.edited=entry.edited;current.decodeError=entry.decodeError;current.synthetic=entry.synthetic;current.pspGeneratedFocus=entry.pspGeneratedFocus;
  }
  state.lastFocusGenerationBackup=null;els.undoFocusGeneratorBtn.disabled=true;
  setDirty(backup.dirtyBefore);renderAssetList();
  if(state.selectedAsset)selectAsset(state.selectedAsset);
  updateFocusGeneratorPreview();
  toast('Bulk generation undone','The previous focus assets have been restored.','success');
}

function registerPreviewHit(asset,x,y,w,h,kind='icon'){
  if(!asset)return;
  state.previewHitRegions.push({asset,x,y,w,h,kind});
}
function previewAssetAtEvent(event){
  const rect=els.xmbCanvas.getBoundingClientRect();
  const x=(event.clientX-rect.left)*(els.xmbCanvas.width/rect.width),y=(event.clientY-rect.top)*(els.xmbCanvas.height/rect.height);
  for(let i=state.previewHitRegions.length-1;i>=0;i--){
    const r=state.previewHitRegions[i];if(x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h)return r.asset;
  }
  return null;
}
function openImportAssetModal(asset){
  if(!asset?.role.required)return;
  selectAsset(asset,{scroll:true});
  const [w,h]=asset.role.required;
  els.importAssetModalTitle.textContent=asset.role.label;
  els.importAssetModalSub.textContent=`Required canvas: ${w} × ${h} pixels`;
  openModal(els.importAssetModal);
}

function drawXmb(time){
  const W=960,H=544;ctx.clearRect(0,0,W,H);state.previewHitRegions=[];
  if(!state.theme){ctx.fillStyle='#07090d';ctx.fillRect(0,0,W,H);requestAnimationFrame(drawXmb);return;}
  if(state.viewMode==='assets'&&state.selectedAsset){drawAssetStage();requestAnimationFrame(drawXmb);return;}
  const bg=getAsset(1,0);if(bg?.imageData){drawImageDataFit(ctx,bg.imageData,0,0,W,H,1,true);registerPreviewHit(bg,0,0,W,H,'background');}else{const grad=ctx.createLinearGradient(0,0,W,H);grad.addColorStop(0,'#222936');grad.addColorStop(1,'#090b10');ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);}
  drawStatusBar();
  const cats=visibleCategoryAssets();if(!cats.length){requestAnimationFrame(drawXmb);return;}
  state.nav.categoryPos=Math.max(0,Math.min(state.nav.categoryPos,cats.length-1));
  const selected=cats[state.nav.categoryPos];
  const hierarchyShift=state.nav.level===2 ? -60*PSP_SCALE : 0;
  cats.forEach((a,i)=>{
    const d=i-state.nav.categoryPos;
    const x=XMB_LAYOUT.categoryX+hierarchyShift+d*XMB_LAYOUT.categorySpacing;
    const selectedCat=i===state.nav.categoryPos;
    const hitX=x-XMB_LAYOUT.categoryWidth/2,hitY=XMB_LAYOUT.categoryY-XMB_LAYOUT.categoryHeight/2;
    drawImageDataFit(ctx,a.imageData,hitX,hitY,XMB_LAYOUT.categoryWidth,XMB_LAYOUT.categoryHeight,selectedCat?1:.62,false);
    registerPreviewHit(a,hitX,hitY,XMB_LAYOUT.categoryWidth,XMB_LAYOUT.categoryHeight,'category');
  });
  drawPspText(selected.role.label,XMB_LAYOUT.categoryX+hierarchyShift,XMB_LAYOUT.categoryLabelY,{
    size:XMB_LAYOUT.categoryFontSize,weight:500,align:'center'
  });
  const itemIds=visibleItemsForCategory(selected.subIdx);
  if(itemIds.length){
    state.nav.itemPos=(state.nav.itemPos+itemIds.length)%itemIds.length;
    drawVerticalItems(itemIds,time,hierarchyShift);
  }
  if(state.showGuides){
    const gx=XMB_LAYOUT.categoryX+hierarchyShift;
    const drawGuideGeometry=()=>{
      ctx.strokeRect(1,1,W-2,H-2);
      ctx.beginPath();
      ctx.moveTo(gx,0);ctx.lineTo(gx,H);
      ctx.moveTo(0,XMB_LAYOUT.categoryY);ctx.lineTo(W,XMB_LAYOUT.categoryY);
      ctx.moveTo(0,XMB_LAYOUT.itemY);ctx.lineTo(W,XMB_LAYOUT.itemY);
      ctx.stroke();
    };
    ctx.save();
    ctx.setLineDash([12,7]);
    ctx.lineCap='round';
    ctx.strokeStyle='rgba(0,0,0,.82)';
    ctx.lineWidth=6;
    drawGuideGeometry();
    ctx.strokeStyle='rgba(85,235,255,.98)';
    ctx.lineWidth=2.25;
    ctx.shadowColor='rgba(43,211,255,.75)';
    ctx.shadowBlur=7;
    drawGuideGeometry();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(85,235,255,.98)';
    ctx.shadowBlur=8;
    for(const [x,y] of [[gx,XMB_LAYOUT.categoryY],[gx,XMB_LAYOUT.itemY]]){
      ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='rgba(0,0,0,.9)';ctx.lineWidth=2;ctx.stroke();
    }
    ctx.restore();
  }
  requestAnimationFrame(drawXmb);
}

function roundedRectPath(c,x,y,w,h,r){
  r=Math.min(r,w/2,h/2);c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);
}

function drawStatusBar(){
  const label=formatPspDateTime();
  ctx.save();
  setPspFont(13*PSP_SCALE,500);
  ctx.textAlign='right';
  ctx.textBaseline='alphabetic';
  ctx.fillStyle='rgba(0,0,0,.82)';
  ctx.fillText(label,XMB_LAYOUT.statusRightX+2,XMB_LAYOUT.statusBaselineY+3);
  ctx.fillStyle='rgba(250,250,248,.98)';
  ctx.fillText(label,XMB_LAYOUT.statusRightX,XMB_LAYOUT.statusBaselineY);

  const x=XMB_LAYOUT.batteryX,y=XMB_LAYOUT.batteryY,w=XMB_LAYOUT.batteryWidth,h=XMB_LAYOUT.batteryHeight;
  if(PSP_BATTERY_IMAGE.complete && PSP_BATTERY_IMAGE.naturalWidth){
    ctx.imageSmoothingEnabled=false;
    ctx.drawImage(PSP_BATTERY_IMAGE,x,y,w,h);
  }
  ctx.restore();
}

function focusPulse(elapsed){
  // PSP-style glow: 10% → 100% → 10%. Beta 0.9 slows the full cycle to 1000 ms.
  return els.pulseToggle.checked?(0.10+0.90*(0.5+0.5*Math.sin((elapsed/1000)*Math.PI*2-Math.PI/2))):1;
}

function firstLevelDimAlpha(k){
  const distance=Math.abs(k);
  if(distance===0)return 1;
  if(distance===1)return .34;
  if(distance===2)return .22;
  return .12;
}

function drawStorageItemLabel(bodyId,categorySub,yy,x,alpha){
  const isStorage=bodyId===2 || bodyId===60;
  if(!isStorage)return false;
  const main=bodyId===60?'System Storage':'Memory Stick™';
  drawPspText(main,x,yy-5*PSP_SCALE,{
    size:XMB_LAYOUT.itemFontSize,weight:500,align:'left',alpha,maxWidth:310*PSP_SCALE
  });
  ctx.save();
  ctx.globalAlpha=alpha*.95;
  ctx.strokeStyle='rgba(248,248,246,.95)';
  ctx.lineWidth=1*PSP_SCALE;
  ctx.beginPath();ctx.moveTo(x,yy-1*PSP_SCALE);ctx.lineTo(XMB_LAYOUT.itemLineRightX,yy-1*PSP_SCALE);ctx.stroke();
  ctx.restore();
  const freeSpace=bodyId===60?'Free Space 12.4 GB':'Free Space 486 MB';
  drawPspText(freeSpace,x,yy+14*PSP_SCALE,{
    size:XMB_LAYOUT.itemSubFontSize,weight:500,align:'left',alpha,maxWidth:310*PSP_SCALE
  });
  return true;
}

function drawVerticalItems(ids,time,hierarchyShift=0){
  const selectedIndex=state.nav.itemPos;
  const elapsed=time-state.animationStart;
  const focusIn=easeOutCubic(elapsed/135);
  const pulse=focusPulse(elapsed);
  const categories=visibleCategoryAssets();
  const categorySub=categories[state.nav.categoryPos]?.subIdx;
  for(let k=-2;k<=3;k++){
    const idx=selectedIndex+k;if(idx<0||idx>=ids.length)continue;
    const bodyId=ids[idx],body=resolvedBodyAsset(bodyId),focus=resolvedFocusAsset(bodyId);if(!body?.imageData)continue;
    // The previous row moves into a dedicated lane above the selected category,
    // matching real PSP captures and preventing it from sitting behind the category icon.
    const upperLaneY=XMB_LAYOUT.categoryY-XMB_LAYOUT.categoryHeight/2-XMB_LAYOUT.bodyHeight/2;
    const yy=k<0?upperLaneY+(k+1)*XMB_LAYOUT.itemSpacing:XMB_LAYOUT.itemY+k*XMB_LAYOUT.itemSpacing;
    const sel=k===0;
    const dimAlpha=firstLevelDimAlpha(k);
    const itemX=XMB_LAYOUT.itemX+hierarchyShift;
    if(sel&&focus?.imageData){
      const focusScale=.96+.04*focusIn;
      const fw=XMB_LAYOUT.focusWidth*focusScale,fh=XMB_LAYOUT.focusHeight*focusScale;
      drawImageDataFit(ctx,focus.imageData,itemX-fw/2,yy-fh/2,fw,fh,pulse,false);
    }
    const bodyX=itemX-XMB_LAYOUT.bodyWidth/2,bodyY=yy-XMB_LAYOUT.bodyHeight/2;
    drawImageDataFit(ctx,body.imageData,bodyX,bodyY,XMB_LAYOUT.bodyWidth,XMB_LAYOUT.bodyHeight,sel?1:dimAlpha,false);
    registerPreviewHit(body,bodyX,bodyY,XMB_LAYOUT.bodyWidth,XMB_LAYOUT.bodyHeight,'first');

    // Real XMB lists keep neighbouring first-level labels visible only at level 1.
    // When a second-level submenu opens, all parent-level text disappears while
    // the parent icons remain visible and shift left behind the child menu.
    if(state.nav.level!==2){
      const labelAlpha=sel?focusIn:dimAlpha*.90;
      const labelX=XMB_LAYOUT.itemLabelX+hierarchyShift;
      if(!(sel&&drawStorageItemLabel(bodyId,categorySub,yy,labelX,labelAlpha))){
        drawPspText(firstLevelDisplayLabel(bodyId),labelX,yy+XMB_LAYOUT.itemLabelOffsetY,{
          size:XMB_LAYOUT.itemFontSize,weight:500,align:'left',alpha:labelAlpha,maxWidth:318*PSP_SCALE
        });
      }
    }
  }
  if(state.nav.level===2)drawSecondLevelMenu(time);
}

function secondLevelAssetPair(index){
  const bodySub=index===0?0:2;
  return {body:getAsset(4,bodySub),focus:getAsset(4,bodySub+1)};
}

function drawSecondLevelMenu(time){
  const items=[
    {label:'Theme',value:'Classic'},
    {label:'Color',value:''},
    {label:'Background',value:'Classic'}
  ];
  state.nav.secondPos=(state.nav.secondPos+items.length)%items.length;
  const elapsed=time-state.animationStart;
  const pulse=focusPulse(elapsed);
  const focusIn=easeOutCubic(elapsed/120);
  const iconX=130*PSP_SCALE;
  const labelX=151*PSP_SCALE;
  const valueX=438*PSP_SCALE;
  const pointerX=99*PSP_SCALE;
  for(let k=-2;k<=2;k++){
    const idx=state.nav.secondPos+k;if(idx<0||idx>=items.length)continue;
    const yy=XMB_LAYOUT.itemY+k*XMB_LAYOUT.itemSpacing;
    const selected=k===0;
    const pair=secondLevelAssetPair(idx);
    if(pair.body?.imageData){
      if(selected&&pair.focus?.imageData){
        drawImageDataFit(ctx,pair.focus.imageData,iconX-24*PSP_SCALE,yy-24*PSP_SCALE,48*PSP_SCALE,48*PSP_SCALE,pulse,false);
      }
      const secondX=iconX-16*PSP_SCALE,secondY=yy-16*PSP_SCALE;
      drawImageDataFit(ctx,pair.body.imageData,secondX,secondY,32*PSP_SCALE,32*PSP_SCALE,selected?1:.30,false);
      registerPreviewHit(pair.body,secondX,secondY,32*PSP_SCALE,32*PSP_SCALE,'second');
    }
    drawPspText(items[idx].label,labelX,yy+XMB_LAYOUT.itemLabelOffsetY,{
      size:XMB_LAYOUT.itemFontSize,weight:500,align:'left',alpha:selected?focusIn:.34
    });
    if(items[idx].value){
      drawPspText(items[idx].value,valueX,yy+XMB_LAYOUT.itemLabelOffsetY,{
        size:12*PSP_SCALE,weight:500,align:'right',alpha:selected?.90:.34
      });
    }
    if(selected){
      ctx.save();
      ctx.globalAlpha=focusIn;
      ctx.fillStyle='rgba(0,0,0,.78)';
      ctx.beginPath();ctx.moveTo(pointerX+2*PSP_SCALE,yy-6*PSP_SCALE+2);ctx.lineTo(pointerX-5*PSP_SCALE+2,yy+2);ctx.lineTo(pointerX+2*PSP_SCALE,yy+6*PSP_SCALE+2);ctx.closePath();ctx.fill();
      ctx.fillStyle='rgba(248,248,246,.98)';
      ctx.beginPath();ctx.moveTo(pointerX,yy-6*PSP_SCALE);ctx.lineTo(pointerX-7*PSP_SCALE,yy);ctx.lineTo(pointerX,yy+6*PSP_SCALE);ctx.closePath();ctx.fill();
      ctx.restore();
    }
  }
}

function drawAssetStage(){const a=state.selectedAsset;state.previewHitRegions=[];ctx.fillStyle='#101318';ctx.fillRect(0,0,960,544);checker(ctx,0,0,960,544,24);if(a.imageData){const s=Math.min(760/a.imageData.width,410/a.imageData.height);const w=a.imageData.width*s,h=a.imageData.height*s,x=(960-w)/2,y=(544-h)/2;drawImageDataFit(ctx,a.imageData,x,y,w,h);registerPreviewHit(a,x,y,w,h,'asset');}ctx.fillStyle='rgba(0,0,0,.65)';ctx.fillRect(0,490,960,54);ctx.fillStyle='#fff';ctx.font='600 20px -apple-system, sans-serif';ctx.textAlign='center';ctx.fillText(a.role.label,480,523);}
requestAnimationFrame(drawXmb);

function canOpenSecondLevel(selectedCategory,items){
  if(selectedCategory?.subIdx!==1 || !items.length || !state.assets.some(a=>a.objIdx===4))return false;
  return items[state.nav.itemPos]===24;
}

function moveNav(key){
  if(!state.theme)return;
  const cats=visibleCategoryAssets();if(!cats.length)return;
  const selected=cats[state.nav.categoryPos];
  const items=visibleItemsForCategory(selected.subIdx);
  if(state.nav.level===2){
    if(key==='ArrowUp')state.nav.secondPos=(state.nav.secondPos-1+3)%3;
    if(key==='ArrowDown')state.nav.secondPos=(state.nav.secondPos+1)%3;
    if(key==='Escape'||key==='ArrowLeft')state.nav.level=1;
    state.animationStart=performance.now();
    return;
  }
  if(key==='ArrowLeft'){state.nav.categoryPos=(state.nav.categoryPos-1+cats.length)%cats.length;state.nav.itemPos=0;state.nav.secondPos=0;}
  if(key==='ArrowRight'){state.nav.categoryPos=(state.nav.categoryPos+1)%cats.length;state.nav.itemPos=0;state.nav.secondPos=0;}
  const active=cats[state.nav.categoryPos],activeItems=visibleItemsForCategory(active.subIdx);
  if(key==='ArrowUp'&&activeItems.length)state.nav.itemPos=(state.nav.itemPos-1+activeItems.length)%activeItems.length;
  if(key==='ArrowDown'&&activeItems.length)state.nav.itemPos=(state.nav.itemPos+1)%activeItems.length;
  if((key==='Enter'||key===' ')&&canOpenSecondLevel(active,activeItems)){state.nav.level=2;state.nav.secondPos=0;}
  if(key==='Escape')state.nav.level=1;
  state.animationStart=performance.now();
}

function quantize(imageData,maxColors=256,dither=true){
  const d=imageData.data;const opaque=[];let transparent=false;const unique=new Map();
  for(let i=0;i<d.length;i+=4){const a=d[i+3];if(a<8){transparent=true;continue;}const key=`${d[i]},${d[i+1]},${d[i+2]},${a}`;if(unique.size<=maxColors&&!unique.has(key))unique.set(key,[d[i],d[i+1],d[i+2],a]);}
  const maxOpaque=maxColors-(transparent?1:0);
  let palette;
  if(unique.size<=maxOpaque){palette=[...unique.values()];}
  else{
    const sampleStep=Math.max(1,Math.floor((d.length/4)/12000));
    for(let p=0,i=0;i<d.length;i+=4,p++)if(p%sampleStep===0&&d[i+3]>=8)opaque.push([d[i],d[i+1],d[i+2],d[i+3]]);
    let boxes=[opaque];
    while(boxes.length<maxOpaque){let bi=-1,bscore=-1,channel=0;for(let i=0;i<boxes.length;i++){const b=boxes[i];if(b.length<2)continue;for(let c=0;c<4;c++){let mn=255,mx=0;for(const px of b){mn=Math.min(mn,px[c]);mx=Math.max(mx,px[c]);}const score=(mx-mn)*Math.sqrt(b.length)*(c===3?1.15:1);if(score>bscore){bscore=score;bi=i;channel=c;}}}if(bi<0)break;const b=boxes.splice(bi,1)[0];b.sort((a,b)=>a[channel]-b[channel]);const mid=Math.floor(b.length/2);boxes.push(b.slice(0,mid),b.slice(mid));}
    palette=boxes.map(b=>{const s=[0,0,0,0];for(const p of b)for(let c=0;c<4;c++)s[c]+=p[c];return s.map(v=>Math.round(v/Math.max(1,b.length)));});
  }
  if(transparent)palette.unshift([0,0,0,0]);while(palette.length<256)palette.push([0,0,0,0]);if(palette.length>256)palette.length=256;
  const w=imageData.width,h=imageData.height,indices=new Uint8Array(w*h);const work=new Float32Array(d.length);for(let i=0;i<d.length;i++)work[i]=d[i];
  const nearest=(r,g,b,a)=>{if(a<8&&transparent)return 0;let best=transparent?1:0,bd=Infinity;for(let j=transparent?1:0;j<palette.length;j++){const p=palette[j];const dr=r-p[0],dg=g-p[1],db=b-p[2],da=(a-p[3])*1.2;const dist=dr*dr+dg*dg+db*db+da*da;if(dist<bd){bd=dist;best=j;if(dist===0)break;}}return best;};
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;const idx=nearest(work[i],work[i+1],work[i+2],work[i+3]);indices[y*w+x]=idx;if(dither){const p=palette[idx],er=work[i]-p[0],eg=work[i+1]-p[1],eb=work[i+2]-p[2],ea=work[i+3]-p[3];const spread=(xx,yy,f)=>{if(xx<0||xx>=w||yy<0||yy>=h)return;const q=(yy*w+xx)*4;work[q]+=er*f;work[q+1]+=eg*f;work[q+2]+=eb*f;work[q+3]+=ea*f;};spread(x+1,y,7/16);spread(x-1,y+1,3/16);spread(x,y+1,5/16);spread(x+1,y+1,1/16);}}
  return {palette,indices,used:new Set(indices).size};
}

function swizzleIndices(indices,w,h,bpp=8){const tileW=0x80/bpp,tileH=8,ow=align(w,tileW),oh=align(h,tileH),out=new Uint8Array(ow*oh);let ox=0,oy=0,tp=0,p=0;for(let y=0;y<oh;y++)for(let x=0;x<ow;x++){const sx=ox+(tp%tileW),sy=oy+Math.floor(tp/tileW);out[p++]=(sx<w&&sy<h)?indices[sy*w+sx]:0;tp++;if(tp===tileW*tileH){tp=0;ox+=tileW;if(ox>=ow){ox=0;oy+=tileH;}}}return out;}
function blockHeader(type,size,next){const b=new Uint8Array(16);const v=new DataView(b.buffer);setU16(v,0,type);setU32(v,4,size);setU32(v,8,next);setU32(v,12,0x10);return b;}
function concatArrays(parts){const len=parts.reduce((s,p)=>s+p.length,0),out=new Uint8Array(len);let o=0;for(const p of parts){out.set(p,o);o+=p.length;}return out;}
function makeImageBlock(type,format,pixelOrder,w,h,bpp,pixelBytes,levelType){const content=new Uint8Array(0x40+pixelBytes.length);const v=new DataView(content.buffer);setU16(v,0,0x30);setU16(v,4,format);setU16(v,6,pixelOrder);setU16(v,8,w);setU16(v,10,h);setU16(v,12,bpp);setU16(v,14,0x10);setU16(v,16,0x08);setU16(v,18,2);setU32(v,24,0x30);setU32(v,28,0x40);setU32(v,32,0x40+pixelBytes.length);setU32(v,36,0);setU16(v,40,levelType);setU16(v,42,1);setU16(v,44,3);setU16(v,46,1);setU32(v,0x30,0x40);content.set(pixelBytes,0x40);const total=16+content.length;return concatArrays([blockHeader(type,total,total),content]);}
function makeFileInfo(){const text=new TextEncoder().encode(`\0\0${new Date().toString().slice(0,24)}\n\0PTF Studio 1.0\0`);const padded=new Uint8Array(align(text.length,4));padded.set(text);const total=16+padded.length;return concatArrays([blockHeader(0xff,total,total),padded]);}
function encodeGimIndexed(imageData,dither=true){const q=quantize(imageData,256,dither),w=imageData.width,h=imageData.height;const palBytes=new Uint8Array(1024);q.palette.forEach((p,i)=>{palBytes[i*4]=p[0];palBytes[i*4+1]=p[1];palBytes[i*4+2]=p[2];palBytes[i*4+3]=p[3];});const indexBytes=swizzleIndices(q.indices,w,h,8);let paletteBlock=makeImageBlock(5,3,0,256,1,32,palBytes,2);let imageBlock=makeImageBlock(4,5,1,w,h,8,indexBytes,1);const fileInfo=makeFileInfo();
  // Correct global next pointers after sizes are known.
  new DataView(paletteBlock.buffer).setUint32(8,paletteBlock.length,true);new DataView(imageBlock.buffer).setUint32(8,imageBlock.length,true);
  const pictureSize=16+paletteBlock.length+imageBlock.length;const picture=blockHeader(3,pictureSize,16);const rootSize=16+pictureSize+fileInfo.length;const root=blockHeader(2,rootSize,16);const header=new Uint8Array([77,73,71,46,48,48,46,49,80,83,80,0,0,0,0,0]);return {bytes:concatArrays([header,root,picture,paletteBlock,imageBlock,fileInfo]),used:q.used};}
function encodeGimPspFocus(imageData){
  const validation=validatePspGeneratedFocus(imageData,imageData.width,imageData.height);
  const w=imageData.width,h=imageData.height,palette=new Array(256).fill(null).map(()=>[0,0,0,0]);
  const visibleLevels=PSP_FOCUS_ALPHA_LEVELS-1;
  for(let level=1;level<=visibleLevels;level++)palette[level]=[255,255,255,Math.round(level*255/visibleLevels)];
  const indices=new Uint8Array(w*h),d=imageData.data;
  for(let i=0,p=0;i<d.length;i+=4,p++){
    const a=d[i+3];indices[p]=a===0?0:Math.max(1,Math.min(visibleLevels,Math.round(a/255*visibleLevels)));
  }
  const palBytes=new Uint8Array(1024);
  palette.forEach((entry,index)=>{palBytes[index*4]=entry[0];palBytes[index*4+1]=entry[1];palBytes[index*4+2]=entry[2];palBytes[index*4+3]=entry[3];});
  const indexBytes=swizzleIndices(indices,w,h,8);
  let paletteBlock=makeImageBlock(5,3,0,256,1,32,palBytes,2),imageBlock=makeImageBlock(4,5,1,w,h,8,indexBytes,1),fileInfo=makeFileInfo();
  new DataView(paletteBlock.buffer).setUint32(8,paletteBlock.length,true);new DataView(imageBlock.buffer).setUint32(8,imageBlock.length,true);
  const pictureSize=16+paletteBlock.length+imageBlock.length,picture=blockHeader(3,pictureSize,16),rootSize=16+pictureSize+fileInfo.length,root=blockHeader(2,rootSize,16),header=new Uint8Array([77,73,71,46,48,48,46,49,80,83,80,0,0,0,0,0]);
  return {bytes:concatArrays([header,root,picture,paletteBlock,imageBlock,fileInfo]),used:validation.paletteEntries};
}
function encodeGimRgba(imageData){const w=imageData.width,h=imageData.height,d=imageData.data,pixels=new Uint8Array(w*h*4);pixels.set(d);const imageBlock=makeImageBlock(4,3,0,w,h,32,pixels,1),fileInfo=makeFileInfo();const pictureSize=16+imageBlock.length,picture=blockHeader(3,pictureSize,16),rootSize=16+pictureSize+fileInfo.length,root=blockHeader(2,rootSize,16),header=new Uint8Array([77,73,71,46,48,48,46,49,80,83,80,0,0,0,0,0]);return concatArrays([header,root,picture,imageBlock,fileInfo]);}
function encodeBmp24(imageData){const w=imageData.width,h=imageData.height,row=align(w*3,4),size=54+row*h,b=new Uint8Array(size),v=new DataView(b.buffer);b[0]=66;b[1]=77;setU32(v,2,size);setU32(v,10,54);setU32(v,14,40);v.setInt32(18,w,true);v.setInt32(22,h,true);setU16(v,26,1);setU16(v,28,24);setU32(v,34,row*h);const d=imageData.data;for(let y=0;y<h;y++){const sy=h-1-y;for(let x=0;x<w;x++){const si=(sy*w+x)*4,di=54+y*row+x*3;b[di]=d[si+2];b[di+1]=d[si+1];b[di+2]=d[si];}}return b;}

async function encodeAssetImage(asset,imageData){
  if(asset.fileType===5){
    if(asset.pspGeneratedFocus&&(asset.role.type==='firstFocus'||asset.role.type==='secondFocus')){
      const r=encodeGimPspFocus(imageData);asset.paletteCount=r.used;return r.bytes;
    }
    if(asset.role.indexed){
      const r=encodeGimIndexed(imageData,els.ditherToggle.checked);asset.paletteCount=r.used;return r.bytes;
    }
    return encodeGimRgba(imageData);
  }
  if(asset.fileType===4)return encodeBmp24(imageData);
  const c=imageDataToCanvas(imageData);
  const mime={0:'image/png',1:'image/jpeg',2:'image/tiff',3:'image/gif'}[asset.fileType]||'image/png';
  const blob=await new Promise(res=>c.toBlob(res,mime));
  if(!blob)throw new Error(`Browser could not encode ${asset.role.label}.`);
  return new Uint8Array(await blob.arrayBuffer());
}
async function rawForAsset(asset,imageOverride=null){
  if(!imageOverride&&!asset.edited&&asset.rawOriginal)return asset.rawOriginal;
  const image=imageOverride||asset.imageData;
  if(!image)throw new Error(`${asset.role.label} has no image data.`);
  return encodeAssetImage(asset,image);
}
async function bestCompression(raw){
  if(raw.length<=4)return {comp:0,packed:raw};
  const z=await compressDeflate(raw);
  return z.length<raw.length?{comp:2,packed:z}:{comp:0,packed:raw};
}
async function buildPtf(options={}){
  if(!state.theme)throw new Error('No theme loaded.');
  if(options.status!==false)setStatus('Building PTF…');
  const categoryMap=new Map();
  let omittedUnsupportedSlots=0;
  for(const a of state.assets){
    // Do not emit invented PSP Go records 60–65. On real hardware a single
    // unsupported subtype can invalidate the complete first-level icon group.
    if(a.objIdx===3&&a.subIdx>PTF_FIRST_LEVEL_MAX_SUB){omittedUnsupportedSlots++;continue;}
    if(!categoryMap.has(a.objIdx))categoryMap.set(a.objIdx,[]);
    categoryMap.get(a.objIdx).push(a);
  }
  for(const arr of categoryMap.values())arr.sort((a,b)=>a.subIdx-b.subIdx);
  if(!categoryMap.has(0))categoryMap.set(0,[]);
  const metadata=validateThemeMetadata({
    title:options.title??els.themeName.value,
    productId:options.productId??els.productId.value,
    version:options.version??els.version.value
  });
  const themeColor=normalizeThemeColor(options.themeColor??els.themeColor.value);
  const modeRaw=new Uint8Array(4);new DataView(modeRaw.buffer).setUint32(0,themeColor,true);
  const groups=[];const exportedAssets=new Map();let preservedLzr=0,convertedLzr=0,deflated=0,stored=0;
  for(const objIdx of [...categoryMap.keys()].sort((a,b)=>a-b)){
    const records=[];
    if(objIdx===0){
      const arr=categoryMap.get(0);for(const a of arr)records.push({asset:a,subIdx:a.subIdx});
      records.push({asset:null,subIdx:2,raw:modeRaw,fileType:5,comp:2,forceRaw:true});records.sort((a,b)=>a.subIdx-b.subIdx);
    }else for(const a of categoryMap.get(objIdx))records.push({asset:a,subIdx:a.subIdx});
    const entryParts=[];
    for(const r of records){
      const overrideImage=r.asset&&options.assetTransform?options.assetTransform(r.asset):null;
      const raw=r.raw||await rawForAsset(r.asset,overrideImage);let comp=r.asset?.comp??r.comp??2,packed;
      const canPreserve=r.asset&&!overrideImage&&!r.asset.edited&&r.asset.packedOriginal;
      if(r.forceRaw){
        // Sony's converter marks the four-byte colour record as mode 2 while storing it verbatim.
        // Keep this canonical header even though packed and unpacked sizes are both four bytes.
        packed=raw;comp=2;stored++;
      }else if(canPreserve){
        packed=r.asset.packedOriginal;comp=r.asset.comp;if(comp===1)preservedLzr++;
      }else{
        const wasLzr=r.asset?.comp===1;
        const packedResult=await bestCompression(raw);comp=packedResult.comp;packed=packedResult.packed;
        if(comp===2)deflated++;else stored++;
        if(wasLzr)convertedLzr++;
      }
      const padded=new Uint8Array(align(packed.length,4));padded.set(packed);
      const header=new Uint8Array(0x20),hv=new DataView(header.buffer);
      setU16(hv,0,r.subIdx);setU16(hv,4,r.asset?.fileType??r.fileType);setU16(hv,6,comp);
      setU32(hv,8,padded.length);setU32(hv,12,raw.length);entryParts.push(header,padded);
      if(r.asset&&!overrideImage)exportedAssets.set(r.asset,{raw,packed:padded,comp,packedSize:padded.length,ucSize:raw.length});
    }
    const body=concatArrays(entryParts),groupHeader=new Uint8Array(0x20),gv=new DataView(groupHeader.buffer);
    setU16(gv,0,objIdx);setU16(gv,2,records.length);setU32(gv,4,body.length);groups.push({objIdx,header:groupHeader,body});
  }
  let offset=0x120;
  for(const g of groups){setU32(new DataView(g.header.buffer),8,offset+0x20);g.offset=offset;offset+=0x20+g.body.length;}
  const out=new Uint8Array(offset),v=new DataView(out.buffer);
  out.set([0,80,84,70,0,1,0,0],0);
  writeFixedString(out,8,128,metadata.title,'Title');
  writeFixedString(out,136,48,metadata.productId,'Product ID');
  writeFixedString(out,184,8,state.theme.pspVersion||'6.20','PSP version');
  writeFixedString(out,192,8,metadata.version,'Version');
  setU32(v,200,state.theme.value8||8);groups.forEach((g,i)=>setU32(v,0x100+i*4,g.offset));
  for(const g of groups){out.set(g.header,g.offset);out.set(g.body,g.offset+0x20);}
  return {bytes:out,exportedAssets,metadata:{...metadata,themeColor},stats:{preservedLzr,convertedLzr,deflated,stored,omittedUnsupportedSlots}};
}
function normalizeExportFileName(value,productId){
  let name=String(value??'').trim();
  if(!name)name=String(productId||'theme').trim()||'theme';
  name=name.replace(/[\\/:*?"<>|]+/g,'_').replace(/[. ]+$/g,'').trim();
  if(!name)throw new Error('Output filename cannot be empty.');
  if(!/\.ptf$/i.test(name))name+=`.ptf`;
  return name;
}
function exportDialogValues(){
  return {
    fileName:normalizeExportFileName(els.exportFileName.value,els.exportProductId.value),
    title:els.exportTitle.value,
    productId:els.exportProductId.value,
    version:els.exportVersion.value,
    themeColor:normalizeThemeColor(els.exportThemeColor.value)
  };
}
function exportValidationSignature(values){
  return JSON.stringify({
    fileName:values.fileName,title:values.title,productId:values.productId,version:values.version,
    themeColor:values.themeColor,assetState:state.assets.map(a=>[a.objIdx,a.subIdx,a.edited,a.synthetic,a.imageData?.width||0,a.imageData?.height||0,a.paletteCount||0,a.decodeError||''])
  });
}
function setExportValidationDisplay(status,title,summary,sizeText='—'){
  els.exportValidationCard.className=`exportValidationCard ${status}`;
  els.exportValidationTitle.textContent=title;
  els.exportValidationSummary.textContent=summary;
  els.exportSizePill.textContent=sizeText;
}
function renderExportValidationItems(items){
  els.exportValidationList.innerHTML='';
  for(const item of items){
    const li=document.createElement('li');li.className=item.type;
    const icon=document.createElement('span');icon.className='validationItemIcon';icon.textContent=item.type==='error'?'×':item.type==='warning'?'!':'✓';
    const label=document.createElement('span');label.textContent=item.text;
    li.append(icon,label);els.exportValidationList.appendChild(li);
  }
}
function collectAssetExportChecks(){
  const errors=[],warnings=[],info=[];
  const unsupported=state.assets.filter(a=>a.objIdx===3&&a.subIdx>PTF_FIRST_LEVEL_MAX_SUB);
  if(unsupported.length)warnings.push(`${unsupported.length} unsupported virtual PSP Go slot${unsupported.length===1?' will':'s will'} be omitted and replaced by the fallback icon on hardware.`);
  for(const asset of state.assets){
    if(asset.objIdx===3&&asset.subIdx>PTF_FIRST_LEVEL_MAX_SUB)continue;
    if(asset.decodeError){errors.push(`${asset.role.label}: ${asset.decodeError}`);continue;}
    if(!asset.imageData&&!asset.rawOriginal){errors.push(`${asset.role.label}: no usable image data.`);continue;}
    if(asset.role.required&&asset.imageData){
      const [w,h]=asset.role.required;
      if(asset.imageData.width!==w||asset.imageData.height!==h)errors.push(`${asset.role.label}: ${asset.imageData.width} × ${asset.imageData.height}; required ${w} × ${h}.`);
    }
    if(asset.role.indexed&&asset.paletteCount>256)warnings.push(`${asset.role.label}: ${asset.paletteCount} colours will be reduced to the PSP 256-colour limit.`);
    if(asset.pspGeneratedFocus&&asset.imageData){
      try{validatePspGeneratedFocus(asset.imageData,asset.imageData.width,asset.imageData.height);}
      catch(error){errors.push(`${asset.role.label}: ${error.message}`);}
    }
  }
  const legacy=state.assets.filter(a=>a.comp===1).length;
  if(legacy)info.push(`${legacy} legacy RLZ/LZR-compressed asset${legacy===1?' is':'s are'} supported; edited legacy assets will use PSP-compatible compression.`);
  return {errors,warnings,info};
}
async function validateExportDialog(){
  if(!state.theme)return;
  const token=++state.exportValidationToken;
  state.exportValidation=null;
  els.exportConfirmCheck.checked=false;els.exportConfirmCheck.disabled=true;els.confirmExportBtn.disabled=true;
  els.exportConfirmRow.classList.add('disabled');els.refreshExportValidationBtn.disabled=true;
  setExportValidationDisplay('checking','Validating theme…','Checking metadata, assets, compression records, and final PTF size.');
  renderExportValidationItems([]);
  const errors=[],warnings=[],info=[];
  let values=null,result=null;
  try{
    values=exportDialogValues();
    validateThemeMetadata(values);
    info.push(`Output file: ${values.fileName}`);
  }catch(error){errors.push(error.message);}
  const assetChecks=collectAssetExportChecks();errors.push(...assetChecks.errors);warnings.push(...assetChecks.warnings);info.push(...assetChecks.info);
  if(!errors.length){
    try{
      result=await buildPtf({status:false,title:values.title,productId:values.productId,version:values.version,themeColor:values.themeColor});
      verifyBuiltPtfMetadata(result.bytes,result.metadata);
      if(result.bytes.length>PTF_MAX_SIZE)errors.push(`Final theme size is ${formatBytes(result.bytes.length)}, exceeding the PSP 768 KB PTF limit.`);
      else if(result.bytes.length>PTF_MAX_SIZE*.9)warnings.push(`Final theme size is ${formatBytes(result.bytes.length)}, close to the PSP 768 KB limit.`);
      else info.push(`Final theme size: ${formatBytes(result.bytes.length)} of 768 KB.`);
      if(result.stats.convertedLzr)info.push(`${result.stats.convertedLzr} edited legacy LZR asset${result.stats.convertedLzr===1?' will':'s will'} be converted during export.`);
      if(result.stats.omittedUnsupportedSlots)warnings.push(`${result.stats.omittedUnsupportedSlots} unsafe virtual slot${result.stats.omittedUnsupportedSlots===1?' will':'s will'} be omitted to protect the first-level icon group.`);
    }catch(error){errors.push(error.message);}
  }
  if(token!==state.exportValidationToken)return;
  const items=[...errors.map(text=>({type:'error',text})),...warnings.map(text=>({type:'warning',text})),...info.map(text=>({type:'info',text}))];
  renderExportValidationItems(items);
  const sizeText=result?formatBytes(result.bytes.length):'—';
  if(errors.length){
    setExportValidationDisplay('bad','Theme is not ready for export',`${errors.length} blocking issue${errors.length===1?'':'s'} must be corrected.`,sizeText);
  }else{
    const summary=warnings.length?`Valid for export with ${warnings.length} warning${warnings.length===1?'':'s'}. Review them before continuing.`:'All PSP compatibility checks passed. The theme is valid for export.';
    setExportValidationDisplay(warnings.length?'warn':'ok',warnings.length?'Valid with warnings':'Theme is valid for export',summary,sizeText);
    const signature=exportValidationSignature(values);
    state.exportValidation={valid:true,result,values,signature,warnings};
    els.exportConfirmCheck.disabled=false;els.exportConfirmRow.classList.remove('disabled');
  }
  els.refreshExportValidationBtn.disabled=false;
}
let exportValidationTimer=0;
function scheduleExportValidation(){
  clearTimeout(exportValidationTimer);
  state.exportValidation=null;els.exportConfirmCheck.checked=false;els.confirmExportBtn.disabled=true;
  exportValidationTimer=setTimeout(validateExportDialog,260);
}
async function openExportDialog(){
  if(!state.theme){toast('Import a theme first','Export becomes available after a PTF is loaded.');return;}
  els.exportTitle.value=els.themeName.value;
  els.exportProductId.value=els.productId.value;
  els.exportVersion.value=els.version.value;
  els.exportThemeColor.value=String(normalizeThemeColor(els.themeColor.value));
  const currentBase=(els.productId.value.trim()||state.sourceName.replace(/\.ptf$/i,'')||'theme').replace(/[^A-Za-z0-9_.-]+/g,'_');
  els.exportFileName.value=`${currentBase}.ptf`;
  els.exportConfirmCheck.checked=false;els.confirmExportBtn.disabled=true;
  openModal(els.exportModal);
  await validateExportDialog();
}
async function confirmExportPtf(){
  try{
    let values=exportDialogValues();
    const signature=exportValidationSignature(values);
    if(!state.exportValidation?.valid||state.exportValidation.signature!==signature){
      await validateExportDialog();
      values=exportDialogValues();
    }
    if(!state.exportValidation?.valid)throw new Error('The theme has not passed export validation.');
    if(!els.exportConfirmCheck.checked)throw new Error('Confirm that you reviewed the validation results before exporting.');
    els.confirmExportBtn.disabled=true;els.refreshExportValidationBtn.disabled=true;
    const {result}=state.exportValidation,out=result.bytes;
    downloadBlob(new Blob([out],{type:'application/octet-stream'}),values.fileName);
    els.themeName.value=result.metadata.title;els.productId.value=result.metadata.productId;els.version.value=result.metadata.version;els.themeColor.value=String(result.metadata.themeColor);
    state.theme.title=result.metadata.title;state.theme.productId=result.metadata.productId;state.theme.version=result.metadata.version;state.theme.backgroundMode=result.metadata.themeColor;
    for(const [asset,packed] of result.exportedAssets){
      asset.rawOriginal=packed.raw;asset.rawCurrent=packed.raw;asset.packedOriginal=packed.packed;asset.comp=packed.comp;asset.packedSize=packed.packedSize;asset.ucSize=packed.ucSize;asset.edited=false;asset.synthetic=false;
    }
    setDirty(false);renderAssetList();if(state.selectedAsset)selectAsset(state.selectedAsset);
    closeModal(els.exportModal);
    const converted=result.stats.convertedLzr,omitted=result.stats.omittedUnsupportedSlots;
    setStatus(`Exported ${formatBytes(out.length)}${converted?` · ${converted} changed LZR asset${converted===1?'':'s'} converted`:''}${omitted?` · ${omitted} unsafe virtual slot${omitted===1?'':'s'} omitted`:''}`);
    toast('Validated PTF exported',`${values.fileName} passed metadata, asset, structure, and size checks before download.`,'success');
  }catch(error){console.error(error);setStatus('Export failed');toast('Could not export PTF',error.message,'error');}
  finally{els.refreshExportValidationBtn.disabled=false;if(els.exportConfirmCheck.checked&&state.exportValidation?.valid)els.confirmExportBtn.disabled=false;}
}
async function exportPtf(){return openExportDialog();}
function downloadBlob(blob,name){
  const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500);
}
async function canvasToBytes(canvas,type='image/png'){
  const blob=await new Promise(res=>canvas.toBlob(res,type));if(!blob)throw new Error('Could not encode canvas image.');
  return new Uint8Array(await blob.arrayBuffer());
}
async function exportSelectedPng(){
  const a=state.selectedAsset;if(!a?.imageData)return;
  const c=imageDataToCanvas(a.imageData);const blob=await new Promise(res=>c.toBlob(res,'image/png'));
  downloadBlob(blob,`${a.objIdx}_${String(a.subIdx).padStart(4,'0')}.png`);
}

function tintImageData(imageData,hex,strength){
  const amount=clamp01(strength),rgb=hexToRgb(hex),out=cloneImageData(imageData),d=out.data;
  for(let i=0;i<d.length;i+=4){
    if(d[i+3]===0)continue;
    d[i]=Math.round(d[i]*(1-amount)+rgb.r*amount);
    d[i+1]=Math.round(d[i+1]*(1-amount)+rgb.g*amount);
    d[i+2]=Math.round(d[i+2]*(1-amount)+rgb.b*amount);
  }
  return out;
}

async function runThemeAnalysis(){
  if(!state.theme)return;
  els.runAnalysisBtn.disabled=true;els.analysisStatus.textContent='Encoding and checking assets…';els.analysisTableBody.innerHTML='';
  try{
    const rows=[];
    for(const asset of state.assets){
      let rawSize=asset.ucSize||0,packedSize=asset.packedSize||0,compression=compressionName(asset);
      if(asset.edited||asset.synthetic){
        const raw=await rawForAsset(asset);rawSize=raw.length;
        const best=await bestCompression(raw);packedSize=align(best.packed.length,4);compression=best.comp===2?'Deflate':'Stored';
      }
      let status='OK',severity='ok';
      if(asset.decodeError){status='Decode error';severity='bad';}
      else if(asset.role.required&&(asset.imageData.width!==asset.role.required[0]||asset.imageData.height!==asset.role.required[1])){status='Wrong dimensions';severity='bad';}
      else if(asset.role.indexed&&asset.paletteCount>256){status='Will quantize';severity='warn';}
      else if(asset.synthetic){status='New slot';severity='warn';}
      rows.push({
        asset,label:asset.role.label,size:asset.imageData?`${asset.imageData.width} × ${asset.imageData.height}`:'—',
        colors:asset.role.indexed?(asset.paletteCount??'≤256'):'24/32-bit',rawSize,packedSize,compression,status,severity
      });
    }
    const built=await buildPtf({status:false});state.analysisEstimate=built.bytes.length;state.analysisRows=rows;
    renderAnalysisResults(rows,built.bytes.length);
    els.analysisStatus.textContent=`Analysis complete · ${rows.length} assets checked`;
    els.exportAnalysisCsvBtn.disabled=false;
  }catch(e){console.error(e);els.analysisStatus.textContent=e.message;toast('Analysis failed',e.message,'error');}
  finally{els.runAnalysisBtn.disabled=false;}
}
function renderAnalysisResults(rows,totalSize){
  const warnings=rows.filter(r=>r.severity==='warn').length,errors=rows.filter(r=>r.severity==='bad').length;
  const colorsOver=rows.filter(r=>typeof r.colors==='number'&&r.colors>256).length;
  const compressionTypes=new Set(rows.map(r=>r.compression)).size;
  const sizeClass=totalSize>PTF_MAX_SIZE?'bad':totalSize>PTF_MAX_SIZE*.9?'warn':'';
  els.analysisSummary.innerHTML=[
    ['Assets',rows.length,''],['Estimated PTF',formatBytes(totalSize),sizeClass],['Warnings',warnings,warnings?'warn':''],
    ['Errors',errors,errors?'bad':''],['Compression types',compressionTypes,'']
  ].map(([label,value,cls])=>`<div class="summaryCard ${cls}"><span>${label}</span><strong>${value}</strong></div>`).join('');
  els.analysisTableBody.innerHTML='';
  for(const row of rows){
    const tr=document.createElement('tr');
    tr.innerHTML=`<td></td><td>${row.size}</td><td>${row.colors}</td><td>${formatBytes(row.rawSize)}</td><td>${formatBytes(row.packedSize)}</td><td>${row.compression}</td><td class="analysisState ${row.severity}">${row.status}</td>`;
    tr.firstChild.textContent=row.label;els.analysisTableBody.appendChild(tr);
  }
}
function exportAnalysisCsv(){
  if(!state.analysisRows.length)return;
  const q=v=>`"${String(v).replace(/"/g,'""')}"`;
  const lines=[['Asset','Size','Colors','Raw bytes','Packed bytes','Compression','Status'].map(q).join(',')];
  for(const r of state.analysisRows)lines.push([r.label,r.size,r.colors,r.rawSize,r.packedSize,r.compression,r.status].map(q).join(','));
  downloadBlob(new Blob([lines.join('\n')],{type:'text/csv'}),'ptf-analysis.csv');
}

function renderVariantList(){
  if(!els.variantList)return;
  els.exportVariantsBtn.disabled=!state.theme||!state.variants.length;
  if(!state.variants.length){els.variantList.className='variantList emptyVariant';els.variantList.textContent='No variants added.';return;}
  els.variantList.className='variantList';els.variantList.innerHTML='';
  state.variants.forEach((variant,index)=>{
    const row=document.createElement('div');row.className='variantRow';
    const title=document.createElement('div');title.innerHTML=`<div class="variantRowTitle"></div><div class="variantRowSub"></div>`;
    title.querySelector('.variantRowTitle').textContent=variant.name;
    title.querySelector('.variantRowSub').textContent=`${THEME_COLORS[variant.themeColor]} · tint ${variant.tintStrength}%`;
    const sw=document.createElement('div');sw.className='variantSwatch';sw.style.background=variant.tint;
    const profile=document.createElement('span');profile.className='compatPill';profile.textContent=currentProfile().label;
    const remove=document.createElement('button');remove.className='miniButton action-danger';remove.dataset.icon='trash';remove.textContent='Remove';remove.addEventListener('click',()=>{state.variants.splice(index,1);renderVariantList();});
    row.append(title,sw,profile,remove);els.variantList.appendChild(row);installButtonIcons();
  });
}
function addVariant(){
  const name=els.variantName.value.trim();if(!name){toast('Variant name required','Enter a name such as Red Edition.','error');return;}
  state.variants.push({name,themeColor:Number(els.variantThemeColor.value),tint:els.variantTint.value,tintStrength:Number(els.variantTintStrength.value)});
  els.variantName.value='';renderVariantList();
}
async function exportVariants(){
  if(!state.variants.length)return;
  els.exportVariantsBtn.disabled=true;setStatus('Building variants…');
  try{
    const entries=[];
    for(const variant of state.variants){
      const strength=variant.tintStrength/100;
      const transform=strength>0?(asset=>{
        if(!asset.imageData||!['category','firstBody','firstFocus','secondBody','secondFocus'].includes(asset.role.type))return null;
        if(asset.pspGeneratedFocus&&(asset.role.type==='firstFocus'||asset.role.type==='secondFocus'))return null;
        return tintImageData(asset.imageData,variant.tint,strength);
      }):null;
      const suffix=slugify(variant.name).replace(/_/g,'-');
      const result=await buildPtf({
        status:false,title:`${els.themeName.value} — ${variant.name}`,
        productId:`${els.productId.value}_${suffix}`.slice(0,48),
        themeColor:variant.themeColor,assetTransform:transform
      });
      if(result.bytes.length>PTF_MAX_SIZE)throw new Error(`${variant.name} exceeds the 768 KB PTF limit.`);
      entries.push({name:`${slugify(variant.name)}.ptf`,data:result.bytes});
    }
    entries.push({name:'VARIANTS.txt',data:new TextEncoder().encode(state.variants.map(v=>`${v.name}: ${THEME_COLORS[v.themeColor]}, tint ${v.tintStrength}% ${v.tint}`).join('\n'))});
    const zip=makeZip(entries);downloadBlob(new Blob([zip],{type:'application/zip'}),`${slugify(els.productId.value||'theme')}_variants.zip`);
    toast('Variants exported',`${state.variants.length} PTF themes were packed into one ZIP.`,'success');setStatus('Variant ZIP exported');
  }catch(e){console.error(e);toast('Could not export variants',e.message,'error');}
  finally{els.exportVariantsBtn.disabled=false;}
}

function createIconSheetCanvas(){
  const icons=state.assets.filter(a=>a.imageData&&['category','firstBody','firstFocus','secondBody','secondFocus'].includes(a.role.type));
  const cols=6,cellW=170,cellH=112,rows=Math.ceil(icons.length/cols);
  const c=document.createElement('canvas');c.width=cols*cellW;c.height=Math.max(cellH,rows*cellH);const cctx=c.getContext('2d');
  cctx.fillStyle='#15181d';cctx.fillRect(0,0,c.width,c.height);cctx.font='12px sans-serif';cctx.textAlign='center';cctx.textBaseline='top';
  icons.forEach((asset,i)=>{
    const col=i%cols,row=Math.floor(i/cols),x=col*cellW,y=row*cellH;
    cctx.fillStyle='#0f1216';cctx.fillRect(x+5,y+5,cellW-10,cellH-10);
    const max=58,scale=Math.min(max/asset.imageData.width,max/asset.imageData.height),w=asset.imageData.width*scale,h=asset.imageData.height*scale;
    drawImageDataFit(cctx,asset.imageData,x+(cellW-w)/2,y+12,w,h);
    cctx.fillStyle='#e7eaee';const label=asset.role.label.length>25?`${asset.role.label.slice(0,24)}…`:asset.role.label;cctx.fillText(label,x+cellW/2,y+76);
    cctx.fillStyle='#7f8996';cctx.fillText(`${asset.objIdx}:${asset.subIdx}`,x+cellW/2,y+93);
  });
  return c;
}
function buildReleaseReadme(ptfName){
  return `PTF Studio release package

Theme: ${els.themeName.value}
File: ${ptfName}
Version: ${els.version.value}
Model preview profile: ${currentProfile().label}

Installation
1. Copy the .ptf file to /PSP/THEME/ on the Memory Stick or internal storage.
2. Open Settings > Theme Settings > Theme.
3. Select and apply the theme.

Created with PTF Studio ${APP_VERSION}.
Created by Blue with the assistance of ChatGPT.
`;
}
async function exportReleasePackage(){
  if(!state.theme)return;
  els.releasePackageBtn.disabled=true;setStatus('Building release package…');
  try{
    const result=await buildPtf({status:false});if(result.bytes.length>PTF_MAX_SIZE)throw new Error(`Theme exceeds the 768 KB PTF limit.`);
    const base=(els.productId.value.trim()||'theme').replace(/[^a-z0-9_.-]+/gi,'_'),ptfName=`${base}.ptf`;
    const screenshot=await canvasToBytes(els.xmbCanvas);
    const sheet=await canvasToBytes(createIconSheetCanvas());
    const manifest={
      title:els.themeName.value,productId:els.productId.value,version:els.version.value,
      themeColor:THEME_COLORS[Number(els.themeColor.value)],modelProfile:currentProfile().label,
      ptfSize:result.bytes.length,assets:state.assets.length,generatedBy:`PTF Studio ${APP_VERSION}`
    };
    const entries=[
      {name:ptfName,data:result.bytes},
      {name:'preview.png',data:screenshot},
      {name:'icon-sheet.png',data:sheet},
      {name:'README.txt',data:new TextEncoder().encode(buildReleaseReadme(ptfName))},
      {name:'CREDITS.txt',data:new TextEncoder().encode('Created by Blue\nDeveloped with the assistance of ChatGPT\n')},
      {name:'manifest.json',data:new TextEncoder().encode(JSON.stringify(manifest,null,2))}
    ];
    const zip=makeZip(entries);downloadBlob(new Blob([zip],{type:'application/zip'}),`${base}_release.zip`);
    setStatus('Release package exported');toast('Release ZIP exported','PTF, preview, icon sheet, README, credits and manifest were packaged together.','success');
  }catch(e){console.error(e);toast('Could not build release package',e.message,'error');}
  finally{els.releasePackageBtn.disabled=false;}
}

const CRC_TABLE=(()=>{
  const table=new Uint32Array(256);
  for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;table[n]=c>>>0;}
  return table;
})();
function crc32(bytes){let c=0xffffffff;for(const b of bytes)c=CRC_TABLE[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
function dosDateTime(date=new Date()){
  const year=Math.max(1980,date.getFullYear());
  const dosTime=(date.getHours()<<11)|(date.getMinutes()<<5)|(date.getSeconds()>>1);
  const dosDate=((year-1980)<<9)|((date.getMonth()+1)<<5)|date.getDate();
  return {dosTime,dosDate};
}
function makeZip(entries){
  const enc=new TextEncoder(),locals=[],centrals=[];let offset=0;
  const {dosTime,dosDate}=dosDateTime();
  for(const entry of entries){
    const name=enc.encode(entry.name.replace(/\\/g,'/')),data=entry.data instanceof Uint8Array?entry.data:new Uint8Array(entry.data),crc=crc32(data);
    const local=new Uint8Array(30+name.length+data.length),lv=new DataView(local.buffer);
    setU32(lv,0,0x04034b50);setU16(lv,4,20);setU16(lv,6,0x0800);setU16(lv,8,0);setU16(lv,10,dosTime);setU16(lv,12,dosDate);
    setU32(lv,14,crc);setU32(lv,18,data.length);setU32(lv,22,data.length);setU16(lv,26,name.length);setU16(lv,28,0);local.set(name,30);local.set(data,30+name.length);locals.push(local);
    const central=new Uint8Array(46+name.length),cv=new DataView(central.buffer);
    setU32(cv,0,0x02014b50);setU16(cv,4,20);setU16(cv,6,20);setU16(cv,8,0x0800);setU16(cv,10,0);setU16(cv,12,dosTime);setU16(cv,14,dosDate);
    setU32(cv,16,crc);setU32(cv,20,data.length);setU32(cv,24,data.length);setU16(cv,28,name.length);setU16(cv,30,0);setU16(cv,32,0);setU16(cv,34,0);setU16(cv,36,0);setU32(cv,38,0);setU32(cv,42,offset);central.set(name,46);centrals.push(central);
    offset+=local.length;
  }
  const centralOffset=offset,centralSize=centrals.reduce((n,b)=>n+b.length,0),end=new Uint8Array(22),ev=new DataView(end.buffer);
  setU32(ev,0,0x06054b50);setU16(ev,4,0);setU16(ev,6,0);setU16(ev,8,entries.length);setU16(ev,10,entries.length);setU32(ev,12,centralSize);setU32(ev,16,centralOffset);setU16(ev,20,0);
  return concatArrays([...locals,...centrals,end]);
}

function openModal(modal){if(modal)modal.classList.remove('hidden');}
function closeModal(modal){if(modal)modal.classList.add('hidden');}

els.ptfInput.addEventListener('change',async e=>{
  const f=e.target.files[0];
  if(f)await loadThemeBuffer(await f.arrayBuffer(),f.name);
  e.target.value='';
});
els.loadSampleBtn.addEventListener('click',async()=>{
  if(typeof SAMPLE_PTF_BASE64==='undefined'){
    toast('Sample missing','Open the bundled sample manually.','error');
    return;
  }
  const bin=atob(SAMPLE_PTF_BASE64),b=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)b[i]=bin.charCodeAt(i);
  await loadThemeBuffer(b.buffer,'PTF_STUDIO_SAMPLE_THEME.ptf');
});
els.exportBtn.addEventListener('click',openExportDialog);
[els.exportFileName,els.exportTitle,els.exportProductId,els.exportVersion,els.exportThemeColor].forEach(control=>{
  control.addEventListener(control.tagName==='SELECT'?'change':'input',scheduleExportValidation);
});
els.exportConfirmCheck.addEventListener('change',()=>{
  els.confirmExportBtn.disabled=!els.exportConfirmCheck.checked||!state.exportValidation?.valid;
});
els.refreshExportValidationBtn.addEventListener('click',validateExportDialog);
els.confirmExportBtn.addEventListener('click',confirmExportPtf);
els.analyzeBtn.addEventListener('click',async()=>{
  openModal(els.analysisModal);
  await runThemeAnalysis();
});
els.releasePackageBtn.addEventListener('click',exportReleasePackage);

els.modelProfile.addEventListener('change',()=>{
  state.modelProfile=els.modelProfile.value;
  state.nav={categoryPos:0,itemPos:0,secondPos:0,level:1};
  state.animationStart=performance.now();
  updateModelUi();
  renderAssetList();
});
els.addModelSlotsBtn.addEventListener('click',addMissingModelSlots);

els.fontInput.addEventListener('change',async e=>{
  const f=e.target.files[0];
  if(f)await loadPreviewFont(f);
  e.target.value='';
});
els.bulkFolderBtn.addEventListener('click',()=>els.bulkFolderInput.click());
els.bulkFolderInput.addEventListener('change',async e=>{
  if(e.target.files.length)await bulkImportFolder(e.target.files,'exact');
  e.target.value='';
});
els.bulkFolderDownscaleBtn.addEventListener('click',()=>els.bulkFolderDownscaleInput.click());
els.bulkFolderDownscaleInput.addEventListener('change',async e=>{
  if(e.target.files.length)await bulkImportFolder(e.target.files,'downscale');
  e.target.value='';
});
function openFocusGenerator(mode){
  if(mode==='selected'){
    const body=selectedBodyForDirectFocus();
    if(!body?.imageData||!imageHasVisiblePixels(body.imageData)){
      toast('Select an icon','Choose a populated first- or second-level icon before generating its focus.','error');
      return;
    }
    els.focusTitle.textContent='Generate Focus for Selected Icon';
    els.focusSubtitle.textContent='Create or replace the matching focus for the selected icon';
    els.focusTarget.value='selected';
    els.focusGenerationMode.value='replace';
  }else{
    els.focusTitle.textContent='Bulk Focus Generator';
    els.focusSubtitle.textContent='Create matching PSP focus glows from multiple normal icons';
    els.focusTarget.value='both';
  }
  updateFocusGeneratorPreview();
  openModal(els.focusModal);
}
els.selectedFocusGeneratorBtn.addEventListener('click',()=>openFocusGenerator('selected'));
els.focusGeneratorBtn.addEventListener('click',()=>openFocusGenerator('bulk'));
[els.focusTarget,els.focusGenerationMode,els.focusColor,els.focusOpacity,els.focusBlur,els.focusPadding,els.focusIncludeCore].forEach(control=>{
  control.addEventListener(control.type==='checkbox'?'change':'input',updateFocusGeneratorPreview);
});
els.applyFocusGeneratorBtn.addEventListener('click',applyFocusGenerator);
els.undoFocusGeneratorBtn.addEventListener('click',undoLastFocusGeneration);
els.bulkFocusBtn.addEventListener('click',()=>els.bulkFocusInput.click());
els.bulkFocusInput.addEventListener('change',async e=>{
  const f=e.target.files[0];
  if(f)await bulkReplaceFirstLevelFocus(f,'exact');
  e.target.value='';
});
els.bulkFocusDownscaleBtn.addEventListener('click',()=>els.bulkFocusDownscaleInput.click());
els.bulkFocusDownscaleInput.addEventListener('change',async e=>{
  const f=e.target.files[0];
  if(f)await bulkReplaceFirstLevelFocus(f,'downscale');
  e.target.value='';
});
els.restoreBulkFocusBtn.addEventListener('click',restoreAllFirstLevelFocus);
els.variantsBtn.addEventListener('click',()=>{
  renderVariantList();
  openModal(els.variantsModal);
});
els.variantTintStrength.addEventListener('input',()=>{
  els.variantTintValue.textContent=`${els.variantTintStrength.value}%`;
});
els.addVariantBtn.addEventListener('click',addVariant);
els.exportVariantsBtn.addEventListener('click',exportVariants);
els.selectFallbackBtn.addEventListener('click',()=>{
  const fallbackAssets=state.assets.filter(asset=>assetCompatibility(asset).className==='fallback');
  if(!fallbackAssets.length){
    toast('Fallback slots are missing','Choose a model profile and use Add missing profile slots first.','error');
    return;
  }
  els.assetSearch.value='fallback';
  renderAssetList();
  selectAsset(fallbackAssets[0]);
});

els.runAnalysisBtn.addEventListener('click',runThemeAnalysis);
els.exportAnalysisCsvBtn.addEventListener('click',exportAnalysisCsv);
els.assetSearch.addEventListener('input',renderAssetList);
els.replaceInput.addEventListener('change',async e=>{
  const f=e.target.files[0];
  if(f)await replaceSelectedAsset(f,'exact');
  e.target.value='';
});
els.downscaleInput.addEventListener('change',async e=>{
  const f=e.target.files[0];
  if(f)await replaceSelectedAsset(f,'downscale');
  e.target.value='';
});
els.importExactModalBtn.addEventListener('click',()=>{closeModal(els.importAssetModal);els.replaceInput.click();});
els.importDownscaleModalBtn.addEventListener('click',()=>{closeModal(els.importAssetModal);els.downscaleInput.click();});
els.xmbCanvas.addEventListener('click',event=>{
  const asset=previewAssetAtEvent(event);if(asset)selectAsset(asset,{scroll:true});
});
els.xmbCanvas.addEventListener('dblclick',event=>{
  event.preventDefault();const asset=previewAssetAtEvent(event);if(asset)openImportAssetModal(asset);
});
els.restoreAssetBtn.addEventListener('click',restoreSelected);
els.exportAssetBtn.addEventListener('click',exportSelectedPng);
els.resetNavBtn.addEventListener('click',()=>{
  state.nav={categoryPos:0,itemPos:0,secondPos:0,level:1};
  state.animationStart=performance.now();
});
els.toggleGridBtn.addEventListener('click',()=>{state.showGuides=!state.showGuides;els.toggleGridBtn.classList.toggle('guidesActive',state.showGuides);els.toggleGridBtn.setAttribute('aria-pressed',state.showGuides?'true':'false');});
[els.themeName,els.productId,els.version,els.themeColor].forEach(control=>{
  const markChanged=()=>{setDirty(true);updateModelUi();};
  control.addEventListener('input',markChanged);control.addEventListener('change',markChanged);
});
$$('.seg').forEach(button=>button.addEventListener('click',()=>{
  $$('.seg').forEach(item=>item.classList.remove('active'));
  button.classList.add('active');
  state.viewMode=button.dataset.view;
}));

['dragenter','dragover'].forEach(eventName=>els.dropZone.addEventListener(eventName,event=>{
  event.preventDefault();
  els.dropZone.classList.add('dragging');
}));
['dragleave','drop'].forEach(eventName=>els.dropZone.addEventListener(eventName,event=>{
  event.preventDefault();
  els.dropZone.classList.remove('dragging');
}));
els.dropZone.addEventListener('drop',async event=>{
  const file=[...event.dataTransfer.files].find(item=>item.name.toLowerCase().endsWith('.ptf'));
  if(file)await loadThemeBuffer(await file.arrayBuffer(),file.name);
  else toast('No PTF file found','Drop a file ending in .ptf.','error');
});

function setHelpMenu(open){
  els.helpMenu.classList.toggle('hidden',!open);
  els.helpMenuBtn.setAttribute('aria-expanded',open?'true':'false');
}
function openAbout(){setHelpMenu(false);openModal(els.aboutModal);}
function closeAbout(){closeModal(els.aboutModal);}
function openGuide(){setHelpMenu(false);openModal(els.guideModal);}
function closeGuide(){closeModal(els.guideModal);}
function allModals(){return [els.aboutModal,els.guideModal,els.exportModal,els.focusModal,els.analysisModal,els.variantsModal,els.importAssetModal,document.querySelector('#assetMakerModal')];}
function anyModalOpen(){return allModals().some(modal=>modal&&!modal.classList.contains('hidden'));}
function closeAllModals(){allModals().forEach(closeModal);}

els.helpMenuBtn.addEventListener('click',event=>{
  event.stopPropagation();
  setHelpMenu(els.helpMenu.classList.contains('hidden'));
});
els.aboutBtn.addEventListener('click',openAbout);
els.guideBtn.addEventListener('click',openGuide);
els.creditsBtn.addEventListener('click',openAbout);
els.closeAboutBtn.addEventListener('click',closeAbout);
els.modalCloseButton.addEventListener('click',closeAbout);
els.closeGuideBtn.addEventListener('click',closeGuide);
els.guideCloseButton.addEventListener('click',closeGuide);
document.querySelectorAll('[data-close-modal]').forEach(button=>{
  button.addEventListener('click',()=>closeModal(document.getElementById(button.dataset.closeModal)));
});
allModals().forEach(modal=>modal?.addEventListener('click',event=>{
  if(event.target===modal)closeModal(modal);
}));
document.addEventListener('click',event=>{
  if(!els.helpMenu.contains(event.target)&&event.target!==els.helpMenuBtn)setHelpMenu(false);
});
window.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&anyModalOpen()){
    event.preventDefault();
    closeAllModals();
    return;
  }
  if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' ','Escape'].includes(event.key)){
    event.preventDefault();
    moveNav(event.key);
  }
});
window.addEventListener('beforeunload',event=>{
  if(state.dirty){event.preventDefault();event.returnValue='';}
});

updateUiEnabled();
updateModelUi();
renderVariantList();
updateFocusGeneratorPreview();

// Start in a useful state: load the bundled sample automatically. Users can
// immediately replace it with New/Open without altering the sample file.
if(!state.theme && typeof SAMPLE_PTF_BASE64!=='undefined'){
  setTimeout(()=>els.loadSampleBtn?.click(),0);
}


// Release 1.0 navigation rail. The rail mirrors existing commands rather than
// introducing duplicate workflows, keeping the editor fully keyboard-friendly.
function setActiveRail(action){
  document.querySelectorAll('.railButton[data-rail-action]').forEach(button=>button.classList.toggle('active',button.dataset.railAction===action));
}
document.querySelectorAll('.railButton[data-rail-action]').forEach(button=>{
  button.addEventListener('click',()=>{
    const action=button.dataset.railAction;
    setActiveRail(action);
    if(action==='theme'){
      document.querySelector('.leftPanel')?.scrollTo({top:0,behavior:'smooth'});
      setTimeout(()=>els.themeName?.focus(),220);
    }else if(action==='assets'){
      document.querySelector('#assetsSection')?.scrollIntoView({behavior:'smooth',block:'start'});
    }else if(action==='preview'){
      document.querySelector('#previewStage')?.focus?.();
      els.xmbCanvas?.scrollIntoView({behavior:'smooth',block:'center'});
    }else if(action==='maker'){
      document.querySelector('#assetMakerBtn')?.click();
    }else if(action==='analysis'){
      if(!els.analyzeBtn?.disabled)els.analyzeBtn.click();else toast('Import a theme first','Analysis becomes available after a PTF is loaded.');
    }else if(action==='export'){
      if(!els.exportBtn?.disabled)els.exportBtn.click();else toast('Import a theme first','Export becomes available after a PTF is loaded.');
    }else if(action==='about'){
      els.aboutBtn?.click();
    }
  });
});
