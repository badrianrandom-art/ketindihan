import React from "react";
import {
  AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig,
  interpolate, Easing, spring
} from "remotion";

const K = {
  bg:"#111827", wall:"#252b40", wallTop:"#30364d", wallShade:"#1d2336",
  window:"#203550", moon:"#e8d6ae", moonGlow:"#d6d4c1",
  floor:"#101624", floorLine:"#454a60", bedFrame:"#343a55",
  mattress:"#5e6482", pillow:"#d8cbc4", blanket:"#515875",
  blanketHi:"#727794", skin:"#dfaa91", skinDark:"#bd8374",
  hair:"#292635", shirt:"#7b849e", shirtShade:"#59617a",
  lamp:"#d7b783", shadow:"#080b14",
  brain:"#c4a9cf", brainLight:"#f0d9e6", nerve:"#edc987"
};

const cl=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
const mix=(f:number,a:number,b:number,x:number,y:number)=>interpolate(f,[a,b],[x,y],{
  extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.inOut(Easing.sin)
});
const smooth=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{
  extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.out(Easing.cubic)
});

const Room:React.FC<{pan?:number;dark?:number;dawn?:number;lamp?:number}> = ({
 pan=0,dark=0,dawn=0,lamp=0
}) => (
 <AbsoluteFill style={{background:K.bg,overflow:"hidden"}}>
  <svg width="100%" height="100%" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
   <defs>
    <linearGradient id="roomWall" x2="0" y2="1"><stop stopColor={K.wallTop}/><stop offset="1" stopColor={K.wall}/></linearGradient>
    <linearGradient id="roomFloor" x2="0" y2="1"><stop stopColor="#20263a"/><stop offset="1" stopColor={K.floor}/></linearGradient>
    <radialGradient id="moonBloom"><stop stopColor={K.moonGlow} stopOpacity=".28"/><stop offset="1" stopColor={K.moonGlow} stopOpacity="0"/></radialGradient>
    <radialGradient id="lampBloom"><stop stopColor={K.lamp} stopOpacity=".6"/><stop offset="1" stopColor={K.lamp} stopOpacity="0"/></radialGradient>
    <radialGradient id="dawnBloom"><stop stopColor="#e8b986" stopOpacity=".45"/><stop offset="1" stopColor="#e8b986" stopOpacity="0"/></radialGradient>
   </defs>
   <rect width="1080" height="1920" fill="url(#roomWall)"/>
   <g transform={`translate(${pan},0)`}>
    {/* window and moon */}
    <rect x="90" y="185" width="360" height="465" rx="5" fill="#171f31" stroke="#555a70" strokeWidth="20"/>
    <rect x="112" y="207" width="316" height="420" fill={K.window}/>
    <circle cx="335" cy="285" r="38" fill={K.moon}/>
    <circle cx="335" cy="285" r="180" fill="url(#moonBloom)"/>
    <path d="M270 207V627M112 410H428" stroke="#556078" strokeWidth="10"/>
    <path d="M112 520Q235 450 428 515V627H112Z" fill="#2b415d" opacity=".62"/>
    {/* curtain */}
    <path d="M65 175Q105 260 85 650L55 650Z M470 175Q430 300 465 650L490 650Z" fill="#34344c" opacity=".85"/>
    {/* shelf */}
    <rect x="700" y="250" width="290" height="20" rx="5" fill="#4a4655"/>
    <rect x="755" y="165" width="130" height="85" fill="#282a3e"/>
    {/* side table and lamp */}
    <rect x="790" y="1040" width="220" height="22" fill="#4b4551"/>
    <rect x="825" y="1060" width="16" height="190" fill="#39364a"/>
    <path d="M835 810L755 1000H915L875 810Z" fill="#c49d76"/>
    <ellipse cx="835" cy="810" rx="90" ry="20" fill="#e5c49a"/>
    <ellipse cx="835" cy="950" rx="260" ry="300" fill="url(#lampBloom)" opacity={lamp}/>
    {/* plant */}
    <rect x="40" y="1110" width="95" height="110" rx="12" fill="#34364a"/>
    <path d="M85 1115Q15 1030 40 960Q105 1005 85 1115M90 1115Q160 1030 145 970Q80 1010 90 1115M85 1085Q75 970 100 920Q125 1005 85 1085" fill="#344c4a"/>
    {/* floor */}
    <rect x="0" y="1340" width="1080" height="580" fill="url(#roomFloor)"/>
    <path d="M0 1340H1080" stroke="#4b4d63" strokeWidth="13"/>
   </g>
   <ellipse cx="850" cy="1050" rx="460" ry="560" fill="url(#dawnBloom)" opacity={dawn}/>
   <rect width="1080" height="1920" fill="#070a13" opacity={dark}/>
  </svg>
 </AbsoluteFill>
);

