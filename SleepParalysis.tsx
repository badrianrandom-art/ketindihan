import React from "react";
import {
  AbsoluteFill, Easing, interpolate, spring, useCurrentFrame,
  useVideoConfig, Sequence
} from "remotion";

const P = {
  ink:"#151827", night:"#20253a", wall:"#30334b", wall2:"#3a3d56",
  window:"#283b56", moon:"#f0d9a3", cream:"#f4eee5", muted:"#b8bac8",
  lilac:"#8b88aa", lilac2:"#656582", skin:"#e8b99f", skinShade:"#c98f7e",
  hair:"#302a35", shirt:"#777f98", blanket:"#5d607f", gold:"#e1bd78",
  shadow:"#090d18", glow:"#a9b5d1"
};

const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
const fade=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
const slide=(f:number,a:number,b:number,d=50)=>interpolate(f,[a,b],[d,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.out(Easing.cubic)});
const scale=(f:number,a:number,b:number,x=.92,y=1)=>interpolate(f,[a,b],[x,y],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.out(Easing.cubic)});

const Type:React.FC<{children:React.ReactNode; top:number; size?:number; width?:string; align?:"left"|"center"; start?:number; color?:string}> =
({children,top,size=46,width="82%",align="left",start=0,color=P.cream})=>{
 const f=useCurrentFrame(); const {fps}=useVideoConfig();
 const p=spring({frame:f-start,fps,config:{damping:18,stiffness:110}});
 return <div style={{position:"absolute",top,left:"9%",width,opacity:fade(f,start,start+12),
   transform:`translateY(${interpolate(p,[0,1],[34,0])}px)`,fontFamily:"Arial, sans-serif",
   fontSize:size,fontWeight:700,lineHeight:1.16,letterSpacing:-1.3,color,textAlign:align,
   textShadow:"0 4px 20px rgba(0,0,0,.28)"}}>{children}</div>;
};

const Eyebrow:React.FC<{children:React.ReactNode;top:number;start?:number}> = ({children,top,start=0})=>{
 const f=useCurrentFrame();
 return <div style={{position:"absolute",top,left:"9%",opacity:fade(f,start,start+10),
   color:P.gold,fontFamily:"Arial",fontSize:22,fontWeight:700,letterSpacing:5}}>{children}</div>;
};

const Room:React.FC<{warm?:number; shake?:number}> = ({warm=0,shake=0})=>{
 const f=useCurrentFrame();
 const drift=Math.sin(f/65)*9;
 return <AbsoluteFill style={{background:P.ink,overflow:"hidden"}}>
  <svg width="100%" height="100%" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
   <defs>
    <linearGradient id="wall" x2="0" y2="1"><stop stopColor="#363951"/><stop offset="1" stopColor="#22263a"/></linearGradient>
    <linearGradient id="floor" x2="0" y2="1"><stop stopColor="#1a1e2d"/><stop offset="1" stopColor="#101420"/></linearGradient>
    <radialGradient id="lamp"><stop stopColor="#e5c58e" stopOpacity=".55"/><stop offset="1" stopColor="#e5c58e" stopOpacity="0"/></radialGradient>
   </defs>
   <rect width="1080" height="1920" fill="url(#wall)"/>
   <rect x="0" y="1330" width="1080" height="590" fill="url(#floor)"/>
   <path d="M0 1330 H1080" stroke="#56536a" strokeWidth="12"/>
   <g transform={`translate(${drift},0)`}>
    <rect x="95" y="205" width="330" height="410" rx="7" fill="#20283b" stroke="#56566e" strokeWidth="18"/>
    <rect x="118" y="228" width="284" height="364" fill={P.window}/>
    <path d="M260 228 V592 M118 410 H402" stroke="#596178" strokeWidth="9"/>
    <circle cx="337" cy="294" r="29" fill={P.moon}/>
    <path d="M118 500 Q210 440 402 500 V592 H118Z" fill="#30445d" opacity=".6"/>
    <rect x="710" y="230" width="220" height="340" fill="#25283c" stroke="#4a4a61" strokeWidth="14"/>
    <path d="M710 390 H930" stroke="#41445a" strokeWidth="8"/>
   </g>
   <ellipse cx="540" cy="1510" rx="520" ry="170" fill="#090d18" opacity=".45"/>
   <ellipse cx="770" cy="980" rx="390" ry="520" fill="url(#lamp)" opacity={warm}/>
  </svg>
  {shake>0 && <div style={{position:"absolute",inset:0,background:`rgba(7,10,19,${shake})`}}/>}
 </AbsoluteFill>;
};

