// Fit the 1440 x 3200 canvas to the screen width (never larger than 1440)
const holder=document.getElementById('holder'),stage=document.getElementById('stage');
function fit(){const s=Math.min(1,innerWidth/1440);stage.style.transform='scale('+s+')';holder.style.width=1440*s+'px';holder.style.height=3200*s+'px'}
addEventListener('resize',fit);fit();

const items=[
 {img:"images/speakers.jpg",dark:1,alt:"Speakers",text:"Clear, powerful desktop speakers for music, movies and games."},
 {img:"images/parts.jpg",alt:"Computer parts",text:"Upgrade parts: motherboard, CPU, RAM, storage, power supply and more."},
 {img:"images/setup.jpg",dark:1,alt:"Gaming setup",text:"This modern high-performance computer is designed for fast, smooth, reliable performance"},
 {img:"images/keyboard.jpg",dark:1,alt:"Mechanical keyboard",text:"Responsive mechanical keyboards built for typing and gaming."},
 {img:"images/mouse.jpg",alt:"Wireless mouse",text:"Comfortable, precise wireless mice for work and play."}
];
const MIN=-1,MAX=items.length; // blank slots at both ends
const car=document.getElementById('carousel'),cap=document.getElementById('caption');
// slot geometry by offset from the active item: center x, width, height
const G={'-3':[-80,145,206,0],'-2':[156,145,206,.9],'-1':[371,265,285,1],'0':[710,364,344,1],'1':[1058,265,285,1],'2':[1286,145,206,.9],'3':[1520,145,206,0]};
const CY=232; // slot centre line inside the carousel
const slots=[];
for(let i=MIN-3;i<=MAX+3;i++){
  const d=document.createElement('div'),it=items[i];
  d.className='slot'+(it?(it.dark?' dark':''):' blank');
  if(it){const im=document.createElement('img');im.src=it.img;im.alt=it.alt;d.appendChild(im)}
  car.appendChild(d);slots.push({i,d});
}
let cur=0;
function go(n){
  cur=n;
  slots.forEach(({i,d})=>{
    const o=Math.max(-3,Math.min(3,i-cur)),g=G[o];
    d.style.left=(g[0]-g[1]/2)+'px';d.style.top=(CY-g[2]/2)+'px';
    d.style.width=g[1]+'px';d.style.height=g[2]+'px';
    d.style.opacity=(i-cur===o)?g[3]:0;d.style.zIndex=10-Math.abs(o);
  });
  const it=items[cur];cap.style.opacity=0;
  setTimeout(()=>{cap.textContent=it?it.text:'';cap.classList.toggle('blank',!it);cap.style.opacity=1},250);
}
const next=()=>go(cur>=MAX?MIN:cur+1),prev=()=>go(cur<=MIN?MAX:cur-1);
let timer;const restart=()=>{clearInterval(timer);timer=setInterval(next,2800)};
document.getElementById('next').onclick=()=>{next();restart()};
document.getElementById('prev').onclick=()=>{prev();restart()};
car.addEventListener('mouseenter',()=>clearInterval(timer));
car.addEventListener('mouseleave',restart);
let sx=null;
car.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;clearInterval(timer)},{passive:true});
car.addEventListener('touchend',e=>{if(sx!==null){const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>30)dx<0?next():prev();sx=null}restart()});
go(0);
if(!matchMedia('(prefers-reduced-motion:reduce)').matches)restart();
