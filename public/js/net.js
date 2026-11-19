(function(){
  var c=document.getElementById('net');if(!c)return;
  var x=c.getContext('2d'),W,H,pts=[],m={x:-999,y:-999};
  var still=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size(){
    var r=c.getBoundingClientRect(),d=window.devicePixelRatio||1;
    W=r.width;H=r.height;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0);
    var n=Math.max(24,Math.min(70,Math.round(W*H/16000)));
    pts=[];for(var i=0;i<n;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35});
  }
  function frame(){
    x.clearRect(0,0,W,H);
    for(var i=0;i<pts.length;i++){
      var p=pts[i];
      if(!still){
        var dx=p.x-m.x,dy=p.y-m.y,d=Math.hypot(dx,dy);
        if(d<120){p.vx+=dx/d*.03;p.vy+=dy/d*.03}
        p.vx*=.995;p.vy*=.995;p.x+=p.vx;p.y+=p.vy;
        if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
      }
      for(var j=i+1;j<pts.length;j++){
        var q=pts[j],e=Math.hypot(p.x-q.x,p.y-q.y);
        if(e<140){x.strokeStyle='rgba(255,179,71,'+(1-e/140)*.35+')';x.lineWidth=1;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke()}
      }
      x.fillStyle='rgba(255,179,71,.85)';x.beginPath();x.arc(p.x,p.y,2,0,6.283);x.fill();
    }
    if(!still)requestAnimationFrame(frame);
  }
  window.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top});
  window.addEventListener('resize',function(){size();if(still)frame()});
  size();frame();
})();