// Character drawn as a coherent vector illustration, with separate animated limbs and facial features.
const Character:React.FC<{awake?:boolean; frozen?:boolean; sitting?:boolean; reaching?:boolean; shadow?:boolean}> =
({awake=false,frozen=false,sitting=false,reaching=false,shadow=false})=>{
 const f=useCurrentFrame();
 const breath=frozen?0:Math.sin(f/13)*3;
 const arm= reaching ? interpolate(f,[0,25,65],[0,-22,-6],{extrapolateRight:"clamp"}) : 0;
 const headTilt=awake?interpolate(f,[0,35],[0,-3],{extrapolateRight:"clamp"}):0;
 return <div style={{position:"absolute",left:"5%",right:"5%",bottom:"13%",height:"42%",transform:sitting?"translateY(-55px)":"none"}}>
  <svg width="100%" height="100%" viewBox="0 0 980 780">
   <defs>
    <linearGradient id="quilt" x2="0" y2="1"><stop stopColor="#777796"/><stop offset="1" stopColor="#50536f"/></linearGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="18"/></filter>
   </defs>
   {shadow && <g opacity=".82">
    <ellipse cx="810" cy="190" rx="115" ry="210" fill="#070a12" filter="url(#soft)"/>
    <path d="M710 520 Q700 260 730 160 Q810 55 890 160 Q920 300 925 520Z" fill="#090c16"/>
    <ellipse cx="810" cy="160" rx="75" ry="90" fill="#090c16"/>
    <circle cx="780" cy="170" r="7" fill="#d7c5a3"/><circle cx="838" cy="170" r="7" fill="#d7c5a3"/>
   </g>}
   {/* Bed frame and mattress */}
   <rect x="70" y="430" width="830" height="285" rx="26" fill="#34374f"/>
   <rect x="85" y="360" width="800" height="150" rx="35" fill="#777691"/>
   <path d="M85 470 Q400 430 885 470 V700 H85Z" fill="url(#quilt)"/>
   {/* pillow */}
   <rect x="170" y="340" width="245" height="120" rx="25" fill="#d8cbc4"/>
   {/* body */}
   <g transform={`translate(0 ${breath})`}>
    <path d={sitting?"M350 390 Q430 260 555 300 L670 470 L510 550 L350 460Z":"M310 405 Q450 320 620 390 L760 510 L520 570 L300 500Z"} fill={P.shirt}/>
    {/* neck */}
    <path d="M390 345 L510 350 L520 420 L410 420Z" fill={P.skinShade}/>
    {/* head */}
    <g transform={`rotate(${headTilt} 430 320)`}>
     <ellipse cx="435" cy="300" rx="100" ry="115" fill={P.skin}/>
     <path d="M340 292 Q320 170 425 166 Q530 155 545 260 Q500 235 450 225 Q400 235 340 292Z" fill={P.hair}/>
     <path d="M350 290 Q370 250 400 247" stroke={P.hair} strokeWidth="22" fill="none" strokeLinecap="round"/>
     {awake && <>
      <ellipse cx="400" cy="312" rx="13" ry="7" fill="#252331"/>
      <ellipse cx="475" cy="312" rx="13" ry="7" fill="#252331"/>
      <path d="M410 365 Q440 350 465 365" stroke="#9f5f62" strokeWidth="7" fill="none" strokeLinecap="round"/>
     </>}
     {!awake && <path d="M390 315 Q405 325 420 315 M460 315 Q475 325 490 315" stroke="#674b4d" strokeWidth="7" fill="none" strokeLinecap="round"/>}
    </g>
    {/* near arm */}
    <g transform={`rotate(${arm} 540 420)`}>
      <path d={reaching?"M520 415 Q620 360 680 280":"M520 415 Q610 450 680 520"} stroke={P.skin} strokeWidth="55" strokeLinecap="round" fill="none"/>
      <path d={reaching?"M680 280 Q700 250 720 265":"M680 520 Q700 535 720 525"} stroke={P.skin} strokeWidth="38" strokeLinecap="round" fill="none"/>
     </g>
   </g>
  </svg>
 </div>;
};

const Bubble:React.FC<{children:React.ReactNode;top:number;start:number}> = ({children,top,start})=>{
 const f=useCurrentFrame(); const {fps}=useVideoConfig();
 const p=spring({frame:f-start,fps,config:{damping:15,stiffness:150}});
 return <div style={{position:"absolute",top,left:"9%",maxWidth:"78%",padding:"23px 28px",borderRadius:"25px 25px 25px 5px",
   background:P.bubble,border:"1px solid #65647a",color:P.cream,fontFamily:"Arial",fontSize:30,lineHeight:1.3,
   opacity:fade(f,start,start+8),transform:`scale(${interpolate(p,[0,1],[.75,1])}) translateY(${interpolate(p,[0,1],[18,0])}px)`,
   boxShadow:"0 12px 30px rgba(0,0,0,.25)"}}>{children}</div>;
};

