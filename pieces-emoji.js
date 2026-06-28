/* Fun emoji pieces + chess-symbol pieces + kid quips.
   Side is shown by the badge colour (light = White, dark = Black),
   so the emoji per type can be silly without losing who-owns-what.
   Armies are re-rolled each New Game for novelty (variable reward). */

/* pools — King and Queen pools are DISJOINT so they never look alike */
var POOL={
  K:['🐸','🦁','🦖','🧛','🐲','🤴'],   /* frog-prince, lion, dino, vampire, dragon, prince */
  Q:['👸','🧜','🦚','👑','🧝','🦩'],   /* princess, mermaid, peacock, crown, elf, flamingo */
  R:['🏰','🗼','🏯','🛕','🗿'],          /* castle, tower, pagoda, temple, moai */
  B:['⛪','🐘','🎩','🧙','🦒'],          /* church, elephant, hat, wizard, giraffe */
  N:['🐴','🦄','🐎','🦓','🐫'],          /* horse, unicorn, racehorse, zebra, camel */
  P:['🦐','🪖','🐥','🍄','🐌','🌰']       /* PRAWN, soldier, chick, mushroom, snail, chestnut */
};
var SYMW={K:'♔',Q:'♕',R:'♖',B:'♗',N:'♘',P:'♙'};
var SYMB={K:'♚',Q:'♛',R:'♜',B:'♝',N:'♞',P:'♟'};

var ARMY_W=null, ARMY_B=null;
function rollArmy(){var m={},t,k=['K','Q','R','B','N','P'];for(var i=0;i<k.length;i++){t=k[i];m[t]=POOL[t][Math.floor(Math.random()*POOL[t].length)];}return m;}
function buildArmies(){ ARMY_W=rollArmy(); ARMY_B=rollArmy(); }

function pieceEmoji(p){
  if(!p) return '';
  if(!ARMY_W) buildArmies();
  var white=(p===p.toUpperCase()), t=p.toUpperCase();
  var e = white?ARMY_W[t]:ARMY_B[t];
  var d=Math.round((CELL||60)*0.9), fs=Math.round((CELL||60)*0.56);
  var st="width:"+d+"px;height:"+d+"px;line-height:"+d+"px;font-size:"+fs+"px";
  return "<span class='badge "+(white?'wb':'bb')+"' style='"+st+"'>"+e+"</span>";
}
function pieceSym(p){
  if(!p) return '';
  var white=(p===p.toUpperCase()), t=p.toUpperCase();
  var fs=Math.round((CELL||60)*0.82);
  return "<span class='sym' style='font-size:"+fs+"px'>"+(white?SYMW[t]:SYMB[t])+"</span>";
}

/* kid-friendly quips, shown at random (~1 in 3) when emoji style is on */
var QUIPS=['Good move!','Ha! I see your trick 😏','I’ll get you next time!','Ooh, brave! 😮',
  'Nice one!','Hmm, tricky…','My turn to shine! ✨','Uh oh…','You’re good at this!',
  'Gotcha! 😜','Take that!','Clever clogs!','Beep boop… thinking 🤖','Is that your best? 😄',
  'Well played!','Watch this! 🪄','Sneaky… I like it'];
var QUIPS_YOUWIN=['Aw, you got me! 🏆','GG — you win!','Champion! 👑','You beat me! 🎉'];
var QUIPS_CPUWIN=['Checkmate! 😎','Got you — rematch?','Hehe, I win this one! 🤖','So close! 😜'];
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
