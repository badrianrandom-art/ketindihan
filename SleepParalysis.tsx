import React from "react";
import {
  AbsoluteFill, Sequence, useCurrentFrame, interpolate, Easing,
  spring, useVideoConfig
} from "remotion";

const C = {
  ink:"#111725", wall:"#252c42", wallHi:"#343b55", floor:"#101624",
  window:"#213854", moon:"#e9d9b7", skin:"#e2ad94", skinShade:"#bd8272",
  blush:"#c9837d", hair:"#292633", shirt:"#78839e", shirtHi:"#929bb0",
  bed:"#3c435e", mattress:"#68708d", pillow:"#d9ccc4",
  blanket:"#555d7b", blanketHi:"#79809c", gold:"#e4c38e",
  ivory:"#f4eee5", muted:"#bcbac5", brain:"#bca6cc", muscle:"#c17d85",
  shadow:"#070a12"
};

const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
const ease=(f:number,a:number,b:number,x:number,y:number)=>interpolate(f,[a,b],[x,y],{
  extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.inOut(Easing.sin)
});
const reveal=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{
  extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.out(Easing.cubic)
});
const pulse=(f:number,period:number,amp:number)=>Math.sin(f/period)*amp;

const Room:React.FC<{dark?:number;warm?:number;pan?:number;focus?:number}> =
({dark=0,warm=0,pan=0,focus=0})=>(
 <AbsoluteFill style={{background:C.ink,overflow:"hidden"}}>
  <svg width="100%" height="100%" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
   <defs>
    <linearGradient id="wall6" x2="0" y2="1"><stop stopColor="#363d57"/><stop offset="1" stopColor="#242a3e"/></linearGradient>
    <linearGradient id="floor6" x2="0" y2="1"><stop stopColor="#1b2234"/><stop offset="1" stopColor="#0d1320"/></linearGradient>
    <radialGradient id="moon6"><stop stopColor="#dce0dc" stopOpacity=".32"/><stop offset="1" stopColor="#dce0dc" stopOpacity="0"/></radialGradient>
    <radialGradient id="warm6"><stop stopColor="#e8bc8d" stopOpacity=".55"/><stop offset="1" stopColor="#e8bc8d" stopOpacity="0"/></radialGradient>
    <filter id="blur6"><feGaussianBlur stdDeviation="28"/></filter>
   </defs>
   <rect width="1080" height="1920" fill="url(#wall6)"/>
   <g transform={`translate(${pan},0)`}>
    {/* architectural depth */}
    <path d="M0 0H1080V1345H0Z" fill="#ffffff" opacity=".018"/>
    <rect x="82" y="185" width="375" height="480" rx="4" fill="#171f31" stroke="#596078" strokeWidth="20"/>
    <rect x="105" y="208" width="329" height="434" fill={C.window}/>
    <circle cx="330" cy="288" r="39" fill={C.moon}/>
    <circle cx="330" cy="288" r="195" fill="url(#moon6)"/>
    <path d="M270 208V642M105 420H434" stroke="#58627b" strokeWidth="10"/>
    <path d="M105 520Q260 455 434 525V642H105Z" fill="#314964" opacity=".56"/>
    <path d="M52 172Q104 300 75 680L42 680Z M480 172Q440 300 478 680L510 680Z" fill="#34364d"/>
    <path d="M735 235H955V575H735Z" fill="#252a40" stroke="#4b5068" strokeWidth="15"/>
    <path d="M735 410H955" stroke="#41475f" strokeWidth="8"/>
    {/* small nightstand and lamp */}
    <rect x="790" y="1080" width="220" height="20" rx="4" fill="#514958"/>
    <path d="M825 1100V1295M980 1100V1295" stroke="#37384c" strokeWidth="16"/>
    <path d="M835 820L755 1025H915L875 820Z" fill="#c49d76"/>
    <ellipse cx="835" cy="820" rx="90" ry="22" fill="#e7c79d"/>
    <ellipse cx="835" cy="970" rx="250" ry="300" fill="url(#warm6)" opacity=".25"/>
    {/* floor and baseboard */}
    <rect x="0" y="1345" width="1080" height="575" fill="url(#floor6)"/>
    <path d="M0 1345H1080" stroke="#51566d" strokeWidth="13"/>
    <path d="M0 1370H1080" stroke="#080d17" strokeWidth="8" opacity=".7"/>
    {/* plant silhouette */}
    <path d="M75 1335Q5 1200 50 1120Q120 1190 75 1335M85 1335Q170 1190 155 1115Q70 1190 85 1335M80 1290Q60 1160 105 1080Q135 1190 80 1290" fill="#304744"/>
    <rect x="38" y="1320" width="120" height="70" rx="12" fill="#35384c"/>
   </g>
   <ellipse cx="850" cy="1010" rx="450" ry="540" fill="url(#warm6)" opacity={warm}/>
   <rect width="1080" height="1920" fill="#060912" opacity={dark}/>
   {focus>0 && <rect width="1080" height="1920" fill="#080b15" opacity={focus*.18}/>}
  </svg>
 </AbsoluteFill>
);

