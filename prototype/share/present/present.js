const titles=['Opening','The problem','Product demo · 68 sec','Market','Competition','How it works','Early traction','Next step','Try the prototype','Contact our team'];
const params=new URLSearchParams(location.search),requested=Number(params.get('slide'));
let current=Number.isInteger(requested)&&requested>=1&&requested<=titles.length?requested-1:0;
const image=document.querySelector('#slide'),video=document.querySelector('#demo'),play=document.querySelector('#play'),prev=document.querySelector('#prev'),next=document.querySelector('#next'),jump=document.querySelector('#jump'),container=document.querySelector('#presentation');
let started=null;
for(let i=0;i<titles.length;i++){const option=document.createElement('option');option.value=String(i);option.textContent=`${i+1}. ${titles[i]}`;jump.append(option);}
function show(index,update=true){
 video.pause();current=Math.max(0,Math.min(titles.length-1,index));
 const isVideo=current===2;image.hidden=isVideo;video.hidden=!isVideo;play.hidden=!isVideo;
 if(isVideo)video.currentTime=0;
 else {image.src=`./slides/slide-${String(current+1).padStart(2,'0')}.png`;image.alt=titles[current];}
 document.querySelector('#pitch-feedback').hidden=current<8;
 prev.disabled=current===0;next.disabled=current===titles.length-1;jump.value=String(current);
 document.querySelector('#counter').textContent=`${current+1} / ${titles.length}`;
 document.querySelector('#hint').textContent=isVideo?'Click play. The market slide appears when the demo finishes.':'Arrow keys to move · F for fullscreen · Space to play the demo';
 if(update){history.replaceState(null,'',`?slide=${current+1}`);if(started===null)started=Date.now();}
 if(current+1<titles.length){const preload=new Image();preload.src=`./slides/slide-${String(current+2).padStart(2,'0')}.png`;}
}
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await container.requestFullscreen();if(started===null)started=Date.now();}catch{document.querySelector('#hint').textContent='Fullscreen is unavailable here. You can still present in this window.';}}
async function toggleVideo(){if(!video.paused){video.pause();return;}try{await video.play();if(started===null)started=Date.now();}catch{play.hidden=false;document.querySelector('#hint').textContent='Use the video playback controls to start the demo.';}}
prev.addEventListener('click',()=>show(current-1));next.addEventListener('click',()=>show(current+1));jump.addEventListener('change',()=>show(Number(jump.value)));play.addEventListener('click',toggleVideo);document.querySelector('#fullscreen').addEventListener('click',fullscreen);
video.addEventListener('play',()=>{play.hidden=true;});video.addEventListener('pause',()=>{if(current===2&&!video.ended)play.hidden=false;});video.addEventListener('ended',()=>{if(current===2)show(3);});
document.addEventListener('keydown',event=>{if(/SELECT|INPUT|TEXTAREA|BUTTON|A/.test(event.target.tagName)||event.ctrlKey||event.metaKey||event.altKey)return;
 if(event.key==='ArrowRight'||event.key==='PageDown'){event.preventDefault();show(current+1);}else if(event.key==='ArrowLeft'||event.key==='PageUp'){event.preventDefault();show(current-1);}else if(event.key.toLowerCase()==='f'){event.preventDefault();fullscreen();}else if(event.key===' '){event.preventDefault();current===2?toggleVideo():show(current+1);}});
setInterval(()=>{if(started===null)return;const seconds=Math.floor((Date.now()-started)/1000);const timer=document.querySelector('#timer');timer.textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')} / 3:00`;timer.classList.toggle('overtime',seconds>=180);},1000);
show(current,false);
