import React from "react";
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig,
  Sequence, Easing
} from "remotion";

const C = {
  bg: "#171b2b", wall: "#25283a", wall2: "#303248", floor: "#111522",
  bed: "#4c4d69", blanket: "#686783", skin: "#e6b59b",
  hair: "#292637", shirt: "#777f91", gold: "#d6b77c",
  text: "#f1eee8", muted: "#b8b5bd", bubble: "#252d3d"
};

const txt: React.CSSProperties = {
  color: C.text, fontFamily: "Georgia, 'Times New Roman', serif",
  textShadow: "0 3px 18px rgba(0,0,0,.35)"
};

const sans: React.CSSProperties = {
  color: C.text, fontFamily: "Arial, Helvetica, sans-serif",
  letterSpacing: 1
};

const Room: React.FC<{light?: number}> = ({light=0}) => (
  <AbsoluteFill style={{background: C.bg, overflow: "hidden"}}>
    <div style={{position:"absolute", inset:"0 0 34% 0", background:C.wall}} />
    <div style={{position:"absolute", top:"10%", left:"9%", width:"31%", height:"22%", background:"#20283c", border:"10px solid #3b3c50", boxShadow:"0 0 50px #101726"}}>
      <div style={{position:"absolute", inset:0, background:"linear-gradient(135deg,#283b58,#18243a)"}}/>
      <div style={{position:"absolute", width:18, height:18, borderRadius:50, background:"#e9d6a6", top:"20%", right:"18%", boxShadow:"0 0 28px #e9d6a6"}}/>
      <div style={{position:"absolute", left:"50%", top:0, bottom:0, width:5, background:"#3e465a"}}/>
      <div style={{position:"absolute", top:"50%", left:0, right:0, height:5, background:"#3e465a"}}/>
    </div>
    <div style={{position:"absolute", top:"12%", right:"12%", width:"20%", height:"25%", background:"#202235", border:"8px solid #3c3b4d", opacity:.8}}/>
    <div style={{position:"absolute", bottom:"31%", left:0, right:0, height:14, background:"#3c3a4b"}}/>
    <div style={{position:"absolute", bottom:0, left:0, right:0, height:"31%", background:C.floor}}/>
    <div style={{position:"absolute", top:"18%", left:"47%", width:2, height:"16%", background:"#776d66"}}/>
    <div style={{position:"absolute", top:"31%", left:"44%", width:65, height:24, borderRadius:"50%", background:"#c3a979", boxShadow:"0 0 35px #c3a979"}}/>
    {light > 0 && <div style={{position:"absolute", inset:0, background:`rgba(238,190,125,${light})`}}/>}
  </AbsoluteFill>
);

const Character: React.FC<{awake?:boolean; sitting?:boolean; shadow?:boolean}> = ({awake=false,sitting=false,shadow=false}) => (
  <div style={{position:"absolute", left:"18%", bottom:"24%", width:"66%", height:"28%"}}>
    <div style={{position:"absolute", left:"2%", bottom:0, width:"96%", height:"48%", background:C.bed, borderRadius:"22px 22px 5px 5px", boxShadow:"0 20px 30px #090d17"}}/>
    <div style={{position:"absolute", left:"4%", bottom:"40%", width:"92%", height:"30%", background:C.blanket, borderRadius:"30px 30px 0 0"}}/>
    <div style={{position:"absolute", left:"17%", bottom:"58%", width:"32%", height:"20%", background:"#d4c8c1", borderRadius:"18px"}}/>
    <div style={{position:"absolute", left:"29%", bottom:"67%", width:"18%", height:"22%", background:C.skin, borderRadius:"50%", transform:sitting?"rotate(-8deg)":"rotate(8deg)"}}>
      <div style={{position:"absolute", top:"-8%", left:"-4%", width:"105%", height:"48%", background:C.hair, borderRadius:"70% 65% 20% 20%"}}/>
      {awake && <><div style={{position:"absolute", top:"48%", right:"18%", width:8, height:5, borderRadius:5, background:"#282330"}}/><div style={{position:"absolute", top:"48%", right:"42%", width:8, height:5, borderRadius:5, background:"#282330"}}/></>}
    </div>
    {sitting && <div style={{position:"absolute", left:"39%", bottom:"35%", width:"10%", height:"36%", background:C.skin, borderRadius:20, transform:"rotate(-35deg)"}}/>}
    {shadow && <div style={{position:"absolute", right:"-2%", bottom:"65%", width:"22%", height:"85%", background:"#080b14", borderRadius:"48% 48% 12% 12%", opacity:.88, filter:"blur(2px)"}}>
      <div style={{position:"absolute", top:"18%", left:"25%", width:7, height:7, borderRadius:50, background:"#c5b6a0", boxShadow:"25px 0 #c5b6a0, 0 0 15px #c5b6a0"}}/>
    </div>}
  </div>
);

