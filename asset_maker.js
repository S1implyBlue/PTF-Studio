/* PTF Studio 1.0 — built-in PSP Asset Maker */
'use strict';

const MAKER_PRESETS = Object.freeze({
  wallpaper:{label:'Wallpaper',width:480,height:272,indexed:false,roleTypes:['wallpaper']},
  previewImage:{label:'Preview image',width:300,height:170,indexed:false,roleTypes:['previewImage']},
  category:{label:'Category icon',width:64,height:48,indexed:true,roleTypes:['category']},
  firstBody:{label:'First-level icon',width:48,height:48,indexed:true,roleTypes:['firstBody']},
  firstFocus:{label:'First-level focus',width:64,height:64,indexed:true,roleTypes:['firstFocus']},
  secondBody:{label:'Second-level icon',width:32,height:32,indexed:true,roleTypes:['secondBody']},
  secondFocus:{label:'Second-level focus',width:48,height:48,indexed:true,roleTypes:['secondFocus']},
  previewIcon:{label:'Preview icon',width:16,height:16,indexed:true,roleTypes:['previewIcon']}
});

const makerEls = {
  openBtn: document.querySelector('#assetMakerBtn'),
  modal: document.querySelector('#assetMakerModal'),
  preset: document.querySelector('#makerPreset'),
  newBtn: document.querySelector('#makerNewBtn'),
  importBtn: document.querySelector('#makerImportBtn'),
  importInput: document.querySelector('#makerImportInput'),
  canvas: document.querySelector('#makerCanvas'),
  docInfo: document.querySelector('#makerDocInfo'),
  paletteInfo: document.querySelector('#makerPaletteInfo'),
  palettePreview: document.querySelector('#makerPalettePreview'),
  grid: document.querySelector('#makerGrid'),
  xmbGuides: document.querySelector('#makerXmbGuides'),
  xmbOverlay: document.querySelector('#makerXmbOverlay'),
  layers: document.querySelector('#makerLayers'),
  emptyLayers: document.querySelector('#makerEmptyLayers'),
  addRect: document.querySelector('#makerAddRect'),
  addRoundRect: document.querySelector('#makerAddRoundRect'),
  addCircle: document.querySelector('#makerAddCircle'),
  addLine: document.querySelector('#makerAddLine'),
  undo: document.querySelector('#makerUndo'),
  redo: document.querySelector('#makerRedo'),
  duplicate: document.querySelector('#makerDuplicate'),
  delete: document.querySelector('#makerDelete'),
  layerUp: document.querySelector('#makerLayerUp'),
  layerDown: document.querySelector('#makerLayerDown'),
  layerName: document.querySelector('#makerLayerName'),
  layerVisible: document.querySelector('#makerLayerVisible'),
  posX: document.querySelector('#makerX'),
  posY: document.querySelector('#makerY'),
  width: document.querySelector('#makerWidth'),
  height: document.querySelector('#makerHeight'),
  lockAspect: document.querySelector('#makerLockAspect'),
  rotation: document.querySelector('#makerRotation'),
  opacity: document.querySelector('#makerOpacity'),
  opacityValue: document.querySelector('#makerOpacityValue'),
  fill: document.querySelector('#makerFill'),
  fill2: document.querySelector('#makerFill2'),
  gradient: document.querySelector('#makerGradient'),
  stroke: document.querySelector('#makerStroke'),
  strokeWidth: document.querySelector('#makerStrokeWidth'),
  brightness: document.querySelector('#makerBrightness'),
  contrast: document.querySelector('#makerContrast'),
  saturation: document.querySelector('#makerSaturation'),
  tint: document.querySelector('#makerTint'),
  tintStrength: document.querySelector('#makerTintStrength'),
  outlineWidth: document.querySelector('#makerOutlineWidth'),
  outlineColor: document.querySelector('#makerOutlineColor'),
  shadow: document.querySelector('#makerShadow'),
  shadowColor: document.querySelector('#makerShadowColor'),
  shadowX: document.querySelector('#makerShadowX'),
  shadowY: document.querySelector('#makerShadowY'),
  glowRadius: document.querySelector('#makerGlowRadius'),
  glowColor: document.querySelector('#makerGlowColor'),
  propertyPanel: document.querySelector('#makerPropertyPanel'),
  noSelection: document.querySelector('#makerNoSelection'),
  target: document.querySelector('#makerTarget'),
  apply: document.querySelector('#makerApplyBtn'),
  applyPreview: document.querySelector('#makerApplyPreviewBtn'),
  useCurrent: document.querySelector('#makerUseCurrentBtn'),
  focus: document.querySelector('#makerFocusBtn'),
  exportPng: document.querySelector('#makerExportPngBtn'),
  status: document.querySelector('#makerStatus'),
  editSelected: document.querySelector('#editInMakerBtn')
};

