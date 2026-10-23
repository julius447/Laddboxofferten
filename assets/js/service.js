/* Serviceofferten. Den enda av de fem mallarna som inte konfigurerar nagot i
   sitt eget jobb: kunden laser en lista och svarar ja eller nej. Skriptet har
   darfor bara tre uppgifter, och ingen av dem ar att rakna ett avdrag.

   AGARDIREKTIV 23 OKTOBER: ROT-avdragets BELOPP far aldrig sta pa en sida.
   Priserna ar netto, sa det finns ingenting att rakna. */
(function(){
  var PRIS=7400;
  var TID={"1500": "Prioritet, 3 till 5 dagar", "2500": "Express, 24 till 72 timmar"};
  var GRANNRABATT=500;

  function $(id){ return document.getElementById(id); }
  function kr(n){
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " kr";
  }
  function val(namn){
    var e = document.querySelector('input[name="' + namn + '"]:checked');
    return e ? +e.value : 0;
  }

  function render(){
    /* Skriptet kor. Nu far prisytorna visas, se js-redo i system.css. */
    var _o = document.querySelector(".offer"); if (_o) _o.classList.add("js-redo");

    var tid = val("tid");
    var summa = PRIS + tid;

    var rows = '<div class="o-sumrow"><span>' + document.getElementById("prodName").textContent
             + '</span><span class="kr">' + kr(PRIS) + "</span></div>";
    if (tid) rows += '<div class="o-sumrow sub"><span>' + TID[String(tid)]
                   + '</span><span class="kr">' + kr(tid) + "</span></div>";
    $("sumRows").innerHTML = rows;

    $("calcFinalEtikett").textContent = tid ? "Ditt pris, med ditt val" : "Ditt pris";
    $("calcNet").textContent = kr(summa);
    $("sumTotal").textContent = kr(summa);
    $("barTotal").textContent = kr(summa);
  }
  window.__render = render;

  document.querySelectorAll('input[name="tid"]').forEach(function(i){
    i.addEventListener("change", render);
  });

  /* ---- panelerna ---- */
  [["fraga", "fragaPanel", "avbojPanel"], ["avboj", "avbojPanel", "fragaPanel"]]
    .forEach(function(par){
      var b = $(par[0]); if (!b) return;
      b.addEventListener("click", function(){
        var p = $(par[1]), other = $(par[2]);
        var open = p.hidden; p.hidden = !open;
        b.setAttribute("aria-expanded", open ? "true" : "false");
        if (open && other) other.hidden = true;
      });
    });

  var fs = $("fragaSend");
  if (fs) fs.addEventListener("click", function(){
    var ta = $("fragaText"), h = $("fragaHint");
    if (!ta.value.trim()){ h.textContent = "Skriv din fråga i rutan först."; ta.focus(); return; }
    h.textContent = "Frågan är mottagen.";
    this.disabled = true; ta.readOnly = true;
  });

  /* ---- skarmarna ---- */
  function visaSkarm(id){
    var s = $(id); if (!s) return;
    document.querySelector(".offer").classList.add("visarSkarm");
    s.hidden = false; s.classList.add("syns");

    if (id === "skarmAccept"){
      var kv = $("oaKvitto");
      if (kv){
        $("oaTotal").textContent = $("sumTotal").textContent;
        $("oaPaket").textContent = document.getElementById("prodName").textContent;
        kv.hidden = false;
      }
      /* Avbojspanelen nollas: ett ikryssat skal bakom en acceptskarm ar ett
         svar sidan aldrig fick. */
      document.querySelectorAll('input[name="skal"]:checked').forEach(function(e){ e.checked = false; });
      var tid = val("tid");
      var steg2 = s.querySelector('.oa__steps li:nth-child(2) small');
      if (steg2 && tid) steg2.textContent = "Du har valt " + TID[String(tid)] + ". Vi hör av oss för att boka tid.";
    }

    /* En skarmlasare maste fa veta att kopet gick igenom: regeln som visar
       skarmen slacker knappen som hade fokus, sa fokus hamnar pa body. */
    s.setAttribute("tabindex", "-1");
    if (!s.getAttribute("role")) s.setAttribute("role", "status");
    try { s.focus({preventScroll:true}); } catch(e){ try { s.focus(); } catch(e2){} }

    var sc = document.scrollingElement;
    if (sc) sc.scrollTop = 0; else window.scrollTo(0, 0);
  }
  ["acceptBtn", "barBtn"].forEach(function(id){
    var b = $(id); if (b) b.addEventListener("click", function(){ visaSkarm("skarmAccept"); });
  });
  var av = $("avbojSend");
  if (av) av.addEventListener("click", function(){ visaSkarm("skarmAvboj"); });

  /* ---- utskriften. En stangd <details> tar inte med sitt innehall pa
     papperet, oavsett vad CSS sager om barnet, for ::details-content bar
     content-visibility:hidden. ---- */
  (function(){
    var fore = [];
    function oppna(){
      if (fore.length) return;
      fore = [].slice.call(document.querySelectorAll("details"));
      fore.forEach(function(e){ e.dataset.varOppen = e.open ? "1" : "0"; e.open = true; });
    }
    function aterstall(){
      fore.forEach(function(e){ e.open = e.dataset.varOppen === "1"; delete e.dataset.varOppen; });
      fore = [];
    }
    window.addEventListener("beforeprint", oppna);
    window.addEventListener("afterprint", aterstall);
    if (window.matchMedia){
      var mq = window.matchMedia("print");
      if (mq.addEventListener) mq.addEventListener("change", function(e){ e.matches ? oppna() : aterstall(); });
    }
  })();

  render();
})();