const SceneTag:React.FC<{n:string;label:string}> = ({n,label})=>(
 <div style={{position:"absolute",bottom:"7%",left:"9%",display:"flex",gap:18,alignItems:"center"}}>
  <span style={{color:P.gold,fontSize:23,fontFamily:"Arial",letterSpacing:4,fontWeight:700}}>{n}</span>
  <span style={{color:"#bcb9c5",fontSize:21,fontFamily:"Arial",letterSpacing:3}}>{label}</span>
 </div>
);

const Scene1:React.FC=()=>{
 const f=useCurrentFrame();
 const zoom=interpolate(f,[0,150],[1,1.045]);
 return <AbsoluteFill>
  <Room/>
  <div style={{position:"absolute",inset:0,transform:`scale(${zoom})`}}><Character/></div>
  <Eyebrow top={160}>CERITA TUBUH MANUSIA</Eyebrow>
  <Type top={235} size={58} start={8}>Pernah nggak, kamu terbangun tengah malam...</Type>
  <Type top={390} size={43} start={52}>tapi tubuhmu terasa seperti terkunci?</Type>
  <SceneTag n="01" label="TERBANGUN"/>
 </AbsoluteFill>;
};

const Scene2:React.FC=()=>{
 const f=useCurrentFrame();
 const darkness=interpolate(Math.sin(f/8),[-1,1],[.05,.25]);
 return <AbsoluteFill>
  <Room shake={darkness}/>
  <Character awake frozen shadow/>
  <Eyebrow top={145}>PUKUL 02:17</Eyebrow>
  <Type top={220} size={48} start={4}>Kamu sadar.</Type>
  <Type top={300} size={48} start={25}>Kamu ingin bergerak.</Type>
  <Type top={380} size={48} start={47}>Tapi tubuhmu tidak merespons.</Type>
  <Bubble top={650} start={82}>Kenapa aku nggak bisa bergerak?</Bubble>
  <div style={{position:"absolute",top:"68%",left:"9%",fontFamily:"Arial",fontSize:25,color:P.muted,letterSpacing:2}}>ADA SESUATU DI SUDUT KAMAR...</div>
  <SceneTag n="02" label="TUBUH TERKUNCI"/>
 </AbsoluteFill>;
};

const Scene3:React.FC=()=>{
 const f=useCurrentFrame();
 const q=spring({frame:f-12,fps:30,config:{damping:18}});
 return <AbsoluteFill style={{background:"#171b2b",justifyContent:"center",alignItems:"center"}}>
  <div style={{position:"absolute",top:"17%",...sans,color:P.gold,fontSize:24,letterSpacing:6}}>SEBENARNYA APA YANG TERJADI?</div>
  <div style={{...txt,fontSize:300,fontWeight:700,color:"#77748d",opacity:.2,transform:`scale(${interpolate(q,[0,1],[.5,1])})`}}>?</div>
  <Type top={600} size={55} align="center" width="84%" start={10}>Bukan karena ada makhluk yang menindihmu.</Type>
  <div style={{position:"absolute",top:"59%",left:"8%",right:"8%",padding:"28px 20px",background:P.gold,color:"#252434",fontSize:42,fontWeight:900,textAlign:"center",fontFamily:"Arial",transform:`rotate(${interpolate(f,[0,30],[2,0])}deg)`}}>ADA PENJELASAN ILMIAH.</div>
  <SceneTag n="03" label="MISTERI TERJAWAB"/>
 </AbsoluteFill>;
};

const Scene4:React.FC=()=>{
 const f=useCurrentFrame();
 const pulse=1+Math.sin(f/9)*.025;
 return <AbsoluteFill style={{background:"linear-gradient(145deg,#1b2032,#29334b)"}}>
  <Eyebrow top={150}>FASE TIDUR REM</Eyebrow>
  <Type top={220} size={65} start={3}>OTAK TETAP AKTIF.</Type>
  <div style={{position:"absolute",top:480,left:"25%",transform:`scale(${pulse})`}}><BrainGraphic/></div>
  <Type top={1100} size={39} start={25}>Saat bermimpi, otak mengaktifkan mekanisme yang membuat sebagian besar otot tubuh sementara tidak bergerak.</Type>
  <div style={{position:"absolute",bottom:"15%",left:"9%",right:"9%",height:8,background:"#53566e",borderRadius:8}}>
   <div style={{width:`${interpolate(f,[0,150],[5,100])}%`,height:"100%",background:P.gold,borderRadius:8}}/>
  </div>
  <SceneTag n="04" label="PENJELASAN ILMIAH"/>
 </AbsoluteFill>;
};