const makerCtx = makerEls.canvas?.getContext('2d', {willReadFrequently:true});
const makerState = {
  presetKey:'firstBody',
  layers:[],
  selectedId:null,
  history:[],
  future:[],
  nextId:1,
  drag:null,
  lastRender:null,
  targetKey:null,
  generatedPspFocus:false
};

function makerPreset(){ return MAKER_PRESETS[makerState.presetKey]; }
function makerLayer(){ return makerState.layers.find(layer=>layer.id===makerState.selectedId) || null; }
function makerCloneImageData(image){ return image ? new ImageData(new Uint8ClampedArray(image.data),image.width,image.height) : null; }
function makerCloneLayer(layer){ return {...layer, source:makerCloneImageData(layer.source)}; }
function makerSnapshot(){ return {presetKey:makerState.presetKey,layers:makerState.layers.map(makerCloneLayer),selectedId:makerState.selectedId,nextId:makerState.nextId,generatedPspFocus:makerState.generatedPspFocus}; }
function makerRestore(snapshot){
  makerState.presetKey=snapshot.presetKey;
  makerState.layers=snapshot.layers.map(makerCloneLayer);
  makerState.selectedId=snapshot.selectedId;
  makerState.nextId=snapshot.nextId;
  makerState.generatedPspFocus=!!snapshot.generatedPspFocus;
  makerEls.preset.value=makerState.presetKey;
  makerRefreshTargets();
  makerRenderAll();
}
function makerPushHistory(){
  makerState.history.push(makerSnapshot());
  makerState.generatedPspFocus=false;
  if(makerState.history.length>24)makerState.history.shift();
  makerState.future=[];
  makerUpdateButtons();
}
function makerUndo(){
  if(!makerState.history.length)return;
  makerState.future.push(makerSnapshot());
  makerRestore(makerState.history.pop());
}
function makerRedo(){
  if(!makerState.future.length)return;
  makerState.history.push(makerSnapshot());
  makerRestore(makerState.future.pop());
}
function makerDefaultLayer(name,type){
  const p=makerPreset();
  return {
    id:makerState.nextId++,name,type,visible:true,x:p.width/2,y:p.height/2,width:Math.max(1,Math.round(p.width*.55)),height:Math.max(1,Math.round(p.height*.55)),rotation:0,opacity:1,
    fill:'#ffffff',fill2:'#64b8ff',gradient:false,stroke:'#000000',strokeWidth:0,
    brightness:100,contrast:100,saturation:100,tint:'#ffffff',tintStrength:0,
    outlineWidth:0,outlineColor:'#ffffff',shadow:false,shadowColor:'#000000',shadowX:1,shadowY:1,glowRadius:0,glowColor:'#ffffff',source:null
  };
}
function makerNewDocument(presetKey=makerState.presetKey,{skipConfirm=false}={}){
  if(!skipConfirm&&makerState.layers.length&&!confirm('Clear the current Asset Maker canvas?'))return false;
  makerState.presetKey=presetKey;
  makerState.layers=[];makerState.selectedId=null;makerState.history=[];makerState.future=[];makerState.generatedPspFocus=false;makerState.nextId=1;
  makerEls.preset.value=presetKey;
  makerRefreshTargets();makerRenderAll();return true;
}
function makerNewFromAsset(asset){
  const key=asset?.role?.type;
  if(!MAKER_PRESETS[key]||!asset.imageData){toast('Asset cannot be edited here','Select a supported image asset.','error');return;}
  makerNewDocument(key,{skipConfirm:true});
  const p=makerPreset(),layer=makerDefaultLayer(asset.role.label,'image');
  layer.source=makerCloneImageData(asset.imageData);layer.width=p.width;layer.height=p.height;layer.x=p.width/2;layer.y=p.height/2;
  makerState.layers=[layer];makerState.selectedId=layer.id;makerState.targetKey=`${asset.objIdx}:${asset.subIdx}`;
  makerRefreshTargets();makerEls.target.value=makerState.targetKey;
  openModal(makerEls.modal);
  requestAnimationFrame(()=>requestAnimationFrame(makerRenderAll));
}
function makerAddLayer(layer){ makerPushHistory();makerState.layers.push(layer);makerState.selectedId=layer.id;makerRenderAll(); }
function makerAddShape(type){
  const names={rect:'Rectangle',roundRect:'Rounded rectangle',circle:'Circle',line:'Line'};
  const layer=makerDefaultLayer(names[type],type);
  if(type==='line'){layer.height=1;layer.strokeWidth=1;layer.fill='#ffffff';}
  makerAddLayer(layer);
}
async function makerImportFile(file){
  if(!file)return;
  try{
    const bmp=await createImageBitmap(file);let image;
    try{image=bitmapToImageData(bmp);}finally{bmp.close();}
    const p=makerPreset(),layer=makerDefaultLayer(file.name.replace(/\.[^.]+$/,''),'image');
    layer.source=image;
    const scale=Math.min(p.width/image.width,p.height/image.height,1);
    layer.width=Math.max(1,image.width*scale);layer.height=Math.max(1,image.height*scale);
    makerAddLayer(layer);
    toast('Artwork added',`${file.name} was added as a new layer.`,'success');
  }catch(error){console.error(error);toast('Could not import artwork',error.message,'error');}
}
function makerDeleteLayer(){
  const layer=makerLayer();if(!layer)return;
  makerPushHistory();const index=makerState.layers.indexOf(layer);makerState.layers.splice(index,1);
  makerState.selectedId=makerState.layers[Math.min(index,makerState.layers.length-1)]?.id??null;makerRenderAll();
}
function makerDuplicateLayer(){
  const layer=makerLayer();if(!layer)return;
  makerPushHistory();const copy=makerCloneLayer(layer);copy.id=makerState.nextId++;copy.name=`${layer.name} copy`;copy.x+=2;copy.y+=2;
  const index=makerState.layers.indexOf(layer);makerState.layers.splice(index+1,0,copy);makerState.selectedId=copy.id;makerRenderAll();
}
function makerMoveLayer(delta){
  const layer=makerLayer();if(!layer)return;
  const index=makerState.layers.indexOf(layer),next=Math.max(0,Math.min(makerState.layers.length-1,index+delta));if(next===index)return;
  makerPushHistory();makerState.layers.splice(index,1);makerState.layers.splice(next,0,layer);makerRenderAll();
}

