/* PTF Studio Beta 0.9 — dependency-free PSP PTF viewer/editor */
'use strict';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const els = {
  ptfInput: $('#ptfInput'), loadSampleBtn: $('#loadSampleBtn'), exportBtn: $('#exportBtn'),
  themeName: $('#themeName'), productId: $('#themeProductId'), version: $('#themeVersion'), themeColor: $('#themeColor'),
  assetSearch: $('#assetSearch'), assetGroups: $('#assetGroups'), xmbCanvas: $('#xmbCanvas'), dropZone: $('#dropZone'),
  dropOverlay: $('#dropOverlay'), viewerStatus: $('#viewerStatus'), resetNavBtn: $('#resetNavBtn'), toggleGridBtn: $('#toggleGridBtn'),
  inspectorEmpty: $('#inspectorEmpty'), inspector: $('#inspector'), assetPreview: $('#assetPreview'), assetTitle: $('#assetTitle'),
  assetSlot: $('#assetSlot'), requiredSize: $('#requiredSize'), currentSize: $('#currentSize'), currentFormat: $('#currentFormat'),
  paletteInfo: $('#paletteInfo'), replaceInput: $('#replaceInput'), restoreAssetBtn: $('#restoreAssetBtn'), exportAssetBtn: $('#exportAssetBtn'),
  fontInput: $('#fontInput'), fontStatus: $('#fontStatus'), bulkFocusBtn: $('#bulkFocusBtn'),
  bulkFocusInput: $('#bulkFocusInput'), restoreBulkFocusBtn: $('#restoreBulkFocusBtn'),
  fitMode: $('#fitMode'), ditherToggle: $('#ditherToggle'), pulseToggle: $('#pulseToggle'), validationBox: $('#validationBox'),
  validationText: $('#validationText'), statusText: $('#statusText'), dirtyState: $('#dirtyState'), toastHost: $('#toastHost'),
  helpMenuBtn: $('#helpMenuBtn'), helpMenu: $('#helpMenu'), aboutBtn: $('#aboutBtn'), creditsBtn: $('#creditsBtn'),
  aboutModal: $('#aboutModal'), closeAboutBtn: $('#closeAboutBtn'), modalCloseButton: $('#modalCloseButton')
};

const ctx = els.xmbCanvas.getContext('2d');
const previewCtx = els.assetPreview.getContext('2d');

const APP_VERSION = 'Beta 0.9.1';
const APP_BUILD = '2026.07.11';

const CATEGORY_LABELS = {1:'Settings',2:'Photo',3:'Music',4:'Video',5:'TV',6:'Game',7:'Network',8:'Extras'};
const FIRST_LABELS = {
  2:'Memory Stick',4:'UMD',6:'Camera',8:'Game Sharing',10:'Save Data Utility',12:'UMD Update',
  14:'Network Update',16:'USB Connection',18:'Video Settings',20:'Photo Settings',22:'System Settings',
  24:'Theme Settings',26:'Date & Time Settings',28:'Power Save Settings',30:'External Display Settings',
  32:'Sound Settings',34:'Security Settings',36:'RSS Channel Settings',38:'Network Settings',40:'Online Manual',
  42:'Remote Play',44:'Internet Radio',46:'RSS Channel',48:'Internet Browser',50:'Internet Search',
  52:'Account Management',54:'Default',56:'Game Sharing',58:'Default Folder'
};
const CATEGORY_ITEMS = {
  1:[14,16,18,20,22,24,26,28,30,32,34,36,38],
  2:[6,2],
  3:[4,2],
  4:[4,2],
  5:[58],
  6:[8,12,4,10,2],
  7:[40,42,44,46,48,50],
  8:[52,40]
};
const GROUP_NAMES = {0:'Preview & metadata',1:'Wallpaper',2:'Category icons',3:'First-level icons',4:'Second-level icons'};
const THEME_COLORS = ['Monthly / automatic','January — Gray','February — Yellow','March — Lime','April — Pink','May — Green','June — Lilac','July — Turquoise','August — Blue','September — Purple','October — Orange','November — Brown','December — Red'];


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
PSP_BATTERY_IMAGE.src = 'assets/psp_battery.png?v=0.9.1-beta';

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
  fontLoaded: false
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
function writeFixedString(target, start, length, text) {
  const enc = new TextEncoder().encode(text);
  target.fill(0,start,start+length);
  target.set(enc.slice(0,length-1), start);
}
function align(value, multiple) { return value % multiple === 0 ? value : value + multiple - (value % multiple); }
function u16(view,o,little=true){return view.getUint16(o,little)}
function u32(view,o,little=true){return view.getUint32(o,little)}
function setU16(view,o,v,little=true){view.setUint16(o,v,little)}
function setU32(view,o,v,little=true){view.setUint32(o,v,little)}

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