// Articulated character rig: independent shoulders, elbows, wrists, neck and facial expression.
const Character:React.FC<{
 sleep?:boolean; awake?:boolean; afraid?:boolean; frozen?:boolean;
 breath?:number; head?:number; leftArm?:number; leftForearm?:number;
 rightArm?:number; rightForearm?:number; sit?:number; blanket?:number;
}> = ({
 sleep=false,awake=false,afraid=false,frozen=false,breath=1,head=0,
 leftArm=0,leftForearm=0,rightArm=0,rightForearm=0,sit=0,blanket=0
})=>{
 const f=useCurrentFrame();
 const b=frozen?0:pulse(f,11,4.5)*breath;
 const blink=!sleep && !afraid && (f%137>130);
 const eyeH=sleep?2:(blink?1:(afraid?17:10));
 return <div style={{position:"absolute",left:"0%",right:"0%",bottom:"5%",height:"59%"}}>
  <svg width="100%" height="100%" viewBox="0 0 1080 1100">
   <defs>
    <linearGradient id="duvet6" x2="0" y2="1"><stop stopColor="#7c829f"/><stop offset="1" stopColor="#4d5572"/></linearGradient>
    <linearGradient id="shirt6" x2="0" y2="1"><stop stopColor="#929bb1"/><stop offset="1" stopColor="#626c86"/></linearGradient>
    <filter id="bedBlur6"><feGaussianBlur stdDeviation="22"/></filter>
   </defs>
   <ellipse cx="540" cy="910" rx="495" ry="78" fill="#050912" opacity=".45" filter="url(#bedBlur6)"/>
   {/* bed base */}
   <rect x="78" y="590" width="925" height="355" rx="30" fill="#303750"/>
   <rect x="85" y="490" width="910" height="190" rx="40" fill={C.mattress}/>
   {/* pillow */}
   <path d="M158 520Q165 405 305 420L505 455Q560 485 530 600L185 605Q145 575 158 520Z" fill={C.pillow}/>
   <path d="M190 505Q330 455 490 500" stroke="#f2e8e0" strokeWidth="9" opacity=".35" fill="none"/>
   {/* legs, slightly visible at the lower edge */}
   <g transform={`rotate(${pulse(f,30,1.5)} 650 750)`}>
    <path d="M570 720Q700 770 835 815" stroke={C.skinShade} strokeWidth="82" strokeLinecap="round" fill="none"/>
    <path d="M820 805Q875 830 930 810" stroke={C.skin} strokeWidth="64" strokeLinecap="round" fill="none"/>
   </g>
   <g transform={`translate(0,${-sit*125+b})`}>
    {/* torso */}
    <path d="M345 585Q375 420 535 425Q700 420 760 590L730 780L345 780Z" fill="url(#shirt6)"/>
    <path d="M385 600Q520 540 720 600" stroke="#b4bac9" strokeWidth="10" opacity=".25" fill="none"/>
    {/* neck */}
    <path d="M445 420L615 420L625 530L435 530Z" fill={C.skinShade}/>
    {/* head */}
    <g transform={`rotate(${head} 520 340)`}>
     <ellipse cx="520" cy="340" rx="113" ry="133" fill={C.skin}/>
     {/* ears */}
     <ellipse cx="407" cy="352" rx="17" ry="30" fill={C.skinShade}/>
     <ellipse cx="633" cy="352" rx="17" ry="30" fill={C.skinShade}/>
     {/* hair silhouette with locks */}
     <path d="M408 350Q382 210 500 188Q625 180 654 292Q608 255 550 252Q468 260 408 350Z" fill={C.hair}/>
     <path d="M416 310Q384 225 456 197Q440 257 477 282Z" fill={C.hair}/>
     <path d="M536 194Q630 202 657 300Q624 269 584 251Z" fill={C.hair}/>
     <path d="M426 240Q455 188 500 194" stroke="#514657" strokeWidth="9" fill="none" opacity=".5"/>
     {/* eyebrows */}
     <path d={afraid?"M455 305Q478 280 500 302":"M455 315Q477 305 500 313"} stroke="#59414a" strokeWidth="9" strokeLinecap="round" fill="none"/>
     <path d={afraid?"M540 302Q563 280 585 305":"M540 313Q563 305 585 315"} stroke="#59414a" strokeWidth="9" strokeLinecap="round" fill="none"/>
     {/* eyes */}
     <ellipse cx="478" cy="350" rx="19" ry={eyeH} fill="#fff8ef"/>
     <ellipse cx="562" cy="350" rx="19" ry={eyeH} fill="#fff8ef"/>
     {!sleep && !blink && <>
      <ellipse cx={afraid?478:481} cy="351" rx="8" ry={afraid?10:7} fill="#302d38"/>
      <ellipse cx={afraid?562:559} cy="351" rx="8" ry={afraid?10:7} fill="#302d38"/>
      <circle cx="484" cy="346" r="3" fill="#fff"/>
      <circle cx="556" cy="346" r="3" fill="#fff"/>
     </>}
     {/* nose and mouth */}
     <path d="M520 360Q510 385 520 389" stroke="#bd8277" strokeWidth="6" strokeLinecap="round" fill="none" opacity=".7"/>
     {sleep
       ? <path d="M495 414Q520 420 545 414" stroke="#995f63" strokeWidth="6" fill="none" strokeLinecap="round"/>
       : afraid
        ? <ellipse cx="520" cy="421" rx="15" ry="19" fill="#754b52"/>
        : <path d="M498 416Q520 424 542 416" stroke="#995f63" strokeWidth="6" fill="none" strokeLinecap="round"/>}
     {afraid && <ellipse cx="455" cy="390" rx="18" ry="9" fill={C.blush} opacity=".3"/>}
    </g>
    {/* left upper arm and forearm, two pivots */}
    <g transform={`rotate(${leftArm} 395 570)`}>
     <path d="M395 570Q340 615 300 680" stroke={C.skin} strokeWidth="62" strokeLinecap="round" fill="none"/>
     <g transform={`rotate(${leftForearm} 300 680)`}>
      <path d="M300 680Q260 715 232 700" stroke={C.skin} strokeWidth="47" strokeLinecap="round" fill="none"/>
      <path d="M245 700l-19 26m39-24l-10 30m31-33l-3 28" stroke={C.skinShade} strokeWidth="10" strokeLinecap="round"/>
     </g>
    </g>
    {/* right upper arm and forearm */}
    <g transform={`rotate(${rightArm} 700 570)`}>
     <path d="M700 570Q765 620 815 680" stroke={C.skin} strokeWidth="62" strokeLinecap="round" fill="none"/>
     <g transform={`rotate(${rightForearm} 815 680)`}>
      <path d="M815 680Q855 710 892 695" stroke={C.skin} strokeWidth="47" strokeLinecap="round" fill="none"/>
     </g>
    </g>
    {/* blanket moves as its own layer */}
    <path d={`M85 ${650-blanket}Q270 ${580-blanket} 450 ${650-blanket}Q680 ${715-blanket} 995 ${620-blanket}L995 930H85Z`} fill="url(#duvet6)"/>
    <path d={`M125 ${690-blanket}Q335 ${630-blanket} 530 ${705-blanket}`} stroke="#aeb0c3" strokeWidth="10" opacity=".3" fill="none"/>
    <path d={`M560 ${700-blanket}Q750 ${660-blanket} 950 ${685-blanket}`} stroke="#aeb0c3" strokeWidth="8" opacity=".22" fill="none"/>
   </g>
  </svg>
 </div>;
};

