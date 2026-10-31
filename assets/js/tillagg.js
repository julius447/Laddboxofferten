(function(){
  var $=function(i){return document.getElementById(i);};
  var KVITTOETIKETT="Tillägg, 4 artiklar";
  function render(){
    var _o=document.querySelector('.offer'); if(_o) _o.classList.add('js-redo');
  }
  window.__render = render;
  function visaSkarm(id){
    var s=$(id==="skarmAccept"?"skarmAccept":"skarmAvboj");
    if(!s) return;
    document.querySelector(".offer").classList.add("visarSkarm");
    s.hidden=false; s.classList.add("syns");
    if(id==="skarmAccept"){
      var kv=$("oaKvitto");
      if(kv){
        $("oaTotal").textContent=$("sumTotal").textContent;
        $("oaPaket").textContent=KVITTOETIKETT;
        kv.hidden=false;
      }
      document.querySelectorAll('input[name="skal"]:checked').forEach(function(e){ e.checked=false; });
    }
    s.setAttribute("tabindex","-1");
    if(!s.getAttribute("role")) s.setAttribute("role","status");
    try{ s.focus({preventScroll:true}); }catch(e){ try{ s.focus(); }catch(e2){} }
    var sc=document.getElementById("scroller")||document.scrollingElement;
    if(sc) sc.scrollTop=0; else window.scrollTo(0,0);
  }
  $("acceptBtn").addEventListener("click",function(){ visaSkarm("skarmAccept"); });
  var av=$("avboj"), panel=$("avbojPanel");
  av.addEventListener("click",function(){
    var open=panel.hidden; panel.hidden=!open; av.setAttribute("aria-expanded",open?"true":"false");
  });
  $("avbojSend").addEventListener("click",function(){ visaSkarm("skarmAvboj"); });
  (function(){
    var fore=[];
    function oppna(){
      if(fore.length) return;
      fore=[].slice.call(document.querySelectorAll("details"));
      fore.forEach(function(e){ e.dataset.varOppen=e.open?"1":"0"; e.open=true; });
    }
    function aterstall(){
      fore.forEach(function(e){ e.open=e.dataset.varOppen==="1"; delete e.dataset.varOppen; });
      fore=[];
    }
    window.addEventListener("beforeprint",oppna);
    window.addEventListener("afterprint",aterstall);
    if(window.matchMedia){
      var mq=window.matchMedia("print");
      var lyssna=mq.addEventListener?mq.addEventListener.bind(mq,"change"):null;
      if(lyssna) lyssna(function(e){ e.matches?oppna():aterstall(); });
    }
  })();
  render();
})();