const Caption: React.FC<{children: React.ReactNode; top?: string; delay?: number; size?: number}> = ({children,top="13%",delay=0,size=48}) => {
  const f=useCurrentFrame();
  const {fps}=useVideoConfig();
  const p=spring({frame:f-delay, fps, config:{damping:18, stiffness:100}});
  return <div style={{position:"absolute", top, left:"9%", right:"9%", opacity:interpolate(p,[0,1],[0,1]), transform:`translateY(${interpolate(p,[0,1],[35,0])}px)`, ...txt, fontSize:size, lineHeight:1.25, textAlign:"left"}}>{children}</div>;
};

const SmallLabel: React.FC<{children:React.ReactNode}> = ({children}) => (
  <div style={{...sans, fontSize:22, letterSpacing:5, color:C.gold, textAlign:"center", textTransform:"uppercase"}}>{children}</div>
);

const Scene1: React.FC = () => {
  const f=useCurrentFrame();
  const zoom=interpolate(f,[0,150],[1,1.08]);
  return <AbsoluteFill><Room/><div style={{position:"absolute", inset:0, transform:`scale(${zoom})`}}><Character awake={f>105}/></div>
    <Caption top="9%" delay={8} size={48}>Pernah nggak, kamu terbangun tengah malam...</Caption>
    <Caption top="18%" delay={45} size={42}>sadar sepenuhnya, tapi tiba-tiba nggak bisa menggerakkan tubuh?</Caption>
    <div style={{position:"absolute",bottom:"10%",left:"9%"}}><SmallLabel>01 — TERBANGUN</SmallLabel></div>
  </AbsoluteFill>;
};

const Scene2: React.FC = () => {
  const f=useCurrentFrame();
  const pulse=interpolate(Math.sin(f/5),[-1,1],[.18,.48]);
  return <AbsoluteFill><Room/><Character awake shadow/>
    <div style={{position:"absolute",inset:0,background:`rgba(5,8,17,${pulse})`}}/>
    <Caption top="9%" size={44}>Kamu mencoba berteriak.</Caption>
    <Caption top="16%" delay={28} size={44}>Mencoba mengangkat tangan.</Caption>
    <Caption top="23%" delay={55} size={44}>Tapi semuanya seperti terkunci.</Caption>
    <div style={{position:"absolute",bottom:"10%",left:"9%",right:"9%",background:"rgba(20,25,39,.92)",border:"1px solid #55536a",borderRadius:24,padding:"25px 30px",...sans,fontSize:30,lineHeight:1.35}}>
      <span style={{color:C.gold}}>KAMU:</span> "Ada... siapa di sana?"
    </div>
  </AbsoluteFill>;
};

const Scene3: React.FC = () => {
  const f=useCurrentFrame();
  const q=interpolate(f,[0,30],[.7,1],{extrapolateRight:"clamp"});
  return <AbsoluteFill style={{background:"#171b2b",justifyContent:"center",alignItems:"center"}}>
    <div style={{...txt,fontSize:210,color:"#55536c",opacity:.22,transform:`scale(${q})`}}>?</div>
    <div style={{position:"absolute",top:"22%",left:"10%",right:"10%",...txt,fontSize:52,textAlign:"center",lineHeight:1.3}}>Apa sebenarnya yang sedang terjadi?</div>
    <div style={{position:"absolute",top:"43%",left:"8%",right:"8%",background:C.gold,padding:"25px 15px",transform:"rotate(-2deg)",color:"#20202b",fontFamily:"Arial",fontWeight:800,fontSize:39,textAlign:"center",letterSpacing:1}}>ADA PENJELASAN ILMIAH?</div>
    <div style={{position:"absolute",bottom:"13%"}}><SmallLabel>BUKAN SEKADAR MIMPI</SmallLabel></div>
  </AbsoluteFill>;
};

const Brain: React.FC = () => (
  <svg width="520" height="520" viewBox="0 0 520 520">
    <defs><radialGradient id="brain"><stop stopColor="#b6a4cb"/><stop offset="1" stopColor="#555b86"/></radialGradient></defs>
    <path d="M260 85 C180 35 105 105 130 180 C65 225 110 315 165 320 C165 405 245 430 260 385 C285 435 365 400 355 330 C430 300 420 220 365 190 C390 110 315 55 260 85Z" fill="url(#brain)" stroke="#d0c3d9" strokeWidth="9"/>
    <g fill="none" stroke="#e1d6e8" strokeWidth="8" opacity=".7"><path d="M180 115 Q220 145 185 195 T205 280"/><path d="M270 95 Q230 155 280 205 T260 340"/><path d="M330 125 Q290 175 345 225 T320 310"/><path d="M135 220 Q190 230 210 250"/><path d="M300 245 Q350 220 380 250"/></g>
    <circle cx="265" cy="235" r="30" fill="#e9c47f" opacity=".9"/><circle cx="265" cy="235" r="55" fill="none" stroke="#e9c47f" strokeWidth="5" opacity=".4"/>
  </svg>
);

