(function(){
  var $=function(i){return document.getElementById(i);};
  var KVITTOETIKETT="Tillägg, 4 artiklar";

  /* Tillagget raknar ingenting i webblasaren: raderna och totalen ar
     renderade i bygget ur katalogen. Men prisytorna visas forst nar skriptet
     SJALVT sagt att det kor, samma skydd som de andra mallarna: ett skript
     som inte laddar (annonsblockerare, tappat paket, gammal cache) far inte
     lamna en sida som ser ut att kunna ta emot ett svar. Se js-redo i
     gemensamt/system.css. */
  function render(){
    var _o=document.querySelector('.offer'); if(_o) _o.classList.add('js-redo');
  }
  window.__render = render;

  /* I produktion ar accept och avboj egna sidor. Prototypen visar dem som
     egna skarmar i stallet, sa flodet gar att granska. Samma funktion som i
     laddboxmallen, utan paket, tid och skal att nolla. */
  function visaSkarm(id){
    var s=$(id==="skarmAccept"?"skarmAccept":"skarmAvboj");
    if(!s) return;
    document.querySelector(".offer").classList.add("visarSkarm");
    s.hidden=false; s.classList.add("syns");
    if(id==="skarmAccept"){
      /* KVITTOT. Samma tal som kortet just visade, last ur DOM:en i stallet
         for omraknat, sa de inte kan dra isar. */
      var kv=$("oaKvitto");
      if(kv){
        $("oaTotal").textContent=$("sumTotal").textContent;
        $("oaPaket").textContent=KVITTOETIKETT;
        kv.hidden=false;
      }
      /* Ett ikryssat skal bakom en acceptskarm ar ett svar sidan aldrig
         fick, och det skulle folja med in i CRM:et. */
      document.querySelectorAll('input[name="skal"]:checked').forEach(function(e){ e.checked=false; });
    }
    /* EN SKARMLASARE MASTE FA VETA ATT SVARET GICK IGENOM. Regeln
       .offer.visarSkarm > *:not(.o-skarm) slacker knappen som hade fokus,
       sa fokus flyttas in i skarmen och upplasaren laser rubriken. */
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

  /* UTSKRIFTEN. En stangd <details> tar inte med sitt innehall pa papperet,
     oavsett vad CSS sager om barnet. Villkoren oppnas fore utskrift och
     aterstalls efterat. Samma kod som de andra mallarna, inklusive sparren
     mot att oppnaren fyrar tva ganger och glommer vilka foldar som var oppna. */
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
