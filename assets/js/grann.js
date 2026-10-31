
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
    var box   = document.getElementById("refChips"),
        mej   = document.getElementById("refMejl"),
        skick = document.getElementById("refSkicka"),
        lista = document.getElementById("refLista");
    if(!box || !mej) return;
    var adresser = [];
    var fel = document.getElementById("refFel"),
        FELTEXT = "Det ser inte ut som en mejladress. Kontrollera adressen.";
    function visaFel(pa){ if (fel) fel.textContent = pa ? FELTEXT : ""; }
    function giltig(v){ return /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v); }
    function rent(v){ return v.replace(/[<>&"]/g, ""); }
    function rita(){
      box.querySelectorAll(".o-chip").forEach(function(c){ c.remove(); });
      adresser.forEach(function(a, n){
        var c = document.createElement("span");
        c.className = "o-chip";
        c.innerHTML = '<span>' + rent(a) + '</span>' +
          '<button type="button" aria-label="Ta bort ' + rent(a) + '">' +
          '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" ' +
          'stroke-linecap="round" aria-hidden="true"><path d="M2 2l8 8M10 2l-8 8"/></svg></button>';
        c.querySelector("button").addEventListener("click", function(e){
          e.preventDefault(); e.stopPropagation();
          adresser.splice(n, 1); rita(); mej.focus(); render();
        });
        box.insertBefore(c, mej);
      });
      skick.disabled = adresser.length === 0;
      skick.textContent = adresser.length > 1
        ? "Skicka " + adresser.length + " inbjudningar" : "Skicka inbjudan";
      render();
    }
    function lagg(){
      var v = mej.value.trim().toLowerCase();
      if(!v) return false;
      if(!giltig(v)){ mej.setAttribute("aria-invalid","true"); visaFel(true); return false; }
      mej.removeAttribute("aria-invalid"); visaFel(false);
      if(adresser.indexOf(v) >= 0){
        var fanns = box.querySelectorAll(".o-chip")[adresser.indexOf(v)];
        if(fanns){ fanns.style.animation = "none"; void fanns.offsetWidth; fanns.style.animation = ""; }
        mej.value = ""; return false;
      }
      adresser.push(v); mej.value = ""; rita(); return true;
    }
    mej.addEventListener("keydown", function(e){
      if(e.key === "Enter" || e.key === "," || e.key === " "){ e.preventDefault(); lagg(); }
      else if(e.key === "Backspace" && !mej.value && adresser.length){
        adresser.pop(); rita();
      }
    });
    mej.addEventListener("blur", lagg);
    mej.addEventListener("input", function(){ mej.removeAttribute("aria-invalid"); visaFel(false); });
    box.addEventListener("click", function(e){ if(e.target === box) mej.focus(); });
    mej.addEventListener("paste", function(e){
      var txt = (e.clipboardData || window.clipboardData).getData("text") || "";
      if(!/[,;\s]/.test(txt)) return;
      e.preventDefault();
      txt.split(/[,;\s]+/).forEach(function(d){ mej.value = d.trim(); lagg(); });
    });
    skick.addEventListener("click", function(){
      if(!adresser.length) return;
      adresser.forEach(function(a){
        var li = document.createElement("li");
        li.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
          'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M4.5 12.5 9.5 17.5 19.5 7"/></svg>' +
          '<span>Inbjudan skickad till ' + rent(a) + '</span>';
        lista.appendChild(li);
      });
      adresser = []; rita();
    });
    window.__grannar = function(){ return adresser.length + lista.children.length; };
    rita();
  })();
})();
