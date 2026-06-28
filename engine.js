/* ============================================================
   Kindle Chess — shared engine (pure logic, no DOM).
   ES5 only for old Kindle WebKit. Used by index/emoji/puzzles.
   ============================================================ */
var W='w', B='b';

function startPos(){
  return [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R']
  ];
}
function clone(b){var n=[];for(var r=0;r<8;r++){n.push(b[r].slice());}return n;}
function isWhite(p){return p && p===p.toUpperCase();}
function isBlack(p){return p && p===p.toLowerCase();}
function colorOf(p){return p?(isWhite(p)?W:B):'';}
function other(c){return c===W?B:W;}
function onBoard(r,c){return r>=0&&r<8&&c>=0&&c<8;}

/* ---- coordinate naming ---- */
function sq(r,c){return String.fromCharCode(97+c)+(8-r);}      /* a1..h8 */
function parseSquare(s){return {r:8-parseInt(s.charAt(1),10), c:s.charCodeAt(0)-97};}

/* ---- move generation (pseudo-legal) ---- */
function mk(fr,fc,tr,tc,extra){var m={fr:fr,fc:fc,tr:tr,tc:tc};if(extra)for(var k in extra)m[k]=extra[k];return m;}
function genMoves(b,color,cst,epSq){
  var moves=[],r,c;
  for(r=0;r<8;r++)for(c=0;c<8;c++){
    var p=b[r][c]; if(!p||colorOf(p)!==color)continue;
    var up=p.toUpperCase();
    if(up==='P') pawnMoves(b,r,c,color,epSq,moves);
    else if(up==='N') stepMoves(b,r,c,color,moves,[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]);
    else if(up==='K'){ stepMoves(b,r,c,color,moves,[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]);
                       castleMoves(b,r,c,color,cst,moves); }
    else if(up==='B') slideMoves(b,r,c,color,moves,[[-1,-1],[-1,1],[1,-1],[1,1]]);
    else if(up==='R') slideMoves(b,r,c,color,moves,[[-1,0],[1,0],[0,-1],[0,1]]);
    else if(up==='Q') slideMoves(b,r,c,color,moves,[[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]);
  }
  return moves;
}
function pawnMoves(b,r,c,color,epSq,moves){
  var dir=color===W?-1:1, startRow=color===W?6:1, promoRow=color===W?0:7, nr=r+dir;
  if(onBoard(nr,c)&&!b[nr][c]){
    addPawn(moves,r,c,nr,c,nr===promoRow);
    if(r===startRow&&!b[r+2*dir][c]) moves.push(mk(r,c,r+2*dir,c,{dbl:true}));
  }
  for(var dc=-1;dc<=1;dc+=2){var tc=c+dc; if(!onBoard(nr,tc))continue;
    if(b[nr][tc]&&colorOf(b[nr][tc])!==color) addPawn(moves,r,c,nr,tc,nr===promoRow);
    if(epSq&&epSq.r===nr&&epSq.c===tc) moves.push(mk(r,c,nr,tc,{ep:true}));
  }
}
function addPawn(moves,r,c,nr,nc,promo){
  if(promo) moves.push(mk(r,c,nr,nc,{promo:true}));
  else moves.push(mk(r,c,nr,nc));
}
function stepMoves(b,r,c,color,moves,deltas){
  for(var i=0;i<deltas.length;i++){var nr=r+deltas[i][0],nc=c+deltas[i][1];
    if(!onBoard(nr,nc))continue;
    if(!b[nr][nc]||colorOf(b[nr][nc])!==color) moves.push(mk(r,c,nr,nc));
  }
}
function slideMoves(b,r,c,color,moves,dirs){
  for(var i=0;i<dirs.length;i++){var dr=dirs[i][0],dc=dirs[i][1],nr=r+dr,nc=c+dc;
    while(onBoard(nr,nc)){
      if(!b[nr][nc]){moves.push(mk(r,c,nr,nc));}
      else{ if(colorOf(b[nr][nc])!==color)moves.push(mk(r,c,nr,nc)); break;}
      nr+=dr;nc+=dc;
    }
  }
}
function castleMoves(b,r,c,color,cst,moves){
  if(color===W&&r===7&&c===4){
    if(cst.wk&&!b[7][5]&&!b[7][6]&&b[7][7]==='R'&&!attacked(b,7,4,B)&&!attacked(b,7,5,B)&&!attacked(b,7,6,B))
      moves.push(mk(7,4,7,6,{castle:'wk'}));
    if(cst.wq&&!b[7][3]&&!b[7][2]&&!b[7][1]&&b[7][0]==='R'&&!attacked(b,7,4,B)&&!attacked(b,7,3,B)&&!attacked(b,7,2,B))
      moves.push(mk(7,4,7,2,{castle:'wq'}));
  }
  if(color===B&&r===0&&c===4){
    if(cst.bk&&!b[0][5]&&!b[0][6]&&b[0][7]==='r'&&!attacked(b,0,4,W)&&!attacked(b,0,5,W)&&!attacked(b,0,6,W))
      moves.push(mk(0,4,0,6,{castle:'bk'}));
    if(cst.bq&&!b[0][3]&&!b[0][2]&&!b[0][1]&&b[0][0]==='r'&&!attacked(b,0,4,W)&&!attacked(b,0,3,W)&&!attacked(b,0,2,W))
      moves.push(mk(0,4,0,2,{castle:'bq'}));
  }
}

/* ---- attack / check detection ---- */
function attacked(b,r,c,byColor){
  var dir=byColor===W?1:-1, pr=r+dir, pp=byColor===W?'P':'p', i;
  if(onBoard(pr,c-1)&&b[pr][c-1]===pp)return true;
  if(onBoard(pr,c+1)&&b[pr][c+1]===pp)return true;
  var nd=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]], kn=byColor===W?'N':'n';
  for(i=0;i<nd.length;i++){var rr=r+nd[i][0],cc=c+nd[i][1];if(onBoard(rr,cc)&&b[rr][cc]===kn)return true;}
  var kd=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]], kk=byColor===W?'K':'k';
  for(i=0;i<kd.length;i++){var r2=r+kd[i][0],c2=c+kd[i][1];if(onBoard(r2,c2)&&b[r2][c2]===kk)return true;}
  if(slideHit(b,r,c,[[-1,-1],[-1,1],[1,-1],[1,1]],byColor===W?['B','Q']:['b','q']))return true;
  if(slideHit(b,r,c,[[-1,0],[1,0],[0,-1],[0,1]],byColor===W?['R','Q']:['r','q']))return true;
  return false;
}
function slideHit(b,r,c,dirs,pieces){
  for(var i=0;i<dirs.length;i++){var dr=dirs[i][0],dc=dirs[i][1],nr=r+dr,nc=c+dc;
    while(onBoard(nr,nc)){var p=b[nr][nc];
      if(p){for(var j=0;j<pieces.length;j++){if(p===pieces[j])return true;}break;}
      nr+=dr;nc+=dc;
    }
  }
  return false;
}
function findKing(b,color){var k=color===W?'K':'k';
  for(var r=0;r<8;r++)for(var c=0;c<8;c++)if(b[r][c]===k)return{r:r,c:c};return null;}
