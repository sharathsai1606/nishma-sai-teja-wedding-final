/* Nishma & Sai Teja wedding invitation
   1) builds the painted garden-terrace scene (garlands, lanterns, peacock, flowers) as SVG
   2) page navigation (swipe / wheel / keys / dots / optional auto-play) with smooth cross-fades
   3) falling petals, countdown, share + copy link */
(function(){
  'use strict';
  var NS='http://www.w3.org/2000/svg';
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id){return document.getElementById(id)}
  function E(tag,attrs,parent){var e=document.createElementNS(NS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}
  var seed=11;function R(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646}
  function rr(a,b){return a+R()*(b-a)}
  function pick(a){return a[Math.floor(R()*a.length)]}

  /* ================= SCENE ================= */
  var GREENS=['#56764a','#6f8f5d','#7fa070','#47663f','#8aa878','#5f8456'];
  var BLOOMS=['#ffffff','#fffaf2','#fbeaea','#f6c4cf','#f09ab0','#e97f9d'];

  function leaf(p,x,y,ang,s){
    var g=E('g',{transform:'translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate('+ang.toFixed(0)+') scale('+s.toFixed(2)+')'},p);
    E('path',{d:'M0 0C4.5-5 5.5-14 0-23C-5.5-14-4.5-5 0 0Z',fill:pick(GREENS)},g);
    E('path',{d:'M0-1V-18',stroke:'rgba(255,255,255,.28)','stroke-width':.6,fill:'none'},g);
  }
  function bloom(p,x,y,s,col){
    var g=E('g',{transform:'translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate('+(R()*72).toFixed(0)+') scale('+s.toFixed(2)+')'},p);
    for(var i=0;i<5;i++)E('ellipse',{cx:0,cy:-5.2,rx:3.7,ry:6,fill:col,stroke:'rgba(120,80,60,.22)','stroke-width':.4,transform:'rotate('+(i*72)+')'},g);
    E('circle',{r:2,fill:'#e2ae4a'},g);E('circle',{r:.9,fill:'#b97d1c'},g);
  }
  function daisy(p,x,y,s,col){ /* pink dahlia-like flower */
    var g=E('g',{transform:'translate('+x.toFixed(1)+' '+y.toFixed(1)+') scale('+s.toFixed(2)+')'},p);
    for(var i=0;i<12;i++)E('ellipse',{cx:0,cy:-7,rx:2.6,ry:7.5,fill:col||'#e85d86',opacity:.92,transform:'rotate('+(i*30)+')'},g);
    E('circle',{r:3.2,fill:'#f7c85c'},g);
  }
  function cluster(p,cx,cy,rx,ry,n){
    for(var i=0;i<n;i++){var a=R()*6.283,d=Math.sqrt(R());leaf(p,cx+Math.cos(a)*rx*d,cy+Math.sin(a)*ry*d,rr(-180,180),rr(.8,1.5))}
    for(i=0;i<n*.8;i++){var a2=R()*6.283,d2=Math.sqrt(R());bloom(p,cx+Math.cos(a2)*rx*d2,cy+Math.sin(a2)*ry*d2,rr(.8,1.3),pick(BLOOMS))}
  }

  function buildScene(){
    /* balusters */
    var bal=$('balusters');
    for(var x=104;x<480;x+=15){E('path',{d:'M'+x+' 790v-4q-3-4 0-8t0-8q-3-4 0-6h5q3 2 0 6t0 8q3 4 0 8v4z'},bal)}
    /* floor petals */
    var fp=$('floorPetals');
    for(var i=0;i<46;i++)E('ellipse',{cx:rr(80,470).toFixed(0),cy:rr(808,950).toFixed(0),rx:rr(2.5,5).toFixed(1),ry:rr(1.2,2.4).toFixed(1),fill:pick(['#f4b9c6','#f9d6dc','#ffffff','#f09ab0']),opacity:.8,transform:'rotate('+rr(-40,40).toFixed(0)+' 0 0)'},fp);

    /* garland along the arch */
    var gar=$('garland'),guide=$('guide'),L=guide.getTotalLength();
    var lining=E('g',{},gar),strands=E('g',{},gar);
    for(var s=0;s<=L;s+=9){
      var pt=guide.getPointAtLength(s),pt2=guide.getPointAtLength(Math.min(L,s+2));
      var ang=Math.atan2(pt2.y-pt.y,pt2.x-pt.x)*180/Math.PI-90;
      leaf(lining,pt.x+rr(-3,3),pt.y+rr(-3,3),ang+rr(-55,55),rr(.9,1.3));
      if(R()<.4)bloom(lining,pt.x+rr(-5,5),pt.y+rr(-5,5),rr(.7,1.1),pick(BLOOMS));
    }
    for(s=6;s<L;s+=21){
      var q=guide.getPointAtLength(s),left=q.x<250;
      var len=left?rr(40,150)+(q.x<110?rr(40,170):0):rr(24,70);
      var g=E('g',{'class':'sway',style:'animation-duration:'+rr(5,9).toFixed(1)+'s;animation-delay:-'+rr(0,6).toFixed(1)+'s'},strands);
      E('path',{d:'M'+q.x.toFixed(1)+' '+q.y.toFixed(1)+' q'+rr(-4,4).toFixed(1)+' '+(len/2).toFixed(0)+' '+rr(-3,3).toFixed(1)+' '+len.toFixed(0),stroke:'#5f7e52','stroke-width':1.1,fill:'none'},g);
      for(var y=10;y<len;y+=13){
        var side=(y/13|0)%2?1:-1;
        leaf(g,q.x+side*2,q.y+y,side*rr(40,80)+180,rr(.7,1.1));
        if(R()<.55)bloom(g,q.x+rr(-4,4),q.y+y,rr(.55,.85),pick(BLOOMS));
      }
      bloom(g,q.x,q.y+len,rr(.8,1.15),pick(BLOOMS));
    }
    /* dense top-left corner */
    var corner=E('g',{},gar);cluster(corner,22,40,48,44,28);
    cluster(corner,440,36,36,30,14);
    for(i=0;i<6;i++){daisy(corner,rr(6,90),rr(10,120),rr(.7,1.05),pick(['#f09ab0','#e97f9d','#f6c4cf']))}

    /* lanterns */
    var lan=$('lanterns');
    [[40,175,.95,0],[96,110,.8,-1.2]].forEach(function(c){
      var g=E('g',{'class':'swing',style:'animation-delay:'+c[3]+'s'},lan);
      var x=c[0],y=c[1],s=c[2];
      E('path',{d:'M'+x+' 0V'+y,stroke:'#8a6224','stroke-width':1.3,'stroke-dasharray':'3 2',fill:'none'},g);
      var b=E('g',{transform:'translate('+x+' '+y+') scale('+s+')'},g);
      E('circle',{cy:42,r:46,fill:'url(#gGlow)','class':'flame'},b);
      E('path',{d:'M-3 0h6v6h-6z',fill:'#8a6224'},b);
      E('path',{d:'M-17 24L0 6L17 24Z',fill:'url(#gBrass)'},b);
      E('rect',{x:-15,y:24,width:30,height:42,rx:3,fill:'#ffe2a0',opacity:.92,stroke:'#a9792f','stroke-width':1.4},b);
      E('path',{d:'M-15 24V66M0 24V66M15 24V66',stroke:'#a9792f','stroke-width':1.2},b);
      E('ellipse',{cx:0,cy:48,rx:5,ry:11,fill:'#fff8dc','class':'flame'},b);
      E('path',{d:'M-18 66h36l-5 8h-26z',fill:'url(#gBrass)'},b);
      E('path',{d:'M0 74v8',stroke:'#8a6224','stroke-width':2},b);
      E('circle',{cy:84,r:2.4,fill:'#8a6224'},b);
    });

    /* bottom-left: pedestal, peacock, blooms */
    var fl=$('fgL');
    var ped=E('g',{},fl);
    E('rect',{x:46,y:752,width:76,height:14,rx:2,fill:'#f2e5c9',stroke:'#cdb68a','stroke-width':.8},ped);
    E('rect',{x:54,y:766,width:60,height:36,fill:'url(#gSandV)',stroke:'#cdb68a','stroke-width':.8},ped);
    E('rect',{x:46,y:802,width:76,height:10,rx:2,fill:'#f2e5c9',stroke:'#cdb68a','stroke-width':.8},ped);
    peacock(fl,86,752,1);
    cluster(fl,40,835,64,46,38);
    cluster(fl,130,860,50,34,22);
    daisy(fl,34,815,1.3,'#e85d86');daisy(fl,112,846,1.1,'#ee7d9f');daisy(fl,70,880,.95,'#f09ab0');
    /* brass bowl with floating candles */
    var bowl=E('g',{transform:'translate(104 918)'},fl);
    E('ellipse',{cx:0,cy:0,rx:42,ry:11,fill:'url(#gBrass)'},bowl);
    E('ellipse',{cx:0,cy:-2,rx:36,ry:8,fill:'#fdf0d4'},bowl);
    for(i=0;i<9;i++)bloom(bowl,rr(-28,28),rr(-5,2),.55,pick(BLOOMS.slice(0,4)));
    [-14,8,22].forEach(function(cx){E('ellipse',{cx:cx,cy:-6,rx:2,ry:4.5,fill:'#ffe27a','class':'flame'},bowl)});

    /* bottom-right blooms */
    var fr=$('fgR');
    cluster(fr,452,832,36,58,24);cluster(fr,430,900,50,30,18);
    daisy(fr,458,806,1.1,'#e85d86');daisy(fr,436,884,.95,'#f09ab0');
  }

  function peacock(p,x,y,sc){
    var g=E('g',{transform:'translate('+x+' '+y+') scale('+sc+')'},p);
    /* tail fan falling down the pedestal */
    var tail=E('g',{'class':'peafan'},g);
    for(var i=0;i<11;i++){
      var a=(100+i*8.2)*Math.PI/180,len=rr(60,86),tx=Math.cos(a)*len*0.9-4,ty=Math.sin(a)*len+6;
      E('path',{d:'M-6 -2 Q'+(tx*0.45-8)+' '+(ty*0.4)+' '+tx.toFixed(1)+' '+ty.toFixed(1),stroke:i%2?'#3d8a5c':'#2f7a66','stroke-width':2.6,fill:'none','stroke-linecap':'round'},tail);
      E('ellipse',{cx:tx.toFixed(1),cy:ty.toFixed(1),rx:6,ry:7.6,fill:'#d9a93f'},tail);
      E('ellipse',{cx:tx.toFixed(1),cy:ty.toFixed(1),rx:4.2,ry:5.4,fill:'#2a7f9e'},tail);
      E('ellipse',{cx:tx.toFixed(1),cy:(ty+.6).toFixed(1),rx:2.2,ry:3,fill:'#133f6e'},tail);
    }
    E('ellipse',{cx:2,cy:-10,rx:16,ry:12,fill:'url(#gTeal)',transform:'rotate(-20 2 -10)'},g);
    E('path',{d:'M10 -16C22 -26 18 -42 22 -52',stroke:'url(#gTeal)','stroke-width':7.5,fill:'none','stroke-linecap':'round'},g);
    E('circle',{cx:23,cy:-55,r:5.4,fill:'#17407a'},g);
    E('path',{d:'M27 -55l8 2.4l-8 1.6z',fill:'#d9a93f'},g);
    E('circle',{cx:24.4,cy:-56,r:1,fill:'#fff'},g);
    [-1,0,1].forEach(function(k){E('path',{d:'M'+(21+k*2)+' -59L'+(18+k*5)+' -70',stroke:'#17407a','stroke-width':.9},g);E('circle',{cx:18+k*5,cy:-70.6,r:1.5,fill:'#4aa0c8'},g)});
    E('path',{d:'M-8 -12Q6 -20 14 -10',stroke:'#8cc7a2','stroke-width':1,fill:'none',opacity:.7},g);
  }

  /* ================= PETALS ================= */
  var cv=$('petals'),cx=cv.getContext('2d'),W=0,H=0,dpr=1,P=[],running=false,last=0;
  function size(){dpr=Math.min(2,window.devicePixelRatio||1);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0)}
  var PCOL=['#f6b6c4','#f9cfd6','#ee8fa9','#fbe3e6','#ffffff'];
  function newPetal(top){
    return {x:Math.random()*W,y:top?-20-Math.random()*H*.3:Math.random()*H,s:6+Math.random()*9,vy:16+Math.random()*30,sw:10+Math.random()*26,ph:Math.random()*6.28,
      rot:Math.random()*6.28,vr:(Math.random()-.5)*2,c:PCOL[Math.floor(Math.random()*PCOL.length)],flip:Math.random()*6.28,bl:Math.random()<.14}
  }
  function drawPetal(p){
    cx.save();cx.translate(p.x,p.y);cx.rotate(p.rot);cx.scale(1,.55+.45*Math.abs(Math.cos(p.flip)));cx.fillStyle=p.c;cx.globalAlpha=.92;
    if(p.bl){for(var i=0;i<5;i++){cx.rotate(1.2566);cx.beginPath();cx.ellipse(0,-p.s*.5,p.s*.34,p.s*.55,0,0,6.283);cx.fill()}cx.fillStyle='#e2ae4a';cx.beginPath();cx.arc(0,0,p.s*.18,0,6.283);cx.fill()}
    else{cx.beginPath();cx.moveTo(0,-p.s);cx.bezierCurveTo(p.s*.9,-p.s*.7,p.s*.7,p.s*.7,0,p.s);cx.bezierCurveTo(-p.s*.7,p.s*.7,-p.s*.9,-p.s*.7,0,-p.s);cx.fill()}
    cx.restore();
  }
  function loop(t){
    if(!running)return;
    var dt=Math.min(.05,(t-last)/1000||.016);last=t;
    cx.clearRect(0,0,W,H);
    for(var i=0;i<P.length;i++){
      var p=P[i];p.ph+=dt;p.y+=p.vy*dt;p.x+=Math.sin(p.ph*.9)*p.sw*dt;p.rot+=p.vr*dt;p.flip+=dt*1.6;
      if(p.y>H+20||p.x<-30||p.x>W+30)P[i]=newPetal(true);
      drawPetal(p);
    }
    requestAnimationFrame(loop);
  }
  function startPetals(){
    size();var n=reduce?0:(W<500?22:30);P=[];for(var i=0;i<n;i++)P.push(newPetal(false));
    if(!running&&n){running=true;last=performance.now();requestAnimationFrame(loop)}
  }
  document.addEventListener('visibilitychange',function(){if(document.hidden)running=false;else if(P.length&&!running){running=true;last=performance.now();requestAnimationFrame(loop)}});
  addEventListener('resize',function(){var wasRun=running;size();if(!wasRun&&P.length){running=true;requestAnimationFrame(loop)}});

  /* ================= NAVIGATION ================= */
  var stage=$('stage'),slides=[].slice.call(document.querySelectorAll('.slide')),N=slides.length,cur=-1,lock=false,auto=false,timer=0;
  var dots=$('dots'),autoBtn=$('auto'),dotEls=[];
  slides.forEach(function(s,i){
    var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Go to page '+(i+1));b.addEventListener('click',function(){stopAuto();go(i)});dots.appendChild(b);dotEls.push(b);
  });
  var DUR=[5200,5200,7600,6400,6800,7600,0];
  function go(i,force){
    if(i<0||i>=N||i===cur)return;
    if(!opened&&!force)return;
    if(lock&&!force)return;
    lock=true;setTimeout(function(){lock=false},1150);
    cur=i;
    slides.forEach(function(s,k){s.classList.toggle('active',k===i);s.classList.toggle('after',k>i);if(k===i)s.scrollTop=0});
    var act=slides[i].querySelector('.inner');if(act)act.scrollTop=0;
    dotEls.forEach(function(d,k){d.classList.toggle('on',k===i)});
    stage.setAttribute('data-i',i);stage.classList.toggle('is-cover',i===0);
    if(auto)schedule();
  }
  function schedule(){clearTimeout(timer);if(cur>=N-1||!auto){return}timer=setTimeout(function(){go(cur+1,true)},DUR[cur]||6000)}
  function setAuto(v){auto=v;autoBtn.setAttribute('aria-pressed',v);autoBtn.setAttribute('aria-label',v?'Pause story':'Play story');if(v)schedule();else clearTimeout(timer)}
  function stopAuto(){if(auto)setAuto(false)}
  autoBtn.addEventListener('click',function(){if(!auto&&cur>=N-1)go(0,true);setAuto(!auto)});
  $('hint').addEventListener('click',function(){go(cur+1)});

  function innerCanScroll(dir){
    var el=slides[cur]&&slides[cur].querySelector('.inner');if(!el)return false;
    if(el.scrollHeight<=el.clientHeight+2)return false;
    return dir>0?el.scrollTop+el.clientHeight<el.scrollHeight-2:el.scrollTop>2;
  }
  stage.addEventListener('wheel',function(e){
    e.preventDefault();var d=e.deltaY;if(Math.abs(d)<6)return;
    var dir=d>0?1:-1;
    if(innerCanScroll(dir)){slides[cur].querySelector('.inner').scrollTop+=d;return}
    stopAuto();go(cur+dir);
  },{passive:false});
  var ty=null,tx=null;
  stage.addEventListener('touchstart',function(e){ty=e.touches[0].clientY;tx=e.touches[0].clientX},{passive:true});
  stage.addEventListener('touchend',function(e){
    if(ty===null)return;
    var dy=ty-e.changedTouches[0].clientY,dx=tx-e.changedTouches[0].clientX;ty=null;
    if(Math.abs(dy)<44||Math.abs(dy)<Math.abs(dx))return;
    var dir=dy>0?1:-1;if(innerCanScroll(dir))return;
    stopAuto();go(cur+dir);
  },{passive:true});
  addEventListener('keydown',function(e){
    var k=e.key;
    if(k==='ArrowDown'||k==='PageDown'||k==='ArrowRight'||(k===' '&&!/^(BUTTON|A)$/.test((e.target||{}).tagName||''))){e.preventDefault();stopAuto();go(cur+1)}
    else if(k==='ArrowUp'||k==='PageUp'||k==='ArrowLeft'){e.preventDefault();stopAuto();go(cur-1)}
    else if(k==='Home')go(0);else if(k==='End')go(N-1);
  });

  /* ================= COUNTDOWN ================= */
  var TARGET=new Date('2026-11-18T11:30:00+05:30').getTime();
  function pad(n){return n<10?'0'+n:String(n)}
  function setv(id,v){var e=$(id);v=String(v);if(e.textContent!==v){e.textContent=v;e.classList.remove('flip');void e.offsetWidth;e.classList.add('flip')}}
  function tick(){
    var d=TARGET-Date.now();
    if(d<=0){stage.classList.add('is-today');return}
    stage.classList.remove('is-today');
    setv('cd',Math.floor(d/864e5));setv('ch',pad(Math.floor(d%864e5/36e5)));setv('cm',pad(Math.floor(d%36e5/6e4)));setv('cs',pad(Math.floor(d%6e4/1e3)));
  }
  tick();setInterval(tick,1000);

  /* ================= SHARE ================= */
  var shareBtn=$('nativeShareBtn'),copyBtn=$('copyLinkBtn'),url=location.href.split('#')[0];
  if(navigator.share){shareBtn.style.display='';shareBtn.addEventListener('click',function(){navigator.share({title:document.title,text:'You are invited to the wedding of Nishma & Sai Teja - 18 November 2026',url:url}).catch(function(){})})}
  function flash(t){var o=copyBtn.textContent;copyBtn.textContent=t;setTimeout(function(){copyBtn.textContent=o},1800)}
  copyBtn.addEventListener('click',function(){
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(function(){flash('Link copied')},fallback)}else fallback();
    function fallback(){var t=document.createElement('textarea');t.value=url;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();try{document.execCommand('copy');flash('Link copied')}catch(e){flash('Copy failed')}document.body.removeChild(t)}
  });
  $('replayBtn').addEventListener('click',function(){stopAuto();go(0,true)});

  /* ================= GRAND OPENING ================= */
  var NSS='non-scaling-stroke';
  function buildDoor(svg){
    var g=E('g',{},svg);
    E('rect',{width:240,height:1000,fill:'url(#gIvory)'},g);
    E('rect',{width:240,height:1000,fill:'url(#gDoorShade)'},g);
    E('rect',{x:6,y:6,width:228,height:988,fill:'none',stroke:'#c9a85a','stroke-width':1.4,'vector-effect':NSS},g);
    E('rect',{x:11,y:11,width:218,height:978,fill:'none',stroke:'#d9bd7c','stroke-width':.8,'stroke-dasharray':'2 3','vector-effect':NSS},g);
    // arched top panel: the two leaves' tops meet as one palace arch
    E('path',{d:'M30 330V206C30 146 128 116 214 62V330Z',fill:'url(#gEmer)',stroke:'url(#gGoldV)','stroke-width':2.2,'vector-effect':NSS},g);
    E('path',{d:'M41 319V210C41 158 130 130 203 82V319Z',fill:'none',stroke:'#d9bd7c','stroke-width':.9,'vector-effect':NSS},g);
    var rays=E('g',{stroke:'#d8b86a','stroke-width':.9,opacity:.55},g);
    for(var a=-70;a<=70;a+=14){var r=a*Math.PI/180;E('path',{d:'M122 304L'+(122+Math.sin(r)*86).toFixed(1)+' '+(304-Math.cos(r)*86).toFixed(1),'vector-effect':NSS},rays)}
    var lot=E('g',{fill:'url(#gGoldV)',stroke:'#8a6224','stroke-width':.6},g);
    [-58,-29,0,29,58].forEach(function(a){E('path',{d:'M122 304C111 281 114 260 122 246C130 260 133 281 122 304Z',transform:'rotate('+a+' 122 304)','vector-effect':NSS},lot)});
    E('path',{d:'M96 305H148',stroke:'#e4bf6a','stroke-width':1.6,'vector-effect':NSS},g);
    // spandrel rosette
    var ros=E('g',{fill:'url(#gGoldV)',opacity:.85},g);
    for(var k=0;k<8;k++)E('ellipse',{cx:62,cy:96,rx:3.2,ry:9,transform:'rotate('+k*45+' 62 105)'},ros);
    E('circle',{cx:62,cy:105,r:4,fill:'#8a6224'},g);
    // middle panel with jaali lattice (mostly behind the lock)
    E('rect',{x:30,y:356,width:184,height:300,rx:3,fill:'url(#gEmer)',stroke:'url(#gGoldV)','stroke-width':2.2,'vector-effect':NSS},g);
    E('rect',{x:30,y:356,width:184,height:300,fill:'url(#pJaali)',opacity:.5},g);
    E('rect',{x:41,y:367,width:162,height:278,fill:'none',stroke:'#d9bd7c','stroke-width':.9,'vector-effect':NSS},g);
    // bottom panel: purna kalasham, one flanking each side of the doorway
    E('rect',{x:30,y:682,width:184,height:236,rx:3,fill:'url(#gEmer)',stroke:'url(#gGoldV)','stroke-width':2.2,'vector-effect':NSS},g);
    E('rect',{x:41,y:693,width:162,height:214,fill:'none',stroke:'#d9bd7c','stroke-width':.9,'vector-effect':NSS},g);
    kalasham(g,122,806);
    // brass studs on the stiles and rails
    var st=E('g',{},g);
    function stud(x,y){E('circle',{cx:x+.7,cy:y+1.3,r:4.4,fill:'rgba(40,25,5,.35)'},st);E('circle',{cx:x,cy:y,r:4.2,fill:'url(#gStud)'},st)}
    for(var y=40;y<=962;y+=34){stud(18.5,y);stud(225,y)}
    for(var x=52;x<=196;x+=24){stud(x,343);stud(x,669);stud(x,950)}
    E('rect',{x:235,width:5,height:1000,fill:'url(#gGoldH)'},g);
  }
  function kalasham(p,cx,cy){
    var g=E('g',{transform:'translate('+cx+' '+cy+')'},p);
    [-64,-36,-12,12,36,64].forEach(function(a,i){
      E('path',{d:'M0 -28C-8 -41 -7 -60 0 -74C7 -60 8 -41 0 -28Z',transform:'rotate('+a+' 0 -28)',fill:i%2?'#3f7a3a':'#4f8f45',stroke:'#d9bd7c','stroke-width':.7,'vector-effect':NSS},g)});
    E('ellipse',{cx:0,cy:-50,rx:11,ry:15,fill:'url(#gCoco)',stroke:'#8a6224','stroke-width':.7,'vector-effect':NSS},g);
    E('path',{d:'M-5 -63L0 -73L5 -63',fill:'none',stroke:'#8a6224','stroke-width':.9,'vector-effect':NSS},g);
    E('rect',{x:-12,y:-30,width:24,height:12,rx:2,fill:'url(#gGoldH)',stroke:'#8a6224','stroke-width':.6,'vector-effect':NSS},g);
    E('ellipse',{cx:0,cy:-30,rx:18,ry:4,fill:'url(#gGoldH)',stroke:'#8a6224','stroke-width':.6,'vector-effect':NSS},g);
    E('path',{d:'M-30 6C-34 34 -18 56 0 56C18 56 34 34 30 6C28 -10 14 -18 0 -18C-14 -18 -28 -10 -30 6Z',fill:'url(#gGoldPot)',stroke:'#8a6224','stroke-width':.8,'vector-effect':NSS},g);
    E('path',{d:'M-28 12Q0 22 28 12',fill:'none',stroke:'#fff1c4','stroke-width':1.1,'vector-effect':NSS},g);
    E('path',{d:'M-29 21Q0 31 29 21',fill:'none',stroke:'#8a6224','stroke-width':.8,'vector-effect':NSS},g);
    [[-14,25],[0,27],[14,25]].forEach(function(d){E('circle',{cx:d[0],cy:d[1],r:2.3,fill:'#b8323f'},g)});
    E('ellipse',{cx:0,cy:58,rx:20,ry:4,fill:'url(#gGoldH)',stroke:'#8a6224','stroke-width':.6,'vector-effect':NSS},g);
  }
  function mari(p,x,y,r){E('circle',{cx:x,cy:y,r:r,fill:'url(#gMari)'},p);E('circle',{cx:x,cy:y,r:r*.62,fill:'none',stroke:'#d8700f','stroke-width':1.1,'stroke-dasharray':'1.4 1.2'},p)}
  function buildToran(t){
    for(var i=0;i<18;i++){
      var x=6+i*26.8,L=E('g',{class:'lf',style:'animation-delay:'+(-i*.37).toFixed(2)+'s'},t);
      E('path',{d:'M'+x+' 4c8 10 10 34 0 58c-10-24-8-48 0-58Z',fill:'url(#gLeaf)'},L);
      E('path',{d:'M'+x+' 7V58',stroke:'#a9c97f','stroke-width':.8,opacity:.8},L);
    }
    E('path',{d:'M-10 4H490',stroke:'#b58f4a','stroke-width':2.4},t);
    for(var s=0;s<4;s++){var sw=E('g',{},t);for(var k=0;k<=10;k++){var u=k/10;mari(sw,s*120+u*120,6+Math.sin(u*Math.PI)*34,k%2?5.6:6.4)}}
    for(var j=0;j<=4;j++){
      var dx=j*120,dr=E('g',{class:'drop',style:'animation-delay:'+(-j*.7)+'s'},t);
      E('path',{d:'M'+dx+' 6V66',stroke:'#b58f4a','stroke-width':1},dr);
      for(var m=1;m<=4;m++)mari(dr,dx,6+m*12,5.2);
      E('path',{d:'M'+(dx-6)+' 80c0-8 2-12 6-12s6 4 6 12z',fill:'url(#gGoldV)',stroke:'#8a6224','stroke-width':.6},dr);
      E('circle',{cx:dx,cy:81.5,r:1.8,fill:'#8a6224'},dr);
    }
  }
  function buildDiya(svg){
    E('ellipse',{class:'halo',cx:80,cy:38,rx:30,ry:36,fill:'url(#gHalo)'},svg);
    var f=E('g',{class:'fl'},svg);
    E('path',{class:'fp',d:'M80 58C71 47 72 32 80 14C88 32 89 47 80 58Z',fill:'url(#gFlame)'},f);
    E('path',{class:'fp',d:'M80 57C77 52 77 46 80 40C83 46 83 52 80 57Z',fill:'#fffbe6',opacity:.9},f);
    E('path',{d:'M8 64C12 82 30 90 46 90S80 82 84 64Z',fill:'url(#gBrassBowl)',stroke:'#6d4c17','stroke-width':.8},svg);
    E('path',{d:'M78 62Q90 58 94 58Q88 66 80 70Z',fill:'url(#gBrassBowl)',stroke:'#6d4c17','stroke-width':.6},svg);
    E('ellipse',{cx:46,cy:64,rx:38,ry:6,fill:'#4a2f0c'},svg);
    E('ellipse',{cx:46,cy:64,rx:38,ry:6,fill:'none',stroke:'#f4d68a','stroke-width':1.6},svg);
    E('path',{d:'M80 62Q81 60 80 58',stroke:'#3b2408','stroke-width':2,fill:'none'},svg);
    E('path',{d:'M38 89L40 94H52L54 89Z',fill:'#8a6224'},svg);
    E('ellipse',{cx:46,cy:95,rx:15,ry:3.4,fill:'url(#gBrassBowl)'},svg);
  }

  /* gold dust while sealed, then a burst of petals toward the camera */
  var sk=$('sparkle'),sx=sk.getContext('2d'),SW=0,SH=0,dust=[],parts=[],idle=true,dustA=1,skLast=0,skRun=false;
  function skKick(){if(!skRun){skRun=true;skLast=0;requestAnimationFrame(skFrame)}}
  var PCOL=['#e2627f','#d9466a','#f08aa3','#c9304f','#f39a1f','#f7b733','#ffcf5a','#ef7f9a'];
  function skSize(){var r=stage.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);SW=r.width;SH=r.height;sk.width=SW*d;sk.height=SH*d;sx.setTransform(d,0,0,d,0,0)}
  function mote(init){return{x:Math.random()*SW,y:init?Math.random()*SH:SH+8,r:.7+Math.random()*1.7,vy:-(8+Math.random()*18),ph:Math.random()*6.28,sp:.6+Math.random()*1.4,a:.35+Math.random()*.55}}
  function burst(){
    for(var i=0;i<140;i++){
      var a=Math.random()*6.283,s=(.22+Math.random()*.85)*SW,gold=i%4===0;
      parts.push({x:(Math.random()-.5)*SW*.12,y:(Math.random()-.5)*SH*.22,z:0,vx:Math.cos(a)*s,vy:Math.sin(a)*s-SW*.2,vz:(.2+Math.random()*.9)*SW,
        r:(gold?.005+Math.random()*.004:.017+Math.random()*.016)*SW,rot:Math.random()*6.28,vr:(Math.random()-.5)*9,tb:Math.random()*6.28,vt:2+Math.random()*5,
        c:gold?'#fff1b8':PCOL[(Math.random()*PCOL.length)|0],gold:gold,t:0,life:1.8+Math.random()*1.3});
    }
    skKick();
  }
  function skFrame(ts){
    var dt=Math.min(.05,(ts-(skLast||ts))/1000);skLast=ts;
    sx.clearRect(0,0,SW,SH);
    if(!idle)dustA=Math.max(0,dustA-dt*1.6);
    if(dustA>0){
      sx.globalCompositeOperation='lighter';
      for(var i=0;i<dust.length;i++){var d=dust[i];d.y+=d.vy*dt;d.ph+=dt*d.sp;if(d.y<-8){dust[i]=mote(false);continue}
        var al=d.a*(.55+.45*Math.sin(d.ph*2.3))*dustA;
        sx.fillStyle='rgba(255,226,150,'+al.toFixed(3)+')';sx.beginPath();sx.arc(d.x+Math.sin(d.ph)*7,d.y,d.r,0,6.283);sx.fill()}
      sx.globalCompositeOperation='source-over';
    }
    var P=SW*1.5,cx=SW/2,cy=SH/2;
    for(var j=parts.length-1;j>=0;j--){
      var p=parts[j];p.t+=dt;
      if(p.t>p.life||p.z>P*.82){parts.splice(j,1);continue}
      p.vy+=SW*.55*dt;p.vx*=1-.55*dt;p.vz*=1-.25*dt;
      p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.rot+=p.vr*dt;p.tb+=p.vt*dt;
      var f=P/(P-p.z),al2=Math.min(1,p.t*7)*Math.min(1,(p.life-p.t)/(p.life*.35));
      sx.save();sx.globalAlpha=al2;sx.translate(cx+p.x*f,cy+p.y*f);sx.rotate(p.rot);
      if(p.gold){sx.globalCompositeOperation='lighter';sx.fillStyle=p.c;sx.beginPath();sx.arc(0,0,p.r*f,0,6.283);sx.fill();
        sx.globalAlpha=al2*.3;sx.beginPath();sx.arc(0,0,p.r*f*3.2,0,6.283);sx.fill()}
      else{sx.scale(f,f*(.25+.75*Math.abs(Math.cos(p.tb))));sx.fillStyle=p.c;sx.beginPath();sx.ellipse(0,0,p.r,p.r*.62,0,0,6.283);sx.fill();
        sx.lineWidth=.7/f;sx.strokeStyle='rgba(110,30,40,.28)';sx.stroke();
        sx.fillStyle='rgba(150,60,60,.14)';sx.beginPath();sx.ellipse(-p.r*.18,0,p.r*.6,p.r*.16,0,0,6.283);sx.fill()}
      sx.restore();
    }
    if(idle||dustA>0||parts.length)requestAnimationFrame(skFrame);else{skRun=false;sx.clearRect(0,0,SW,SH)}
  }

  /* temple bell, synthesised so there's no audio file to load */
  function ringBell(){
    try{
      var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
      var ac=new AC(),out=ac.createGain();out.gain.value=.2;out.connect(ac.destination);
      var strike=function(t0,vol){
        [[1,1,3.4],[2.01,.55,2.3],[2.74,.32,1.7],[4.12,.2,1.15],[5.4,.12,.8]].forEach(function(pt){
          [0,1.7].forEach(function(det){
            var o=ac.createOscillator(),gn=ac.createGain();o.type='sine';o.frequency.value=640*pt[0]+det;
            gn.gain.setValueAtTime(0,t0);gn.gain.linearRampToValueAtTime(vol*pt[1]*.5,t0+.005);gn.gain.exponentialRampToValueAtTime(.0001,t0+pt[2]);
            o.connect(gn);gn.connect(out);o.start(t0);o.stop(t0+pt[2]+.05);
          });
        });
      };
      var t=ac.currentTime+.02;strike(t,1);strike(t+.45,.55);
      setTimeout(function(){if(ac.close)ac.close()},4500);
    }catch(e){}
  }

  /* ================= START ================= */
  buildScene();
  document.querySelectorAll('.door .face svg').forEach(buildDoor);
  buildToran($('toran'));
  document.querySelectorAll('.diya').forEach(buildDiya);
  skSize();for(var di=0;di<30;di++)dust.push(mote(true));
  addEventListener('resize',skSize);
  skKick();

  var opened=false;
  function begin(){
    if(opened)return;opened=true;
    ringBell();
    if(navigator.vibrate)try{navigator.vibrate([14,50,22])}catch(e){}
    stage.classList.remove('sealed');
    stage.classList.add('opening');
    idle=false;
    setTimeout(function(){if(!reduce)burst()},1150);
    setTimeout(function(){stage.classList.add('ready');go(0,true);startPetals()},reduce?0:1700);
    setTimeout(function(){stage.classList.add('opened');stage.classList.remove('opening')},reduce?60:4700);
  }
  $('openBtn').addEventListener('click',begin);
  var armedOnce=false;function arm(){if(armedOnce)return;armedOnce=true;stage.classList.add('armed')}
  if(document.fonts&&document.fonts.ready){Promise.race([document.fonts.ready,new Promise(function(r){setTimeout(r,2500)})]).then(arm)}else addEventListener('load',arm);
  setTimeout(arm,3200);
  cur=-1;
})();