function makerRoundedPath(c,x,y,w,h,r){
  r=Math.min(Math.abs(r),Math.abs(w)/2,Math.abs(h)/2);c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath();
}
function makerDrawBase(c,layer,p){
  c.save();c.translate(layer.x,layer.y);c.rotate(layer.rotation*Math.PI/180);c.globalAlpha=Math.max(0,Math.min(1,layer.opacity));
  const x=-layer.width/2,y=-layer.height/2,w=layer.width,h=layer.height;
  if(layer.type==='image'&&layer.source){
    c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    c.filter=`brightness(${layer.brightness}%) contrast(${layer.contrast}%) saturate(${layer.saturation}%)`;
    c.drawImage(imageDataToCanvas(layer.source),x,y,w,h);c.filter='none';
  }else{
    const gradient=layer.gradient?c.createLinearGradient(x,y,x+w,y+h):null;
    if(gradient){gradient.addColorStop(0,layer.fill);gradient.addColorStop(1,layer.fill2);}
    c.fillStyle=gradient||layer.fill;c.strokeStyle=layer.stroke;c.lineWidth=Math.max(0,layer.strokeWidth);
    if(layer.type==='rect'){c.beginPath();c.rect(x,y,w,h);}
    else if(layer.type==='roundRect')makerRoundedPath(c,x,y,w,h,Math.min(w,h)*.2);
    else if(layer.type==='circle'){c.beginPath();c.ellipse(0,0,Math.abs(w)/2,Math.abs(h)/2,0,0,Math.PI*2);}
    else if(layer.type==='line'){c.beginPath();c.moveTo(x,0);c.lineTo(x+w,0);c.lineWidth=Math.max(1,layer.strokeWidth||1);c.strokeStyle=layer.fill;}
    if(layer.type!=='line'){c.fill();if(layer.strokeWidth>0)c.stroke();}else c.stroke();
  }
  c.restore();
}
function makerTintLayerCanvas(canvas,layer){
  if(layer.tintStrength<=0)return canvas;
  const tc=document.createElement('canvas');tc.width=canvas.width;tc.height=canvas.height;const c=tc.getContext('2d');c.drawImage(canvas,0,0);c.globalCompositeOperation='source-atop';c.globalAlpha=Math.max(0,Math.min(1,layer.tintStrength/100));c.fillStyle=layer.tint;c.fillRect(0,0,tc.width,tc.height);return tc;
}
function makerLayerCanvas(layer,p){
  const c=document.createElement('canvas');c.width=p.width;c.height=p.height;makerDrawBase(c.getContext('2d'),layer,p);return makerTintLayerCanvas(c,layer);
}
function makerColorMask(layerCanvas,color){
  const mask=document.createElement('canvas');mask.width=layerCanvas.width;mask.height=layerCanvas.height;const mc=mask.getContext('2d');mc.drawImage(layerCanvas,0,0);mc.globalCompositeOperation='source-in';mc.fillStyle=color;mc.fillRect(0,0,mask.width,mask.height);return mask;
}
function makerDrawEffectLayer(out,layerCanvas,layer){
  const c=out;
  if(layer.shadow){const mask=makerColorMask(layerCanvas,layer.shadowColor);c.save();c.globalAlpha=.62;c.drawImage(mask,layer.shadowX,layer.shadowY);c.restore();}
  if(layer.glowRadius>0){const mask=makerColorMask(layerCanvas,layer.glowColor);c.save();c.globalAlpha=.68;c.filter=`blur(${Math.min(3,Math.max(0,layer.glowRadius))}px)`;c.drawImage(mask,0,0);c.restore();}
  if(layer.outlineWidth>0){
    const n=Math.min(3,Math.max(1,Math.round(layer.outlineWidth))),mask=makerColorMask(layerCanvas,layer.outlineColor);
    for(let y=-n;y<=n;y++)for(let x=-n;x<=n;x++)if(x||y)c.drawImage(mask,x,y);
  }
  c.drawImage(layerCanvas,0,0);
}
function makerQuantizedImageData(imageData){
  const q=quantize(imageData,256,els.ditherToggle.checked),out=new ImageData(imageData.width,imageData.height);
  for(let i=0;i<q.indices.length;i++){const p=q.palette[q.indices[i]],o=i*4;out.data[o]=p[0];out.data[o+1]=p[1];out.data[o+2]=p[2];out.data[o+3]=p[3];}
  return {imageData:out,used:q.used};
}
function makerOutput({palettePreview=false}={}){
  const p=makerPreset(),canvas=document.createElement('canvas');canvas.width=p.width;canvas.height=p.height;const c=canvas.getContext('2d',{willReadFrequently:true});
  for(const layer of makerState.layers){if(!layer.visible)continue;makerDrawEffectLayer(c,makerLayerCanvas(layer,p),layer);}
  let imageData=c.getImageData(0,0,p.width,p.height),used=countColors(imageData,257);
  if(palettePreview&&p.indexed){const result=makerQuantizedImageData(imageData);imageData=result.imageData;used=result.used;c.clearRect(0,0,p.width,p.height);c.putImageData(imageData,0,0);}
  return {canvas,imageData,used};
}
function makerSyncCanvasResolution(){
  if(!makerEls.canvas)return false;
  const bounds=makerEls.canvas.getBoundingClientRect();
  if(bounds.width<2||bounds.height<2)return false;
  const dpr=Math.max(1,Math.min(2,window.devicePixelRatio||1));
  const width=Math.max(1,Math.round(bounds.width*dpr));
  const height=Math.max(1,Math.round(bounds.height*dpr));
  if(makerEls.canvas.width===width&&makerEls.canvas.height===height)return false;
  makerEls.canvas.width=width;
  makerEls.canvas.height=height;
  return true;
}
function makerDisplayRect(){
  const p=makerPreset(),margin=Math.max(24,Math.round(Math.min(makerEls.canvas.width,makerEls.canvas.height)*.055)),W=makerEls.canvas.width,H=makerEls.canvas.height,scale=Math.min((W-margin*2)/p.width,(H-margin*2)/p.height);return {x:(W-p.width*scale)/2,y:(H-p.height*scale)/2,w:p.width*scale,h:p.height*scale,scale};
}
function makerRenderCanvas(){
  if(!makerCtx)return;
  makerSyncCanvasResolution();
  const W=makerEls.canvas.width,H=makerEls.canvas.height,rect=makerDisplayRect(),p=makerPreset();makerCtx.clearRect(0,0,W,H);makerCtx.fillStyle='#090b0e';makerCtx.fillRect(0,0,W,H);
  const tile=12;for(let y=rect.y;y<rect.y+rect.h;y+=tile)for(let x=rect.x;x<rect.x+rect.w;x+=tile){makerCtx.fillStyle=(((x-rect.x)/tile+(y-rect.y)/tile)&1)?'#232830':'#181c22';makerCtx.fillRect(x,y,Math.min(tile,rect.x+rect.w-x),Math.min(tile,rect.y+rect.h-y));}
  const output=makerOutput({palettePreview:makerEls.palettePreview.checked});makerState.lastRender=output;
  makerCtx.imageSmoothingEnabled=true;makerCtx.imageSmoothingQuality='high';makerCtx.drawImage(output.canvas,rect.x,rect.y,rect.w,rect.h);
  if(makerEls.grid.checked){makerCtx.save();const step=Math.max(1,Math.round(Math.min(p.width,p.height)/8));const drawGrid=()=>{for(let x=step;x<p.width;x+=step){const px=rect.x+x*rect.scale;makerCtx.beginPath();makerCtx.moveTo(px,rect.y);makerCtx.lineTo(px,rect.y+rect.h);makerCtx.stroke();}for(let y=step;y<p.height;y+=step){const py=rect.y+y*rect.scale;makerCtx.beginPath();makerCtx.moveTo(rect.x,py);makerCtx.lineTo(rect.x+rect.w,py);makerCtx.stroke();}};makerCtx.strokeStyle='rgba(0,0,0,.62)';makerCtx.lineWidth=3;drawGrid();makerCtx.strokeStyle='rgba(84,225,255,.72)';makerCtx.lineWidth=1.25;makerCtx.shadowColor='rgba(44,207,255,.45)';makerCtx.shadowBlur=3;drawGrid();makerCtx.restore();}
  if(makerEls.xmbGuides.checked){makerCtx.save();const drawSafe=()=>{makerCtx.strokeRect(rect.x+rect.w*.05,rect.y+rect.h*.05,rect.w*.9,rect.h*.9);makerCtx.beginPath();makerCtx.moveTo(rect.x+rect.w/2,rect.y);makerCtx.lineTo(rect.x+rect.w/2,rect.y+rect.h);makerCtx.moveTo(rect.x,rect.y+rect.h/2);makerCtx.lineTo(rect.x+rect.w,rect.y+rect.h/2);makerCtx.stroke();};makerCtx.setLineDash([9,6]);makerCtx.strokeStyle='rgba(0,0,0,.82)';makerCtx.lineWidth=5;drawSafe();makerCtx.strokeStyle='rgba(255,219,92,.98)';makerCtx.lineWidth=2;makerCtx.shadowColor='rgba(255,202,64,.68)';makerCtx.shadowBlur=6;drawSafe();makerCtx.restore();}
  if(p===MAKER_PRESETS.wallpaper&&makerEls.xmbOverlay.checked&&state.theme){
    const cats=visibleCategoryAssets(),cat=cats[Math.max(0,Math.min(state.nav.categoryPos,cats.length-1))]||cats[0];
    if(cat?.imageData){
      const drawAsset=(asset,x,y,w,h,alpha=1)=>{if(!asset?.imageData)return;makerCtx.save();makerCtx.globalAlpha=alpha;makerCtx.imageSmoothingEnabled=true;makerCtx.imageSmoothingQuality='high';makerCtx.drawImage(imageDataToCanvas(asset.imageData),rect.x+x*rect.scale,rect.y+y*rect.scale,w*rect.scale,h*rect.scale);makerCtx.restore();};
      drawAsset(cat,109-32,72-24,64,48,1);
      const ids=visibleItemsForCategory(cat.subIdx),body=ids.length?bodyAsset(ids[0]):null,focus=body?focusAsset(body.subIdx):null;
      if(focus)drawAsset(focus,109-32,137-32,64,64,.72);
      if(body)drawAsset(body,109-24,137-24,48,48,1);
      makerCtx.save();makerCtx.scale(rect.scale,rect.scale);makerCtx.translate(rect.x/rect.scale,rect.y/rect.scale);makerCtx.font=`500 11px ${PSP_FONT_STACK}`;makerCtx.textAlign='center';makerCtx.fillStyle='rgba(248,248,246,.98)';makerCtx.shadowColor='rgba(0,0,0,.56)';makerCtx.shadowBlur=2.5;makerCtx.shadowOffsetX=1;makerCtx.shadowOffsetY=1.5;makerCtx.fillText(cat.role.label,109,104);if(body){makerCtx.font=`500 14px ${PSP_FONT_STACK}`;makerCtx.textAlign='left';makerCtx.fillText(body.role.label.replace(/\s+—\s+Body$/,''),149,143);}makerCtx.font=`500 13px ${PSP_FONT_STACK}`;makerCtx.textAlign='right';makerCtx.fillText(formatPspDateTime(),444,18);makerCtx.restore();
    }
  }
  const layer=makerLayer();if(layer){makerCtx.save();makerCtx.translate(rect.x+layer.x*rect.scale,rect.y+layer.y*rect.scale);makerCtx.rotate(layer.rotation*Math.PI/180);makerCtx.strokeStyle='#63b7ff';makerCtx.lineWidth=1.5;makerCtx.setLineDash([6,4]);makerCtx.strokeRect(-layer.width*rect.scale/2,-layer.height*rect.scale/2,layer.width*rect.scale,layer.height*rect.scale);makerCtx.restore();}
  makerEls.docInfo.textContent=`${p.label} · ${p.width} × ${p.height}px`;
  makerEls.paletteInfo.textContent=p.indexed?`${output.used} / 256 colors${makerEls.palettePreview.checked?' · PSP palette preview':''}`:'Full color PTF asset';
}
function makerLayerPoint(event){const b=makerEls.canvas.getBoundingClientRect(),rect=makerDisplayRect();return {x:((event.clientX-b.left)*(makerEls.canvas.width/b.width)-rect.x)/rect.scale,y:((event.clientY-b.top)*(makerEls.canvas.height/b.height)-rect.y)/rect.scale};}
function makerHitLayer(point){
  for(let i=makerState.layers.length-1;i>=0;i--){const l=makerState.layers[i];if(!l.visible)continue;const angle=-l.rotation*Math.PI/180,dx=point.x-l.x,dy=point.y-l.y,x=dx*Math.cos(angle)-dy*Math.sin(angle),y=dx*Math.sin(angle)+dy*Math.cos(angle);if(Math.abs(x)<=Math.abs(l.width)/2+1&&Math.abs(y)<=Math.abs(l.height)/2+1)return l;}
  return null;
}
function makerRenderLayers(){
  makerEls.layers.innerHTML='';makerEls.emptyLayers.classList.toggle('hidden',makerState.layers.length>0);
  [...makerState.layers].reverse().forEach(layer=>{const row=document.createElement('button');row.className=`makerLayerRow${layer.id===makerState.selectedId?' selected':''}`;row.innerHTML=`<span class="makerLayerEye">${layer.visible?'●':'○'}</span><span class="makerLayerText"></span><span class="makerLayerType">${layer.type}</span>`;row.querySelector('.makerLayerText').textContent=layer.name;row.addEventListener('click',()=>{makerState.selectedId=layer.id;makerRenderAll();});makerEls.layers.appendChild(row);});
}
function makerSetInput(element,value){if(document.activeElement!==element)element.value=value;}
function makerRenderProperties(){
  const l=makerLayer(),disabled=!l;makerEls.noSelection.classList.toggle('hidden',!disabled);makerEls.propertyPanel.classList.toggle('hidden',disabled);
  if(disabled)return;
  makerSetInput(makerEls.layerName,l.name);makerEls.layerVisible.checked=l.visible;makerSetInput(makerEls.posX,Math.round(l.x*100)/100);makerSetInput(makerEls.posY,Math.round(l.y*100)/100);makerSetInput(makerEls.width,Math.round(l.width*100)/100);makerSetInput(makerEls.height,Math.round(l.height*100)/100);makerSetInput(makerEls.rotation,l.rotation);makerSetInput(makerEls.opacity,Math.round(l.opacity*100));makerEls.opacityValue.textContent=`${Math.round(l.opacity*100)}%`;
  makerEls.fill.value=l.fill;makerEls.fill2.value=l.fill2;makerEls.gradient.checked=l.gradient;makerEls.stroke.value=l.stroke;makerSetInput(makerEls.strokeWidth,l.strokeWidth);
  makerSetInput(makerEls.brightness,l.brightness);makerSetInput(makerEls.contrast,l.contrast);makerSetInput(makerEls.saturation,l.saturation);makerEls.tint.value=l.tint;makerSetInput(makerEls.tintStrength,l.tintStrength);
  makerSetInput(makerEls.outlineWidth,l.outlineWidth);makerEls.outlineColor.value=l.outlineColor;makerEls.shadow.checked=l.shadow;makerEls.shadowColor.value=l.shadowColor;makerSetInput(makerEls.shadowX,l.shadowX);makerSetInput(makerEls.shadowY,l.shadowY);makerSetInput(makerEls.glowRadius,l.glowRadius);makerEls.glowColor.value=l.glowColor;
  const shape=l.type!=='image';document.querySelectorAll('.makerShapeOnly').forEach(e=>e.classList.toggle('controlDisabled',!shape));
}
function makerUpdateButtons(){
  const has=!!makerLayer();makerEls.undo.disabled=!makerState.history.length;makerEls.redo.disabled=!makerState.future.length;makerEls.duplicate.disabled=!has;makerEls.delete.disabled=!has;makerEls.layerUp.disabled=!has;makerEls.layerDown.disabled=!has;makerEls.focus.disabled=!['firstBody','secondBody'].includes(makerState.presetKey);
}
function makerRenderAll(){makerRenderCanvas();makerRenderLayers();makerRenderProperties();makerUpdateButtons();}
function makerRefreshTargets(){
  const p=makerPreset(),compatible=state.assets.filter(asset=>p.roleTypes.includes(asset.role.type));makerEls.target.innerHTML='';
  if(!compatible.length){const o=new Option(state.theme?'No compatible slots in this theme':'Import a PTF theme to apply assets','');makerEls.target.add(o);}
  for(const asset of compatible){const key=`${asset.objIdx}:${asset.subIdx}`,option=new Option(asset.role.label,key);makerEls.target.add(option);}
  if(makerState.targetKey&&compatible.some(a=>`${a.objIdx}:${a.subIdx}`===makerState.targetKey))makerEls.target.value=makerState.targetKey;
  else if(state.selectedAsset&&p.roleTypes.includes(state.selectedAsset.role.type))makerEls.target.value=`${state.selectedAsset.objIdx}:${state.selectedAsset.subIdx}`;
  makerEls.apply.disabled=!compatible.length;makerEls.applyPreview.disabled=!compatible.length;makerEls.useCurrent.disabled=!(state.selectedAsset&&p.roleTypes.includes(state.selectedAsset.role.type));
}
function makerTargetAsset(useCurrent=false){
  if(useCurrent){const a=state.selectedAsset,p=makerPreset();return a&&p.roleTypes.includes(a.role.type)?a:null;}
  const [obj,sub]=String(makerEls.target.value).split(':').map(Number);return getAsset(obj,sub);
}
function makerApplyToAsset(asset){
  if(!asset){toast('No compatible asset selected','Choose a matching PTF slot first.','error');return false;}
  const p=makerPreset();if(!p.roleTypes.includes(asset.role.type)){toast('Incompatible asset slot',`${p.label} cannot be applied to ${asset.role.label}.`,'error');return false;}
  const output=makerOutput({palettePreview:false});asset.imageData=makerCloneImageData(output.imageData);asset.paletteCount=countColors(asset.imageData,257);asset.edited=true;asset.decodeError=null;asset.pspGeneratedFocus=!!makerState.generatedPspFocus&&(asset.role.type==='firstFocus'||asset.role.type==='secondFocus');setDirty(true);renderAssetList();selectAsset(asset);makerState.targetKey=`${asset.objIdx}:${asset.subIdx}`;makerRefreshTargets();toast('Asset applied',`${p.label} was applied to ${asset.role.label}.`,'success');return true;
}
function makerApplyAndPreview(){const asset=makerTargetAsset(false);if(makerApplyToAsset(asset)){closeModal(makerEls.modal);state.viewMode='xmb';document.querySelectorAll('.seg').forEach(button=>button.classList.toggle('active',button.dataset.view==='xmb'));selectAsset(asset,{scroll:true});}}
function makerExport(){const output=makerOutput({palettePreview:false});output.canvas.toBlob(blob=>blob&&downloadBlob(blob,`${slugify(makerPreset().label)||'ptf_asset'}.png`),'image/png');}
function makerCreateFocus(){
  if(!['firstBody','secondBody'].includes(makerState.presetKey))return;
  makerPushHistory();const source=makerOutput({palettePreview:false}).imageData,next=makerState.presetKey==='firstBody'?'firstFocus':'secondFocus';makerState.presetKey=next;makerEls.preset.value=next;const p=makerPreset(),generated=generateFocusImage(source,p.width,p.height,{opacity:.9,blur:6}),layer=makerDefaultLayer('Sony-guideline focus','image');layer.source=generated;layer.width=p.width;layer.height=p.height;makerState.layers=[layer];makerState.selectedId=layer.id;makerState.generatedPspFocus=true;makerRefreshTargets();makerRenderAll();toast('PSP-safe focus generated','The icon was centred with an 8 px margin and converted to a white alpha-only halo.','success');
}

