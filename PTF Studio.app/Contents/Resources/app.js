/* PTF Studio Beta 0.9.5 — dependency-free PSP PTF viewer/editor */
'use strict';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

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
  focusGeneratorBtn: $('#focusGeneratorBtn'), variantsBtn: $('#variantsBtn'), selectFallbackBtn: $('#selectFallbackBtn'),
  ditherToggle: $('#ditherToggle'), pulseToggle: $('#pulseToggle'), validationBox: $('#validationBox'),
  validationText: $('#validationText'), statusText: $('#statusText'), dirtyState: $('#dirtyState'), toastHost: $('#toastHost'),
  helpMenuBtn: $('#helpMenuBtn'), helpMenu: $('#helpMenu'), aboutBtn: $('#aboutBtn'), creditsBtn: $('#creditsBtn'),
  aboutModal: $('#aboutModal'), closeAboutBtn: $('#closeAboutBtn'), modalCloseButton: $('#modalCloseButton'),
  focusModal: $('#focusModal'), focusPreviewCanvas: $('#focusPreviewCanvas'), focusPreviewLabel: $('#focusPreviewLabel'),
  focusTarget: $('#focusTarget'), focusColor: $('#focusColor'), focusOpacity: $('#focusOpacity'), focusOpacityValue: $('#focusOpacityValue'),
  focusBlur: $('#focusBlur'), focusBlurValue: $('#focusBlurValue'), focusPadding: $('#focusPadding'),
  focusPaddingValue: $('#focusPaddingValue'), focusIncludeCore: $('#focusIncludeCore'), applyFocusGeneratorBtn: $('#applyFocusGeneratorBtn'),
  analysisModal: $('#analysisModal'), analysisSummary: $('#analysisSummary'), analysisStatus: $('#analysisStatus'),
  analysisTableBody: $('#analysisTableBody'), runAnalysisBtn: $('#runAnalysisBtn'), exportAnalysisCsvBtn: $('#exportAnalysisCsvBtn'),
  variantsModal: $('#variantsModal'), variantName: $('#variantName'), variantThemeColor: $('#variantThemeColor'),
  variantTint: $('#variantTint'), variantTintStrength: $('#variantTintStrength'), variantTintValue: $('#variantTintValue'),
  addVariantBtn: $('#addVariantBtn'), variantList: $('#variantList'), exportVariantsBtn: $('#exportVariantsBtn'),
  importAssetModal: $('#importAssetModal'), importAssetModalTitle: $('#importAssetModalTitle'), importAssetModalSub: $('#importAssetModalSub'),
  importExactModalBtn: $('#importExactModalBtn'), importDownscaleModalBtn: $('#importDownscaleModalBtn')
};
const ctx = els.xmbCanvas.getContext('2d');
const previewCtx = els.assetPreview.getContext('2d');

const APP_VERSION = 'Beta 0.9.5';
const APP_BUILD = '2026.07.15';

