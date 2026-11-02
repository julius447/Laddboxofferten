
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
    var lank  = document.getElementById("refLank"),
        kopia = document.getElementById("refKopiera"),
        dela  = document.getElementById("refDela"),
        stat  = document.getElementById("refStatus");
    if (!lank || !kopia) return;
    var VILA     = "Kopiera länk",
        KLAR     = "Kopierad",
        NEKAD    = "Kopieringen gick inte. Markera adressen och kopiera den själv.",
        HORD     = "Länken är kopierad.",
        timer    = null;
    function adress(){ return lank.getAttribute("href") || (lank.textContent || "").trim(); }
    function sag(text, syns){
      if (!stat) return;
      stat.textContent = text;
      stat.classList.toggle("o-dold", !syns);
    }
    function tillVila(){
      kopia.textContent = VILA;
      kopia.setAttribute("aria-label", VILA);
      kopia.classList.remove("klar");
    }
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      kopia.hidden = false;
      tillVila();
      kopia.addEventListener("click", function(){
        navigator.clipboard.writeText(adress()).then(function(){
          kopia.textContent = KLAR;
          kopia.setAttribute("aria-label", KLAR);
          kopia.classList.add("klar");
          sag(HORD, false);
          setTimeout(function(){ sag("", false); }, 500);
          clearTimeout(timer);
          timer = setTimeout(tillVila, 4000);
        }).catch(function(){
          sag(NEKAD, true);
          var r = document.createRange();
          r.selectNodeContents(lank);
          var s = window.getSelection();
          s.removeAllRanges(); s.addRange(r);
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
