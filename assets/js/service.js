
(function(){
  var PRIS=7400;
  var JOBBNAMN="Byte av strömbrytare och uttag";
  var TID={"1500": "Prioritet, 3 till 5 dagar", "2500": "Express, 24 till 72 timmar"};
  var GRANNRABATT=1000;
  function $(id){ return document.getElementById(id); }
  function kr(n){ return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0") + "\u00a0kr"; }
  function val(namn){
    var e = document.querySelector('input[name="' + namn + '"]:checked');
    return e ? +e.value : 0;
  }
  function radAntal(r){
    var a = r.querySelector("[data-antal]");
    return a ? +a.value : 1;
  }
  function radVarde(r, i){
    var styck = i.getAttribute("data-styck");
    return styck ? (+styck) * radAntal(r) : +i.value;
  }
  function radNamn(r, i){
    var n = i.getAttribute("data-name");
    if (!i.getAttribute("data-styck")) return n;
    var an = radAntal(r);
    return n + ", " + an + " " + (an === 1 ? "styck" : "stycken");
  }
  function ovriga(){
    var kopt = [], fragor = [];
    document.querySelectorAll('.o-rad > input.add, .o-rad > input.intresse, '
                            + '.o-tjanst input[type="radio"]').forEach(function(i){
      var rad = i.closest(".o-rad");
      if (rad){
        rad.classList.toggle("vald", i.checked);
        if (i.hasAttribute("data-intresse")){
          if (i.checked) fragor.push(i.getAttribute("data-name"));
          return;
        }
        var v = radVarde(rad, i);
        var pf = rad.querySelector(".o-radpris");
        if (pf) pf.textContent = v ? "+" + kr(v) : "pris saknas";
        if (i.checked) kopt.push({namn: radNamn(rad, i), pris: v});
        return;
      }
      if (!i.checked) return;
      var sek = i.closest(".o-tjanst"), kort = i.closest(".o-pkg");
      var rub = sek ? sek.querySelector(".o-tjansttitel") : null;
      var titel = rub ? rub.textContent.replace(/^\s*\d+\s*/, "").trim() : i.name;
      var pn = kort ? kort.querySelector(".pname b") : null;
      var namn = titel + (pn ? ", " + pn.textContent.trim() : "");
      if (i.hasAttribute("value") && +i.value > 0) kopt.push({namn: namn, pris: +i.value});
      else fragor.push(namn);
    });
    return {kopt: kopt, fragor: fragor};
  }
  function rensningsknappar(){
    document.querySelectorAll("[data-rensa]").forEach(function(b){
      b.hidden = !document.querySelector('input[name="' + b.getAttribute("data-rensa") + '"]:checked');
    });
  }
  function render(){
    var _o = document.querySelector(".offer"); if (_o) _o.classList.add("js-redo");
    var tid = val("tid");
    var ovr = ovriga();
    var summa = PRIS + tid;
    ovr.kopt.forEach(function(v){ summa += v.pris; });
    var rows = '<div class="o-sumrow"><span>' + JOBBNAMN
             + '</span><span class="kr">' + kr(PRIS) + "</span></div>";
    if (tid) rows += '<div class="o-sumrow sub"><span>' + TID[String(tid)]
                   + '</span><span class="kr">' + kr(tid) + "</span></div>";
    ovr.kopt.forEach(function(v){
      rows += '<div class="o-sumrow sub"><span>' + v.namn
            + '</span><span class="kr">' + kr(v.pris) + "</span></div>";
    });
    if (ovr.fragor.length){
      rows += '<div class="o-sumrow grp"><span>Vi hör av oss om</span><span></span></div>';
      ovr.fragor.forEach(function(x){
        rows += '<div class="o-sumrow sub"><span>' + x + '</span><span>ingen kostnad nu</span></div>';
      });
    }
    $("sumRows").innerHTML = rows;
    rensningsknappar();
    $("calcFinalEtikett").textContent = (summa !== PRIS) ? "Ditt pris, med ditt val" : "Ditt pris";
    $("calcNet").textContent = kr(summa);
    $("sumTotal").textContent = kr(summa);
    $("barTotal").textContent = kr(summa);
  }
  window.__render = render;
  document.querySelectorAll('input[name="tid"]').forEach(function(i){
    i.addEventListener("change", render);
  });
  document.querySelectorAll('.o-rad > input.add, .o-rad > input.intresse, '
                          + '.o-tjanst input[type="radio"], .o-tjanst [data-antal]')
    .forEach(function(i){ i.addEventListener("change", render); });
  document.querySelectorAll("[data-rensa]").forEach(function(b){
    b.addEventListener("click", function(){
      var n = this.getAttribute("data-rensa");
      var inp = [].slice.call(document.querySelectorAll('input[name="' + n + '"]'));
      inp.forEach(function(i){ i.checked = false; });
      render();
      if (inp[0]){ try { inp[0].focus({preventScroll:true}); } catch(_){} }
    });
  });
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
  function visaSkarm(id){
    var s = $(id); if (!s) return;
    document.querySelector(".offer").classList.add("visarSkarm");
    s.hidden = false; s.classList.add("syns");
    if (id === "skarmAccept"){
      var kv = $("oaKvitto");
      if (kv){
        $("oaTotal").textContent = $("sumTotal").textContent;
        $("oaPaket").textContent = JOBBNAMN;
        kv.hidden = false;
      }
      document.querySelectorAll('input[name="skal"]:checked').forEach(function(e){ e.checked = false; });
      var tid = val("tid");
      var steg2 = s.querySelector('.oa__steps li:nth-child(2) small');
      if (steg2 && tid) steg2.textContent = "Du har valt " + TID[String(tid)] + ". Vi hör av oss för att boka tid.";
    }
    s.setAttribute("tabindex", "-1");
    if (!s.getAttribute("role")) s.setAttribute("role", "status");
    try { s.focus({preventScroll:true}); } catch(e){ try { s.focus(); } catch(e2){} }
    var sc = document.scrollingElement;
    if (sc) sc.scrollTop = 0; else window.scrollTo(0, 0);
  }
  var acc = $("acceptBtn");
  if (acc) acc.addEventListener("click", function(){ visaSkarm("skarmAccept"); });
  var mjukt = !window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function scrollTill(el,block){ if(el) el.scrollIntoView(mjukt?{behavior:"smooth",block:block||"start"}:{block:block||"start"}); }
  var go = $("barGo");
  if (go) go.addEventListener("click", function(){ scrollTill($("summering"), "start"); });
  var av = $("avbojSend");
  if (av) av.addEventListener("click", function(){ visaSkarm("skarmAvboj"); });
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