const CATEGORY_LABELS = {1:'Settings',2:'Photo',3:'Music',4:'Video',5:'TV',6:'Game',7:'Network',8:'Extras'};
const FIRST_LABELS = {
  2:'Memory Stick',4:'UMD',6:'Camera',8:'Game Sharing',10:'Save Data Utility',12:'UMD Update',
  14:'Network Update',16:'USB Connection',18:'Video Settings',20:'Photo Settings',22:'System Settings',
  24:'Theme Settings',26:'Date & Time Settings',28:'Power Save Settings',30:'External Display Settings',
  32:'Sound Settings',34:'Security Settings',36:'RSS Channel Settings',38:'Network Settings',40:'Online Manual',
  42:'Remote Play',44:'Internet Radio',46:'RSS Channel',48:'Internet Browser',50:'Internet Search',
  52:'Account Management',54:'Default / Fallback',56:'Bluetooth Settings',58:'SensMe Channels'
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
    label:'PSP Go', hint:'Shows Bluetooth, SensMe and External Display slots; UMD-related entries are hidden.',
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


// Native PSP coordinates are doubled because the preview canvas is 960 × 544.
const PSP_SCALE = 2;
const XMB_LAYOUT = Object.freeze({
  categoryX: 109 * PSP_SCALE,
  categoryY: 72 * PSP_SCALE,
  categorySpacing: 83 * PSP_SCALE,
  categoryWidth: 64 * PSP_SCALE,
  categoryHeight: 48 * PSP_SCALE,
  categoryLabelY: 104 * PSP_SCALE,
  categoryFontSize: 11 * PSP_SCALE,
  itemX: 109 * PSP_SCALE,
  itemY: 137 * PSP_SCALE,
  itemSpacing: 64 * PSP_SCALE,
  bodyWidth: 48 * PSP_SCALE,
  bodyHeight: 48 * PSP_SCALE,
  focusWidth: 64 * PSP_SCALE,
  focusHeight: 64 * PSP_SCALE,
  itemLabelX: 149 * PSP_SCALE,
  itemLabelOffsetY: 6 * PSP_SCALE,
  itemFontSize: 14 * PSP_SCALE,
  statusBaselineY: 18 * PSP_SCALE,
  statusRightX: 444 * PSP_SCALE,
  batteryX: 451 * PSP_SCALE,
  batteryY: 6 * PSP_SCALE,
  batteryWidth: 24 * PSP_SCALE,
  batteryHeight: 12 * PSP_SCALE
});

const PSP_FONT_STACK = '"PSP New Rodin", "FOT-NewRodin Pro DB", "NewRodin Pro DB", Arial, sans-serif';

const PSP_BATTERY_IMAGE = new Image();
PSP_BATTERY_IMAGE.src = 'assets/psp_battery.png?v=0.9.5-beta';

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
  previewHitRegions: []
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
  const base=CATEGORY_ITEMS[categorySub] || state.assets.filter(a=>a.objIdx===3&&a.subIdx%2===0).map(a=>a.subIdx);
  return base.filter(id=>!profile.excludedItems.includes(id) && !!bodyAsset(id));
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
    decodeError:null,synthetic:true
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
  if(added){
    setDirty(true);renderAssetList();updateUiEnabled();
    toast('Model slots added',`${added} missing slot${added===1?' was':'s were'} created from the fallback artwork.`,'success');
  }else toast('Profile is complete','No model-specific slots were missing.','success');
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
        const asset={objIdx,subIdx,fileType,comp,packedSize:size,ucSize,packedOriginal:packed,rawOriginal:raw,rawCurrent:raw,role,edited:false,imageData:null,gimMeta:null,paletteCount:null,decodeError:null};
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
function drawImageDataFit(targetCtx,imageData,x,y,w,h,alpha=1){
  if(!imageData)return;
  const c=imageDataToCanvas(imageData);
  targetCtx.save();
  targetCtx.globalAlpha=alpha;
  targetCtx.imageSmoothingEnabled=true;
  targetCtx.imageSmoothingQuality='high';
  targetCtx.drawImage(c,x,y,w,h);
  targetCtx.restore();
}
function getAsset(obj,sub){return state.assets.find(a=>a.objIdx===obj&&a.subIdx===sub)||null;}
function categoryAssets(){return state.assets.filter(a=>a.objIdx===2).sort((a,b)=>a.subIdx-b.subIdx);}
function bodyAsset(bodyId){return getAsset(3,bodyId);}
function focusAsset(bodyId){return getAsset(3,bodyId+1);}

function populateThemeColors(){
  for(const select of [els.themeColor,els.variantThemeColor]){
    select.innerHTML='';
    THEME_COLORS.forEach((v,i)=>{const o=document.createElement('option');o.value=i;o.textContent=v;select.appendChild(o);});
  }
}
populateThemeColors();

async function loadThemeBuffer(buffer,name){
  setStatus('Reading PTF…');
  try{
    const parsed=await parsePtf(buffer,name);
    state.theme=parsed.theme;state.assets=parsed.assets;state.sourceName=name;state.selectedAsset=null;state.nav={categoryPos:0,itemPos:0,secondPos:0,level:1};state.modelProfile='universal';state.variants=[];els.modelProfile.value='universal';
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
  els.restoreAssetBtn.disabled=!asset.edited;updateValidation();drawInspectorPreview();updateFocusGeneratorPreview();
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
  asset.paletteCount=countColors(asset.imageData,257);asset.edited=true;asset.decodeError=null;
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
    for(const a of targets){a.imageData=cloneImageData(prepared);a.paletteCount=countColors(a.imageData,257);a.edited=true;a.decodeError=null;}
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
      a.rawCurrent=a.rawOriginal;a.edited=false;await decodeAsset(a);
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
  a.rawCurrent=a.rawOriginal;a.edited=false;await decodeAsset(a);setDirty(state.assets.some(x=>x.edited)||metadataDirty());selectAsset(a);renderAssetList();toast('Original restored',a.role.label,'success');
}
function metadataDirty(){if(!state.theme)return false;return els.themeName.value!==state.theme.title||els.productId.value!==state.theme.productId||els.version.value!==state.theme.version||normalizeThemeColor(els.themeColor.value)!==normalizeThemeColor(state.theme.backgroundMode);}


function clamp01(v){return Math.max(0,Math.min(1,v));}
function easeOutCubic(v){v=clamp01(v);return 1-Math.pow(1-v,3);}
function setPspFont(sizePx,weight=500){ctx.font=`${weight} ${sizePx}px ${PSP_FONT_STACK}`;}
function drawPspText(text,x,y,{size=30,weight=500,align='left',alpha=1,shadow=true}={}){
  ctx.save();
  setPspFont(size,weight);
  ctx.textAlign=align;
  ctx.textBaseline='alphabetic';
  if(shadow){
    ctx.globalAlpha=alpha*.75;
    ctx.fillStyle='rgba(0,0,0,.88)';
    ctx.fillText(text,x+2,y+3);
  }
  ctx.globalAlpha=alpha;
  ctx.fillStyle='rgba(247,247,245,.98)';
  ctx.fillText(text,x,y);
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
function generateFocusImage(bodyImage,targetW,targetH,{color='#ffffff',opacity=.9,blur=6,padding=7,includeCore=false}={}){
  const mask=document.createElement('canvas');mask.width=targetW;mask.height=targetH;
  const mctx=mask.getContext('2d');const source=imageDataToCanvas(bodyImage);
  const maxW=Math.max(1,targetW-padding*2),maxH=Math.max(1,targetH-padding*2);
  const scale=Math.min(maxW/bodyImage.width,maxH/bodyImage.height);
  const w=bodyImage.width*scale,h=bodyImage.height*scale,x=(targetW-w)/2,y=(targetH-h)/2;
  mctx.drawImage(source,x,y,w,h);
  const colored=document.createElement('canvas');colored.width=targetW;colored.height=targetH;
  const cc=colored.getContext('2d');cc.drawImage(mask,0,0);cc.globalCompositeOperation='source-in';cc.fillStyle=color;cc.fillRect(0,0,targetW,targetH);
  const out=document.createElement('canvas');out.width=targetW;out.height=targetH;const oc=out.getContext('2d');
  oc.save();oc.globalAlpha=opacity;oc.filter=`blur(${blur}px)`;oc.drawImage(colored,0,0);oc.restore();
  if(includeCore){oc.save();oc.globalAlpha=Math.min(1,opacity*.35);oc.drawImage(colored,0,0);oc.restore();}
  return oc.getImageData(0,0,targetW,targetH);
}
function focusOptionsFromUi(){
  return {
    color:els.focusColor.value,
    opacity:Number(els.focusOpacity.value)/100,
    blur:Number(els.focusBlur.value),
    padding:Number(els.focusPadding.value),
    includeCore:els.focusIncludeCore.checked
  };
}
function updateFocusGeneratorPreview(){
  if(!els.focusPreviewCanvas)return;
  els.focusOpacityValue.textContent=`${els.focusOpacity.value}%`;
  els.focusBlurValue.textContent=`${els.focusBlur.value} px`;
  els.focusPaddingValue.textContent=`${els.focusPadding.value} px`;
  const body=selectedBodyForFocusGenerator(),pc=els.focusPreviewCanvas.getContext('2d');
  pc.clearRect(0,0,256,256);checker(pc,0,0,256,256,16);
  if(!body?.imageData){els.focusPreviewLabel.textContent='Select a body icon first';return;}
  const target=body.role.type==='secondBody'?[48,48]:[64,64];
  const generated=generateFocusImage(body.imageData,target[0],target[1],focusOptionsFromUi());
  const scale=3.2,gw=generated.width*scale,gh=generated.height*scale,bw=body.imageData.width*scale,bh=body.imageData.height*scale;
  drawImageDataFit(pc,generated,(256-gw)/2,(256-gh)/2,gw,gh,1);
  drawImageDataFit(pc,body.imageData,(256-bw)/2,(256-bh)/2,bw,bh,1);
  els.focusPreviewLabel.textContent=`Preview from ${body.role.label.replace(/\s+—\s+Body$/,'')}`;
}
function focusTargetsForSelection(){
  const target=els.focusTarget.value;
  if(target==='first')return state.assets.filter(a=>a.role.type==='firstBody');
  if(target==='second')return state.assets.filter(a=>a.role.type==='secondBody');
  const selected=selectedBodyForFocusGenerator();
  return selected?[selected]:[];
}
function ensureFocusPair(body){
  const focusSub=body.subIdx+1;let focus=getAsset(body.objIdx,focusSub);
  if(!focus){
    focus=createSyntheticAsset(body.objIdx,focusSub,null);state.assets.push(focus);state.assets.sort((a,b)=>a.objIdx-b.objIdx||a.subIdx-b.subIdx);
  }
  return focus;
}
function applyFocusGenerator(){
  const bodies=focusTargetsForSelection().filter(a=>a.imageData);
  if(!bodies.length){toast('No source icons','Select a body icon or choose a populated icon group.','error');return;}
  const opts=focusOptionsFromUi();
  for(const body of bodies){
    const focus=ensureFocusPair(body),[tw,th]=focus.role.required;
    focus.imageData=generateFocusImage(body.imageData,tw,th,opts);
    focus.paletteCount=countColors(focus.imageData,257);focus.edited=true;focus.decodeError=null;
  }
  setDirty(true);renderAssetList();if(state.selectedAsset)selectAsset(state.selectedAsset);
  closeModal(els.focusModal);
  toast('Focus graphics generated',`${bodies.length} focus asset${bodies.length===1?' was':'s were'} created.`,'success');
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
  const bg=getAsset(1,0);if(bg?.imageData){drawImageDataFit(ctx,bg.imageData,0,0,W,H);registerPreviewHit(bg,0,0,W,H,'background');}else{const grad=ctx.createLinearGradient(0,0,W,H);grad.addColorStop(0,'#222936');grad.addColorStop(1,'#090b10');ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);}
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
    drawImageDataFit(ctx,a.imageData,hitX,hitY,XMB_LAYOUT.categoryWidth,XMB_LAYOUT.categoryHeight,selectedCat?1:.72);
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
    ctx.save();ctx.strokeStyle='rgba(90,180,255,.42)';ctx.setLineDash([6,6]);ctx.strokeRect(.5,.5,W-1,H-1);
    ctx.beginPath();
    ctx.moveTo(XMB_LAYOUT.categoryX+hierarchyShift,0);ctx.lineTo(XMB_LAYOUT.categoryX+hierarchyShift,H);
    ctx.moveTo(0,XMB_LAYOUT.categoryY);ctx.lineTo(W,XMB_LAYOUT.categoryY);
    ctx.moveTo(0,XMB_LAYOUT.itemY);ctx.lineTo(W,XMB_LAYOUT.itemY);
    ctx.stroke();ctx.restore();
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

function drawVerticalItems(ids,time,hierarchyShift=0){
  const selectedIndex=state.nav.itemPos;
  const elapsed=time-state.animationStart;
  const focusIn=easeOutCubic(elapsed/120);
  const pulse=focusPulse(elapsed);
  for(let k=-2;k<=3;k++){
    const idx=selectedIndex+k;if(idx<0||idx>=ids.length)continue;
    const bodyId=ids[idx],body=bodyAsset(bodyId),focus=focusAsset(bodyId);if(!body?.imageData)continue;
    // Keep outgoing first-level icons spatially above the category row instead of
    // letting the previous item occupy the category icon's slot.
    const upperLaneY=XMB_LAYOUT.categoryY-XMB_LAYOUT.categoryHeight/2-XMB_LAYOUT.bodyHeight/2;
    const yy=k<0?upperLaneY+(k+1)*XMB_LAYOUT.itemSpacing:XMB_LAYOUT.itemY+k*XMB_LAYOUT.itemSpacing;
    const sel=k===0;
    const itemX=XMB_LAYOUT.itemX+hierarchyShift;
    if(sel&&focus?.imageData){
      const focusScale=.94+.06*focusIn;
      const fw=XMB_LAYOUT.focusWidth*focusScale,fh=XMB_LAYOUT.focusHeight*focusScale;
      drawImageDataFit(ctx,focus.imageData,itemX-fw/2,yy-fh/2,fw,fh,pulse);
    }
    const bodyX=itemX-XMB_LAYOUT.bodyWidth/2,bodyY=yy-XMB_LAYOUT.bodyHeight/2;
    drawImageDataFit(ctx,body.imageData,bodyX,bodyY,XMB_LAYOUT.bodyWidth,XMB_LAYOUT.bodyHeight,sel?1:.40);
    registerPreviewHit(body,bodyX,bodyY,XMB_LAYOUT.bodyWidth,XMB_LAYOUT.bodyHeight,'first');
    // The selected first-level label disappears while its second-level menu is open,
    // matching the PSP hierarchy shown in the hardware reference captures.
    if(sel&&state.nav.level===1){
      const label=FIRST_LABELS[bodyId]||`Item ${bodyId/2}`;
      drawPspText(label,XMB_LAYOUT.itemLabelX+hierarchyShift,yy+XMB_LAYOUT.itemLabelOffsetY,{
        size:XMB_LAYOUT.itemFontSize,weight:500,align:'left',alpha:focusIn
      });
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
        drawImageDataFit(ctx,pair.focus.imageData,iconX-24*PSP_SCALE,yy-24*PSP_SCALE,48*PSP_SCALE,48*PSP_SCALE,pulse);
      }
      const secondX=iconX-16*PSP_SCALE,secondY=yy-16*PSP_SCALE;
      drawImageDataFit(ctx,pair.body.imageData,secondX,secondY,32*PSP_SCALE,32*PSP_SCALE,selected?1:.34);
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
function makeFileInfo(){const text=new TextEncoder().encode(`\0\0${new Date().toString().slice(0,24)}\n\0PTF Studio Beta 0.9.5\0`);const padded=new Uint8Array(align(text.length,4));padded.set(text);const total=16+padded.length;return concatArrays([blockHeader(0xff,total,total),padded]);}
function encodeGimIndexed(imageData,dither=true){const q=quantize(imageData,256,dither),w=imageData.width,h=imageData.height;const palBytes=new Uint8Array(1024);q.palette.forEach((p,i)=>{palBytes[i*4]=p[0];palBytes[i*4+1]=p[1];palBytes[i*4+2]=p[2];palBytes[i*4+3]=p[3];});const indexBytes=swizzleIndices(q.indices,w,h,8);let paletteBlock=makeImageBlock(5,3,0,256,1,32,palBytes,2);let imageBlock=makeImageBlock(4,5,1,w,h,8,indexBytes,1);const fileInfo=makeFileInfo();
  // Correct global next pointers after sizes are known.
  new DataView(paletteBlock.buffer).setUint32(8,paletteBlock.length,true);new DataView(imageBlock.buffer).setUint32(8,imageBlock.length,true);
  const pictureSize=16+paletteBlock.length+imageBlock.length;const picture=blockHeader(3,pictureSize,16);const rootSize=16+pictureSize+fileInfo.length;const root=blockHeader(2,rootSize,16);const header=new Uint8Array([77,73,71,46,48,48,46,49,80,83,80,0,0,0,0,0]);return {bytes:concatArrays([header,root,picture,paletteBlock,imageBlock,fileInfo]),used:q.used};}
function encodeGimRgba(imageData){const w=imageData.width,h=imageData.height,d=imageData.data,pixels=new Uint8Array(w*h*4);pixels.set(d);const imageBlock=makeImageBlock(4,3,0,w,h,32,pixels,1),fileInfo=makeFileInfo();const pictureSize=16+imageBlock.length,picture=blockHeader(3,pictureSize,16),rootSize=16+pictureSize+fileInfo.length,root=blockHeader(2,rootSize,16),header=new Uint8Array([77,73,71,46,48,48,46,49,80,83,80,0,0,0,0,0]);return concatArrays([header,root,picture,imageBlock,fileInfo]);}
function encodeBmp24(imageData){const w=imageData.width,h=imageData.height,row=align(w*3,4),size=54+row*h,b=new Uint8Array(size),v=new DataView(b.buffer);b[0]=66;b[1]=77;setU32(v,2,size);setU32(v,10,54);setU32(v,14,40);v.setInt32(18,w,true);v.setInt32(22,h,true);setU16(v,26,1);setU16(v,28,24);setU32(v,34,row*h);const d=imageData.data;for(let y=0;y<h;y++){const sy=h-1-y;for(let x=0;x<w;x++){const si=(sy*w+x)*4,di=54+y*row+x*3;b[di]=d[si+2];b[di+1]=d[si+1];b[di+2]=d[si];}}return b;}

async function encodeAssetImage(asset,imageData){
  if(asset.fileType===5){
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
  for(const a of state.assets){
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
  return {bytes:out,exportedAssets,metadata:{...metadata,themeColor},stats:{preservedLzr,convertedLzr,deflated,stored}};
}
async function exportPtf(){
  try{
    els.exportBtn.disabled=true;const result=await buildPtf(),out=result.bytes;
    verifyBuiltPtfMetadata(out,result.metadata);
    if(out.length>PTF_MAX_SIZE)throw new Error(`Theme is ${formatBytes(out.length)}. The standard PSP PTF limit is 768 KB.`);
    const base=(els.productId.value.trim()||'theme').replace(/[^a-z0-9_.-]+/gi,'_');
    downloadBlob(new Blob([out],{type:'application/octet-stream'}),`${base}.ptf`);
    state.theme.title=result.metadata.title;state.theme.productId=result.metadata.productId;state.theme.version=result.metadata.version;state.theme.backgroundMode=result.metadata.themeColor;
    for(const [a,x] of result.exportedAssets){
      a.rawOriginal=x.raw;a.rawCurrent=x.raw;a.packedOriginal=x.packed;a.comp=x.comp;a.packedSize=x.packedSize;a.ucSize=x.ucSize;a.edited=false;a.synthetic=false;
    }
    setDirty(false);renderAssetList();if(state.selectedAsset)selectAsset(state.selectedAsset);
    const converted=result.stats.convertedLzr;
    setStatus(`Exported ${formatBytes(out.length)}${converted?` · ${converted} changed LZR asset${converted===1?'':'s'} converted`:''}`);
    const note=converted?` ${converted} edited legacy LZR asset${converted===1?' was':'s were'} exported with PSP-compatible Deflate or stored compression.`:'';
    toast('PTF exported',`The rebuilt theme was downloaded.${note} Test it from /PSP/THEME/ before distributing it.`,'success');
  }catch(e){console.error(e);setStatus('Export failed');toast('Could not export PTF',e.message,'error');}
  finally{els.exportBtn.disabled=false;}
}
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
    const remove=document.createElement('button');remove.className='miniButton';remove.textContent='Remove';remove.addEventListener('click',()=>{state.variants.splice(index,1);renderVariantList();});
    row.append(title,sw,profile,remove);els.variantList.appendChild(row);
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
els.exportBtn.addEventListener('click',exportPtf);
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
els.focusGeneratorBtn.addEventListener('click',()=>{
  updateFocusGeneratorPreview();
  openModal(els.focusModal);
});
[els.focusTarget,els.focusColor,els.focusOpacity,els.focusBlur,els.focusPadding,els.focusIncludeCore].forEach(control=>{
  control.addEventListener(control.type==='checkbox'?'change':'input',updateFocusGeneratorPreview);
});
els.applyFocusGeneratorBtn.addEventListener('click',applyFocusGenerator);
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
els.toggleGridBtn.addEventListener('click',()=>state.showGuides=!state.showGuides);
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
function allModals(){return [els.aboutModal,els.focusModal,els.analysisModal,els.variantsModal,els.importAssetModal,document.querySelector('#assetMakerModal')];}
function anyModalOpen(){return allModals().some(modal=>modal&&!modal.classList.contains('hidden'));}
function closeAllModals(){allModals().forEach(closeModal);}

els.helpMenuBtn.addEventListener('click',event=>{
  event.stopPropagation();
  setHelpMenu(els.helpMenu.classList.contains('hidden'));
});
els.aboutBtn.addEventListener('click',openAbout);
els.creditsBtn.addEventListener('click',openAbout);
els.closeAboutBtn.addEventListener('click',closeAbout);
els.modalCloseButton.addEventListener('click',closeAbout);
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

