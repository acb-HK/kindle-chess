/* Silly pieces drawn as SVG (render on Kindle e-ink — no font/emoji needed).
   White = outlined, Black = solid. Each type has a few variants; armies are
   re-rolled each New Game, so sides often differ (prawns vs soldiers etc.). */

/* --- pawns --- */
function pPrawn(f,d){
  return "<path d='M31,13 C37,16 37,25 31,30 C26,35 17,37 12,34 C8,32 9,27 13,28 C17,30 23,29 27,25 C30,22 29,18 25,17 C22,16 19,18 20,21 C17,21 16,15 21,13 C24,12 28,12 31,13 Z'/>"+
    "<path d='M31,13 L38,9 L38,15 Z'/>"+
    "<path d='M21,13 L18,6' fill='none'/><path d='M23,13 L23,5' fill='none'/>"+
    "<circle cx='22' cy='16' r='1.3' fill='"+d+"' stroke='none'/>"+
    "<path d='M16,31 L15,36' fill='none'/><path d='M20,32 L19,37' fill='none'/><path d='M24,31 L23,36' fill='none'/>";
}
function pMushroom(f,d){
  return "<path d='M8,23 C8,13 18,7 22.5,7 C27,7 37,13 37,23 Z'/>"+
    "<path d='M16,23 C16,31 16,37 18,39 L27,39 C29,37 29,31 29,23 Z'/>"+
    "<circle cx='16' cy='17' r='2' fill='"+d+"' stroke='none'/><circle cx='26' cy='14' r='2.6' fill='"+d+"' stroke='none'/>"+
    "<circle cx='30' cy='19' r='1.7' fill='"+d+"' stroke='none'/><circle cx='21' cy='12' r='1.6' fill='"+d+"' stroke='none'/>";
}
function pSoldier(f,d){
  return "<path d='M10,25 C10,14 35,14 35,25 Z'/>"+
    "<rect x='8' y='25' width='29' height='3.6' rx='1'/>"+
    "<rect x='19' y='28' width='7' height='10' rx='1' fill='"+d+"' stroke='none'/>"+
    "<circle cx='22.5' cy='14' r='2.2'/>";
}
/* --- knights --- */
function nHorse(f,d){
  return "<path d='M14,40 C13,32 15,25 20,21 C16,23 14,26 13,28 C11,26 11,22 13,19 C16,14 21,12 24,11 C23,13 24,15 26,16 C30,21 32,29 32,40 Z'/>"+
    "<circle cx='17' cy='20' r='1.4' fill='"+d+"' stroke='none'/>";
}
function nUnicorn(f,d){
  return nHorse(f,d)+"<path d='M23,11 L28,1 L25.5,12 Z'/>";
}
/* --- bishops --- */
function bWizard(f,d){
  return "<path d='M22.5,4 L12,30 L33,30 Z'/>"+
    "<rect x='10' y='30' width='25' height='4' rx='1'/>"+
    "<path d='M20.5,18 l1.4,3 3.2,0 -2.6,2 1,3.1 -2.5,-1.9 -2.5,1.9 1,-3.1 -2.6,-2 3.2,0 z' fill='"+d+"' stroke='none'/>";
}
function bChurch(f,d){
  return "<rect x='12' y='21' width='21' height='17'/>"+
    "<path d='M10,21 L22.5,10 L35,21 Z'/>"+
    "<rect x='21' y='3' width='3' height='7'/><rect x='18.5' y='5' width='8' height='3'/>"+
    "<path d='M19,38 L19,29 C19,26 26,26 26,29 L26,38 Z' fill='"+d+"' stroke='none'/>";
}
/* --- rooks --- */
function rCastle(f,d){
  return "<rect x='10' y='37' width='25' height='5' rx='1'/>"+
    "<path d='M13,37 L14,22 L31,22 L32,37 Z'/>"+
    "<path d='M11,22 L11,14 L15,14 L15,17 L18,17 L18,14 L27,14 L27,17 L30,17 L30,14 L34,14 L34,22 Z'/>"+
    "<rect x='19' y='28' width='7' height='9' rx='1' fill='"+d+"' stroke='none'/>";
}
function rCastleFlag(f,d){
  return rCastle(f,d)+"<path d='M22.5,14 L22.5,4' fill='none'/><path d='M22.5,4 L30,6.5 L22.5,9 Z'/>";
}
/* --- queens --- */
function qCrown(f,d){
  return "<path d='M10,30 C8,20 8,15 11,15 C13,15 13,20 15.5,20 C18.5,20 18.5,11 22.5,11 C26.5,11 26.5,20 29.5,20 C32,20 32,15 34,15 C37,15 37,20 35,30 Z'/>"+
    "<rect x='10' y='30' width='25' height='5' rx='1'/>"+
    "<circle cx='22.5' cy='11' r='2' fill='"+d+"' stroke='none'/>"+
    "<circle cx='15.5' cy='20' r='1.5' fill='"+d+"' stroke='none'/><circle cx='29.5' cy='20' r='1.5' fill='"+d+"' stroke='none'/>";
}
function qPrincess(f,d){
  return "<path d='M12,25 C12,14 33,14 33,25 C33,34 27,40 22.5,40 C18,40 12,34 12,25 Z'/>"+
    "<path d='M13,17 L16,11 L19.5,15.5 L22.5,9 L25.5,15.5 L29,11 L32,17 Z'/>"+
    "<circle cx='18' cy='24' r='1.4' fill='"+d+"' stroke='none'/><circle cx='27' cy='24' r='1.4' fill='"+d+"' stroke='none'/>"+
    "<path d='M18,30 Q22.5,33 27,30' fill='none' stroke='"+d+"' stroke-width='1.3'/>";
}
/* --- kings --- */
function kFrog(f,d){
  return "<ellipse cx='22.5' cy='30' rx='14' ry='9'/>"+
    "<circle cx='14' cy='15' r='5'/><circle cx='31' cy='15' r='5'/>"+
    "<circle cx='14' cy='15' r='1.7' fill='"+d+"' stroke='none'/><circle cx='31' cy='15' r='1.7' fill='"+d+"' stroke='none'/>"+
    "<path d='M13,31 Q22.5,38 32,31' fill='none' stroke='"+d+"' stroke-width='1.4'/>"+
    "<path d='M9,35 L5,39' fill='none'/><path d='M36,35 L40,39' fill='none'/>"+
    "<path d='M17,10 L19,5 L22.5,8.5 L26,5 L28,10 Z'/>";
}
function kCrown(f,d){
  return "<path d='M9,30 L7,12 L15,20 L22.5,9 L30,20 L38,12 L36,30 Z'/>"+
    "<rect x='9' y='30' width='27' height='6' rx='1'/>"+
    "<circle cx='22.5' cy='9' r='2' fill='"+d+"' stroke='none'/>"+
    "<circle cx='15' cy='21' r='1.5' fill='"+d+"' stroke='none'/><circle cx='30' cy='21' r='1.5' fill='"+d+"' stroke='none'/>";
}