// A full-body, faceless character rig. Limbs are separate SVG groups with pivot-based motion.
const Character:React.FC<{
 breath?:number; headTilt?:number; armRaise?:number; wrist?:number;
 legShift?:number; sit?:number; freeze?:boolean; blanketLift?:number;
}> = ({
 breath=1,headTilt=0,armRaise=0,wrist=0,legShift=0,sit=0,freeze=false,blanketLift=0
})=>{
 const f=useCurrentFrame();
 const breathe=freeze?0:Math.sin(f/12)*5*breath;
 const bodyY=-sit*115+breathe;
 const headRot=headTilt;
 const armRot=armRaise;
 const wristRot=wrist;
 const legRot=legShift;
 return <div style={{position:"absolute",left:"0%",right:"0%",bottom:"7%",height:"55%"}}>
  <svg width="100%" height="100%" viewBox="0 0 1080 1050">
   <defs>
    <linearGradient id="duvet" x2="0" y2="1"><stop stopColor={K.blanketHi}/><stop offset="1" stopColor={K.blanket}/></linearGradient>
    <linearGradient id="shirtGrad" x2="0" y2="1"><stop stopColor="#9299ae"/><stop offset="1" stopColor={K.shirtShade}/></linearGradient>
    <filter id="bedShadow"><feGaussianBlur stdDeviation="24"/></filter>
   </defs>
   <ellipse cx="540" cy="865" rx="500" ry="80" fill="#070b14" opacity=".4" filter="url(#bedShadow)"/>
   {/* bed base */}
   <rect x="95" y="575" width="890" height="340" rx="28" fill={K.bedFrame}/>
   <rect x="95" y="485" width="890" height="175" rx="34" fill={K.mattress}/>
   {/* pillows */}
   <path d="M175 500Q185 405 320 415L520 445Q560 480 530 580L205 585Q165 560 175 500Z" fill={K.pillow}/>
   <path d="M200 490Q320 450 490 490" stroke="#eee2da" strokeWidth="8" opacity=".4" fill="none"/>
   {/* legs below blanket */}
   <g transform={`rotate(${legRot} 650 700)`}>
    <path d="M565 715Q680 750 835 805" stroke={K.skinDark} strokeWidth="85" strokeLinecap="round" fill="none"/>
    <path d="M815 795Q875 815 925 800" stroke={K.skin} strokeWidth="65" strokeLinecap="round" fill="none"/>
   </g>
   {/* torso */}
   <g transform={`translate(0,${bodyY})`}>
    <path d="M365 570Q390 430 535 430Q690 430 755 575L720 760L365 755Z" fill="url(#shirtGrad)"/>
    <path d="M390 585Q520 530 730 590" stroke="#a4a9bb" strokeWidth="12" opacity=".35" fill="none"/>
    {/* neck */}
    <path d="M455 425L610 425L620 520L455 520Z" fill={K.skinDark}/>
    {/* head: intentionally blank, no face details */}
    <g transform={`rotate(${headRot} 520 360)`}>
     <ellipse cx="520" cy="345" rx="112" ry="132" fill={K.skin}/>
     <path d="M410 350Q385 215 505 195Q625 185 650 300Q600 260 540 255Q470 265 410 350Z" fill={K.hair}/>
     <path d="M420 305Q385 230 455 205Q435 260 470 285" fill={K.hair}/>
     <path d="M545 210Q640 225 650 310Q615 270 575 255" fill={K.hair}/>
    </g>
    {/* left arm rig */}
    <g transform={`rotate(${armRot} 420 565)`}>
     <path d="M420 565Q350 620 300 690" stroke={K.skin} strokeWidth="65" strokeLinecap="round" fill="none"/>
     <g transform={`rotate(${wristRot} 300 690)`}>
      <path d="M300 690Q260 725 230 700" stroke={K.skin} strokeWidth="48" strokeLinecap="round" fill="none"/>
      <path d="M245 700l-22 28m40-24l-14 33m35-36l-5 30" stroke={K.skinDark} strokeWidth="12" strokeLinecap="round"/>
     </g>
    </g>
    {/* right arm rig */}
    <g transform={`rotate(${-armRot*.35} 700 570)`}>
     <path d="M700 570Q770 635 820 690" stroke={K.skin} strokeWidth="65" strokeLinecap="round" fill="none"/>
     <path d="M820 690Q860 720 895 700" stroke={K.skin} strokeWidth="48" strokeLinecap="round" fill="none"/>
    </g>
    {/* blanket covers lower torso and legs */}
    <path d={`M95 ${650-blanketLift}Q275 ${580-blanketLift} 445 ${650-blanketLift}Q650 ${710-blanketLift} 985 ${620-blanketLift}L985 910H95Z`} fill="url(#duvet)"/>
    <path d={`M120 ${685-blanketLift}Q340 ${630-blanketLift} 520 ${700-blanketLift}`} stroke="#9a9ab1" strokeWidth="9" opacity=".32" fill="none"/>
   </g>
  </svg>
 </div>;
};

