
(function(){
  var render = function(){ if (typeof window.__render === "function") window.__render(); };
  (function(){
    var givare = document.getElementById("refGivare");
    if (!givare) return;
    function urHalsningen(){
      var h = document.querySelector(".offer h1.t-display");
      if (!h) return null;
      var m = /^\s*Hej\s+([A-ZÅÄÖ][A-Za-zÅÄÖåäöÉéÜü'\-]{0,23})\s*,/.exec(h.textContent || "");
      return m ? m[1] : null;
    }
    var namn = (typeof window.__kundfornamn === "string" && window.__kundfornamn.trim())
      ? window.__kundfornamn.trim()
      : urHalsningen();
    if (namn) givare.textContent = namn;
  })();
  (function(){
    var ruta  = document.querySelector(".o-ref-lankruta"),
        lank  = document.getElementById("refLank"),
        ikon  = document.getElementById("refIkon"),
        hjalp = document.getElementById("refHjalp"),
        dela  = document.getElementById("refDela"),
        stat  = document.getElementById("refStatus");
    if (!ruta || !lank) return;
    var NEKAD = "Kopieringen gick inte. Markera adressen och kopiera den själv.",
        HORD  = "Länken är kopierad.",
        HJALP_KOPIERA = "Tryck på länken för att kopiera den. "
                      + "Personen du skickar den till fyller i sina uppgifter själv.",
        KOPIA = ikon ? ikon.innerHTML : "",
        BOCK  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"'
              + ' stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'
              + '<path d="M4 12.5 9 17.5 20 6.5"/></svg>',
        timer = null;
    function adress(){ return lank.getAttribute("href") || (lank.textContent || "").trim(); }
    function sag(text, syns){
      if (!stat) return;
      stat.textContent = text;
      stat.classList.toggle("o-dold", !syns);
    }
    function tillVila(){
      ruta.classList.remove("ar-klar");
      if (ikon) { ikon.innerHTML = KOPIA; }
      lank.setAttribute("aria-label", "Kopiera länken " + adress());
    }
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      if (hjalp) { hjalp.textContent = HJALP_KOPIERA; }
      tillVila();
      lank.addEventListener("click", function(ev){
        ev.preventDefault();
        navigator.clipboard.writeText(adress()).then(function(){
          ruta.classList.add("ar-klar");
          if (ikon) { ikon.innerHTML = BOCK; }
          lank.setAttribute("aria-label", "Länken är kopierad: " + adress());
          sag(HORD, false);
          setTimeout(function(){ sag("", false); }, 500);
          clearTimeout(timer);
          timer = setTimeout(tillVila, 4000);
        }).catch(function(){
          sag(NEKAD, true);
          var r = document.createRange();
          r.selectNodeContents(lank);
          var sel = window.getSelection();
          sel.removeAllRanges(); sel.addRange(r);
        });
      });
    }
    if (dela && navigator.share && window.matchMedia &&
        window.matchMedia("(pointer: coarse)").matches) {
      var nyttja = { url: adress() };
      if (!navigator.canShare || navigator.canShare(nyttja)) {
        dela.hidden = false;
        dela.addEventListener("click", function(){
          navigator.share(nyttja).catch(function(){});
        });
      }
    }
  })();
})();