function inCheck(b,color){var k=findKing(b,color);if(!k)return false;return attacked(b,k.r,k.c,other(color));}

/* ---- apply move ---- */
function applyMove(b,m,cst,color){
  var nb=clone(b), nc={wk:cst.wk,wq:cst.wq,bk:cst.bk,bq:cst.bq}, nep=null;
  var p=nb[m.fr][m.fc];
  nb[m.tr][m.tc]=p; nb[m.fr][m.fc]='';
  if(m.ep) nb[m.fr][m.tc]='';
  if(m.promo) nb[m.tr][m.tc]= color===W?'Q':'q';
  if(m.dbl) nep={r:(m.fr+m.tr)/2,c:m.fc};
  if(m.castle){
    if(m.castle==='wk'){nb[7][5]='R';nb[7][7]='';}
    if(m.castle==='wq'){nb[7][3]='R';nb[7][0]='';}
    if(m.castle==='bk'){nb[0][5]='r';nb[0][7]='';}
    if(m.castle==='bq'){nb[0][3]='r';nb[0][0]='';}
  }
  if(p==='K'){nc.wk=false;nc.wq=false;}
  if(p==='k'){nc.bk=false;nc.bq=false;}
  if(m.fr===7&&m.fc===0)nc.wq=false; if(m.fr===7&&m.fc===7)nc.wk=false;
  if(m.fr===0&&m.fc===0)nc.bq=false; if(m.fr===0&&m.fc===7)nc.bk=false;
  if(m.tr===7&&m.tc===0)nc.wq=false; if(m.tr===7&&m.tc===7)nc.wk=false;
  if(m.tr===0&&m.tc===0)nc.bq=false; if(m.tr===0&&m.tc===7)nc.bk=false;
  return {board:nb,castle:nc,ep:nep};
}
function legalMoves(b,color,cst,epSq){
  var pseudo=genMoves(b,color,cst,epSq),out=[];
  for(var i=0;i<pseudo.length;i++){
    var st=applyMove(b,pseudo[i],cst,color);
    if(!inCheck(st.board,color)) out.push(pseudo[i]);
  }
  return out;
}