const ShadowFigure:React.FC<{progress:number}> = ({progress})=>(
 <svg style={{position:"absolute",right:"2%",bottom:"31%",width:"42%",height:"43%",opacity:progress}} viewBox="0 0 450 700">
  <defs><filter id="shadowSoft"><feGaussianBlur stdDeviation="12"/></filter></defs>
  <ellipse cx="230" cy="610" rx="180" ry="45" fill="#05070e" opacity=".65" filter="url(#shadowSoft)"/>
  <path d="M100 670Q95 410 125 250Q155 120 225 115Q310 115 335 260Q365 420 370 670Z" fill="#080b14"/>
  <ellipse cx="230" cy="135" rx="100" ry="120" fill="#080b14"/>
 </svg>
);

const Scene1:React.FC=()=>{
 const f=useCurrentFrame();
 const breath=Math.sin(f/12)*5;
 const cam=interpolate(f,[0,150],[1,1.055]);
 return <AbsoluteFill style={{transform:`scale(${cam})`}}>
  <Room pan={Math.sin(f/55)*7}/>
  <Character breath={1} headTilt={Math.sin(f/80)*1.5} blanketLift={breath*.25}/>
 </AbsoluteFill>;
};

const Scene2:React.FC=()=>{
 const f=useCurrentFrame();
 const wake=spring({frame:f-12,fps:30,config:{damping:18,stiffness:80}});
 const head=mix(f,10,45,3,-8);
 return <AbsoluteFill>
  <Room dark={.12}/>
  <Character freeze headTilt={head} breath={0} blanketLift={mix(f,25,65,0,2)}/>
  <div style={{position:"absolute",inset:0,background:"#111827",opacity:interpolate(wake,[0,1],[.12,0])}}/>
 </AbsoluteFill>;
};

const Scene3:React.FC=()=>{
 const f=useCurrentFrame();
 const arm=mix(f,0,32,0,-24)+Math.sin(f/4)*mix(f,25,60,0,2);
 const wrist=mix(f,20,50,0,15);
 const micro= Math.sin(f/2)*mix(f,0,70,0,3);
 return <AbsoluteFill>
  <Room dark={.2}/>
  <div style={{position:"absolute",inset:0,transform:`translateX(${micro}px)`}}>
   <Character freeze breath={0} armRaise={arm} wrist={wrist} headTilt={-6} blanketLift={Math.sin(f/5)*1.5}/>
   <ShadowFigure progress={mix(f,5,90,0,.95)}/>
  </div>
  <div style={{position:"absolute",inset:0,background:"#080b14",opacity:mix(f,0,90,0,.16)}}/>
 </AbsoluteFill>;
};