var SP={ K:[kFrog,kCrown], Q:[qCrown,qPrincess], R:[rCastle,rCastleFlag],
         B:[bWizard,bChurch], N:[nHorse,nUnicorn], P:[pPrawn,pMushroom,pSoldier] };
var SNAME={K:['Frog King','Crown King'],Q:['Crown Queen','Princess'],R:['Castle','Flag Castle'],
           B:['Wizard','Church'],N:['Horse','Unicorn'],P:['Prawn','Mushroom','Soldier']};

var SILLY_W=null, SILLY_B=null;
function rollSilly(){var m={},k=['K','Q','R','B','N','P'],i;for(i=0;i<k.length;i++){var t=k[i];m[t]=Math.floor(Math.random()*SP[t].length);}return m;}
function buildSillyArmies(){ SILLY_W=rollSilly(); SILLY_B=rollSilly(); }

function pieceSilly(p){
  if(!p) return '';
  if(!SILLY_W) buildSillyArmies();
  var white=(p===p.toUpperCase()), t=p.toUpperCase();
  var fill=white?'#ffffff':'#000000', dtl=white?'#000000':'#ffffff';
  var idx=(white?SILLY_W:SILLY_B)[t];
  var inner=SP[t][idx](fill,dtl);
  return "<svg viewBox='0 0 45 45'><g fill='"+fill+
    "' stroke='#000' stroke-width='1.5' stroke-linejoin='round' stroke-linecap='round'>"+inner+"</g></svg>";
}
