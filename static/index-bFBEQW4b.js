(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function i(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=i(s);fetch(s.href,n)}})();const M="controlsHidden",O="controlsShown";AFRAME.registerComponent("controls",{init:function(){this.system.register(this.el)},remove:function(){this.system.unregister(this.el)}});AFRAME.registerSystem("controls",{init:function(){this.entities=[],this.clickables=[]},register:function(e){this.entities.push(e)},unregister:function(e){var t=this.entities.indexOf(e);this.entities.splice(t,1)},hideControls:function(){for(let e in this.entities){let t=this.entities[e];this.clickables.push(t.hasAttribute("clickable")),this.clickables.at(-1)&&t.removeAttribute("clickable"),t.object3D.visible=!1}this.el.emit(M)},showControls:function(){for(let e in this.entities){let t=this.entities[e];this.clickables[e]&&t.setAttribute("clickable",""),t.object3D.visible=!0}this.clickables=[],this.el.emit(O)}});function $(e,t){return e==="#FFF"&&(t*=-1),"#"+e.replace(/^#/,"").replace(/../g,i=>("0"+Math.min(255,Math.max(0,parseInt(i,16)+t)).toString(16)).substr(-2))}function k(e){isNaN(e)&&(e=0);var t=new Date(null);return t.setSeconds(e),t.toISOString().substr(11,8)}function D(e){return e.replace(/^.*[\\/]/,"")}function _(e,{width:t,height:i,depth:r}){var s=document.createElement("a-entity");return s.setAttribute("geometry",{primitive:"box",width:t,height:i,depth:r}),s.setAttribute("material",{color:"#4CC3D9"}),e.appendChild(s),s}function U(e){var t=document.createElement("a-text");return t.setAttribute("position","0 0.3 0"),t.setAttribute("align","center"),t.setAttribute("value","00:00:00"),e.appendChild(t),t}function H(e,{width:t,height:i,depth:r}){var s=document.createElement("a-entity");let n=e.getAttribute("position");return s.setAttribute("visible",!1),s.setAttribute("geometry",{primitive:"box",width:t,height:i,depth:r}),s.setAttribute("position",n),s.setAttribute("material",{color:"#00FF00"}),e.insertAdjacentElement("afterend",s),s}function K(e){let{width:t,height:i}=e.getAttribute("geometry"),r=e.getAttribute("position");var s=document.createElement("a-entity");s.setAttribute("geometry",{primitive:"plane",width:t+.05,height:i+.05}),s.setAttribute("material",{color:$(e.getAttribute("material").color,-40)}),s.setAttribute("position",r)}function G(e){var t=document.createElement("a-entity");return t.setAttribute("position","0 0 0"),t.setAttribute("geometry",{primitive:"plane",width:1.5,height:.15}),t.setAttribute("text",{value:"00:00:00/00:00:00",width:2,align:"center"}),t.setAttribute("material",{color:"#333",opacity:.5}),e.appendChild(t),t}AFRAME.registerComponent("timeline",{schema:{videoId:{type:"string",default:"video"}},init:function(){var e=this.el;this.video=document.getElementById(this.data.videoId);let{width:t,height:i}=e.getAttribute("geometry");this.seek=_(e,{width:t*.015,height:i,depth:.015}),this.hoverEl=H(this.seek,{width:t*.01,height:i+.01,depth:.01}),this.hoverTextEl=U(this.hoverEl),this.bg=K(e),this.videoText=G(e),this.timelineWidth=timeline.getAttribute("geometry").width,this.seek.setAttribute("position",{x:-this.timelineWidth/2}),this.updateElems=()=>{var r=this.video.currentTime/this.video.duration*this.timelineWidth-this.timelineWidth/2;this.seek.setAttribute("position",{x:r}),this.videoText.setAttribute("text",{value:`${k(this.video.currentTime)}/${k(this.video.duration)}`})},this.video.addEventListener("loadedmetadata",()=>{this.seek.setAttribute("position",{x:-this.timelineWidth/2}),this.videoText.setAttribute("text",{value:`${k(this.video.currentTime)}/${k(this.video.duration)}`})}),this.video.addEventListener("timeupdate",this.updateElems),e.addEventListener("click",r=>{let s=this.video;if(s.readyState===0){console.log("no info available for video");return}var n=r.detail.intersection.uv.x;s.currentTime=(n*s.duration).toFixed(2)}),e.addEventListener("raycaster-intersected",r=>{this.raycaster=r.detail.el,this.hoverEl.setAttribute("visible",!0)}),e.addEventListener("raycaster-intersected-cleared",r=>{this.raycaster=null,this.hoverEl.setAttribute("visible",!1)})},tick:function(){var a,h,b;if(!this.raycaster)return;let e=this.raycaster.components.raycaster.getIntersection(this.el);if(!e||e.point.x===((a=this.previousIntersection)==null?void 0:a.x)&&e.point.y===((h=this.previousIntersection)==null?void 0:h.y)&&e.point.z===((b=this.previousIntersection)==null?void 0:b.z))return;let t=e.uv.x,i=timeline.getAttribute("geometry").width,r=t*i-i/2,s=Math.floor(t*video.duration),{y:n,z:o}=this.hoverEl.getAttribute("position");this.hoverEl.setAttribute("position",`${r} ${n} ${o}`),this.hoverTextEl.setAttribute("value",k(s)),this.previousIntersection=e.point},remove:function(){var e=this.el;e.setAttribute("controls")}});AFRAME.registerComponent("stereosphere",{schema:{eye:{type:"string",default:"left"},mode:{type:"string",default:"180SbsEq"},side:{type:"string",default:"left"},fishFov:{type:"int",default:180}},update:function(e){let t=this.el.object3D.children[0],i=this.data;if(i.mode==="180SbsEq"){let r=this.el.getAttribute("geometry"),s=new THREE.SphereGeometry(r.radius||100,r.segmentsWidth||32,r.segmentsHeight||32,Math.PI,Math.PI,0,Math.PI),n={repeat:{x:-.5,y:1},offset:{x:.5,y:0}};i.side==="right"&&(n.offset.x+=.5);let o=s.attributes.uv;for(let a=0;a<o.count;a++){const h=o.getX(a),b=o.getY(a);o.setXY(a,h*n.repeat.x+n.offset.x,b*n.repeat.y+n.offset.y)}o.needsUpdate=!0,t.geometry=s}else if(i.mode==="SbsFish"){let r=Math.PI;if(i.fishFov){let h=i.fishFov-180;r+=Math.PI/180*h}let s=this.el.getAttribute("geometry"),n=new THREE.SphereGeometry(s.radius||100,s.segmentsWidth||32,s.segmentsHeight||32),o={repeat:{x:.5,y:1},offset:{x:0,y:0}};i.side==="right"&&(o.offset.x+=.5),n.rotateX(-Math.PI/2),n.rotateY(Math.PI);let a=n.attributes.uv;for(let h=0;h<a.count;h++){const b=a.getX(h),u=a.getY(h),c=2*Math.PI*b,l=Math.PI*u/r,y=.5+l*Math.cos(c),j=.5+l*Math.sin(c);a.setXY(h,y*o.repeat.x+o.offset.x,j*o.repeat.y+o.offset.y)}a.needsUpdate=!0,t.geometry=n}i.eye==="left"?t.layers.set(1):i.eye==="right"?t.layers.set(2):t.layers.set(0)}});AFRAME.registerComponent("stereocam",{schema:{eye:{type:"string",default:"left"}},init:function(){this.layer_changed=!1},tick:function(e){var t=this.data;if(!this.layer_changed){var i;this.el.object3D.children.forEach(function(r){r.type=="PerspectiveCamera"&&(i=r)}),i?t.eye==="left"?(i.layers.enable(1),i.layers.disable(2)):t.eye==="right"?(i.layers.enable(2),i.layers.disable(1)):(i.layers.enable(1),i.layers.enable(2)):console.error("stereocam: Camera not found")}}});AFRAME.registerComponent("button-highlight",{init:function(){this.color=this.el.getAttribute("material").color,this.el.addEventListener("raycaster-intersected",e=>{this.el.setAttribute("material",{color:$(this.color,40)})}),this.el.addEventListener("raycaster-intersected-cleared",e=>{this.el.setAttribute("material",{color:this.color})})}});AFRAME.registerComponent("recenter",{schema:{},init:function(){var e=this.el;const t=document.getElementById("rightEye");this.camera=document.getElementById("camera"),this.recenterCamera=!1,this.controlsVisible=!0,e.sceneEl.addEventListener("enter-vr",()=>{this.recenterCamera=!0}),e.sceneEl.addEventListener("exit-vr",()=>{this.recenterCamera=!1}),e.sceneEl.addEventListener(M,()=>{this.controlsVisible=!1}),e.sceneEl.addEventListener(O,()=>{this.controlsVisible=!0}),e.addEventListener("click",i=>{if(i.detail.intersectedEl===e){if(!this.controlsVisible){e.sceneEl.systems.controls.showControls(),t.setAttribute("visible",!1);return}this.recenterCamera&&e.setAttribute("rotation",{y:-this.camera.getAttribute("rotation").y})}})}});AFRAME.registerComponent("cursor-util",{schema:{},init:function(){let e=this.el;this.cursorChild=document.createElement("a-entity"),this.cursorChild.setAttribute("geometry","primitive: circle; radius: 0.0075;"),this.cursorChild.setAttribute("material","color: teal"),e.removeAttribute("geometry"),this.checkVR(),e.sceneEl.addEventListener("enter-vr",AFRAME.utils.bind(this.checkVR,this)),e.sceneEl.addEventListener("exit-vr",AFRAME.utils.bind(this.checkVR,this))},checkVR:function(){let e=this.el;AFRAME.utils.device.checkVRSupport()?(e.setAttribute("geometry","primitive: ring; radiusInner: 0.005; radiusOuter: 0.0075;"),e.setAttribute("material","color: white;"),e.appendChild(this.cursorChild)):(e.setAttribute("cursor","rayOrigin: mouse"),e.replaceChildren())}});const A="video-state",C=[{text:"180 SBS EQR",fn:()=>{leftEye.setAttribute("stereosphere","mode: 180SbsEq;"),rightEye.setAttribute("stereosphere","mode: 180SbsEq;")}},{text:"180 SBS FISH",fn:()=>{leftEye.setAttribute("stereosphere","mode: SbsFish; fishFov: 180"),rightEye.setAttribute("stereosphere","mode: SbsFish; fishFov: 180")}},{text:"190 SBS FISH",fn:()=>{leftEye.setAttribute("stereosphere","mode: SbsFish; fishFov: 190"),rightEye.setAttribute("stereosphere","mode: SbsFish; fishFov: 190")}},{text:"200 SBS FISH",fn:()=>{leftEye.setAttribute("stereosphere","mode: SbsFish; fishFov: 200"),rightEye.setAttribute("stereosphere","mode: SbsFish; fishFov: 200")}}];AFRAME.registerComponent(A,{schema:{src:{type:"string",default:"static/sample.mp4"},fileName:{type:"string",default:"sample.mp4"},preset:{type:"number",default:0}},init:function(){this.currentTime=AFRAME.utils.bind(this.currentTime,this)},update:function(e){var t=this.data;C[t.preset].fn(),e.src!==t.src&&e.src&&(d.video.src=t.src,d.video.play()),this.el.emit(A,{data:t,od:e})}});AFRAME.registerComponent("toggle-mode",{init:function(){this.el.addEventListener("click",()=>{let e=d.ascene.getAttribute(A).preset;d.ascene.setAttribute(A,{preset:(e+1)%C.length})}),d.ascene.addEventListener(A,e=>{let t=e.detail.data;this.el.setAttribute("value",C[t.preset].text)})}});AFRAME.registerComponent("adjust-camera",{init:function(){let e=this.el;e.sceneEl.addEventListener("enter-vr",function(){e.setAttribute("position",{y:-1.6})}),e.sceneEl.addEventListener("exit-vr",function(){e.setAttribute("position",{y:0})})}});function R(e){return new Promise((t,i)=>{e.oncomplete=e.onsuccess=()=>t(e.result),e.onabort=e.onerror=()=>i(e.error)})}function W(e,t){const i=indexedDB.open(e);i.onupgradeneeded=()=>i.result.createObjectStore(t);const r=R(i);return(s,n)=>r.then(o=>n(o.transaction(t,s).objectStore(t)))}let I;function V(){return I||(I=W("keyval-store","keyval")),I}function q(e,t=V()){return t("readonly",i=>R(i.get(e)))}function J(e,t,i=V()){return i("readwrite",r=>(r.put(t,e),R(r.transaction)))}function Y(e,t=V()){return t("readwrite",i=>(i.delete(e),R(i.transaction)))}async function X(e){const t={mode:"read"};return await e.queryPermission(t)==="granted"||await e.requestPermission(t)==="granted"}async function z(){try{let e=await q("fs");return e?(await X(e),e):(e=await window.showDirectoryPicker(),await J("fs",e),e)}catch(e){console.error(e)}}async function Q(e){let t=e.split("/").slice(1),i=await z();for(let a in t)i=await i.getDirectoryHandle(t[a]);let r=[];for await(const a of i.values())r.push(a);r=await Promise.all(r);let s=[],n=[],o=[];for(let a in r)r[a].kind==="file"?(s.push(r[a].name),o.push(r[a])):n.push(r[a].name);return{files:s,folders:n,fileHandles:o}}const Z="https://192.168.1.50:5000/file",m="dialog-files",p=6,E=-.23,L=.5;function T(e,t,i,r){let s=document.createElement("a-image");s.setAttribute("src",e),s.setAttribute("position",i),s.setAttribute("background-color","blue"),s.setAttribute("scale",r),t.appendChild(s)}async function ee(e,t){e.setAttribute("dialog-loading","");{let{files:i,folders:r,fileHandles:s}=await Q(t);this.fileHandles=s,e.setAttribute(m,{filesFolders:{files:i,folders:r}})}e.removeAttribute("dialog-loading")}function te(e,t,i,r,s){var c,f;let n=((c=s[t])==null?void 0:c.files)??0,o=((f=s[t])==null?void 0:f.folders)??0,a=document.createElement("a-text"),h=e.getAttribute("geometry");a.setAttribute("value","folder://"+t),a.setAttribute("geometry",`primitive:plane; width:${h.width}; height: 0.2`),a.setAttribute("position",`0 ${h.height/2} 0.01`),a.setAttribute("material","color: grey"),a.setAttribute("align","center"),a.setAttribute("width","2"),e.appendChild(a),T("#asset-movie-icon",e,"-2.35 0 0.01","0.25 0.25 1"),T("#asset-folder",e,"2.35 0 0.01","0.25 0.25 1");let b=document.createElement("a-image");b.setAttribute("src","#asset-refresh"),b.setAttribute("scale","0.2 0.2 1"),b.setAttribute("position",`-0.3 ${h.height/2-.3} 0.02`),b.setAttribute("clickable",""),b.setAttribute("button-highlight",""),b.addEventListener("click",()=>{this.fetchFiles(e,t)}),e.appendChild(b);let u=document.createElement("a-image");if(u.setAttribute("src","#asset-back"),u.setAttribute("scale","0.2 0.2 1"),u.setAttribute("position",`0.3 ${h.height/2-.3} 0.02`),u.setAttribute("clickable",""),u.setAttribute("button-highlight",""),u.addEventListener("click",()=>{e.setAttribute(m,{url:t.substr(0,t.lastIndexOf("/"))})}),e.appendChild(u),i.length>p){if(n!=0){let l=document.createElement("a-image");l.setAttribute("src","#asset-up"),l.setAttribute("scale","0.2 0.2 1"),l.setAttribute("position","-1.2 0.75 0.02"),l.setAttribute("clickable",""),l.setAttribute("button-highlight",""),l.addEventListener("click",()=>{e.setAttribute(m,{offset:{...s,[t]:{files:n-p/2,folders:o}}})}),e.appendChild(l)}if(n+p<i.length){let l=document.createElement("a-image");l.setAttribute("src","#asset-up"),l.setAttribute("scale","0.2 -0.2 1"),l.setAttribute("position",`-1.2 ${L+.2+p*E+(E-.01)} 0.02`),l.setAttribute("clickable",""),l.setAttribute("button-highlight",""),l.addEventListener("click",()=>{e.setAttribute(m,{offset:{...s,[t]:{files:n+p/2,folders:o}}})}),e.appendChild(l)}}if(r.length>p){if(o!=0){let l=document.createElement("a-image");l.setAttribute("src","#asset-up"),l.setAttribute("scale","0.2 0.2 1"),l.setAttribute("position","1.2 0.75 0.02"),l.setAttribute("clickable",""),l.setAttribute("button-highlight",""),l.addEventListener("click",()=>{e.setAttribute(m,{offset:{...s,[t]:{files:n,folders:o-p/2}}})}),e.appendChild(l)}if(o+p<r.length){let l=document.createElement("a-image");l.setAttribute("src","#asset-up"),l.setAttribute("scale","0.2 -0.2 1"),l.setAttribute("position",`1.2 ${L+.2+p*E+(E-.01)} 0.02`),l.setAttribute("clickable",""),l.setAttribute("button-highlight",""),l.addEventListener("click",()=>{e.setAttribute(m,{offset:{...s,[t]:{files:n,folders:o+p/2}}})}),e.appendChild(l)}}{let l=document.createElement("a-plane");l.setAttribute("geometry","width:2; height: 0.2"),l.setAttribute("material","color: #2F9F1D;"),l.setAttribute("position","0 1.3 0.01"),l.setAttribute("clickable",""),l.setAttribute("button-highlight",""),l.onclick=async()=>{await Y("fs"),this.fetchFiles(this.el,""),e.setAttribute(m,{reRender:"rerender"})};let y=document.createElement("a-text");y.setAttribute("value","Choose Another Directory"),y.setAttribute("align","center"),y.setAttribute("width","2"),l.appendChild(y),e.appendChild(l)}}function ie(e,t,i,r,s){var h,b;e.replaceChildren(),e.setAttribute("clickable",""),e.object3D.visible=!0;let n=((h=s[t])==null?void 0:h.files)??0,o=((b=s[t])==null?void 0:b.folders)??0,a=L;for(let u=n;u<n+p;u++)if(u<i.length){let c=document.createElement("a-plane");c.setAttribute("geometry","width:2; height: 0.2"),c.setAttribute("material","color: #801D9F;"),c.setAttribute("position",`-1.2 ${a} 0.01`),c.setAttribute("clickable",""),c.setAttribute("button-highlight",""),c.onclick=async()=>{let l=Z+t+"/"+i[u];l=URL.createObjectURL(await this.fileHandles[u].getFile()),d.ascene.setAttribute(A,{src:l,fileName:i[u]})};let f=document.createElement("a-text");f.setAttribute("value",D(i[u]).substring(0,40)),f.setAttribute("align","center"),f.setAttribute("width","2"),c.appendChild(f),e.appendChild(c),a+=E}a=L;for(let u=o;u<o+p;u++)if(u<r.length){let c=document.createElement("a-plane");c.setAttribute("geometry","width:2; height: 0.2"),c.setAttribute("material","color: #C39807;"),c.setAttribute("position",`1.2 ${a} 0.01`),c.setAttribute("clickable",""),c.setAttribute("button-highlight",""),c.onclick=()=>{e.setAttribute(m,{url:t+"/"+r[u]}),console.log("going : ",t+"/"+r[u])};let f=document.createElement("a-text");f.setAttribute("value",D(r[u])),f.setAttribute("align","center"),f.setAttribute("width","2"),c.appendChild(f),e.appendChild(c),a+=E}this.insertFolderUI(e,t,i,r,s)}AFRAME.registerComponent(m,{schema:{url:{type:"string",default:""},filesFolders:{default:{files:[],folders:[]},parse:function(e){return typeof e=="object"?e:JSON.parse(e)},stringify:function(e){return typeof e=="string"?e:JSON.stringify(e)}},offset:{default:{"":{files:0,folders:0}},parse:function(e){return typeof e=="object"?e:JSON.parse(e)},stringify:function(e){return typeof e=="string"?e:JSON.stringify(e)}},reRender:{type:"string",default:""}},init:function(){let e=this.el;e.setAttribute("geometry","primitive: plane; width: 5; height: 2.1"),e.setAttribute("material","color: teal"),e.setAttribute("dialog-utils",{screen:m}),e.object3D.visible=!0,this.fetchFiles=AFRAME.utils.bind(ee,this),this.insertFolderUI=AFRAME.utils.bind(te,this),this.renderFiles=AFRAME.utils.bind(ie,this)},update:function(e){var t=this.data,i=this.el;if(t.reRender&&t.reRender.length>0){i.setAttribute("dialog-utils",{screen:m}),i.setAttribute(m,{reRender:""});return}t.url!==e.url?this.fetchFiles(this.el,t.url):this.renderFiles(i,t.url,t.filesFolders.files,t.filesFolders.folders,t.offset)},remove:function(){let e=this.el;e.replaceChildren(),e.removeAttribute("clickable"),e.setAttribute("dialog-utils",{screen:""})}});const v=function(){return{get:i=>JSON.parse(localStorage.getItem(i)),set:(i,r)=>{localStorage.setItem(i,JSON.stringify(r))}}}(),x="apply-settings-vid";AFRAME.registerComponent(x,{schema:{time:{type:"boolean",default:!1},defaultPreset:{type:"number",default:0},savePreset:{type:"boolean",default:!0}},init:function(){this.timeKey="",this.presetKey="",this.videoName="",this.lastUpdate=Date.now(),this.onVideoLoad=AFRAME.utils.bind(this.onVideoLoad,this),this.saveVidTime=AFRAME.utils.bind(this.saveVidTime,this),this.onVideoStateChange=AFRAME.utils.bind(this.onVideoStateChange,this),d.video.readyState>=1&&(this.videoName=d.ascene.getAttribute(A).fileName,this.timeKey=`VID_T_${this.videoName}`,this.presetKey=`VID_P_${this.videoName}`),d.video.addEventListener("loadedmetadata",this.onVideoLoad),d.ascene.addEventListener(A,this.onVideoStateChange)},update:function(e){var t=this.data;t.time?d.video.addEventListener("timeupdate",this.saveVidTime):d.video.removeEventListener("timeupdate",this.saveVidTime)},remove:function(){d.video.removeEventListener("timeupdate",this.saveVidTime),d.video.removeEventListener("loadedmetadata",this.onVideoLoad)},onVideoLoad:function(){if(this.videoName=d.ascene.getAttribute(A).fileName,this.timeKey=`VID_T_${this.videoName}`,this.presetKey=`VID_P_${this.videoName}`,this.lastUpdate=Date.now(),this.data.time){let e=v.get(this.timeKey);e&&(d.video.currentTime=e)}},onVideoStateChange:function(e){if(this.data.savePreset){let{data:t,od:i}=e.detail,r=`VID_P_${t.fileName}`;if(t.fileName!==i.fileName){let s=v.get(r);s!=null?d.ascene.setAttribute(A,{preset:s}):d.ascene.setAttribute(A,{preset:this.data.defaultPreset})}else v.set(r,t.preset)}else d.ascene.setAttribute(A,{preset:this.data.defaultPreset})},saveVidTime:function(){let e=Date.now();e-this.lastUpdate>5e3&&(this.lastUpdate=e,v.set(this.timeKey,d.video.currentTime))}});const w="apply-settings";AFRAME.registerComponent(w,{schema:{resumeVideo:{type:"boolean",default:!0},defaultPreset:{type:"number",default:0},savePreset:{type:"boolean",default:!0}},init:function(){let e=this.el,t=v.get("settings");t?e.setAttribute(w,t):(t=this.data,v.set("settings",t))},update:function(e){let t=this.el,i=this.data;t.setAttribute(x,{time:i.resumeVideo}),t.setAttribute(x,{defaultPreset:i.defaultPreset}),t.setAttribute(x,{savePreset:i.savePreset}),v.set("settings",i)}});const g="dialog-settings",S=4,P=-.3,N=.4,B=document.querySelector("a-scene");function se(e,t,i){var r=i;let s=document.createElement("a-plane");s.setAttribute("geometry","width:2; height: 0.2"),s.setAttribute("material","color: #A15807;"),s.setAttribute("position",`1.2 ${t} 0.01`),s.setAttribute("clickable",""),s.setAttribute("button-highlight","");let n=document.createElement("a-text");n.setAttribute("value",C[r].text),n.setAttribute("align","center"),n.setAttribute("width","2"),s.appendChild(n),s.onclick=()=>{r=(r+1)%C.length,n.setAttribute("value",C[r].text),console.log(r),d.ascene.setAttribute(w,{defaultPreset:r})},e.appendChild(s)}function re(e,t,i){var r=[!1,!0],s=r.indexOf(i);let n=document.createElement("a-plane");n.setAttribute("geometry","width:2; height: 0.2"),n.setAttribute("material","color: #A15807;"),n.setAttribute("position",`1.2 ${t} 0.01`),n.setAttribute("clickable",""),n.setAttribute("button-highlight","");let o=document.createElement("a-text");o.setAttribute("value",i?"ON":"OFF"),o.setAttribute("align","center"),o.setAttribute("width","2"),n.appendChild(o),n.onclick=()=>{let a=r[++s%r.length];o.setAttribute("value",a?"ON":"OFF"),d.ascene.setAttribute(w,{savePreset:a})},e.appendChild(n)}function ne(e,t,i){var r=[!1,!0],s=r.indexOf(i);let n=document.createElement("a-plane");n.setAttribute("geometry","width:2; height: 0.2"),n.setAttribute("material","color: #A15807;"),n.setAttribute("position",`1.2 ${t} 0.01`),n.setAttribute("clickable",""),n.setAttribute("button-highlight","");let o=document.createElement("a-text");o.setAttribute("value",i?"ON":"OFF"),o.setAttribute("align","center"),o.setAttribute("width","2"),n.appendChild(o),n.addEventListener("click",()=>{let a=r[++s%r.length];o.setAttribute("value",a?"ON":"OFF"),B.setAttribute(w,{resumeVideo:a})}),e.appendChild(n)}const F=[{name:"default preset",render:se,storeKey:"defaultPreset"},{name:"save preset for video",render:re,storeKey:"savePreset"},{name:"resume video",render:ne,storeKey:"resumeVideo"}];function oe(e,t){let i=document.createElement("a-text"),r=e.getAttribute("geometry");if(i.setAttribute("value","Settings"),i.setAttribute("geometry",`primitive:plane; width:${r.width}; height: 0.2`),i.setAttribute("position",`0 ${r.height/2} 0.01`),i.setAttribute("material","color: grey"),i.setAttribute("align","center"),i.setAttribute("width","2"),e.appendChild(i),F.length>S){if(t!=0){let s=document.createElement("a-image");s.setAttribute("src","#asset-up"),s.setAttribute("scale","0.2 0.2 1"),s.setAttribute("position","0 0.75 0.02"),s.setAttribute("clickable",""),s.setAttribute("button-highlight",""),s.addEventListener("click",()=>{e.setAttribute(g,{offset:t-1})}),e.appendChild(s)}if(t+S<F.length){let s=document.createElement("a-image");s.setAttribute("src","#asset-up"),s.setAttribute("scale","0.2 -0.2 1"),s.setAttribute("position",`0 ${N+.2+S*P+(P-.01)} 0.02`),s.setAttribute("clickable",""),s.setAttribute("button-highlight",""),s.addEventListener("click",()=>{e.setAttribute(g,{offset:t+1})}),e.appendChild(s)}}}function le(e,t){e.replaceChildren(),e.setAttribute("clickable",""),e.object3D.visible=!0,oe(e,t);let i=B.getAttribute(w),r=N;for(let s=t;s<t+S;s++)if(s<F.length){let n=document.createElement("a-plane");n.setAttribute("geometry","width:2; height: 0.2"),n.setAttribute("material","color: #801D9F;"),n.setAttribute("position",`-1.2 ${r} 0.01`),F[s].render(e,r,i[F[s].storeKey]);let o=document.createElement("a-text");o.setAttribute("value",F[s].name),o.setAttribute("align","center"),o.setAttribute("width","2"),n.appendChild(o),e.appendChild(n),r+=P}}AFRAME.registerComponent(g,{schema:{offset:{type:"number",default:0},resumeVideo:{type:"string",default:"ON"},reRender:{type:"string",default:""}},init:function(){let e=this.el;e.setAttribute("geometry","primitive: plane; width: 5; height: 2.1"),e.setAttribute("material","color: teal"),e.setAttribute("dialog-utils",{screen:g})},update:function(e){var t=this.data,i=this.el;if(t.reRender&&t.reRender.length>0){i.setAttribute("dialog-utils",{screen:g}),i.setAttribute(g,{reRender:""});return}le(i,t.offset)},remove:function(){let e=this.el;e.replaceChildren(),e.removeAttribute("clickable"),e.setAttribute("dialog-utils",{screen:""})}});AFRAME.registerComponent("dialog-loading",{schema:{},init:function(){let e=this.el,t=this.loader=document.createElement("a-entity");t.setAttribute("geometry","primitive: plane; width: 5; height: 2.5"),t.setAttribute("material","color: teal; opacity: 0.2"),t.setAttribute("position","0 0 0.1"),t.setAttribute("clickable",""),e.appendChild(t);let i=document.createElement("a-image");i.setAttribute("src","#asset-loading"),i.setAttribute("position","0 0 0.01"),i.setAttribute("scale","0.5 0.5 1"),t.appendChild(i);let r=document.createElement("a-text");r.setAttribute("value","loading"),r.setAttribute("width",2),r.setAttribute("align","center"),r.setAttribute("position","0 -0.5 0.01"),t.appendChild(r)},remove:function(){this.el.contains(this.loader)&&this.el.removeChild(this.loader)}});AFRAME.registerComponent("dialog-utils",{schema:{screen:{type:"string",default:""}},init:function(){let e=this.el;e.sceneEl.addEventListener(M,()=>{e.object3D.visible=!1,e.removeAttribute("clickable"),e.replaceChildren()})}});AFRAME.registerComponent("btn-open-file",{schema:{},init:function(){let e=this.el,t=document.getElementById("dialog");e.addEventListener("click",()=>{t.hasAttribute(m)?t.object3D.visible?t.getAttribute("dialog-utils").screen===m?(t.removeAttribute("clickable"),t.replaceChildren(),t.object3D.visible=!1):t.setAttribute(m,{reRender:"rerender"}):t.setAttribute(m,{reRender:"rerender"}):(t.setAttribute(m,""),t.object3D.visible=!0)})}});AFRAME.registerComponent("btn-pause-play",{init:function(){let e=this.el;this.video=document.getElementById("video"),this.pausePlay=()=>{this.video.paused?this.video.play():this.video.pause()},this.onPause=()=>e.setAttribute("src","#asset-vp-play"),this.onPlay=()=>e.setAttribute("src","#asset-vp-pause"),e.addEventListener("click",this.pausePlay),this.video.addEventListener("playing",this.onPlay),this.video.addEventListener("pause",this.onPause)},remove:function(){el.removeEventListener("click",this.pausePlay),this.video.removeEventListener("playing",this.onPlay),this.video.removeEventListener("pause",this.onPause)}});AFRAME.registerComponent("btn-seek-back",{init:function(){let e=this.el;this.video=document.getElementById("video"),e.addEventListener("click",()=>{this.video.currentTime-=15})}});AFRAME.registerComponent("btn-seek-forw",{init:function(){let e=this.el;this.video=document.getElementById("video"),e.addEventListener("click",()=>{this.video.currentTime+=15})}});AFRAME.registerComponent("btn-vol",{schema:{vol:{type:"number",default:1}},init:function(){let e=this.el;this.setVolume=AFRAME.utils.bind(this.setVolume,this);let t=this.width=.65;e.setAttribute("geometry",{primitive:"plane",width:t+.05,height:.35}),e.setAttribute("material","color: #808080");let i=this.txt=document.createElement("a-text");i.setAttribute("width",2.5),i.setAttribute("align","center"),i.setAttribute("value","100"),i.setAttribute("position","0 0 0.011"),e.appendChild(i);let r=this.bar=document.createElement("a-entity");r.setAttribute("material","color: #005073"),r.setAttribute("position","0 0 0.01"),r.setAttribute("geometry",{primitive:"plane",width:t,height:.3}),this.el.appendChild(r),this.el.addEventListener("click",s=>{this.setVolume(s.detail.intersection.uv.x)}),this.setVolume(v.get("volume"))},setVolume:function(e){e>=.9&&(e=1),e<=.1&&(e=.1);let t=this.width*e,i=t/2;d.video.volume=e,v.set("volume",e),this.txt.setAttribute("value",`${Math.round(d.video.volume*100)}`),this.bar.setAttribute("position",`${i-this.width/2} 0 0.01`),this.bar.setAttribute("geometry",{width:t})}});AFRAME.registerComponent("btn-hide-controls",{init:function(){let e=this.el;const t=document.getElementById("rightEye");e.addEventListener("click",()=>{t.setAttribute("visible",!0),e.sceneEl.systems.controls.hideControls()})}});AFRAME.registerComponent("btn-settings",{schema:{},init:function(){let e=this.el,t=document.getElementById("dialog");e.addEventListener("click",()=>{t.hasAttribute(g)?t.object3D.visible?t.getAttribute("dialog-utils").screen===g?(t.removeAttribute("clickable"),t.replaceChildren(),t.object3D.visible=!1):t.setAttribute(g,{reRender:"rerender"}):t.setAttribute(g,{reRender:"rerender"}):(t.setAttribute(g,""),t.object3D.visible=!0)})}});{let e=function(t){const r=t.target.files[0],s=document.getElementById("video");r&&(s.src=URL.createObjectURL(r))};document.getElementById("fileInput").addEventListener("change",e)}const d={ascene:document.querySelector("a-scene"),leftEye:document.getElementById("leftEye"),rightEye:document.getElementById("rightEye"),video:document.getElementById("video")};