const Shadow:React.FC<{amount:number;scale:number}> = ({amount,scale})=>(
 <div style={{position:"absolute",right:"1%",bottom:"26%",width:"43%",height:"46%",opacity:amount,transform:`scale(${scale})`,transformOrigin:"bottom center"}}>
  <svg width="100%" height="100%" viewBox="0 0 430 720">
   <defs><filter id="shadeBlur6"><feGaussianBlur stdDeviation="12"/></filter></defs>
   <ellipse cx="220" cy="680" rx="180" ry="35" fill="#05070d" opacity=".6" filter="url(#shadeBlur6)"/>
   <path d="M55 700Q45 400 85 245Q120 105 215 100Q320 105 350 260Q385 435 370 700Z" fill="#080b14"/>
   <ellipse cx="215" cy="145" rx="100" ry="120" fill="#080b14"/>
   <ellipse cx="180" cy="155" rx="7" ry="5" fill="#e5d7bd" opacity=".65"/>
   <ellipse cx="250" cy="155" rx="7" ry="5" fill="#e5d7bd" opacity=".65"/>
  </svg>
 </div>
);

const InfoTag:React.FC<{children:React.ReactNode;top:number;left?:string;delay?:number}> =
({children,top,left="9%",delay=0})=>{
 const f=useCurrentFrame();
 const s=spring({frame:f-delay,fps:30,config:{damping:18,stiffness:120}});
 return <div style={{position:"absolute",top,left,padding:"13px 19px",borderLeft:`4px solid ${C.gold}`,
  background:"rgba(25,32,48,.9)",color:C.ivory,fontFamily:"Arial",fontSize:24,
  letterSpacing:.5,opacity:reveal(f,delay,delay+10),
  transform:`translateX(${interpolate(s,[0,1],[-26,0])}px)`,
  boxShadow:"0 12px 32px rgba(0,0,0,.18)"}}>{children}</div>;
};

