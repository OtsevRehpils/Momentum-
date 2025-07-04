
/* Momentum Card Game minimal demo - Start screen + music + simple UI */

const { useState, useEffect, useRef } = React;

/* ===== Helper data ===== */
const COLOURS = ["Red","Blue"];
const VALUES = { Handball:1,Bounce:1,Kick:1,"Kick & Mark":1,Mark:0,Torp:3,Banana:3 };
const DEFENCE = ["Tackle","Smother","Tackle — HTB","Intercept Mark"];
const PER_COLOUR = {Handball:8,Bounce:8,Kick:8,"Kick & Mark":5,Mark:5,Torp:4,Banana:4,
                    Tackle:3,Smother:3,"Tackle — HTB":3,"Intercept Mark":4};
const shuffle=a=>[...a].sort(()=>Math.random()-0.5);
function buildDeck(){
  const d=[];
  for(const col of COLOURS){
    for(const [name,count] of Object.entries(PER_COLOUR)){
      for(let i=0;i<count;i++) d.push({name,colour:col,type:DEFENCE.includes(name)?'def':'mom'});
    }
  }
  d.push({name:"Siren",type:"wild"});
  return shuffle(d);
}

/* ===== React Component ===== */
function MomentumApp(){
  const [showStart,setShowStart]=useState(true);
  const audioRef = useRef(null);

  const startGame=()=>{
    setShowStart(false);
    audioRef.current.pause();
  };

  if(showStart){
    return (
      <div style={{height:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',background:'#f9f6ee'}} onClick={()=>audioRef.current.play()}>
        <audio ref={audioRef} loop>
          <source src="https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/kevin_macleod/machinima-sound/kevin_macleod_-_march_of_the_brave.mp3" type="audio/mpeg"/>
        </audio>
        <h1 style={{fontSize:'3rem',fontFamily:'Impact, sans-serif',color:'#b41d24',textShadow:'2px 2px 0 #043b6c'}}>MOMENTUM</h1>
        <p style={{letterSpacing:2,color:'#043b6c',marginTop:-10}}>The Aussie Rules Card Game</p>
        <button onClick={startGame} style={{marginTop:30,padding:'10px 26px',fontSize:'1.1rem',fontWeight:600,color:'#fff',background:'linear-gradient(90deg,#b41d24 0%,#b41d24 50%,#043b6c 50%,#043b6c 100%)',border:'none',borderRadius:8,cursor:'pointer'}}>Play Game</button>
      </div>
    );
  }

  /* Placeholder for full game - you can extend further */
  return (
    <div style={{padding:20}}>
      <h2>Game Screen Coming Soon</h2>
      <p>This placeholder confirms React renders after the start screen.</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<MomentumApp/>);