/* ---- evaluation (material + piece-square tables) ---- */
var VAL={P:100,N:320,B:330,R:500,Q:900,K:20000};
var PST={
 P:[[0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],
    [5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],
    [5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]],
 N:[[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],
    [-30,5,15,20,20,15,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],
    [-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]],
 B:[[-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,10,10,5,0,-10],
    [-10,5,5,10,10,5,5,-10],[-10,0,10,10,10,10,0,-10],[-10,10,10,10,10,10,10,-10],
    [-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20]],
 R:[[0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],
    [-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]],
 Q:[[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,5,5,5,0,-10],
    [-5,0,5,5,5,5,0,-5],[0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],
    [-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]],
 K:[[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],[-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],
    [20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20]]
};
function evaluate(b){
  var s=0;
  for(var r=0;r<8;r++)for(var c=0;c<8;c++){var p=b[r][c];if(!p)continue;
    var up=p.toUpperCase(), v=VAL[up];
    if(isWhite(p)) s += v + PST[up][r][c];
    else           s -= v + PST[up][7-r][c];
  }
  return s; /* + = good for White */
}

/* ---- alpha-beta search ---- */
function search(b,color,cst,epSq,depth,alpha,beta){
  if(depth===0) return evaluate(b);
  var moves=legalMoves(b,color,cst,epSq),i;
  if(moves.length===0){
    if(inCheck(b,color)) return color===W ? -100000-depth : 100000+depth;
    return 0;
  }
  if(color===W){
    var best=-1e9;
    for(i=0;i<moves.length;i++){var st=applyMove(b,moves[i],cst,color);
      var v=search(st.board,B,st.castle,st.ep,depth-1,alpha,beta);
      if(v>best)best=v; if(best>alpha)alpha=best; if(alpha>=beta)break;}
    return best;
  }else{
    var b2=1e9;
    for(i=0;i<moves.length;i++){var s2=applyMove(b,moves[i],cst,color);
      var v2=search(s2.board,W,s2.castle,s2.ep,depth-1,alpha,beta);
      if(v2<b2)b2=v2; if(b2<beta)beta=b2; if(alpha>=beta)break;}
    return b2;
  }
}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}

/* level: 0 Beginner, 1 Easy, 2 Medium, 3 Hard */
function pickMove(b,color,cst,epSq,level){
  var moves=legalMoves(b,color,cst,epSq);
  if(moves.length===0)return null;
  shuffle(moves);
  if(level===0 && Math.random()<0.5) return moves[0]; /* Beginner: often plays random legal move */
  var depth = level<=1?1 : level===2?2 : 3;
  var best=null, bestVal=color===W?-1e9:1e9, i;
  for(i=0;i<moves.length;i++){
    var st=applyMove(b,moves[i],cst,color);
    var v=search(st.board,other(color),st.castle,st.ep,depth-1,-1e9,1e9);
    if(color===W){ if(v>bestVal){bestVal=v;best=moves[i];} }
    else { if(v<bestVal){bestVal=v;best=moves[i];} }
  }
  return best;
}

/* ---- long-algebraic notation with capture/check/mate marks ---- */
function notation(b,m,color,cst,epSq){
  if(m.castle) return (m.castle==='wk'||m.castle==='bk') ? 'O-O' : 'O-O-O';
  var p=b[m.fr][m.fc], up=p.toUpperCase();
  var letter = up==='P' ? '' : up;
  var capture = (b[m.tr][m.tc]!=='') || m.ep;
  var s = letter + sq(m.fr,m.fc) + (capture?'×':'→') + sq(m.tr,m.tc) + (m.promo?'=Q':'');
  var st=applyMove(b,m,cst,color), opp=other(color);
  if(inCheck(st.board,opp)) s += legalMoves(st.board,opp,st.castle,st.ep).length===0 ? '#' : '+';
  return s;
}

/* ---- FEN parser (for puzzles) ---- */
function parseFEN(fen){
  var parts=fen.split(/\s+/), rows=parts[0].split('/'), b=[],r,c;
  for(r=0;r<8;r++){var row=[],s=rows[r];
    for(c=0;c<s.length;c++){var ch=s.charAt(c);
      if(ch>='1'&&ch<='8'){var n=parseInt(ch,10);for(var k=0;k<n;k++)row.push('');}
      else row.push(ch);
    }
    b.push(row);
  }
  var turn = parts[1]==='b' ? B : W;
  var cr = parts[2]||'-';
  var cst={wk:cr.indexOf('K')>=0, wq:cr.indexOf('Q')>=0, bk:cr.indexOf('k')>=0, bq:cr.indexOf('q')>=0};
  var ep = (parts[3]&&parts[3]!=='-') ? parseSquare(parts[3]) : null;
  return {board:b,turn:turn,castle:cst,ep:ep};
}