const Chapter:React.FC<{children:React.ReactNode;delay?:number}> = ({children,delay=0})=>{
 const f=useCurrentFrame();
 return <div style={{position:"absolute",top:"8%",left:"9%",color:C.gold,fontFamily:"Arial",
  fontSize:21,fontWeight:700,letterSpacing:5,opacity:reveal(f,delay,delay+14)}}>{children}</div>;
};

const Scene1:React.FC=()=>{
 const f=useCurrentFrame();
 const zoom=interpolate(f,[0,192],[1.02,1.09]);
 const pan=Math.sin(f/70)*9;
 return <AbsoluteFill style={{transform:`scale(${zoom})`}}>
  <Room pan={pan}/>
  <Character sleep breath={1} head={Math.sin(f/75)*1.5} blanket={pulse(f,12,3)}/>
  <Chapter delay={18}>02:17 AM</Chapter>
 </AbsoluteFill>;
};

const Scene2:React.FC=()=>{
 const f=useCurrentFrame();
 const wake=spring({frame:f-15,fps:30,config:{damping:16,stiffness:95}});
 const head=ease(f,5,55,2,-9);
 const zoom=interpolate(f,[0,192],[1.04,1.13]);
 return <AbsoluteFill style={{transform:`scale(${zoom})`}}>
  <Room dark={.08} pan={Math.sin(f/60)*5}/>
  <Character awake frozen breath={0} head={head} leftArm={ease(f,25,65,0,-5)} blanket={2}/>
  <div style={{position:"absolute",inset:0,background:"#101725",opacity:interpolate(wake,[0,1],[.16,0])}}/>
  <InfoTag top={290} delay={38}>Kesadaran kembali</InfoTag>
  <InfoTag top={375} delay={64}>Tubuh belum merespons</InfoTag>
 </AbsoluteFill>;
};

const Scene3:React.FC=()=>{
 const f=useCurrentFrame();
 const arm=ease(f,10,65,0,-28)+pulse(f,2.8,2.2);
 const fore=ease(f,25,70,0,17)+pulse(f,3,2);
 const tremor=pulse(f,1.8,1)*reveal(f,5,35);
 const zoom=interpolate(f,[0,192],[1.08,1.18]);
 return <AbsoluteFill style={{transform:`scale(${zoom}) translateX(${tremor}px)`}}>
  <Room dark={.17}/>
  <Character awake afraid frozen breath={0} head={-7} leftArm={arm} leftForearm={fore} rightArm={-arm*.18} blanket={pulse(f,4,2)}/>
  <InfoTag top={270} delay={20}>Sleep paralysis</InfoTag>
  <InfoTag top={355} delay={55}>Otot masih dalam mode REM</InfoTag>
 </AbsoluteFill>;
};

const Scene4:React.FC=()=>{
 const f=useCurrentFrame();
 const approach=ease(f,0,180,0,1);
 const scale= ease(f,0,180,.68,1.22);
 const camera=pulse(f,2.4,2.5)*reveal(f,0,40);
 return <AbsoluteFill style={{transform:`translateX(${camera}px) scale(${1+approach*.06})`}}>
  <Room dark={.24} focus={.45}/>
  <Character awake afraid frozen breath={0} head={-10} leftArm={-23+pulse(f,3,1)} leftForearm={15} blanket={1}/>
  <Shadow amount={approach*.95} scale={scale}/>
  <div style={{position:"absolute",inset:0,background:"#070a12",opacity:approach*.14}}/>
  <InfoTag top={260} delay={28}>Otak masih bermimpi</InfoTag>
 </AbsoluteFill>;
};

