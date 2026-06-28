/* Animal pieces in classic silhouette style — white = outlined, black = solid,
   so they read clearly on e-ink (no font/emoji dependency).
   K=Bear  Q=Swan  R=Elephant  B=Penguin  N=Horse  P=Fish */
function pieceAnimal(p){
  if(!p) return '';
  var white=(p===p.toUpperCase()), t=p.toUpperCase();
  var fill=white?'#ffffff':'#000000', dtl=white?'#000000':'#ffffff', b='';
  if(t==='P'){ /* fish */
    b="<ellipse cx='20' cy='25' rx='11' ry='7'/>"+
      "<path d='M29,25 L40,19 L40,31 Z'/>"+
      "<circle cx='14' cy='23' r='1.4' fill='"+dtl+"' stroke='none'/>";
  } else if(t==='N'){ /* horse */
    b="<path d='M14,40 C13,32 15,25 20,21 C16,23 14,26 13,28 C11,26 11,22 13,19 C16,14 21,12 24,11 C23,13 24,15 26,16 C30,21 32,29 32,40 Z'/>"+
      "<circle cx='17' cy='20' r='1.4' fill='"+dtl+"' stroke='none'/>";
  } else if(t==='R'){ /* elephant */
    b="<ellipse cx='25' cy='23' rx='11' ry='8'/>"+
      "<circle cx='13' cy='20' r='6'/>"+
      "<circle cx='15' cy='15' r='4'/>"+
      "<path d='M9,22 C6,26 7,33 10,35 C12,36 13,33 12,31 C10,30 11,27 13,26 Z'/>"+
      "<rect x='18' y='29' width='3.5' height='9' rx='1'/>"+
      "<rect x='29' y='29' width='3.5' height='9' rx='1'/>"+
      "<circle cx='12' cy='18' r='1' fill='"+dtl+"' stroke='none'/>";
  } else if(t==='B'){ /* penguin */
    b="<ellipse cx='22' cy='27' rx='8' ry='12'/>"+
      "<circle cx='22' cy='12' r='5'/>"+
      "<path d='M26,12 L31,13 L26,15 Z'/>"+
      "<ellipse cx='22' cy='29' rx='4' ry='8' fill='"+dtl+"' stroke='none'/>"+
      "<path d='M14,24 L12,33' fill='none'/><path d='M30,24 L32,33' fill='none'/>"+
      "<circle cx='20' cy='11' r='1' fill='"+dtl+"' stroke='none'/>";
  } else if(t==='Q'){ /* swan */
    b="<ellipse cx='25' cy='31' rx='10' ry='6'/>"+
      "<path d='M19,32 C9,28 10,12 18,9 C20,8.5 20.5,12 19,13 C13,15 12,26 21,30 Z'/>"+
      "<circle cx='18' cy='9' r='3'/>"+
      "<path d='M15,8 L10,9 L15,11 Z'/>"+
      "<path d='M34,29 L39,26 L36,32 Z'/>"+
      "<circle cx='19' cy='8' r='0.9' fill='"+dtl+"' stroke='none'/>";
  } else { /* bear (king) */
    b="<ellipse cx='22' cy='33' rx='10' ry='8'/>"+
      "<circle cx='13' cy='9' r='4'/>"+
      "<circle cx='31' cy='9' r='4'/>"+
      "<circle cx='22' cy='17' r='10'/>"+
      "<ellipse cx='22' cy='21' rx='4' ry='3' fill='"+dtl+"' stroke='none'/>"+
      "<circle cx='22' cy='19' r='1.3' fill='"+dtl+"' stroke='none'/>"+
      "<circle cx='17' cy='15' r='1' fill='"+dtl+"' stroke='none'/>"+
      "<circle cx='27' cy='15' r='1' fill='"+dtl+"' stroke='none'/>";
  }
  return "<svg viewBox='0 0 45 45'><g fill='"+fill+
    "' stroke='#000' stroke-width='1.4' stroke-linejoin='round' stroke-linecap='round'>"+b+"</g></svg>";
}
