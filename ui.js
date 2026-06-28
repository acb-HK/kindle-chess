/* ============================================================
   Kindle Chess — shared board UI controller. ES5 only.
   Needs: pieceSVG() (svg-pieces.js). Optional: pieceEmoji/pieceSym/
   buildArmies/QUIPS (pieces-emoji.js) for emoji + symbol styles.
   Page provides: #status #boardwrap #moves and controls
   #mode #side #level #style (+ optional #quip).
   ============================================================ */
var G = {
  board:null, turn:W, sel:null, castle:null, ep:null,
  hist:[], sanW:[], sanB:[], over:false, thinking:false,
  mode:'cpu', humanSide:'w', level:2, style:'svg'
};

function $(id){return document.getElementById(id);}
function readControls(){
  if($('mode'))  G.mode = $('mode').value;
  if($('side'))  G.humanSide = $('side').value;
  if($('level')) G.level = parseInt($('level').value,10);
  if($('style')) G.style = $('style').value;
}
function setStatus(t){ $('status').innerHTML = t; }
function showQuip(t){ var q=$('quip'); if(q) q.innerHTML = t?('<span class="bubble">'+t+'</span>'):''; }
function clearQuip(){ showQuip(''); }

function setStyle(v){
  G.style=v;
  if(v==='emoji' && typeof buildArmies==='function') buildArmies();
  if(v!=='emoji') clearQuip();
  render();
}

function newGame(){
  readControls();
  if(G.style==='emoji' && typeof buildArmies==='function') buildArmies();
  G.board=startPos(); G.turn=W; G.sel=null;
  G.castle={wk:true,wq:true,bk:true,bq:true}; G.ep=null;
  G.hist=[]; G.sanW=[]; G.sanB=[]; G.over=false; G.thinking=false;
  clearQuip(); render(); renderMoves(); announceTurn();
  if(G.mode==='cpu' && G.humanSide==='b'){ G.thinking=true; setStatus('Computer thinking…'); setTimeout(computerMove,60); }
}

/* board view: flip only when playing Black vs computer. In 2-player the
   board stays put and Black's PIECES are rotated 180° (opponent's view). */
function viewFlipped(){ return G.mode==='cpu' && G.humanSide==='b'; }
function humanToMove(){
  if(G.over||G.thinking) return false;
  if(G.mode==='2p') return true;
  return G.turn===G.humanSide;
}

function renderPiece(p){
  if(!p) return '';
  var html;
  if(G.style==='emoji' && typeof pieceEmoji==='function') html=pieceEmoji(p);
  else if(G.style==='sym' && typeof pieceSym==='function') html=pieceSym(p);
  else html=pieceSVG(p);
  if(G.mode==='2p' && colorOf(p)===B) html="<span class='flip180'>"+html+"</span>";
  return html;
}
function render(){
  var flip=viewFlipped();
  var legal = G.sel ? movesFrom(G.sel.r,G.sel.c) : [];
  var html='<table class="board">';
  for(var dr=0;dr<8;dr++){ html+='<tr>';
    for(var dc=0;dc<8;dc++){
      var r=flip?7-dr:dr, c=flip?7-dc:dc;
      var cls=((r+c)%2===0)?'lt':'dk';
      if(G.sel&&G.sel.r===r&&G.sel.c===c)cls+=' sel';
      else{for(var k=0;k<legal.length;k++){if(legal[k].tr===r&&legal[k].tc===c){cls+=' dot';break;}}}
      var labels='';
      if(dc===0) labels+='<span class="coord rank">'+(8-r)+'</span>';
      if(dr===7) labels+='<span class="coord file">'+String.fromCharCode(97+c)+'</span>';
      html+='<td class="'+cls+'" onclick="tap('+r+','+c+')">'+labels+renderPiece(G.board[r][c])+'</td>';
    }
    html+='</tr>';
  }
  html+='</table>';
  $('boardwrap').innerHTML=html;
}
function movesFrom(r,c){
  var all=legalMoves(G.board,G.turn,G.castle,G.ep),out=[];
  for(var i=0;i<all.length;i++){if(all[i].fr===r&&all[i].fc===c)out.push(all[i]);}
  return out;
}

