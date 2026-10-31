(function(){
  "use strict";
  function $(id){ return document.getElementById(id); }
  function kr(n){ return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0") + "\u00a0kr"; }
  var PKG={"5990": {"namn": "Liten", "spec": "", "passar": "Passar till lägenheter eller mindre hus, där centralen matar det som redan finns.", "bildsrc": "assets/img/hager-liten.webp", "bildduk": "174.7", "grupper": 7}, "9750": {"namn": "Medel", "spec": "", "passar": "Passar till villor och radhus som de ser ut i dag, med plats kvar för det som kommer sedan.", "bildsrc": "assets/img/hager-mellan.webp", "bildduk": "134.1", "grupper": 20}, "17250": {"namn": "Stor", "spec": "", "passar": "Passar till hus som ska bära laddbox, värmepump och solceller utan att centralen rörs igen.", "bildsrc": "assets/img/hager-stor.webp", "bildduk": "96", "grupper": 36}};
  var TAK={"5990": 17, "9750": 34, "17250": null};
  var RYMS={"5990": 13, "9750": 22, "17250": 20};
  var TJANSTPOTT={"laddbox": "gt"};
  var GRANNRABATT=1000;
  var ORDNING = Object.keys(PKG).sort(function(a,b){ return a - b; });
  var offer = document.querySelector(".offer");
  if (!offer) return;
  var mjukt = !window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function scrollTill(el,block){ if(el) el.scrollIntoView(mjukt?{behavior:"smooth",block:block||"start"}:{block:block||"start"}); }
  var bildVald = { bildCentral:false };
  var inpBild = $("bildCentral");
  if (inpBild) inpBild.addEventListener("change", function(){
    var ruta = inpBild.closest(".o-bildruta");
    var status = document.querySelector('.o-bildstatus[data-for="bildCentral"]');
    var har = !!(inpBild.files && inpBild.files.length);
    bildVald.bildCentral = har;
    if (ruta) ruta.classList.toggle("har", har);
    if (status) status.textContent = har ? "Vald" : "";
    rekommendera();
  });
  function rekommendera(){
    var rad = $("rekRad");
    if (!rad) return;
    if (bildVald.bildCentral) {
      rad.hidden = false;
      rad.textContent = "Tack, bilden är vald. Priset här gäller den storlek du själv väljer i steg 2.";
    } else {
      rad.hidden = true;
    }
  }
  function valdStorlek(){
    var v = offer.querySelector('input[name="pkg"]:checked');
    return v ? v.value : Object.keys(PKG)[0];
  }
  function valdTid(){
    var v = offer.querySelector('input[name="tid"]:checked');
    return v ? parseInt(v.value, 10) : 0;
  }
  function poster(){
    var ut = [];
    offer.querySelectorAll(".add:checked, .intresse:checked").forEach(function(c){
      var rad = c.closest(".o-rad");
      var ant = rad ? rad.querySelector("[data-antal]") : null;
      var sel = rad ? rad.querySelector(".o-variant") : null;
      var n = ant ? Math.max(1, parseInt(ant.value, 10) || 1) : 1;
      var styck = sel ? parseInt(sel.value, 10) : parseInt(c.value, 10);
      ut.push({
        namn: c.getAttribute("data-name"),
        grupp: c.getAttribute("data-grupp"),
        antal: n,
        styck: isNaN(styck) ? null : styck,
        belopp: isNaN(styck) ? null : styck * n,
        pott: c.getAttribute("data-avdrag") || "rot",
        variant: sel ? sel.options[sel.selectedIndex].textContent : null,
        fran: c.getAttribute("data-fran") || null
      });
    });
    return ut.concat(tjansteval());
  }
  var TJANSTEVAL = '.o-tjanst input[type="radio"]';
  function tjansteval(){
    var ut = [];
    offer.querySelectorAll(TJANSTEVAL + ":checked").forEach(function(r){
      var sek = r.closest(".o-tjanst"), kort = r.closest(".o-pkg");
      var grupp = r.name.replace(/pkg$/, "");
      var rub = sek ? sek.querySelector(".o-tjansttitel") : null;
      var namn = rub ? rub.textContent.replace(/^\s*\d+\s*/, "").trim() : grupp;
      var pn = kort ? kort.querySelector(".pname b") : null;
      var v = r.hasAttribute("value") ? parseInt(r.value, 10) : NaN;
      ut.push({
        namn: namn + (pn ? ", " + pn.textContent.trim() : ""),
        grupp: grupp, antal: 1,
        styck: isNaN(v) ? null : v, belopp: isNaN(v) ? null : v,
        pott: TJANSTPOTT[grupp] || "rot", variant: null
      });
    });
    return ut;
  }
  (function(){
    var varVald = null;
    offer.querySelectorAll(".o-tjanst label.o-pkg").forEach(function(lbl){
      var r = lbl.querySelector('input[type="radio"]');
      if (!r) return;
      lbl.addEventListener("pointerdown", function(){ varVald = r.checked ? r : null; }, true);
      r.addEventListener("click", function(){
        if (varVald === r) { r.checked = false; varVald = null; rakna(); }
      });
    });
  })();
  var POTT_BAS = "ROT-avdrag";
  function pottraden(harAnnanPott){
    var mening = window.ampyPottext(POTT_BAS, harAnnanPott);
    $("sumPott").textContent = mening;
    $("calcRotNot").textContent = mening;
    $("barPott").textContent = window.ampyPottsvans(POTT_BAS, harAnnanPott);
  }
  var ingarKundval = {};
  function grinda(nyckel){
    offer.querySelectorAll("input.add[data-ingar-i]").forEach(function(i){
      var rad = i.closest(".o-rad");
      if (!rad) return;
      var med = (" " + i.getAttribute("data-ingar-i") + " ").indexOf(" " + nyckel + " ") !== -1;
      var pr = rad.querySelector(".o-radpris");
      if (med) {
        if (!i.disabled) ingarKundval[i.getAttribute("data-grupp")] = i.checked;
        i.checked = false;
        i.disabled = true;
        rad.classList.add("ingar");
        if (pr) {
          pr.textContent = "Ingår i " + (PKG[nyckel] ? PKG[nyckel].namn : nyckel);
          pr.classList.add("ingarpris");
        }
      } else {
        if (i.disabled) {
          i.disabled = false;
          i.checked = !!ingarKundval[i.getAttribute("data-grupp")];
        }
        rad.classList.remove("ingar");
        if (pr) {
          pr.textContent = "+" + kr(parseInt(i.value, 10));
          pr.classList.remove("ingarpris");
        }
      }
    });
  }
  function rakna(){
    var _o=document.querySelector('.offer'); if(_o) _o.classList.add('js-redo');
    grinda(valdStorlek());
    offer.querySelectorAll("input.add, input.intresse").forEach(function(i){
      var rad = i.closest(".o-rad");
      if (!rad || rad.hidden) return;
      rad.classList.toggle("vald", i.checked && !i.disabled);
    });
    var nyckel = valdStorlek();
    var p = PKG[nyckel];
    var bas = parseInt(nyckel, 10);
    var tid = valdTid();
    var rader = poster();
    var summa = bas + tid;
    var potter = { rot: bas + tid, gt: 0 };
    rader.forEach(function(r){
      if (r.belopp == null) return;
      summa += r.belopp;
      potter[r.pott === "gt" ? "gt" : "rot"] += r.belopp;
    });
    if (p) {
      $("prodName").textContent = "Elcentral + installation";
      $("prodSpec").textContent = p.passar;
      var bild = $("heroImg");
      if (bild && p.bildsrc) {
        bild.src = p.bildsrc;
        bild.alt = p.namn + " elcentral från Hager";
        if (p.bildduk) bild.style.setProperty("--duk", p.bildduk + "px");
      }
    }
    $("calcFinalEtikett").textContent = (summa > bas) ? "Ditt pris, med dina val" : "Ditt pris";
    var netto = summa;
    var rows = "";
    if (p) rows += '<div class="o-sumrow"><span>Paket ' + p.namn + '</span><span class="kr">' + kr(bas) + "</span></div>";
    if (tid) rows += '<div class="o-sumrow"><span>' + (tid === 1500 ? "Prioritet" : "Express") + '</span><span class="kr">' + kr(tid) + "</span></div>";
    var utanPris = [];
    rader.forEach(function(r){
      if (r.belopp == null) { utanPris.push(r); return; }
      var etikett = r.variant ? (r.namn + ", " + r.variant) : r.namn;
      if (r.antal > 1) etikett += ", " + r.antal + " st";
      rows += '<div class="o-sumrow"><span>' + etikett + '</span><span class="kr">' + kr(r.belopp) + "</span></div>";
    });
    if (utanPris.length) {
      rows += '<div class="o-sumrow"><span><b>Vi hör av oss om</b></span><span></span></div>';
      utanPris.forEach(function(r){
        rows += '<div class="o-sumrow"><span>' + r.namn + '</span>'
          + (r.fran ? '<span class="kr">' + r.fran + '</span>' : '<span class="kr saknas">pris saknas</span>')
          + '</div>';
      });
    }
    var grannar = document.querySelectorAll("#refLista li").length;
    if (grannar) {
      rows += '<div class="o-sumrow disc"><span>Rekommendationsrabatt, ' + grannar
        + (grannar > 1 ? " personer inbjudna" : " person inbjuden")
        + '</span><span class="kr">dras när de beställt</span></div>'
        + '<div class="o-sumnote">Upp till ' + kr(grannar * GRANNRABATT) + ' av, '
        + kr(GRANNRABATT) + ' för varje person som beställer. Ditt pris här ändras inte '
        + 'förrän det hänt.</div>';
    }
    $("sumRows").innerHTML = rows;
    $("calcNet").textContent = kr(netto);
    $("sumTotal").textContent = kr(netto);
    $("barTotal").textContent = kr(netto);
    pottraden(potter.gt > 0);
    platsen(nyckel, rader, taket(nyckel, rader));
  }
  function summeraDvarg(rader){
    var antal = 0, belopp = 0, fanns = false;
    rader.forEach(function(r){
      if (r.grupp && r.grupp.indexOf("dvargbrytare") === 0) {
        fanns = true; antal += r.antal; belopp += r.belopp;
      }
    });
    return fanns ? {antal: antal, belopp: belopp} : null;
  }
  function taket(nyckel, rader){
    var rad = $("takRad");
    if (!rad) return false;
    var tak = TAK[nyckel];
    var extra = null;
    extra = summeraDvarg(rader);
    if (tak == null || !extra || extra.antal <= tak) { rad.hidden = true; return false; }
    var i = ORDNING.indexOf(nyckel);
    var vill = PKG[nyckel].grupper + extra.antal;
    var nasta = null;
    for (var k = i + 1; k < ORDNING.length; k++) {
      if (PKG[ORDNING[k]].grupper >= vill) { nasta = ORDNING[k]; break; }
    }
    rad.hidden = false;
    var start = "Med " + extra.antal + " extra dvärgbrytare kostar "
      + PKG[nyckel].namn + " <b>" + kr(parseInt(nyckel, 10) + extra.belopp) + "</b>. ";
    if (!nasta) {
      var storst = PKG[ORDNING[ORDNING.length - 1]];
      $("takText").innerHTML = start + "Så många grupper ryms inte ens i " + storst.namn
        + ", som har <b>" + storst.grupper + "</b> dvärgbrytare från början. Ring oss så "
        + "räknar vi på rätt lösning.";
      $("takKnapp").hidden = true;
      return true;
    }
    $("takKnapp").hidden = false;
    var np = PKG[nasta];
    $("takText").innerHTML = start + np.namn + " kostar <b>" + kr(parseInt(nasta, 10))
      + "</b> och har plats för dem från början.";
    var k = $("takKnapp");
    k.textContent = "Byt till " + np.namn;
    k.onclick = function(){
      var inp = offer.querySelector('input[name="pkg"][value="' + nasta + '"]');
      if (!inp) return;
      inp.checked = true;
      offer.querySelectorAll('[data-antal^="dvargbrytare"]').forEach(function(ruta){ ruta.value = 1; });
      offer.querySelectorAll('.o-rad input[data-grupp^="dvargbrytare"]').forEach(function(kryss){ kryss.checked = false; });
      rakna();
      scrollTill(offer.querySelector("#pkgs"));
    };
    return true;
  }
  function platsMening(namn, ryms, antal, kapslingPris, nasta, nastaGrupper){
    if (ryms <= 0) {
      return "I " + namn + " ryms inga extra dvärgbrytare. Då behövs en extra kapsling, +" + kr(kapslingPris)
        + (nasta ? ", eller " + nasta + " som har " + nastaGrupper + " dvärgbrytare från början." : ".");
    }
    return "I " + namn + " ryms " + ryms + " extra dvärgbrytare. För " + antal
      + " behövs en extra kapsling, +" + kr(kapslingPris) + ".";
  }
  function platsen(nyckel, rader, takSyns){
    var rad = $("platsRad");
    if (!rad) return;
    var extra = null;
    extra = summeraDvarg(rader);
    var kapsling = offer.querySelector('.o-rad input[data-grupp="kapsling"]');
    var ryms = RYMS[nyckel];
    if (takSyns || !extra || ryms == null || extra.antal <= ryms || (kapsling && kapsling.checked)) {
      rad.hidden = true; return;
    }
    var i = ORDNING.indexOf(nyckel);
    var nasta = ORDNING[i + 1] ? PKG[ORDNING[i + 1]] : null;
    var kp = kapsling ? parseInt(kapsling.value, 10) : NaN;
    $("platsText").textContent = platsMening(PKG[nyckel].namn, ryms, extra.antal, isNaN(kp) ? 0 : kp,
                                             nasta ? nasta.namn : null, nasta ? nasta.grupper : null);
    rad.hidden = false;
    var k = $("platsKnapp");
    k.textContent = "Lägg till extra kapsling";
    k.onclick = function(){
      if (!kapsling) return;
      var ant = kapsling.closest(".o-rad").querySelector("[data-antal]");
      if (ant) ant.value = 1;
      kapsling.checked = true;
      rakna();
    };
  }
  function variantpris(sel){
    var rad = sel.closest(".o-rad");
    var pr = rad ? rad.querySelector(".o-radpris") : null;
    var v = parseInt(sel.value, 10);
    if (pr && !isNaN(v)) pr.textContent = "+" + kr(v);
  }
  offer.querySelectorAll(".o-variant").forEach(function(sel){ variantpris(sel); });
  offer.addEventListener("change", function(e){
    if (e.target.matches(".o-variant")) {
      variantpris(e.target);
      var kryss = e.target.closest(".o-rad").querySelector("input.add");
      if (kryss && !kryss.checked) kryss.checked = true;
    }
    if (e.target.matches('input[name="pkg"], input[name="tid"], .add, .intresse, [data-antal], .o-variant, ' + TJANSTEVAL)) rakna();
  });
  offer.addEventListener("click", function(e){
    if (e.target.matches("[data-antal]")) e.stopPropagation();
  });
  offer.addEventListener("pointerdown", function(e){
    var lbl = e.target.closest("label");
    if (!lbl) return;
    var inp = lbl.querySelector('input[type="radio"], input[type="checkbox"]');
    if (inp && inp.focus) inp.focus({ preventScroll: true });
  }, true);
  var go = $("barGo");
  if (go) go.addEventListener("click", function(){
    scrollTill($("summering"));
  });
  var fr = $("fraga");
  if (fr) fr.addEventListener("click", function(){
    var panel = $("fragaPanel");
    var oppen = panel.hidden;
    panel.hidden = !oppen;
    fr.setAttribute("aria-expanded", oppen ? "true" : "false");
  });
  var frSend = $("fragaSend");
  if (frSend) frSend.addEventListener("click", function(){
    $("fragaHint").textContent = "Skickad. Felix svarar på samma mejladress som offerten kom till.";
  });
  var infoOppnare = null;
  document.querySelectorAll(".o-info").forEach(function(b){
    b.addEventListener("click", function(e){
      e.preventDefault(); e.stopPropagation();
      var n = this.getAttribute("data-info");
      var m = document.getElementById("modal" + n.charAt(0).toUpperCase() + n.slice(1));
      if (m && m.showModal) {
        infoOppnare = this;
        try { this.focus({ preventScroll: true }); } catch (fel) { try { this.focus(); } catch (f2) {} }
        m.showModal();
      }
    });
  });
  document.querySelectorAll(".o-modal").forEach(function(m){
    m.addEventListener("close", function(){
      var k = infoOppnare; infoOppnare = null;
      if (!k) return;
      setTimeout(function(){ try { k.focus({ preventScroll: true }); } catch (fel) { k.focus(); } }, 0);
    });
  });
  (function(){
    var VILOLAGE = 50, STEG_PIL = 5, STEG_SIDA = 10, TROSKEL_PX = 6;
    var sistScrollad = 0;
    window.addEventListener("scroll", function(){ sistScrollad = Date.now(); }, { passive: true });
    function initiera(figur){
      var ram = figur.querySelector(".o-ffram");
      var reglage = figur.querySelector(".o-ffreglage");
      if (!ram || !reglage) return;
      var aktivPekare = null, vidrord = false, vinkningPagar = false;
      var sistAviserat = null, vantandeX = null, ramad = 0;
      var startX = 0, startY = 0, bekraftat = false;
      function satt(procent, egenInteraktion){
        if (!isFinite(procent)) procent = VILOLAGE;
        procent = Math.max(0, Math.min(100, procent));
        var avrundat = Math.round(procent);
        figur.style.setProperty("--ff-pos", procent + "%");
        if (Number(reglage.value) !== avrundat) reglage.value = String(avrundat);
        if (avrundat !== sistAviserat){
          sistAviserat = avrundat;
          reglage.setAttribute("aria-valuetext", "Efter syns till " + (100 - avrundat) + " procent");
        }
        if (egenInteraktion && !vidrord){
          vidrord = true;
          avbrytVinkning();
        }
      }
      function mjukt(pa){ figur.classList.toggle("mjuk", !!pa); }
      function procentAv(klientX){
        var r = ram.getBoundingClientRect();
        if (!r.width) return VILOLAGE;
        return ((klientX - r.left) / r.width) * 100;
      }
      function schemalagg(klientX){
        vantandeX = klientX;
        if (ramad) return;
        ramad = (window.requestAnimationFrame || function(f){ return setTimeout(f, 16); })(function(){
          ramad = 0;
          if (vantandeX === null) return;
          satt(procentAv(vantandeX), true);
        });
      }
      function slappDraget(){
        if (aktivPekare === null) return;
        aktivPekare = null; bekraftat = false; vantandeX = null;
      }
      ram.addEventListener("dragstart", function(e){ e.preventDefault(); });
      function bekrafta(){
        if (bekraftat) return;
        bekraftat = true;
        figur.classList.add("pekarfokus");
        try { reglage.focus({ preventScroll: true }); } catch (fel) {  }
        mjukt(false);
      }
      ram.addEventListener("pointerdown", function(e){
        if (aktivPekare !== null) return;                      
        if (e.button !== undefined && e.button !== 0) return;  
        aktivPekare = e.pointerId;
        startX = e.clientX; startY = e.clientY; bekraftat = false;
        if (ram.setPointerCapture){
          try { ram.setPointerCapture(e.pointerId); } catch (fel) {  }
        }
        if (e.pointerType === "mouse"){
          e.preventDefault();          
          bekrafta();                  
          satt(procentAv(e.clientX), true);
        }
      });
      ram.addEventListener("pointermove", function(e){
        if (e.pointerId !== aktivPekare) return;               
        if (e.pointerType === "mouse" && e.buttons === 0){ slappDraget(); return; }
        if (!bekraftat){
          var dx = e.clientX - startX, dy = e.clientY - startY;
          if (Math.abs(dx) <= TROSKEL_PX) return;              
          if (Math.abs(dx) <= Math.abs(dy) * 1.5) return;      
          bekrafta();
        }
        schemalagg(e.clientX);
      });
      ram.addEventListener("pointerup", function(e){
        if (e.pointerId !== aktivPekare) return;
        if (!bekraftat && Date.now() - sistScrollad > 120){
          bekrafta();                  
          satt(procentAv(e.clientX), true);
        }
        slappDraget();
      });
      ["pointercancel", "lostpointercapture"].forEach(function(typ){
        ram.addEventListener(typ, function(e){
          if (e.pointerId === aktivPekare) slappDraget();      
        });
      });
      window.addEventListener("blur", slappDraget);
      window.addEventListener("pointerup", function(e){
        if (e.pointerId === aktivPekare) slappDraget();
      });
      window.addEventListener("pointercancel", function(e){
        if (e.pointerId === aktivPekare) slappDraget();
      });
      reglage.addEventListener("pointerdown", function(){ figur.classList.add("pekarfokus"); });
      reglage.addEventListener("keydown", function(){ figur.classList.remove("pekarfokus"); }, true);
      reglage.addEventListener("blur", function(){ figur.classList.remove("pekarfokus"); });
      reglage.addEventListener("input", function(){ mjukt(false); satt(Number(reglage.value), true); });
      reglage.addEventListener("keydown", function(e){
        var v = Number(reglage.value), traff = true;
        switch (e.key){
          case "ArrowLeft":
          case "ArrowDown":  v -= STEG_PIL; break;
          case "ArrowRight":
          case "ArrowUp":    v += STEG_PIL; break;
          case "PageDown":   v -= STEG_SIDA; break;
          case "PageUp":     v += STEG_SIDA; break;
          case "Home":       v = 0; break;
          case "End":        v = 100; break;
          default: traff = false;
        }
        if (!traff) return;
        e.preventDefault();
        mjukt(true);                   
        satt(v, true);
      });
      var vinkningsTimers = [];
      function avbrytVinkning(){
        vinkningsTimers.forEach(clearTimeout);
        vinkningsTimers = [];
        if (vinkningPagar){ vinkningPagar = false; mjukt(false); }
      }
      function vinka(){
        if (vidrord || vinkningPagar) return;
        if (document.activeElement === reglage) return;   
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (!(window.CSS && typeof CSS.registerProperty === "function")) return;
        vinkningPagar = true;
        mjukt(true);
        satt(VILOLAGE + 13, false);
        vinkningsTimers.push(setTimeout(function(){ satt(VILOLAGE, false); }, 460));
        vinkningsTimers.push(setTimeout(function(){ vinkningPagar = false; mjukt(false); }, 760));
      }
      if ("IntersectionObserver" in window){
        var blick = new IntersectionObserver(function(poster){
          poster.forEach(function(post){
            if (post.isIntersecting && post.intersectionRatio >= 0.55){
              blick.disconnect();
              setTimeout(vinka, 420);
            }
          });
        }, { threshold: [0.55] });
        blick.observe(ram);
      }
      var start = parseFloat(reglage.value);
      satt(isFinite(start) ? start : VILOLAGE, false);
    }
    var figurer = document.querySelectorAll(".o-fffig");
    for (var i = 0; i < figurer.length; i++) initiera(figurer[i]);
  })();
  function visaSkarm(id){
    var sk = $(id);
    if (!sk) return;
    offer.classList.add("visarSkarm");
    sk.hidden = false;
    sk.classList.add("syns");
    if (id === "skarmAccept") {
      var kv = $("oaKvitto");
      if (kv) {
        var forsta = $("sumRows").querySelector(".o-sumrow span");
        $("oaTotal").textContent = $("sumTotal").textContent;
        $("oaPaket").textContent = forsta ? forsta.textContent : $("prodName").textContent;
        kv.hidden = false;
      }
    }
    sk.setAttribute("tabindex", "-1");
    if (!sk.getAttribute("role")) sk.setAttribute("role", "status");
    try { sk.focus({preventScroll:true}); } catch(e) { try { sk.focus(); } catch(e2){} }
    var sc = document.scrollingElement;
    if (sc) sc.scrollTop = 0; else window.scrollTo(0, 0);
  }
  var acc = $("acceptBtn");
  if (acc) acc.addEventListener("click", function(){ visaSkarm("skarmAccept"); });
  var av = $("avboj");
  if (av) av.addEventListener("click", function(){
    var panel = $("avbojPanel");
    var oppen = panel.hidden;
    panel.hidden = !oppen;
    av.setAttribute("aria-expanded", oppen ? "true" : "false");
  });
  var avSend = $("avbojSend");
  if (avSend) avSend.addEventListener("click", function(){ visaSkarm("skarmAvboj"); });
  rakna();
  rekommendera();
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
    if (window.matchMedia) {
      var mq = window.matchMedia("print");
      var lyssna = mq.addEventListener ? mq.addEventListener.bind(mq, "change") : null;
      if (lyssna) lyssna(function(e){ e.matches ? oppna() : aterstall(); });
    }
  })();
  window.__render = rakna;
})();
