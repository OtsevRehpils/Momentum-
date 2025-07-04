<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Momentum – Mobile Prototype</title>
<style>
  :root{
    --red:#b41d24;
    --blue:#043b6c;
    --cream:#faf8f1;
    --bg:#f0f0f0;
  }
  body{margin:0;font-family:system-ui,Helvetica,Arial;background:var(--bg);color:#111;display:flex;flex-direction:column;height:100vh;}
  header{padding:.75rem;background:var(--blue);color:#fff;text-align:center;font-weight:600;font-size:1.1rem;}
  #controls{display:flex;gap:.5rem;justify-content:center;padding:.5rem;flex-wrap:wrap;}
  button{flex:1 1 130px;padding:.6rem;font-size:1rem;border:none;border-radius:6px;color:#fff;font-weight:600;background:var(--red);}
  button:disabled{opacity:.4}
  #state{flex:0 0 auto;padding:.5rem;overflow-y:auto;}
  #players{display:flex;flex-direction:column;gap:.75rem;}
  .player{background:#fff;border-radius:6px;padding:.6rem;box-shadow:0 1px 3px rgba(0,0,0,.1);}
  .hand{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;}
  .card{background:var(--cream);border:1px solid #333;border-radius:3px;padding:2px 6px;font-size:.75rem;}
  #logwrap{flex:1 1 auto;display:flex;flex-direction:column;}
  #log{flex:1 1 auto;background:#fff;margin:.5rem;border-radius:6px;padding:.5rem;overflow-y:auto;font-size:.8rem;box-shadow:inset 0 1px 2px rgba(0,0,0,.1);} 
</style>
</head>
<body>
<header>Momentum – Mobile Prototype</header>
<div id="controls">
  <button id="startBtn">Start Game</button>
  <button id="turnBtn" disabled>Next Turn</button>
</div>
<div id="state"><div id="players"></div></div>
<div id="logwrap"><div id="log"></div></div>
<script>
/* ==== CONFIG ==== */
const COLOURS=["Red","Blue"];const ACTION_LIMIT=3;const DEF_PER_ROUND=1;const HAND_SIZE=7;const PLAYERS=4;
const MOM_VAL={"Handball":1,"Bounce":1,"Kick":1,"Kick & Mark":1,"Mark":0,"Torp":3,"Banana":3};
const COUNTS={"Handball":8,"Bounce":8,"Kick":8,"Kick & Mark":5,"Mark":5,"Torp":4,"Banana":4,"Tackle":3,"Smother":3,"Tackle — HTB":3,"Intercept Mark":4};
const UMP={{"High Tackle":2,"Not 15":2,"50 Metres":2,"Score Review":2}};
const WILD={{"Siren":1}};
const COUNTER_P={"Handball":0.59/3,"Bounce":0.35/3,"Kick":0.54/3,"Torp":0.54/3,"Banana":0.54/3};
/* ==== STATE ==== */
let G={};
const qs=id=>document.getElementById(id);
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function deckBuild(){const d=[];for(const colour of COLOURS){Object.entries(COUNTS).forEach(([n,c])=>{for(let i=0;i<c;i++)d.push({name:n,colour});});}
Object.entries(UMP).forEach(([n,c])=>{for(let i=0;i<c;i++)d.push({name:n,colour:null});});
Object.entries(WILD).forEach(([n,c])=>{for(let i=0;i<c;i++)d.push({name:n,colour:null});});
return shuffle(d);} 
function init(){G={deck:deckBuild(),discard:[],turns:0,defUsed:false,scoreCards:0,players:Array.from({length:PLAYERS},(_,i)=>({name:`P${i+1}`,hand:[],momentum:0,score:0}))};G.players.forEach(p=>{while(p.hand.length<HAND_SIZE)p.hand.push(G.deck.pop());});render();log('Game started');qs('turnBtn').disabled=false;}
function log(t){const el=qs('log');el.innerHTML+=t+'<br>';el.scrollTop=el.scrollHeight;}
function render(){const wrap=qs('players');wrap.innerHTML='';G.players.forEach(p=>{wrap.innerHTML+=`<div class="player"><b>${p.name}</b>  Score:${p.score}  Mom:${p.momentum}<div class="hand">${p.hand.map(c=>`<span class=card>${c.name}</span>`).join('')}</div></div>`});}
function playTurn(){const idx=G.turns%PLAYERS,pl=G.players[idx];if(idx===0)G.defUsed=false;let acts=0;while(acts<ACTION_LIMIT){const need=10-pl.momentum;if(need<=0)break;let card=pickCard(pl,need);if(!card)break; // no play
if(!G.defUsed&&Math.random()< (COUNTER_P[card.name]||0)){pl.momentum=Math.max(0,pl.momentum-1);G.defUsed=true;pl.hand.splice(pl.hand.indexOf(card),1);G.discard.push(card);log(`${pl.name}'s ${card.name} countered`);break;}
const inc=MOM_VAL[card.name]||0;pl.momentum+=inc;pl.hand.splice(pl.hand.indexOf(card),1);G.discard.push(card);log(`${pl.name} ➜ ${card.name} (+${inc})`);acts++;if(["Kick","Torp","Banana"].includes(card.name)&&pl.momentum>=10){const goal=Math.random()<0.33;pl.score+=goal?6:1;G.scoreCards++;log(`${pl.name} ${goal?'GOAL!':'Behind'}  (${pl.score})`);pl.momentum=goal?0:5;break;}}
while(pl.hand.length<HAND_SIZE&&G.deck.length)pl.hand.push(G.deck.pop());G.turns++;render();}
function pickCard(pl,need){const opts=pl.hand.filter(c=>MOM_VAL[c.name]!==undefined);if(!opts.length)return null;return opts[Math.floor(Math.random()*opts.length)];}
/* === EVENTS === */
qs('startBtn').onclick=init;qs('turnBtn').onclick=()=>{if(G.deck)playTurn();};
</script>
</body>
</html>