function tap(r,c){
  if(!humanToMove())return;
  var p=G.board[r][c];
  if(G.sel){
    var ms=legalMoves(G.board,G.turn,G.castle,G.ep),chosen=null;
    for(var i=0;i<ms.length;i++){var m=ms[i];
      if(m.fr===G.sel.r&&m.fc===G.sel.c&&m.tr===r&&m.tc===c){chosen=m;break;}}
    if(chosen){ doMove(chosen); return; }
    if(p&&colorOf(p)===G.turn){ G.sel={r:r,c:c}; render(); return; }
    G.sel=null; render(); return;
  }
  if(p&&colorOf(p)===G.turn){ G.sel={r:r,c:c}; render(); }
}
function pushSAN(s,color){ if(color===W)G.sanW.push(s); else G.sanB.push(s); }

function doMove(m){
  clearQuip();
  G.hist.push({board:clone(G.board),castle:{wk:G.castle.wk,wq:G.castle.wq,bk:G.castle.bk,bq:G.castle.bq},
               ep:G.ep,turn:G.turn,sanW:G.sanW.length,sanB:G.sanB.length});
  pushSAN(notation(G.board,m,G.turn,G.castle,G.ep),G.turn);
  var st=applyMove(G.board,m,G.castle,G.turn);
  G.board=st.board; G.castle=st.castle; G.ep=st.ep; G.sel=null; G.turn=other(G.turn);
  render(); renderMoves();
  if(checkEnd()) return;
  if(G.mode==='cpu' && G.turn!==G.humanSide){
    G.thinking=true; setStatus('Computer thinking…'); setTimeout(computerMove,60);
  } else announceTurn();
}
function computerMove(){
  var m=pickMove(G.board,G.turn,G.castle,G.ep,G.level);
  if(m){
    pushSAN(notation(G.board,m,G.turn,G.castle,G.ep),G.turn);
    var st=applyMove(G.board,m,G.castle,G.turn);
    G.board=st.board; G.castle=st.castle; G.ep=st.ep;
  }
  G.turn=other(G.turn); G.thinking=false;
  render(); renderMoves();
  if(checkEnd()) return;
  announceTurn();
  if(G.style==='emoji' && typeof QUIPS!=='undefined' && Math.random()<0.32) showQuip(pick(QUIPS));
}
function announceTurn(){
  var chk = inCheck(G.board,G.turn) ? 'Check! ' : '';
  if(G.mode==='2p') setStatus(chk + (G.turn===W?'White':'Black') + ' to move');
  else setStatus(chk + (G.turn===G.humanSide ? 'Your move' : 'Computer to move'));
}
function checkEnd(){
  var moves=legalMoves(G.board,G.turn,G.castle,G.ep);
  if(moves.length>0) return false;
  G.over=true; G.thinking=false;
  if(inCheck(G.board,G.turn)){
    var winner = G.turn===W ? 'Black' : 'White';
    if(G.mode==='cpu'){
      var youWin = (other(G.turn)===G.humanSide);
      setStatus('Checkmate — ' + (youWin?'you win! 🏆':'computer wins.'));
      if(G.style==='emoji' && typeof QUIPS_YOUWIN!=='undefined') showQuip(pick(youWin?QUIPS_YOUWIN:QUIPS_CPUWIN));
    } else setStatus('Checkmate — ' + winner + ' wins! 🏆');
  } else setStatus('Stalemate — draw.');
  return true;
}
function renderMoves(){
  if(!$('moves'))return;
  var n=Math.max(G.sanW.length,G.sanB.length), html='', i;
  for(i=0;i<n;i++){ html+='<b>'+(i+1)+'.</b> '+(G.sanW[i]||'')+'  '+(G.sanB[i]||'')+'  '; }
  $('moves').innerHTML = html || '<i>No moves yet.</i>';
}
function undo(){
  if(G.thinking)return;
  var back = (G.mode==='cpu') ? 2 : 1;
  while(back-->0 && G.hist.length>0){
    var s=G.hist.pop();
    G.board=s.board; G.castle=s.castle; G.ep=s.ep; G.turn=s.turn;
    G.sanW.length=s.sanW; G.sanB.length=s.sanB;
  }
  G.sel=null; G.over=false; clearQuip();
  render(); renderMoves(); announceTurn();
}
function onControlChange(){ newGame(); }