const Brain:React.FC=()=>{
 const f=useCurrentFrame();
 const p=1+pulse(f,8,.035);
 return <svg width="570" height="570" viewBox="0 0 570 570" style={{transform:`scale(${p})`}}>
  <defs><radialGradient id="brainV6"><stop stopColor="#f0dced"/><stop offset="1" stopColor="#777697"/></radialGradient></defs>
  <path d="M285 65C195 20 95 105 130 198C55 270 110 365 185 355C175 450 265 480 295 410C335 475 425 420 395 345C475 310 445 215 385 190C410 105 320 40 285 65Z" fill="url(#brainV6)" stroke="#e9ddec" strokeWidth="10"/>
  <g fill="none" stroke="#f8eafa" strokeWidth="9" opacity=".75">
   <path d="M175 115Q230 160 190 225T220 340"/><path d="M285 75Q240 175 300 240T285 370"/>
   <path d="M365 130Q305 195 375 260T345 335"/><path d="M130 250Q195 235 230 280"/><path d="M315 275Q385 225 420 280"/>
  </g>
  <circle cx="290" cy="245" r="34" fill="#f0cd8d"/><circle cx="290" cy="245" r="70" fill="none" stroke="#f0cd8d" strokeWidth="6" opacity=".55"/>
 </svg>;
};

const ScienceScene:React.FC=()=>{
 const f=useCurrentFrame();
 const draw=reveal(f,12,105);
 const spark=pulse(f,5,5);
 return <AbsoluteFill style={{background:"linear-gradient(145deg,#182033,#30374f)"}}>
  <Chapter delay={8}>APA YANG TERJADI DI OTAK?</Chapter>
  <div style={{position:"absolute",top:"17%",left:"50%",transform:"translateX(-50%)"}}><Brain/></div>
  <svg style={{position:"absolute",top:"47%",left:"12%"}} width="800" height="420" viewBox="0 0 800 420">
   <path d="M400 0V210" stroke={C.gold} strokeWidth="6" strokeDasharray="12 16" strokeDashoffset={200*(1-draw)} opacity=".85"/>
   <path d="M130 300Q240 205 400 295T670 300" fill="none" stroke={C.muscle} strokeWidth="75" strokeLinecap="round"/>
   <path d="M145 300Q250 235 400 300T655 300" fill="none" stroke="#e3a4a6" strokeWidth="9" opacity=".6"/>
   <g fill="none" stroke="#f0c5bd" strokeWidth="8" opacity=".8">
    <path d="M210 255L265 345M300 245L350 350M450 250L500 345M545 250L595 345"/>
   </g>
   <circle cx={400+spark} cy="295" r="20" fill={C.gold} opacity={draw}/>
  </svg>
  <InfoTag top={1160} delay={52}>Otak aktif saat fase REM</InfoTag>
  <InfoTag top={1245} delay={88}>Otot mengalami atonia sementara</InfoTag>
 </AbsoluteFill>;
};

const RecoveryScene:React.FC=()=>{
 const f=useCurrentFrame();
 const dawn=ease(f,0,180,0,.65);
 const sit=ease(f,20,150,0,.78);
 const head=ease(f,65,140,-6,2);
 const arm=ease(f,65,135,-3,12);
 return <AbsoluteFill>
  <Room warm={dawn} dark={.03}/>
  <Character awake breath={1.25} sit={sit} head={head} leftArm={arm} rightArm={-arm*.4}/>
  <div style={{position:"absolute",top:"14%",left:"50%",width:2,height:"28%",background:C.gold,opacity:dawn*.7}}/>
  <InfoTag top={260} delay={75}>Tubuh mulai bergerak kembali</InfoTag>
 </AbsoluteFill>;
};

const SceneTransition:React.FC<{children:React.ReactNode;duration:number}> =
({children,duration})=>{
 const f=useCurrentFrame();
 const opacity=interpolate(f,[0,16,duration-16,duration],[0,1,1,0],{
  extrapolateLeft:"clamp",extrapolateRight:"clamp"
 });
 const zoom=interpolate(f,[0,duration],[1.035,1],{extrapolateRight:"clamp"});
 return <AbsoluteFill style={{opacity,transform:`scale(${zoom})`}}>{children}</AbsoluteFill>;
};

export const SleepParalysis:React.FC=()=>{
 const starts=[0,174,348,522,696,870];
 const durations=[192,192,192,192,192,210];
 const scenes=[Scene1,Scene2,Scene3,Scene4,ScienceScene,RecoveryScene];
 return <AbsoluteFill style={{background:C.ink}}>
  {scenes.map((Comp,i)=>(
   <Sequence key={i} from={starts[i]} durationInFrames={durations[i]}>
    <SceneTransition duration={durations[i]}><Comp/></SceneTransition>
   </Sequence>
  ))}
  <AbsoluteFill style={{border:"13px solid rgba(5,7,13,.2)",pointerEvents:"none"}}/>
 </AbsoluteFill>;
};
