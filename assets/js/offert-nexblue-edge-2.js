(function(){
  var kr=function(n){return n.toLocaleString("sv-SE").replace(/ /g," ")+" kr";};
  var GRANNRABATT=1000;
  var $=function(i){return document.getElementById(i);};
  var val=function(n){var e=document.querySelector('input[name="'+n+'"]:checked');return e?e.value:"0";};
  var BAS=4190;        
  function pottraden(harAnnanPott){
    $("sumPott").textContent  = window.ampyPottext("grön teknik", harAnnanPott);
    $("barPott").textContent  = window.ampyPottsvans("grön teknik", harAnnanPott);
  }
  var PKG={"0": {"namn": "Bas", "spec": "11 kW, monterad och driftsatt", "kw": 11, "inc": "<li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>NexBlue Edge 2</b></span></li><li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>11 kW</b><span>laddeffekt</span></span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Personskyddsautomat 16 A och egen grupp</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Upp till 10 meter installationskabel, 5G2,5</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Två håltagningar</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Installation av våra egna elektriker</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Driftsättning och genomgång av appen</span></li>"}, "2110": {"namn": "Plus", "spec": "11 kW med lastbalansering", "kw": 11, "inc": "<li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>NexBlue Edge 2</b></span></li><li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>11 kW</b><span>laddeffekt</span></span></li><li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>Perific One</b><span>lastbalansering</span></span></li><li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>Zaptec Chill</b></span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Personskyddsautomat 16 A och egen grupp</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Upp till 10 meter installationskabel, 5G2,5</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Två håltagningar</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Installation av våra egna elektriker</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Driftsättning och genomgång av appen</span></li>"}, "4750": {"namn": "Premium", "spec": "22 kW med Perific Max", "kw": 22, "inc": "<li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>NexBlue Edge 2</b></span></li><li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>22 kW</b><span>laddeffekt</span></span></li><li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>Perific Max</b><span>lastbalansering</span></span></li><li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>Laddkabel 22 kW</b><span>5 meter</span></span></li><li class=\"prod\"><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span><b>Zaptec Chill</b></span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Uppgraderad installation till 22 kW, större kabel och säkring</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Personskyddsautomat och egen grupp</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Upp till 10 meter installationskabel för den uppgraderade installationen</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Två håltagningar</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Installation av våra egna elektriker</span></li><li><span class=\"o-bock\"><svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.6 6.45 4.7 8.65 9.4 3.85\"/></svg></span><span>Driftsättning och genomgång av appen</span></li>"}};
  var INGAR={"0": [], "2110": ["perific", "kabelhallare"], "4750": ["kw22", "perific", "kabel11", "kabel22", "kabelhallare"]};
  var PKGVARIANT={"2110": {"perific": "Perific One"}, "4750": {"perific": "Perific Max"}};
  var TID={"0":"","1500":"Prioritet, 3 till 5 dagar","2500":"Express, 24 till 72 timmar"};
  var CEN={"5990": "Byte av elcentral, liten", "9750": "Byte av elcentral, medel", "17250": "Byte av elcentral, stor"};
  var kundval={};
  function rader(){ return [].slice.call(document.querySelectorAll(".o-rad")); }
  function radRuta(r){ return r.querySelector("input.add, input.intresse"); }
  function radAntal(r){
    var a=r.querySelector("[data-antal]");
    return a ? +a.value : 1;
  }
  var GO2={"0": 1450, "2110": 1380, "4750": 1310};
  function radVarde(r){
    var i=radRuta(r);
    if(i.getAttribute("data-grupp")==="go2"){
      var n=GO2[val("pkg")];
      if(n!==undefined) return n;
    }
    var styck=i.getAttribute("data-styck");
    if(styck) return (+styck) * radAntal(r);
    var s=r.querySelector(".o-variant");
    return s ? +s.value : +i.value;
  }
  function radNamn(r){
    var i=radRuta(r);
    var n=i.getAttribute("data-name");
    if(i.getAttribute("data-styck")){
      var an=radAntal(r);
      return n+", "+an+" "+(an===1?"styck":"stycken");
    }
    var s=r.querySelector(".o-variant");
    return s ? n+", "+s.options[s.selectedIndex].text : n;
  }
  function toppAbs(e){var y=0;while(e){y+=e.offsetTop;e=e.offsetParent;}return y;}
  function arLangd(sel){
    var ok=true;
    Array.prototype.forEach.call(sel.options,function(o){
      if(!/meter\s*$/.test(o.textContent.trim())) ok=false;
    });
    return ok && sel.options.length>0;
  }
  function hittaRad(grupp){
    var i=document.querySelector('input.add[data-grupp="'+grupp+'"]');
    return i?i.closest(".o-rad"):null;
  }
  function render(){
    var _o=document.querySelector('.offer'); if(_o) _o.classList.add('js-redo');
    var pkg=val("pkg"), tid=val("tid"), cen=val("elcentralpkg"), plats=val("plats");
    var go2ruta=$("go2"), go2=!!(go2ruta && go2ruta.checked);
    var p=PKG[pkg];
    var kw22ruta = document.querySelector('input.add[data-grupp="kw22"]');
    var kw22Pa = !!(kw22ruta && (kw22ruta.checked || kundval["kw22"]));
    var har22 = kw22Pa || (p && p.kw === 22);
    var rad22 = document.querySelector('input.add[data-grupp="kabel22"]');
    if(rad22){
      var kort22 = rad22.closest(".o-rad");
      kort22.hidden = !har22;
      if(!har22 && rad22.checked){ rad22.checked = false; }
    }
    var kapruta = document.querySelector('input.add[data-grupp="frontkapa"]');
    if(kapruta){
      kapruta.closest(".o-rad").hidden = go2;
    }
    var ingar=INGAR[pkg]||[];
    var LB=["sense","equalizer","tibber","perific"];
    var lbIPaket=null;
    LB.forEach(function(g){ if(ingar.indexOf(g)>=0) lbIPaket=g; });
    var kabelErsatt = har22 ? "kabel11" : null;
    rader().forEach(function(r){
      var i=radRuta(r), g=i.getAttribute("data-grupp");
      var med=ingar.indexOf(g)>=0 && g!==kabelErsatt;
      var ute=false, uteText="";
      if(!med && lbIPaket && LB.indexOf(g)>=0){
        ute=true; uteText="Ingår redan";
      }
      if(g===kabelErsatt){
        ute=true; uteText="Ersatt av 22 kW";
      }
      var dold=r.hidden;
      var last=med||ute;
      r.classList.toggle("ingar",med);
      r.classList.toggle("utesluten",ute);
      i.disabled=last;
      if(last||dold){ i.checked=false; }
      else if(kundval[g]){ i.checked=true; }
      var s=r.querySelector(".o-variant");
      if(s) s.disabled = ute || (med && !arLangd(s));
      if(s && !arLangd(s) && !med && !ute && kundvariant[g] !== undefined
         && s.selectedIndex !== kundvariant[g]){
        s.selectedIndex = kundvariant[g];
        var nk=s.getAttribute("data-bild");
        if(nk){
          var bd=r.querySelector(".o-radbild img"), n2=nk.split(",")[s.selectedIndex];
          if(bd && IMGS[n2]) bd.src=IMGS[n2];
        }
      }
      if(med && s && !arLangd(s)){
        var vill=(PKGVARIANT[pkg]||{})[g];
        if(vill){
          for(var vi=0; vi<s.options.length; vi++){
            if(s.options[vi].text.indexOf(vill)===0 || vill.indexOf(s.options[vi].text)===0){
              if(s.selectedIndex!==vi){
                s.selectedIndex=vi;
                var nyck=s.getAttribute("data-bild");
                if(nyck){
                  var bld=r.querySelector(".o-radbild img"), nn=nyck.split(",")[vi];
                  if(bld && IMGS[nn]){ bld.src=IMGS[nn]; bld.alt=vill; }
                }
              }
              break;
            }
          }
        }
      }
      var pr=r.querySelector(".o-radpris");
      if(med){ pr.textContent="Ingår i "+p.namn; pr.classList.add("ingarpris"); }
      else if(ute){ pr.textContent=uteText; pr.classList.add("ingarpris"); }
      else { pr.classList.remove("ingarpris"); }
    });
    var paketpris=BAS+(+pkg);
    var cenPris=(+cen>0)?+cen:0;
    var sum=paketpris+(+tid)+(+plats)+cenPris;   
    var valda=[];
    var rotSum=cenPris, rotNamn=[];
    if (cenPris) rotNamn.push(CEN[cen]);
    var intresse=[];
    rader().forEach(function(r){
      var i=radRuta(r);
      if(r.hidden) return;
      if(!i.disabled || !r.classList.contains("ingar")) return;
      var sel=r.querySelector(".o-variant");
      if(!sel || sel.disabled || sel.selectedIndex===0) return;
      var delta=(+sel.value) - (+sel.options[0].value);
      if(delta>0){
        sum+=delta; rotSum+=0;
        valda.push({namn:radNamn(r)+" i stället för "+sel.options[0].text.trim(), pris:delta});
      }
    });
    rader().forEach(function(r){
      var i=radRuta(r);
      if(r.hidden) return;
      r.classList.toggle("vald", i.checked && !i.disabled);
      if(i.disabled) return;
      if(i.hasAttribute("data-intresse")){
        if(i.checked) intresse.push(radNamn(r));
        return;
      }
      var v=radVarde(r);
      r.querySelector(".o-radpris").textContent = v ? "+"+kr(v) : "pris saknas";
      if(i.checked){
        sum+=v; valda.push({namn:radNamn(r), pris:v});
        if(i.hasAttribute("data-rot")){ rotSum+=v; rotNamn.push(radNamn(r)); }
      }
    });
    var mitt = sum;
    $("prodName").textContent = go2 ? "Zaptec Go 2" : "NexBlue Edge 2";
    $("heroImg").src = go2 ? IMGS["zaptec-go-2"] : IMGS["nexblue-edge-2"];
    $("prodSpec").textContent = har22 ? p.spec.replace("11 kW", "22 kW") : p.spec;
    var nyLista = go2 ? p.inc.replace("<b>Zaptec Go</b>","<b>Zaptec Go 2</b>") : p.inc;
    if (har22 && p.kw !== 22){
      nyLista = nyLista.replace("<b>11 kW</b>", "<b>22 kW</b>")
                       .replace("Personskyddsautomat 16 A", "Personskyddsautomat 32 A");
    }
    if ($("incList").innerHTML !== nyLista){
      $("incList").innerHTML = nyLista;
    }
    var gtBas = mitt - rotSum;
    $("calcGross").textContent = kr(gtBas*2);
    $("calcDed").textContent = "\u2212" + kr(gtBas);
    $("calcCenRad").classList.toggle("dold", !rotSum);
    if (rotSum){
      $("calcCenNamn").textContent = rotNamn.length===1 ? rotNamn[0] : "Tjänster med ROT";
      $("calcCen").textContent = kr(rotSum);
    }
    $("calcNet").textContent = kr(mitt);
    var rows = '<div class="o-sumrow"><span>Paket '+p.namn+'</span><span class="kr">'+kr(paketpris)+'</span></div>';
    valda.forEach(function(v){
      rows += '<div class="o-sumrow sub"><span>'+v.namn+'</span><span class="kr">'+(v.pris?kr(v.pris):"pris saknas")+'</span></div>';
    });
    if (+plats) rows += '<div class="o-sumrow sub"><span>Laddstolpe i stället för vägg</span><span class="kr">'+kr(+plats)+'</span></div>';
    if (+tid) rows += '<div class="o-sumrow sub"><span>'+TID[tid]+'</span><span class="kr">'+kr(+tid)+'</span></div>';
    if (+cen) rows += '<div class="o-sumrow sub"><span>'+CEN[cen]+'</span><span class="kr">'+(cenPris?kr(cenPris):"vi återkommer")+'</span></div>';
    if (intresse.length){
      rows += '<div class="o-sumrow grp"><span>Vi hör av oss om</span><span></span></div>';
      intresse.forEach(function(x){
        rows += '<div class="o-sumrow sub"><span>'+x+'</span><span>ingen kostnad nu</span></div>';
      });
    }
    var grannar=document.querySelectorAll("#refLista li").length;
    if (grannar) rows += '<div class="o-sumrow disc"><span>Rekommendationsrabatt, '+grannar+(grannar>1?' personer inbjudna':' person inbjuden')+'</span><span class="kr">dras när de beställt</span></div>'
      + '<div class="o-sumnote">Upp till '+kr(grannar*GRANNRABATT)+' av, '+kr(GRANNRABATT)+' för varje person som beställer. Ditt pris här ändras inte förrän det hänt.</div>';
    $("sumRows").innerHTML = rows;
    $("sumTotal").textContent = kr(mitt);
    pottraden(rotSum > 0);
    $("sumBrutto").textContent = kr(gtBas*2 + rotSum);
    $("barTotal").textContent = kr(mitt);
    $("barBrutto").textContent = kr(gtBas*2 + rotSum);
  }
  document.querySelectorAll('input[name="pkg"],input[name="tid"],input[name="elcentralpkg"],input[name="plats"]')
    .forEach(function(i){i.addEventListener("change",render);});
  function angerbar(grupp){
    var fore = null;
    function satt(e){ fore = e.checked ? e : null; }
    document.querySelectorAll('input[name="' + grupp + '"]').forEach(function(i){
      i.addEventListener("pointerdown", function(){ satt(this); });
      i.addEventListener("keydown", function(e){
        if(e.key === " " || e.key === "Spacebar" || e.key === "Enter") satt(this);
      });
      i.addEventListener("click", function(){
        if(fore === this){ this.checked = false; fore = null; render(); }
        else { fore = this; }
      });
      i.addEventListener("change", function(){ fore = this; });
    });
  }
  angerbar("elcentralpkg");
  var LASTBALANS = ["sense","equalizer","tibber","perific"];
  function valjRad(i){
    if(!i || i.disabled) return;
    var g = i.getAttribute("data-grupp");
    kundval[g] = i.checked;
    if(i.checked && LASTBALANS.indexOf(g) >= 0){
      LASTBALANS.forEach(function(annan){
        if(annan === g) return;
        var ruta = document.querySelector('input.add[data-grupp="'+annan+'"]');
        if(ruta && ruta.checked && !ruta.disabled){ ruta.checked = false; kundval[annan] = false; }
      });
    }
  }
  document.querySelectorAll("input.add, input.intresse").forEach(function(i){
    i.addEventListener("change",function(){ valjRad(this); render(); });
  });
  document.querySelectorAll("[data-antal]").forEach(function(sel){
    sel.addEventListener("change",function(){
      var r=this.closest(".o-rad"), i=radRuta(r);
      if(!i.disabled){ i.checked=true; valjRad(i); }
      var pr=r.querySelector(".o-radpris");
      if(pr && !i.disabled) pr.textContent="+"+kr(radVarde(r));
      render();
    });
  });
  document.querySelectorAll(".o-variant").forEach(function(s){
    s.addEventListener("change",function(){
      var i=radRuta(this.closest(".o-rad"));
      i.checked=true;
      valjRad(i);
      if(!arLangd(this)) kundvariant[this.getAttribute("data-grupp")]=this.selectedIndex;
      var nycklar=this.getAttribute("data-bild");
      if(nycklar){
        var bild=this.closest(".o-rad").querySelector(".o-radbild img");
        var n=nycklar.split(",")[this.selectedIndex];
        if(bild && IMGS[n]) bild.src=IMGS[n];
      }
      render();
    });
    s.addEventListener("click",function(e){ e.stopPropagation(); });
  });
  var mjukt = !window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.addEventListener("pointerdown", function(e){
    var lab = e.target.closest && e.target.closest("label.o-pkg, label.o-opt, label.o-rad, label.o-plats");
    if (!lab) return;
    var i = lab.querySelector("input");
    if (i && !i.disabled) { try { i.focus({preventScroll:true}); } catch(_) { } }
  }, true);
  function scrollTill(el,block){ if(el) el.scrollIntoView(mjukt?{behavior:"smooth",block:block||"start"}:{block:block||"start"}); }
  function panel(btnId,panelId,other){
    var b=$(btnId), p=$(panelId);
    b.addEventListener("click",function(){
      var open=p.hidden; p.hidden=!open; b.setAttribute("aria-expanded",open?"true":"false");
      if(open&&other) $(other).hidden=true;
      if(open){var ta=p.querySelector("textarea"); if(ta) ta.focus();}
    });
  }
  panel("fraga","fragaPanel","avbojPanel");
  panel("avboj","avbojPanel","fragaPanel");
  function visaSkarm(id){
    var s=document.getElementById(id);
    if(!s) return;
    document.querySelector(".offer").classList.add("visarSkarm");
    s.hidden=false; s.classList.add("syns");
    if (id === "skarmAccept"){
      var kv = document.getElementById("oaKvitto");
      if (kv){
        var tot = document.getElementById("sumTotal");
        var pkgEl = document.querySelector('input[name="pkg"]:checked');
        var p2 = pkgEl ? PKG[pkgEl.value] : null;
        document.getElementById("oaTotal").textContent = tot ? tot.textContent : "";
        document.getElementById("oaPaket").textContent =
          (p2 ? "Paket " + p2.namn : "Din order") +
          (document.querySelector('input.add[data-grupp="kw22"]:checked') ? ", 22 kW" : "");
        kv.hidden = false;
      }
      document.querySelectorAll('input[name="skal"]:checked').forEach(function(e){ e.checked = false; });
      var fritext = document.getElementById("avbojText");
      if (fritext) fritext.value = "";
      var tidEl = document.querySelector('input[name="tid"]:checked');
      var tidNamn = tidEl ? TID[tidEl.value] : null;
      var steg2 = s.querySelector('.oa__steps li:nth-child(2) small');
      if (steg2 && tidNamn && tidEl.value !== "0"){
        steg2.textContent = "Du har valt " + tidNamn + ". Vi hör av oss för att boka tid.";
      }
    }
    s.setAttribute("tabindex", "-1");
    if (!s.getAttribute("role")) s.setAttribute("role", "status");
    try { s.focus({preventScroll:true}); } catch(e) { try { s.focus(); } catch(e2){} }
    var sc=document.getElementById("scroller")||document.scrollingElement;
    if(sc) sc.scrollTop=0; else window.scrollTo(0,0);
  }
  var avbojSend=document.getElementById("avbojSend");
  if (avbojSend) avbojSend.addEventListener("click",function(){ visaSkarm("skarmAvboj"); });
  $("fragaSend").addEventListener("click",function(){
    var ta=$("fragaText"), h=$("fragaHint");
    if(!ta.value.trim()){ h.textContent="Skriv din fråga i rutan först."; ta.focus(); return; }
    h.textContent="Frågan är mottagen.";
    this.disabled=true; ta.readOnly=true;
  });
  var kundvariant = {};
  document.querySelectorAll(".o-variant").forEach(function(s){
    if(!arLangd(s)) kundvariant[s.getAttribute("data-grupp")] = s.selectedIndex;
  });
  window.__render = render;
  var bib = document.getElementById("modalBibliotek");
  var bibEgenPost = false;
  function bibOppna(){
    if (!bib || !bib.showModal || bib.open) return;
    bib.showModal();
    try { bib.focus({preventScroll:true}); } catch(e) { }
    try { history.pushState({ampyBib:1}, "", location.href); bibEgenPost = true; }
    catch(e) { bibEgenPost = false; }
  }
  if (bib) {
    bib.addEventListener("close", function(){
      if (!bibEgenPost) return;
      bibEgenPost = false;
      try { history.back(); } catch(e) { }
    });
    window.addEventListener("popstate", function(){
      if (!bib.open) return;
      bibEgenPost = false;
      bib.close();
    });
  }
  document.querySelectorAll("[data-bib-oppna]").forEach(function(b){
    b.addEventListener("click", function(e){ e.preventDefault(); bibOppna(); });
  });
  var BIBGOR = {
    fraga: function(mid, namn){
      var ta = document.getElementById("fragaText");
      var panel = document.getElementById("fragaPanel");
      if (!ta || !panel) return;
      if (bib && bib.open) bib.close();
      var avb = document.getElementById("avbojPanel");
      if (avb) avb.hidden = true;
      var knapp = document.getElementById("avboj");
      if (knapp) knapp.setAttribute("aria-expanded", "false");
      panel.hidden = false;
      var oppnaren = document.getElementById("fraga");
      if (oppnaren) oppnaren.setAttribute("aria-expanded", "true");
      var send = document.getElementById("fragaSend");
      if (send) send.disabled = false;
      ta.readOnly = false;
      var hint = document.getElementById("fragaHint");
      if (hint) hint.textContent = "";
      var rad = "Jag vill veta mer om " + namn + ".";
      if (ta.value.indexOf(rad) < 0)
        ta.value = (ta.value.trim() ? ta.value.trim() + "\n" : "") + rad;
      scrollTill(panel, "center");
      try { ta.focus({preventScroll:true}); } catch(e) { }
    }
  };
  document.querySelectorAll(".o-bibknapp").forEach(function(b){
    b.addEventListener("click", function(){
      var f = BIBGOR[this.getAttribute("data-bib-gor")];
      if (f) f(this.getAttribute("data-bib-modell"), this.getAttribute("data-bib-namn"));
    });
  });
  document.querySelectorAll(".o-info").forEach(function(b){
    b.addEventListener("click",function(e){
      e.preventDefault(); e.stopPropagation();
      var id="modal"+this.getAttribute("data-info").charAt(0).toUpperCase()+this.getAttribute("data-info").slice(1);
      var m=document.getElementById(id);
      if(m&&m.showModal) m.showModal();
    });
  });
  $("barGo").addEventListener("click",function(){ scrollTill($("summering"),"start"); });
  $("acceptBtn").addEventListener("click",function(){ visaSkarm("skarmAccept"); });
  var frame=$("frame"), stage=document.querySelector(".stage");
  function fit(){
    if(!frame) return;
    frame.style.transform="";
    stage.style.width=(parseInt(frame.style.width,10)||375)+"px";
    stage.style.height=(parseInt(frame.style.height,10)||812)+"px";
  }
  document.querySelectorAll(".switch button").forEach(function(b){
    b.addEventListener("click",function(){
      document.querySelectorAll(".switch button").forEach(function(o){o.setAttribute("aria-pressed",o===b?"true":"false");});
      frame.style.width=b.getAttribute("data-w")+"px";
      frame.style.height=b.getAttribute("data-h")+"px";
      fit(); measure();
    });
  });
  window.addEventListener("resize", fit);
  function measure(){
    if(!frame||parseInt(frame.style.width,10)!==390) return;
    var sc=$("scroller");
    if($("mHeight")) $("mHeight").textContent=(sc.scrollHeight/844).toFixed(1).replace(".",",")+" skärmar";
  }
  render(); fit();
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){setTimeout(function(){fit();measure();},60);});}
  setTimeout(function(){fit();measure();},600);
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
})();