const BrainGraphic:React.FC=()=>{
 const f=useCurrentFrame();
 const pulse=1+Math.sin(f/8)*.035;
 return <svg width="600" height="600" viewBox="0 0 600 600" style={{transform:`scale(${pulse})`}}>
  <defs><radialGradient id="brainV4"><stop stopColor="#e7d3e8"/><stop offset="1" stopColor="#7b789f"/></radialGradient></defs>
  <path d="M300 70C205 20 110 105 145 200C70 265 120 365 195 355C185 455 275 480 305 410C345 475 435 420 405 345C485 310 455 215 395 190C420 105 335 45 300 70Z" fill="url(#brainV4)" stroke="#e6d9e9" strokeWidth="10"/>
  <g fill="none" stroke="#f6eaf4" strokeWidth="9" opacity=".7"><path d="M190 115Q245 160 205 225T235 340"/><path d="M300 80Q250 175 315 240T300 370"/><path d="M380 130Q320 195 390 260T355 335"/><path d="M145 250Q210 235 245 280"/><path d="M330 275Q400 225 435 280"/></g>
  <circle cx="305" cy="245" r="35" fill="#f0ce8e"/><circle cx="305" cy="245" r="70" fill="none" stroke="#f0ce8e" strokeWidth="6" opacity=".55"/>
 </svg>;
};

const Scene4:React.FC=()=>{
 const f=useCurrentFrame();
 const line=interpolate(f,[0,130],[0,1],{extrapolateRight:"clamp"});
 return <AbsoluteFill style={{background:"linear-gradient(145deg,#1a2032,#30364c)"}}>
  <div style={{position:"absolute",top:"18%",left:"50%",transform:"translateX(-50%)"}}><BrainGraphic/></div>
  <svg style={{position:"absolute",top:"48%",left:"15%"}} width="760" height="340" viewBox="0 0 760 340">
   <path d="M380 0V330" stroke="#e7ca8f" strokeWidth="7" strokeDasharray="12 18" strokeDashoffset={180*(1-line)} opacity=".8"/>
   <path d="M250 300Q380 220 510 300" fill="none" stroke="#c98288" strokeWidth="70" strokeLinecap="round"/>
   <rect x="330" y="240" width="100" height="115" rx="18" fill="#e6cda9" stroke="#fff0d0" strokeWidth="7"/>
   <path d="M350 240V218Q350 185 380 185Q410 185 410 218V240" fill="none" stroke="#e6cda9" strokeWidth="14"/>
  </svg>
 </AbsoluteFill>;
};

const Scene5:React.FC=()=>{
 const f=useCurrentFrame();
 const dawn=interpolate(f,[0,150],[0,.6],{extrapolateRight:"clamp"});
 const arm=mix(f,10,75,0,18);
 const sit=mix(f,20,115,0,.9);
 return <AbsoluteFill>
  <Room dawn={dawn} lamp={.2}/>
  <Character breath={1.4} sit={sit} armRaise={arm} headTilt={-5}/>
  <div style={{position:"absolute",inset:0,background:"#e5b985",opacity:dawn*.12}}/>
 </AbsoluteFill>;
};

const SceneTransition:React.FC<{children:React.ReactNode;duration:number}>=({children,duration})=>{
 const f=useCurrentFrame();
 const op=interpolate(f,[0,14,duration-14,duration],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 const zoom=interpolate(f,[0,duration],[1.035,1],{extrapolateRight:"clamp"});
 return <AbsoluteFill style={{opacity:op,transform:`scale(${zoom})`}}>{children}</AbsoluteFill>;
};

export const SleepParalysis:React.FC=()=>{
 const starts=[0,180,360,540,720];
 const scenes=[Scene1,Scene2,Scene3,Scene4,Scene5];
 return <AbsoluteFill style={{background:K.bg}}>
  {scenes.map((Comp,i)=>{
   const duration=i===4?180:starts[i+1]-starts[i];
   return <Sequence key={i} from={starts[i]} durationInFrames={duration}>
    <SceneTransition duration={duration}><Comp/></SceneTransition>
   </Sequence>;
  })}
  <AbsoluteFill style={{border:"14px solid rgba(5,7,13,.22)",pointerEvents:"none"}}/>
 </AbsoluteFill>;
};