function makerBindProperty(element,property,parser=value=>value,{event='input',aspect=false}={}){
  element?.addEventListener(event,()=>{const l=makerLayer();if(!l)return;makerPushHistory();const oldW=l.width,oldH=l.height;l[property]=parser(element.type==='checkbox'?element.checked:element.value);if(aspect&&makerEls.lockAspect.checked&&oldW&&oldH){if(property==='width')l.height=l.width*(oldH/oldW);else if(property==='height')l.width=l.height*(oldW/oldH);}makerRenderAll();});
}
function makerOpen(){
  makerRefreshTargets();
  openModal(makerEls.modal);
  requestAnimationFrame(()=>requestAnimationFrame(makerRenderAll));
}

if(makerEls.modal){
  for(const [key,preset] of Object.entries(MAKER_PRESETS))makerEls.preset.add(new Option(`${preset.label} — ${preset.width} × ${preset.height}`,key));
  makerEls.preset.value=makerState.presetKey;
  makerEls.openBtn?.addEventListener('click',makerOpen);
  makerEls.editSelected?.addEventListener('click',()=>state.selectedAsset?makerNewFromAsset(state.selectedAsset):toast('No asset selected','Choose an asset first.','error'));
  makerEls.newBtn.addEventListener('click',()=>makerNewDocument(makerEls.preset.value));
  makerEls.preset.addEventListener('change',()=>{const requested=makerEls.preset.value;if(!makerNewDocument(requested))makerEls.preset.value=makerState.presetKey;});
  makerEls.importBtn.addEventListener('click',()=>makerEls.importInput.click());
  makerEls.importInput.addEventListener('change',async event=>{const file=event.target.files[0];if(file)await makerImportFile(file);event.target.value='';});
  makerEls.addRect.addEventListener('click',()=>makerAddShape('rect'));makerEls.addRoundRect.addEventListener('click',()=>makerAddShape('roundRect'));makerEls.addCircle.addEventListener('click',()=>makerAddShape('circle'));makerEls.addLine.addEventListener('click',()=>makerAddShape('line'));
  makerEls.undo.addEventListener('click',makerUndo);makerEls.redo.addEventListener('click',makerRedo);makerEls.duplicate.addEventListener('click',makerDuplicateLayer);makerEls.delete.addEventListener('click',makerDeleteLayer);makerEls.layerUp.addEventListener('click',()=>makerMoveLayer(1));makerEls.layerDown.addEventListener('click',()=>makerMoveLayer(-1));
  makerEls.grid.addEventListener('change',makerRenderCanvas);makerEls.xmbGuides.addEventListener('change',makerRenderCanvas);makerEls.xmbOverlay.addEventListener('change',makerRenderCanvas);makerEls.palettePreview.addEventListener('change',makerRenderCanvas);
  makerEls.target.addEventListener('change',()=>{makerState.targetKey=makerEls.target.value;});
  makerEls.apply.addEventListener('click',()=>makerApplyToAsset(makerTargetAsset(false)));makerEls.applyPreview.addEventListener('click',makerApplyAndPreview);makerEls.useCurrent.addEventListener('click',()=>makerApplyToAsset(makerTargetAsset(true)));makerEls.exportPng.addEventListener('click',makerExport);makerEls.focus.addEventListener('click',makerCreateFocus);

  makerBindProperty(makerEls.layerName,'name',String,{event:'change'});makerBindProperty(makerEls.layerVisible,'visible',Boolean,{event:'change'});makerBindProperty(makerEls.posX,'x',Number,{event:'change'});makerBindProperty(makerEls.posY,'y',Number,{event:'change'});makerBindProperty(makerEls.width,'width',value=>Math.max(.25,Number(value)),{event:'change',aspect:true});makerBindProperty(makerEls.height,'height',value=>Math.max(.25,Number(value)),{event:'change',aspect:true});makerBindProperty(makerEls.rotation,'rotation',Number,{event:'change'});makerBindProperty(makerEls.opacity,'opacity',value=>Math.max(0,Math.min(1,Number(value)/100)),{event:'change'});
  makerBindProperty(makerEls.fill,'fill',String,{event:'change'});makerBindProperty(makerEls.fill2,'fill2',String,{event:'change'});makerBindProperty(makerEls.gradient,'gradient',Boolean,{event:'change'});makerBindProperty(makerEls.stroke,'stroke',String,{event:'change'});makerBindProperty(makerEls.strokeWidth,'strokeWidth',value=>Math.max(0,Math.min(4,Number(value))),{event:'change'});
  makerBindProperty(makerEls.brightness,'brightness',value=>Math.max(25,Math.min(200,Number(value))),{event:'change'});makerBindProperty(makerEls.contrast,'contrast',value=>Math.max(25,Math.min(200,Number(value))),{event:'change'});makerBindProperty(makerEls.saturation,'saturation',value=>Math.max(0,Math.min(200,Number(value))),{event:'change'});makerBindProperty(makerEls.tint,'tint',String,{event:'change'});makerBindProperty(makerEls.tintStrength,'tintStrength',value=>Math.max(0,Math.min(100,Number(value))),{event:'change'});
  makerBindProperty(makerEls.outlineWidth,'outlineWidth',value=>Math.max(0,Math.min(3,Number(value))),{event:'change'});makerBindProperty(makerEls.outlineColor,'outlineColor',String,{event:'change'});makerBindProperty(makerEls.shadow,'shadow',Boolean,{event:'change'});makerBindProperty(makerEls.shadowColor,'shadowColor',String,{event:'change'});makerBindProperty(makerEls.shadowX,'shadowX',value=>Math.max(-4,Math.min(4,Number(value))),{event:'change'});makerBindProperty(makerEls.shadowY,'shadowY',value=>Math.max(-4,Math.min(4,Number(value))),{event:'change'});makerBindProperty(makerEls.glowRadius,'glowRadius',value=>Math.max(0,Math.min(3,Number(value))),{event:'change'});makerBindProperty(makerEls.glowColor,'glowColor',String,{event:'change'});

  makerEls.opacity.addEventListener('input',()=>{makerEls.opacityValue.textContent=`${makerEls.opacity.value}%`;});
  makerEls.canvas.addEventListener('pointerdown',event=>{const point=makerLayerPoint(event),layer=makerHitLayer(point);if(!layer){makerState.selectedId=null;makerRenderAll();return;}makerState.selectedId=layer.id;makerPushHistory();makerState.drag={id:layer.id,dx:point.x-layer.x,dy:point.y-layer.y};makerEls.canvas.setPointerCapture(event.pointerId);makerRenderAll();});
  makerEls.canvas.addEventListener('pointermove',event=>{if(!makerState.drag)return;const layer=makerState.layers.find(l=>l.id===makerState.drag.id);if(!layer)return;const p=makerLayerPoint(event),preset=makerPreset();layer.x=Math.max(-preset.width,Math.min(preset.width*2,p.x-makerState.drag.dx));layer.y=Math.max(-preset.height,Math.min(preset.height*2,p.y-makerState.drag.dy));makerRenderAll();});
  makerEls.canvas.addEventListener('pointerup',event=>{makerState.drag=null;if(makerEls.canvas.hasPointerCapture(event.pointerId))makerEls.canvas.releasePointerCapture(event.pointerId);});
  makerEls.canvas.addEventListener('dragover',event=>event.preventDefault());makerEls.canvas.addEventListener('drop',async event=>{event.preventDefault();const file=[...event.dataTransfer.files].find(f=>f.type.startsWith('image/'));if(file)await makerImportFile(file);});
  if(typeof ResizeObserver!=='undefined'){
    const makerResizeObserver=new ResizeObserver(()=>{
      if(!makerEls.modal.classList.contains('hidden'))makerRenderCanvas();
    });
    makerResizeObserver.observe(makerEls.canvas);
  }
  window.addEventListener('resize',()=>{if(!makerEls.modal.classList.contains('hidden'))makerRenderCanvas();});
  makerNewDocument('firstBody',{skipConfirm:true});
}