const Scene4: React.FC = () => {
  const f=useCurrentFrame();
  const s=interpolate(f,[0,40],[.8,1],{extrapolateRight:"clamp"});
  return <AbsoluteFill style={{background:"linear-gradient(145deg,#171b2b,#202b42)",alignItems:"center"}}>
    <div style={{position:"absolute",top:"9%"}}><SmallLabel>FAKTA TUBUH</SmallLabel></div>
    <div style={{position:"absolute",top:"19%",...txt,fontSize:65,fontWeight:700,textAlign:"center"}}>SLEEP PARALYSIS</div>
    <div style={{position:"absolute",top:"30%",transform:`scale(${s})`}}><Brain/></div>
    <div style={{position:"absolute",top:"59%",left:"10%",right:"10%",background:"#2b3348",border:"1px solid #77738b",borderRadius:20,padding:28,...sans,fontSize:31,lineHeight:1.4,textAlign:"center"}}>
      <span style={{color:C.gold,fontWeight:700}}>FASE REM</span><br/>Saat bermimpi, otak membuat sebagian besar otot tubuh sementara tidak bergerak.
    </div>
    <div style={{position:"absolute",bottom:"10%"}}><SmallLabel>MEKANISME ALAMI</SmallLabel></div>
  </AbsoluteFill>;
};

const Scene5: React.FC = () => {
  const f=useCurrentFrame();
  const glow=interpolate(f,[0,100],[0,.18]);
  return <AbsoluteFill><Room light={glow}/><Character awake/>
    <div style={{position:"absolute",top:"8%",left:"9%",right:"9%",...txt,fontSize:43,lineHeight:1.35}}>Kadang, kesadaran kita kembali lebih dulu...</div>
    <div style={{position:"absolute",top:"24%",left:"9%",right:"9%",...txt,fontSize:43,lineHeight:1.35}}>sementara mekanisme kelumpuhan otot belum selesai.</div>
    <div style={{position:"absolute",bottom:"9%",left:"8%",right:"8%",background:"#252d3d",padding:28,borderRadius:18,...sans,fontSize:29,lineHeight:1.4}}>
      <span style={{color:C.gold}}>OTAK:</span> sudah terbangun<br/>
      <span style={{color:C.gold}}>TUBUH:</span> masih dalam mode tidur
    </div>
  </AbsoluteFill>;
};

const Scene6: React.FC = () => {
  const f=useCurrentFrame();
  const warm=interpolate(f,[0,70],[0,.42],{extrapolateRight:"clamp"});
  return <AbsoluteFill><Room light={warm}/><Character sitting/>
    <div style={{position:"absolute",top:"8%",left:"9%",right:"9%",...txt,fontSize:43,lineHeight:1.35}}>Jadi, ketindihan bukan berarti ada makhluk yang menindihmu.</div>
    <div style={{position:"absolute",top:"27%",left:"9%",right:"9%",...txt,fontSize:39,lineHeight:1.4}}>Ini fenomena ketika otak dan tubuh belum sepenuhnya sinkron saat bangun tidur.</div>
    <div style={{position:"absolute",bottom:"8%",left:"7%",right:"7%",background:"#d6c49f",padding:"30px 22px",transform:"rotate(-1deg)",color:"#20202b",fontFamily:"Georgia",fontSize:43,textAlign:"center",lineHeight:1.2}}>
      Menakutkan, tapi sekarang kamu tahu apa yang sebenarnya terjadi.
    </div>
  </AbsoluteFill>;
};

export const SleepParalysis: React.FC = () => (
  <AbsoluteFill style={{background:C.bg}}>
    <Sequence from={0} durationInFrames={150}><Scene1/></Sequence>
    <Sequence from={150} durationInFrames={180}><Scene2/></Sequence>
    <Sequence from={330} durationInFrames={120}><Scene3/></Sequence>
    <Sequence from={450} durationInFrames={150}><Scene4/></Sequence>
    <Sequence from={600} durationInFrames={150}><Scene5/></Sequence>
    <Sequence from={750} durationInFrames={150}><Scene6/></Sequence>
    <AbsoluteFill style={{pointerEvents:"none",border:"18px solid rgba(8,10,18,.22)"}}/>
    <div style={{position:"absolute",top:45,left:55,right:55,height:5,background:"rgba(255,255,255,.16)",borderRadius:5}}>
      <div style={{height:"100%",width:`${(useCurrentFrame()/900)*100}%`,background:C.gold,borderRadius:5}}/>
    </div>
  </AbsoluteFill>
);