const BrainGraphic:React.FC=()=>(
 <svg width="540" height="540" viewBox="0 0 540 540">
  <defs><radialGradient id="b"><stop stopColor="#c4b2d5"/><stop offset="1" stopColor="#62698f"/></radialGradient></defs>
  <path d="M270 75 C190 30 105 95 125 180 C55 235 100 325 170 330 C160 420 250 455 275 395 C310 450 390 400 370 330 C450 300 425 210 375 185 C395 105 315 45 270 75Z" fill="url(#b)" stroke="#d8cde2" strokeWidth="10"/>
  <g fill="none" stroke="#e8d9e8" strokeWidth="8" opacity=".7"><path d="M180 110 Q230 150 190 210 T220 320"/><path d="M270 85 Q230 170 285 220 T270 360"/><path d="M340 125 Q290 185 355 245 T330 320"/><path d="M130 235 Q200 230 225 270"/><path d="M300 260 Q360 220 400 260"/></g>
  <circle cx="275" cy="230" r="34" fill="#e9c47f"/><circle cx="275" cy="230" r="68" fill="none" stroke="#e9c47f" strokeWidth="5" opacity=".5"/>
 </svg>
);

const Scene5:React.FC=()=>{
 const f=useCurrentFrame();
 return <AbsoluteFill>
  <Room/>
  <Character awake frozen/>
  <Eyebrow top={150}>SAAT KITA TERBANGUN</Eyebrow>
  <Type top={235} size={45} start={4}>Kesadaran bisa kembali lebih dulu...</Type>
  <Type top={365} size={45} start={35}>sementara otot masih dalam kondisi lumpuh sementara.</Type>
  <div style={{position:"absolute",top:"60%",left:"9%",right:"9%",display:"flex",flexDirection:"column",gap:18}}>
   <div style={{padding:22,background:"#29364b",borderLeft:`7px solid ${P.gold}`,fontFamily:"Arial",fontSize:31,color:P.cream}}>OTAK — SUDAH BANGUN</div>
   <div style={{padding:22,background:"#35344c",borderLeft:"7px solid #8c87a7",fontFamily:"Arial",fontSize:31,color:P.cream}}>TUBUH — MASIH DALAM MODE REM</div>
  </div>
  <SceneTag n="05" label="OTAK DAN TUBUH"/>
 </AbsoluteFill>;
};

const Scene6:React.FC=()=>{
 const f=useCurrentFrame();
 const warm=interpolate(f,[0,150],[0,.38]);
 return <AbsoluteFill>
  <Room warm={warm}/>
  <Character awake sitting/>
  <Eyebrow top={145}>SEKARANG KAMU TAHU</Eyebrow>
  <Type top={225} size={46} start={5}>Ketindihan umumnya bukan hal mistis.</Type>
  <Type top={360} size={40} start={38}>Ini adalah fenomena saat otak dan tubuh belum sepenuhnya sinkron ketika bangun tidur.</Type>
  <div style={{position:"absolute",bottom:"8%",left:"7%",right:"7%",background:"#e1c99e",padding:"28px 22px",transform:"rotate(-1deg)",color:"#252434",fontFamily:"Georgia",fontSize:42,textAlign:"center",lineHeight:1.2,fontWeight:700}}>
   TUBUH KITA PUNYA CERITANYA SENDIRI.
  </div>
 </AbsoluteFill>;
};

export const SleepParalysis:React.FC=()=>{
 const f=useCurrentFrame();
 const sceneStarts=[0,150,300,420,570,720];
 const scenes=[<Scene1/>,<Scene2/>,<Scene3/>,<Scene4/>,<Scene5/>,<Scene6/>];
 return <AbsoluteFill style={{background:P.ink}}>
  {scenes.map((scene,i)=>{
   const start=sceneStarts[i];
   const duration=i===5?180:(sceneStarts[i+1]-start+18);
   return <Sequence key={i} from={start} durationInFrames={duration}>
    <SceneLayer duration={duration}>{scene}</SceneLayer>
   </Sequence>;
  })}
  <div style={{position:"absolute",top:38,left:50,right:50,height:5,background:"rgba(255,255,255,.15)",borderRadius:10}}>
   <div style={{height:"100%",width:`${(f/900)*100}%`,background:P.gold,borderRadius:10}}/>
  </div>
  <div style={{position:"absolute",inset:0,border:"16px solid rgba(8,10,18,.18)",pointerEvents:"none"}}/>
 </AbsoluteFill>;
};
const SceneLayer:React.FC<{children:React.ReactNode;duration:number}> = ({children,duration})=>{
 const local=useCurrentFrame();
 const opacity=interpolate(local,[0,9,duration-9,duration],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 const zoom=interpolate(local,[0,duration],[1.025,1],{extrapolateRight:"clamp"});
 return <AbsoluteFill style={{opacity,transform:`scale(${zoom})`}}>{children}</AbsoluteFill>;
};
