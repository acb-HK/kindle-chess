/* Board cell size in REAL pixels (Kindle Paperwhite browser has no vw units).
   Computed from screen width so the board fills it; clamped for desktop. */
var CELL=60;
/* px kept free BELOW the board for the buttons. Larger = smaller board. */
var RESERVE_BELOW=78;
/* Cell size from BOTH width and the height left under the controls. Computed
   every render (deterministic) so a menu re-render can't resize the board. */
function cellSize(){
  var w = window.innerWidth || document.documentElement.clientWidth || 320;
  var h = window.innerHeight || document.documentElement.clientHeight || 480;
  var byW = Math.floor((w-8)/8);
  var top = 130;
  var bw = (typeof document!=='undefined') ? document.getElementById('boardwrap') : null;
  if(bw){ var t=0, el=bw; while(el){ t+=el.offsetTop; el=el.offsetParent; } if(t>0) top=t; }
  var byH = Math.floor((h-top-RESERVE_BELOW)/8);
  var s = Math.min(byW, byH);
  if(s<26) s=26;
  if(s>96) s=96;
  return s;
}

/* Inline SVG chess pieces — crisp on e-ink, no fonts/CDN. White=outlined, Black=solid. */
function pieceSVG(p){
  if(!p) return '';
  var white=(p===p.toUpperCase()), t=p.toUpperCase();
  var fill=white?'#ffffff':'#000000', dtl=white?'#000000':'#ffffff', b='';
  if(t==='P'){
    b="<circle cx='22.5' cy='13' r='6'/>"+
      "<path d='M16,40 C16,31 19,27 22.5,20 C26,27 29,31 29,40 Z'/>"+
      "<rect x='13' y='38' width='19' height='4' rx='1.5'/>";
  } else if(t==='R'){
    b="<rect x='11' y='38' width='23' height='4' rx='1.5'/>"+
      "<path d='M14,38 L15,24 L30,24 L31,38 Z'/>"+
      "<path d='M12,24 L12,16 L16,16 L16,19 L19,19 L19,16 L26,16 L26,19 L29,19 L29,16 L33,16 L33,24 Z'/>";
  } else if(t==='N'){
    b="<rect x='13' y='38' width='20' height='4' rx='1.5'/>"+
      "<path d='M14,40 C13,32 15,25 20,21 C16,23 14,26 13,28 C11,26 11,22 13,19 C16,14 21,12 24,11 C23,13 24,15 26,16 C30,21 32,29 32,40 Z'/>"+
      "<circle cx='17' cy='20' r='1.4' fill='"+dtl+"' stroke='none'/>";
  } else if(t==='B'){
    b="<rect x='12' y='38' width='21' height='4' rx='1.5'/>"+
      "<path d='M16,39 C15,31 17,25 22.5,17 C28,25 30,31 29,39 Z'/>"+
      "<ellipse cx='22.5' cy='15' rx='5.5' ry='8'/>"+
      "<circle cx='22.5' cy='7' r='2.6'/>"+
      "<path d='M19.5,16 L25.5,16' stroke='"+dtl+"' stroke-width='1.4' fill='none'/>";
  } else if(t==='Q'){
    b="<rect x='11' y='38' width='23' height='4' rx='1.5'/>"+
      "<path d='M14,38 L12,23 L33,23 L31,38 Z'/>"+
      "<path d='M12,24 L9,12 L15,19 L18,10 L22.5,18 L27,10 L30,19 L36,12 L33,24 Z'/>"+
      "<circle cx='9' cy='12' r='2'/><circle cx='18' cy='10' r='2'/><circle cx='22.5' cy='9' r='2'/><circle cx='27' cy='10' r='2'/><circle cx='36' cy='12' r='2'/>";
  } else {
    b="<rect x='11' y='38' width='23' height='4' rx='1.5'/>"+
      "<path d='M14,38 L12,24 L33,24 L31,38 Z'/>"+
      "<path d='M12,25 C16,19 29,19 33,25 L31,26 C28,21 17,21 14,26 Z'/>"+
      "<rect x='21' y='5' width='3' height='10' rx='0.5'/>"+
      "<rect x='18' y='8' width='9' height='3' rx='0.5'/>";
  }
  return "<svg viewBox='0 0 45 45'><g fill='"+fill+
    "' stroke='#000' stroke-width='1.6' stroke-linejoin='round' stroke-linecap='round'>"+b+"</g></svg>";
}