async function parsePtf(arrayBuffer, sourceName='theme.ptf') {
  const bytes = new Uint8Array(arrayBuffer);
  if (bytes.length < 0x120 || String.fromCharCode(...bytes.slice(0,4)) !== '\0PTF') throw new Error('Not a valid version 1 PTF file.');
  if (!(bytes[4]===0 && bytes[5]===1)) throw new Error('Unsupported PTF version.');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const theme = {
    name: readFixedString(bytes,8,128), fileName:readFixedString(bytes,136,48),
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
      const packed=bytes.slice(pos+0x20,pos+0x20+size);
      let raw;
      if(comp===2 && size<ucSize) raw=await decompressDeflate(packed);
      else if(comp===0 || size===ucSize) raw=packed.slice(0,ucSize);
      else if(comp===1) throw new Error('This theme uses RLZ/LZR compression, which this first build does not yet support.');
      else raw=packed.slice(0,ucSize);
      if(objIdx===0 && subIdx===2 && raw.length>=4){ theme.backgroundMode=new DataView(raw.buffer,raw.byteOffset,raw.byteLength).getUint32(0,true); }
      else {
        const role=roleFor(objIdx,subIdx);
        const asset={objIdx,subIdx,fileType,comp,packedSize:size,ucSize,rawOriginal:raw,rawCurrent:raw,role,edited:false,imageData:null,gimMeta:null,paletteCount:null,decodeError:null};
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

function imageDataToCanvas(imageData){const c=document.createElement('canvas');c.width=imageData.width;c.height=imageData.height;c.getContext('2d').putImageData(imageData,0,0);return c;}
function drawImageDataFit(targetCtx,imageData,x,y,w,h,alpha=1){
  if(!imageData)return; const c=imageDataToCanvas(imageData); targetCtx.save(); targetCtx.globalAlpha=alpha; targetCtx.drawImage(c,x,y,w,h); targetCtx.restore();
}
function getAsset(obj,sub){return state.assets.find(a=>a.objIdx===obj&&a.subIdx===sub)||null;}
function categoryAssets(){return state.assets.filter(a=>a.objIdx===2).sort((a,b)=>a.subIdx-b.subIdx);}
function bodyAsset(bodyId){return getAsset(3,bodyId);}
function focusAsset(bodyId){return getAsset(3,bodyId+1);}

function populateThemeColors(){els.themeColor.innerHTML='';THEME_COLORS.forEach((v,i)=>{const o=document.createElement('option');o.value=i;o.textContent=v;els.themeColor.appendChild(o);});}
populateThemeColors();

async function loadThemeBuffer(buffer,name){
  setStatus('Reading PTF…');
  try{
    const parsed=await parsePtf(buffer,name);
    state.theme=parsed.theme;state.assets=parsed.assets;state.sourceName=name;state.selectedAsset=null;state.nav={categoryPos:0,itemPos:0,secondPos:0,level:1};
    state.animationStart=performance.now();setDirty(false); bindThemeFields(); renderAssetList(); updateUiEnabled();
    els.dropOverlay.classList.add('hidden');
    const errors=state.assets.filter(a=>a.decodeError).length;
    els.viewerStatus.textContent=`${state.theme.name || name} · ${state.assets.length} assets`;
    setStatus(errors?`Loaded with ${errors} unsupported asset(s)`:'Theme loaded');
    toast('Theme loaded',`${state.assets.length} editable assets found${errors?`; ${errors} could not be previewed`:''}.`,errors?'error':'success');
  }catch(e){console.error(e);setStatus('Import failed');toast('Could not import theme',e.message,'error');}
}

function bindThemeFields(){
  const t=state.theme;els.themeName.value=t.name;els.productId.value=t.fileName;els.version.value=t.version;els.themeColor.value=String(t.backgroundMode??0);
}
function updateUiEnabled(){
  const on=!!state.theme;
  [els.exportBtn,els.themeName,els.productId,els.version,els.themeColor,els.assetSearch,els.resetNavBtn,els.toggleGridBtn,els.bulkFocusBtn].forEach(e=>e.disabled=!on);
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
    const group=state.assets.filter(a=>a.objIdx===objIdx && a.role.label.toLowerCase().includes(query)); if(!group.length)continue;
    const wrap=document.createElement('div');wrap.className='assetGroup';
    const head=document.createElement('div');head.className='assetGroupHeader';head.innerHTML=`<strong>${GROUP_NAMES[objIdx]}</strong><span>${group.length}</span>`;wrap.appendChild(head);
    const list=document.createElement('div');list.className='assetList';
    for(const asset of group){
      const row=document.createElement('div');row.className='assetRow'+(asset===state.selectedAsset?' selected':'');
      const thumb=document.createElement('canvas');thumb.className='assetThumb';thumb.width=84;thumb.height=68;drawThumb(thumb,asset);
      const txt=document.createElement('div');txt.className='assetRowText';txt.innerHTML=`<div class="assetRowTitle"></div><div class="assetRowSub">${asset.imageData?`${asset.imageData.width} × ${asset.imageData.height}`:'Unavailable'} · ${formatName(asset)}</div>`;txt.querySelector('.assetRowTitle').textContent=asset.role.label;
      const badge=document.createElement('div');badge.className='assetBadge'+(asset.edited?' edited':'');badge.textContent=asset.edited?'EDITED':`${asset.objIdx}:${asset.subIdx}`;
      row.append(thumb,txt,badge);row.addEventListener('click',()=>selectAsset(asset));list.appendChild(row);
    }
    wrap.appendChild(list);els.assetGroups.appendChild(wrap);
  }
}
function drawThumb(canvas,asset){const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);checker(c,0,0,canvas.width,canvas.height,8);if(asset.imageData){const s=Math.min(64/asset.imageData.width,50/asset.imageData.height);const w=asset.imageData.width*s,h=asset.imageData.height*s;drawImageDataFit(c,asset.imageData,(84-w)/2,(68-h)/2,w,h);}}
function formatName(asset){return asset.fileType===5?(asset.gimMeta?`GIM ${asset.role.indexed?'P8':'RGBA'}`:'GIM'):({0:'PNG',1:'JPEG',2:'TIFF',3:'GIF',4:'BMP'}[asset.fileType]||'Binary');}

function selectAsset(asset){state.selectedAsset=asset;renderAssetList();els.inspectorEmpty.style.display='none';els.inspector.classList.remove('hidden');els.assetTitle.textContent=asset.role.label;els.assetSlot.textContent=`PTF group ${asset.objIdx}, slot ${asset.subIdx}`;els.requiredSize.textContent=asset.role.required?asset.role.required.join(' × '):'Original';els.currentSize.textContent=asset.imageData?`${asset.imageData.width} × ${asset.imageData.height}`:'Unavailable';els.currentFormat.textContent=formatName(asset);els.paletteInfo.textContent=asset.role.indexed?(asset.paletteCount?`${asset.paletteCount} used / 256`:'≤ 256 colors'):'24/32-bit';els.restoreAssetBtn.disabled=!asset.edited;updateValidation();drawInspectorPreview();}
function checker(c,x,y,w,h,s=12){for(let yy=0;yy<h;yy+=s)for(let xx=0;xx<w;xx+=s){c.fillStyle=((xx/s+yy/s)&1)?'#20252c':'#171b20';c.fillRect(x+xx,y+yy,Math.min(s,w-xx),Math.min(s,h-yy));}}
function drawInspectorPreview(){const a=state.selectedAsset;previewCtx.clearRect(0,0,els.assetPreview.width,els.assetPreview.height);checker(previewCtx,0,0,els.assetPreview.width,els.assetPreview.height,14);if(!a?.imageData)return;const s=Math.min((els.assetPreview.width-30)/a.imageData.width,(els.assetPreview.height-30)/a.imageData.height);const w=a.imageData.width*s,h=a.imageData.height*s;drawImageDataFit(previewCtx,a.imageData,(els.assetPreview.width-w)/2,(els.assetPreview.height-h)/2,w,h);}
function updateValidation(){const a=state.selectedAsset;if(!a)return;let status='ok',title='Asset is valid',text='Ready for export.';if(a.decodeError){status='bad';title='Cannot decode this asset';text=a.decodeError;}else if(a.role.required&&(a.imageData.width!==a.role.required[0]||a.imageData.height!==a.role.required[1])){status='bad';title='Incorrect dimensions';text=`Expected ${a.role.required.join(' × ')} pixels.`;}else if(a.role.indexed&&a.paletteCount>256){status='warn';title='Will be reduced to 256 colors';text='PTF Studio will quantize the asset when exporting.';}els.validationBox.querySelector('.validationDot').className=`validationDot ${status}`;els.validationBox.querySelector('strong').textContent=title;els.validationText.textContent=text;}

function bitmapToSizedImageData(bmp,tw,th,mode=els.fitMode.value){
  const c=document.createElement('canvas');c.width=tw;c.height=th;
  const cctx=c.getContext('2d');cctx.clearRect(0,0,tw,th);
  let dx=0,dy=0,dw=tw,dh=th;
  if(mode!=='stretch'){
    const scale=mode==='cover'?Math.max(tw/bmp.width,th/bmp.height):Math.min(tw/bmp.width,th/bmp.height);
    dw=bmp.width*scale;dh=bmp.height*scale;dx=(tw-dw)/2;dy=(th-dh)/2;
  }
  cctx.imageSmoothingEnabled=true;cctx.imageSmoothingQuality='high';cctx.drawImage(bmp,dx,dy,dw,dh);
  return cctx.getImageData(0,0,tw,th);
}
async function replaceSelectedAsset(file){
  const a=state.selectedAsset;if(!a||!a.role.required)return;
  try{
    const bmp=await createImageBitmap(file);const [tw,th]=a.role.required;
    a.imageData=bitmapToSizedImageData(bmp,tw,th);bmp.close();
    a.paletteCount=countColors(a.imageData,257);a.edited=true;setDirty(true);selectAsset(a);renderAssetList();toast('Image replaced',`${a.role.label} was resized to ${tw} × ${th}.`,'success');
  }catch(e){toast('Could not use image',e.message,'error');}
}
async function bulkReplaceFirstLevelFocus(file){
  const targets=state.assets.filter(a=>a.role.type==='firstFocus'&&a.role.required);
  if(!targets.length){toast('No focus assets found','This PTF does not contain first-level focus slots.','error');return;}
  try{
    const bmp=await createImageBitmap(file);
    const prepared=new Map();
    for(const a of targets){
      const [tw,th]=a.role.required;const key=`${tw}x${th}`;
      if(!prepared.has(key))prepared.set(key,bitmapToSizedImageData(bmp,tw,th));
      const src=prepared.get(key);
      a.imageData=new ImageData(new Uint8ClampedArray(src.data),src.width,src.height);
      a.paletteCount=countColors(a.imageData,257);a.edited=true;
    }
    bmp.close();setDirty(true);renderAssetList();
    if(state.selectedAsset?.role.type==='firstFocus')selectAsset(state.selectedAsset);
    toast('First-level focus changed',`${targets.length} focus slots now use the selected image.`,'success');
  }catch(e){console.error(e);toast('Could not apply focus image',e.message,'error');}
}
async function restoreAllFirstLevelFocus(){
  const targets=state.assets.filter(a=>a.role.type==='firstFocus'&&a.edited);
  if(!targets.length)return;
  try{
    for(const a of targets){a.rawCurrent=a.rawOriginal;a.edited=false;await decodeAsset(a);}
    setDirty(state.assets.some(x=>x.edited)||metadataDirty());renderAssetList();
    if(state.selectedAsset?.role.type==='firstFocus')selectAsset(state.selectedAsset);
    toast('Focus assets restored',`${targets.length} first-level focus slots were restored.`,'success');
  }catch(e){console.error(e);toast('Could not restore focus assets',e.message,'error');}
}
async function restoreSelected(){const a=state.selectedAsset;if(!a)return;a.rawCurrent=a.rawOriginal;a.edited=false;await decodeAsset(a);setDirty(state.assets.some(x=>x.edited)||metadataDirty());selectAsset(a);renderAssetList();toast('Original restored',a.role.label,'success');}
function metadataDirty(){if(!state.theme)return false;return els.themeName.value!==state.theme.name||els.productId.value!==state.theme.fileName||els.version.value!==state.theme.version||Number(els.themeColor.value)!==state.theme.backgroundMode;}


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

function drawXmb(time){
  const W=960,H=544;ctx.clearRect(0,0,W,H);
  if(!state.theme){ctx.fillStyle='#07090d';ctx.fillRect(0,0,W,H);requestAnimationFrame(drawXmb);return;}
  if(state.viewMode==='assets'&&state.selectedAsset){drawAssetStage();requestAnimationFrame(drawXmb);return;}
  const bg=getAsset(1,0);if(bg?.imageData)drawImageDataFit(ctx,bg.imageData,0,0,W,H);else{const grad=ctx.createLinearGradient(0,0,W,H);grad.addColorStop(0,'#222936');grad.addColorStop(1,'#090b10');ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);}
  drawStatusBar();
  const cats=categoryAssets();if(!cats.length){requestAnimationFrame(drawXmb);return;}
  state.nav.categoryPos=Math.max(0,Math.min(state.nav.categoryPos,cats.length-1));
  const selected=cats[state.nav.categoryPos];
  const hierarchyShift=state.nav.level===2 ? -60*PSP_SCALE : 0;
  cats.forEach((a,i)=>{
    const d=i-state.nav.categoryPos;
    const x=XMB_LAYOUT.categoryX+hierarchyShift+d*XMB_LAYOUT.categorySpacing;
    const selectedCat=i===state.nav.categoryPos;
    drawImageDataFit(
      ctx,a.imageData,
      x-XMB_LAYOUT.categoryWidth/2,
      XMB_LAYOUT.categoryY-XMB_LAYOUT.categoryHeight/2,
      XMB_LAYOUT.categoryWidth,
      XMB_LAYOUT.categoryHeight,
      selectedCat?1:.72
    );
  });
  drawPspText(selected.role.label,XMB_LAYOUT.categoryX+hierarchyShift,XMB_LAYOUT.categoryLabelY,{
    size:XMB_LAYOUT.categoryFontSize,weight:500,align:'center'
  });
  const itemIds=(CATEGORY_ITEMS[selected.subIdx]||state.assets.filter(a=>a.objIdx===3&&a.subIdx%2===0).map(a=>a.subIdx));
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
    drawImageDataFit(
      ctx,body.imageData,
      itemX-XMB_LAYOUT.bodyWidth/2,
      yy-XMB_LAYOUT.bodyHeight/2,
      XMB_LAYOUT.bodyWidth,
      XMB_LAYOUT.bodyHeight,
      sel?1:.40
    );
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
      drawImageDataFit(ctx,pair.body.imageData,iconX-16*PSP_SCALE,yy-16*PSP_SCALE,32*PSP_SCALE,32*PSP_SCALE,selected?1:.34);
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

function drawAssetStage(){const a=state.selectedAsset;ctx.fillStyle='#101318';ctx.fillRect(0,0,960,544);checker(ctx,0,0,960,544,24);if(a.imageData){const s=Math.min(760/a.imageData.width,410/a.imageData.height);const w=a.imageData.width*s,h=a.imageData.height*s;drawImageDataFit(ctx,a.imageData,(960-w)/2,(544-h)/2,w,h);}ctx.fillStyle='rgba(0,0,0,.65)';ctx.fillRect(0,490,960,54);ctx.fillStyle='#fff';ctx.font='600 20px -apple-system, sans-serif';ctx.textAlign='center';ctx.fillText(a.role.label,480,523);}
requestAnimationFrame(drawXmb);

function canOpenSecondLevel(selectedCategory,items){
  if(selectedCategory?.subIdx!==1 || !items.length || !state.assets.some(a=>a.objIdx===4))return false;
  return items[state.nav.itemPos]===24;
}

function moveNav(key){
  if(!state.theme)return;
  const cats=categoryAssets();if(!cats.length)return;
  const selected=cats[state.nav.categoryPos];
  const items=CATEGORY_ITEMS[selected.subIdx]||[];
  if(state.nav.level===2){
    if(key==='ArrowUp')state.nav.secondPos=(state.nav.secondPos-1+3)%3;
    if(key==='ArrowDown')state.nav.secondPos=(state.nav.secondPos+1)%3;
    if(key==='Escape'||key==='ArrowLeft')state.nav.level=1;
    state.animationStart=performance.now();
    return;
  }
  if(key==='ArrowLeft'){state.nav.categoryPos=(state.nav.categoryPos-1+cats.length)%cats.length;state.nav.itemPos=0;state.nav.secondPos=0;}
  if(key==='ArrowRight'){state.nav.categoryPos=(state.nav.categoryPos+1)%cats.length;state.nav.itemPos=0;state.nav.secondPos=0;}
  const active=cats[state.nav.categoryPos],activeItems=CATEGORY_ITEMS[active.subIdx]||[];
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
function makeFileInfo(){const text=new TextEncoder().encode(`\0\0${new Date().toString().slice(0,24)}\n\0PTF Studio Beta 0.9.1\0`);const padded=new Uint8Array(align(text.length,4));padded.set(text);const total=16+padded.length;return concatArrays([blockHeader(0xff,total,total),padded]);}
function encodeGimIndexed(imageData,dither=true){const q=quantize(imageData,256,dither),w=imageData.width,h=imageData.height;const palBytes=new Uint8Array(1024);q.palette.forEach((p,i)=>{palBytes[i*4]=p[0];palBytes[i*4+1]=p[1];palBytes[i*4+2]=p[2];palBytes[i*4+3]=p[3];});const indexBytes=swizzleIndices(q.indices,w,h,8);let paletteBlock=makeImageBlock(5,3,0,256,1,32,palBytes,2);let imageBlock=makeImageBlock(4,5,1,w,h,8,indexBytes,1);const fileInfo=makeFileInfo();
  // Correct global next pointers after sizes are known.
  new DataView(paletteBlock.buffer).setUint32(8,paletteBlock.length,true);new DataView(imageBlock.buffer).setUint32(8,imageBlock.length,true);
  const pictureSize=16+paletteBlock.length+imageBlock.length;const picture=blockHeader(3,pictureSize,16);const rootSize=16+pictureSize+fileInfo.length;const root=blockHeader(2,rootSize,16);const header=new Uint8Array([77,73,71,46,48,48,46,49,80,83,80,0,0,0,0,0]);return {bytes:concatArrays([header,root,picture,paletteBlock,imageBlock,fileInfo]),used:q.used};}
function encodeGimRgba(imageData){const w=imageData.width,h=imageData.height,d=imageData.data,pixels=new Uint8Array(w*h*4);pixels.set(d);const imageBlock=makeImageBlock(4,3,0,w,h,32,pixels,1),fileInfo=makeFileInfo();const pictureSize=16+imageBlock.length,picture=blockHeader(3,pictureSize,16),rootSize=16+pictureSize+fileInfo.length,root=blockHeader(2,rootSize,16),header=new Uint8Array([77,73,71,46,48,48,46,49,80,83,80,0,0,0,0,0]);return concatArrays([header,root,picture,imageBlock,fileInfo]);}
function encodeBmp24(imageData){const w=imageData.width,h=imageData.height,row=align(w*3,4),size=54+row*h,b=new Uint8Array(size),v=new DataView(b.buffer);b[0]=66;b[1]=77;setU32(v,2,size);setU32(v,10,54);setU32(v,14,40);v.setInt32(18,w,true);v.setInt32(22,h,true);setU16(v,26,1);setU16(v,28,24);setU32(v,34,row*h);const d=imageData.data;for(let y=0;y<h;y++){const sy=h-1-y;for(let x=0;x<w;x++){const si=(sy*w+x)*4,di=54+y*row+x*3;b[di]=d[si+2];b[di+1]=d[si+1];b[di+2]=d[si];}}return b;}

async function rawForAsset(asset){if(!asset.edited)return asset.rawOriginal;if(asset.fileType===5){if(asset.role.indexed){const r=encodeGimIndexed(asset.imageData,els.ditherToggle.checked);asset.paletteCount=r.used;return r.bytes;}return encodeGimRgba(asset.imageData);}if(asset.fileType===4)return encodeBmp24(asset.imageData);const c=imageDataToCanvas(asset.imageData);const mime={0:'image/png',1:'image/jpeg',2:'image/tiff',3:'image/gif'}[asset.fileType]||'image/png';const blob=await new Promise(res=>c.toBlob(res,mime));return new Uint8Array(await blob.arrayBuffer());}
async function buildPtf(){
  if(!state.theme)throw new Error('No theme loaded.');setStatus('Building PTF…');
  const categoryMap=new Map();for(const a of state.assets){if(!categoryMap.has(a.objIdx))categoryMap.set(a.objIdx,[]);categoryMap.get(a.objIdx).push(a);}for(const arr of categoryMap.values())arr.sort((a,b)=>a.subIdx-b.subIdx);
  if(!categoryMap.has(0))categoryMap.set(0,[]);
  const modeRaw=new Uint8Array(4);new DataView(modeRaw.buffer).setUint32(0,Number(els.themeColor.value),true);
  const groups=[];
  for(const objIdx of [...categoryMap.keys()].sort((a,b)=>a-b)){
    const records=[];if(objIdx===0){const arr=categoryMap.get(0);for(const a of arr)records.push({asset:a,subIdx:a.subIdx});records.push({asset:null,subIdx:2,raw:modeRaw,fileType:5,comp:2});records.sort((a,b)=>a.subIdx-b.subIdx);}else for(const a of categoryMap.get(objIdx))records.push({asset:a,subIdx:a.subIdx});
    const entryParts=[];
    for(const r of records){const raw=r.raw||await rawForAsset(r.asset);let comp=r.asset?.comp??r.comp??2,packed=raw;if(comp===2&&raw.length>4){const z=await compressDeflate(raw);if(z.length<raw.length)packed=z;else comp=0;}else if(raw.length<=4)packed=raw;const padded=new Uint8Array(align(packed.length,4));padded.set(packed);const header=new Uint8Array(0x20),hv=new DataView(header.buffer);setU16(hv,0,r.subIdx);setU16(hv,4,r.asset?.fileType??r.fileType);setU16(hv,6,comp);setU32(hv,8,padded.length);setU32(hv,12,raw.length);entryParts.push(header,padded);}
    const body=concatArrays(entryParts),groupHeader=new Uint8Array(0x20),gv=new DataView(groupHeader.buffer);setU16(gv,0,objIdx);setU16(gv,2,records.length);setU32(gv,4,body.length);groups.push({objIdx,header:groupHeader,body});
  }
  let offset=0x120;for(const g of groups){setU32(new DataView(g.header.buffer),8,offset+0x20);g.offset=offset;offset+=0x20+g.body.length;}
  const out=new Uint8Array(offset),v=new DataView(out.buffer);out.set([0,80,84,70,0,1,0,0],0);writeFixedString(out,8,128,els.themeName.value.trim());writeFixedString(out,136,48,els.productId.value.trim());writeFixedString(out,184,8,state.theme.pspVersion||'6.20');writeFixedString(out,192,8,els.version.value.trim());setU32(v,200,state.theme.value8||8);groups.forEach((g,i)=>setU32(v,0x100+i*4,g.offset));for(const g of groups){out.set(g.header,g.offset);out.set(g.body,g.offset+0x20);}
  return out;
}

async function exportPtf(){try{els.exportBtn.disabled=true;const out=await buildPtf();const base=(els.productId.value.trim()||'theme').replace(/[^a-z0-9_.-]+/gi,'_');downloadBlob(new Blob([out],{type:'application/octet-stream'}),`${base}.ptf`);state.theme.name=els.themeName.value;state.theme.fileName=els.productId.value;state.theme.version=els.version.value;state.theme.backgroundMode=Number(els.themeColor.value);for(const a of state.assets){if(a.edited){a.rawOriginal=await rawForAsset(a);a.edited=false;}}setDirty(false);renderAssetList();if(state.selectedAsset)selectAsset(state.selectedAsset);setStatus(`Exported ${out.length.toLocaleString()} bytes`);toast('PTF exported','The rebuilt theme was downloaded. Test it from /PSP/THEME/ before distributing it.','success');}catch(e){console.error(e);setStatus('Export failed');toast('Could not export PTF',e.message,'error');}finally{els.exportBtn.disabled=false;}}
function downloadBlob(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500);}
async function exportSelectedPng(){const a=state.selectedAsset;if(!a?.imageData)return;const c=imageDataToCanvas(a.imageData);const blob=await new Promise(res=>c.toBlob(res,'image/png'));downloadBlob(blob,`${a.objIdx}_${String(a.subIdx).padStart(4,'0')}.png`);}

els.ptfInput.addEventListener('change',async e=>{const f=e.target.files[0];if(f)await loadThemeBuffer(await f.arrayBuffer(),f.name);e.target.value='';});
els.loadSampleBtn.addEventListener('click',async()=>{if(typeof SAMPLE_PTF_BASE64==='undefined'){toast('Sample missing','Open the bundled sample manually.','error');return;}const bin=atob(SAMPLE_PTF_BASE64),b=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)b[i]=bin.charCodeAt(i);await loadThemeBuffer(b.buffer,'S1mplyBlue.ptf');});
els.exportBtn.addEventListener('click',exportPtf);
els.fontInput.addEventListener('change',async e=>{const f=e.target.files[0];if(f)await loadPreviewFont(f);e.target.value='';});
els.bulkFocusBtn.addEventListener('click',()=>els.bulkFocusInput.click());
els.bulkFocusInput.addEventListener('change',async e=>{const f=e.target.files[0];if(f)await bulkReplaceFirstLevelFocus(f);e.target.value='';});
els.restoreBulkFocusBtn.addEventListener('click',restoreAllFirstLevelFocus);
els.assetSearch.addEventListener('input',renderAssetList);
els.replaceInput.addEventListener('change',async e=>{const f=e.target.files[0];if(f)await replaceSelectedAsset(f);e.target.value='';});
els.restoreAssetBtn.addEventListener('click',restoreSelected);els.exportAssetBtn.addEventListener('click',exportSelectedPng);
els.resetNavBtn.addEventListener('click',()=>{state.nav={categoryPos:0,itemPos:0,secondPos:0,level:1};state.animationStart=performance.now();});
els.toggleGridBtn.addEventListener('click',()=>state.showGuides=!state.showGuides);
[els.themeName,els.productId,els.version,els.themeColor].forEach(e=>e.addEventListener('input',()=>{setDirty(true);if(state.theme)els.viewerStatus.textContent=`${els.themeName.value||state.sourceName} · ${state.assets.length} assets`;}));
$$('.seg').forEach(b=>b.addEventListener('click',()=>{$$('.seg').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.viewMode=b.dataset.view;}));
window.addEventListener('keydown',e=>{if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement.tagName))return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' ','Escape'].includes(e.key)){e.preventDefault();moveNav(e.key);}});
['dragenter','dragover'].forEach(ev=>els.dropZone.addEventListener(ev,e=>{e.preventDefault();els.dropZone.classList.add('dragging');}));
['dragleave','drop'].forEach(ev=>els.dropZone.addEventListener(ev,e=>{e.preventDefault();els.dropZone.classList.remove('dragging');}));
els.dropZone.addEventListener('drop',async e=>{const f=[...e.dataTransfer.files].find(x=>x.name.toLowerCase().endsWith('.ptf'));if(f)await loadThemeBuffer(await f.arrayBuffer(),f.name);else toast('No PTF file found','Drop a file ending in .ptf.','error');});
function setHelpMenu(open){
  els.helpMenu.classList.toggle('hidden',!open);
  els.helpMenuBtn.setAttribute('aria-expanded',open?'true':'false');
}
function openAbout(){setHelpMenu(false);els.aboutModal.classList.remove('hidden');}
function closeAbout(){els.aboutModal.classList.add('hidden');}
els.helpMenuBtn.addEventListener('click',e=>{e.stopPropagation();setHelpMenu(els.helpMenu.classList.contains('hidden'));});
els.aboutBtn.addEventListener('click',openAbout);
els.creditsBtn.addEventListener('click',openAbout);
els.closeAboutBtn.addEventListener('click',closeAbout);
els.modalCloseButton.addEventListener('click',closeAbout);
els.aboutModal.addEventListener('click',e=>{if(e.target===els.aboutModal)closeAbout();});
document.addEventListener('click',e=>{if(!els.helpMenu.contains(e.target)&&e.target!==els.helpMenuBtn)setHelpMenu(false);});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!els.aboutModal.classList.contains('hidden')){e.preventDefault();closeAbout();}});

window.addEventListener('beforeunload',e=>{if(state.dirty){e.preventDefault();e.returnValue='';}});

updateUiEnabled();
