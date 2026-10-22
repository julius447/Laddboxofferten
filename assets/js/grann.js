/* Granninbjudningarnas chips-falt.

   Ligger i gemensamt/block/ for att MARKUPEN gor det: grann.html delas av
   varje mall som har ett rekommendera-block. Nar koden lag i laddboxens eget
   skript tappade elcentralen sin inbjudningslogik i samma stund som laddboxen
   byggde om sin, och det upptacktes forst nar elcentralbygget vagrade starta
   med "skriptet slar upp id som inte finns i markupen: refKopiera, refLank".
   Delad markup och odelad kod ar en tidsinstalld bomb.

   Varje mall satter window.__render till sin egen omrakning. */
(function(){
  var render = function(){ if (typeof window.__render === "function") window.__render(); };

  /* GRANNINBJUDNINGAR SOM CHIPS.

     Inbjudningslanken ar borttagen pa agarorder. Skalet ar inte kosmetiskt:
     en lank som kunden kan sprida vart som helst sager inte VEM mottagaren
     ar, och utan mejladress gar det inte att skapa ett kundkort. Agaren:
     "da har vi deras mejl. Da kan vi skapa ett kundkort."

     Faltet var forut en rad dar man skickade EN adress i taget, och
     kommatecken mellan adresser. Agaren: "folk fattar inte det". Nu:
     skriv adress, tryck enter, adressen lases i en ruta, flera kan laggas
     till, X vid hover tar bort. Samma monster som Keyword Planner. */
  (function(){
    var box   = document.getElementById("refChips"),
        mej   = document.getElementById("refMejl"),
        skick = document.getElementById("refSkicka"),
        lista = document.getElementById("refLista");
    if(!box || !mej) return;

    var adresser = [];
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
      if(!giltig(v)){ mej.setAttribute("aria-invalid","true"); return false; }
      mej.removeAttribute("aria-invalid");
      if(adresser.indexOf(v) >= 0){
        /* dubblett: blinka den befintliga i stallet for att tyst slanga */
        var fanns = box.querySelectorAll(".o-chip")[adresser.indexOf(v)];
        if(fanns){ fanns.style.animation = "none"; void fanns.offsetWidth; fanns.style.animation = ""; }
        mej.value = ""; return false;
      }
      adresser.push(v); mej.value = ""; rita(); return true;
    }

    mej.addEventListener("keydown", function(e){
      if(e.key === "Enter" || e.key === "," || e.key === " "){ e.preventDefault(); lagg(); }
      /* backsteg i ett tomt falt tar bort senaste chipet, som i riktiga faltet */
      else if(e.key === "Backspace" && !mej.value && adresser.length){
        adresser.pop(); rita();
      }
    });
    mej.addEventListener("blur", lagg);
    mej.addEventListener("input", function(){ mej.removeAttribute("aria-invalid"); });
    /* klick var som helst i rutan ska landa i inmatningen */
    box.addEventListener("click", function(e){ if(e.target === box) mej.focus(); });

    /* klistra in flera adresser pa en gang */
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

    /* antalet inbjudna gar in i summeringen via render() */
    window.__grannar = function(){ return adresser.length + lista.children.length; };
    rita();
  })();
})();
