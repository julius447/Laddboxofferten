
(function () {
  var kort = document.querySelectorAll(".typ-kort");
  if (!kort.length) return;
  var ROLLER = [
    ["H1  hjälterubrik", 30, 700, "Hej Anders, här är din laddboxoffert"],
    ["H2  kapitelrubrik", 24, 700, "Var ska laddboxen sitta?"],
    ["H3  stegrubrik", 20, 600, "Inkoppling och säkerhetskontroll"],
    ["H4  paketnamn", 17, 700, "Premium"],
    ["H5  radnamn", 17, 700, "Uppgradera till Zaptec Go 2"]
  ];
  var BROD = "Allt du behöver för att bestämma dig står på den här sidan. Ingenting är bindande förrän du accepterar, och priset ändras inte efteråt.";
  var SIFFROR = [["hjältepris", 30, 800, "4 490 kr"], ["baren", 20, 800, "34 109 kr"], ["radpris", 15, 600, "+1 849 kr"]];
  var VIKTER = [300, 400, 500, 600, 700, 800];
  function el(tag, klass, text) {
    var e = document.createElement(tag);
    if (klass) e.className = klass;
    if (text != null) e.textContent = text;
    return e;
  }
  function block(etikett) {
    var b = el("div", "typ-block");
    b.appendChild(el("span", "typ-etikett", etikett));
    return b;
  }
  function rad(matt, text, px, vikt, klass) {
    var r = el("div", "typ-rad");
    r.appendChild(el("i", null, matt));
    var s = el("span", klass || null, text);
    s.style.fontSize = px + "px";
    s.style.fontWeight = vikt;
    s.style.lineHeight = px >= 24 ? "1.15" : "1.3";
    r.appendChild(s);
    return r;
  }
  kort.forEach(function (k) {
    var font = k.getAttribute("data-font");
    k.style.fontFamily = '"' + font + '", system-ui, sans-serif';
    var prov = k.querySelector(".typ-prov");
    var a = block("Rubriker");
    ROLLER.forEach(function (r) { a.appendChild(rad(r[1] + "/" + r[2], r[3], r[1], r[2])); });
    prov.appendChild(a);
    var b = block("Brödtext");
    [[17, 300], [15, 300], [13, 300]].forEach(function (p) {
      var r = el("div", "typ-rad");
      r.appendChild(el("i", null, p[0] + "/" + p[1]));
      var s = el("span", "typ-brod", BROD);
      s.style.fontSize = p[0] + "px";
      s.style.fontWeight = p[1];
      s.style.lineHeight = "1.6";
      r.appendChild(s);
      b.appendChild(r);
    });
    prov.appendChild(b);
    var c = block("Siffror, tabulära");
    SIFFROR.forEach(function (s) { c.appendChild(rad(s[1] + "/" + s[2], s[3], s[1], s[2], "typ-siffra")); });
    c.appendChild(rad("24/700", "0123456789", 24, 700, "typ-siffra"));
    c.appendChild(rad("24/700", "0O 1lI 5S 8B", 24, 700, "typ-siffra"));
    prov.appendChild(c);
    k._viktblock = prov;   
  });
  function vikter() {
    var c = document.createElement("canvas").getContext("2d");
    kort.forEach(function (k) {
      var font = k.getAttribute("data-font");
      var prov = k._viktblock;
      var dd = block("Vikter i bruk");
      var v = el("div", "typ-vikter");
      var bredder = VIKTER.map(function (w) {
        c.font = w + ' 100px "' + font + '", serif';
        return Math.round(c.measureText("Ampy 34109").width * 10);
      });
      var saknas = [];
      VIKTER.forEach(function (w, i) {
        var dubblett = i > 0 && bredder[i] === bredder[i - 1];
        var s = el("span", dubblett ? "sakn" : null, "Ampy");
        s.style.fontWeight = w;
        s.appendChild(el("i", null, dubblett ? w + " saknas" : String(w)));
        v.appendChild(s);
        if (dubblett) saknas.push(w);
      });
      dd.appendChild(v);
      if (saknas.length) {
        dd.appendChild(el("p", "typ-saknas",
          "Vikt " + saknas.join(" och ") + " finns inte i " + font +
          ". Webbläsaren ritar närmaste granne i stället, så de proven ovanför visar fel vikt. Väljer du det här typsnittet måste texten flyttas till en vikt som finns."));
      }
      prov.appendChild(dd);
    });
  }
  function matt(font) {
    var p = el("div");
    p.style.cssText = "position:absolute;left:-9999px;top:0;visibility:hidden;font-family:\"" + font + "\",system-ui,sans-serif;";
    document.body.appendChild(p);
    function bredd(text, px, vikt) {
      var s = el("span", null, text);
      s.style.cssText = "font-size:" + px + "px;font-weight:" + vikt + ";white-space:nowrap;font-variant-numeric:tabular-nums;letter-spacing:-.02em;";
      p.appendChild(s);
      var b = s.getBoundingClientRect().width;
      p.removeChild(s);
      return b;
    }
    function hojd(text, px) {
      var s = el("div", null, text);
      s.style.cssText = "font-size:" + px + "px;font-weight:300;line-height:1.6;width:300px;";
      p.appendChild(s);
      var h = s.getBoundingClientRect().height;
      p.removeChild(s);
      return h;
    }
    var xh = bredd("x", 100, 400) && (function () {
      var s = el("span", null, "x");
      s.style.cssText = "font-size:100px;font-weight:400;line-height:0;display:inline-block;";
      p.appendChild(s);
      var r = s.getBoundingClientRect();
      var c = document.createElement("canvas").getContext("2d");
      c.font = '400 100px "' + font + '", system-ui, sans-serif';
      var mx = c.measureText("x"), mH = c.measureText("H");
      p.removeChild(s);
      return (mx.actualBoundingBoxAscent / mH.actualBoundingBoxAscent) * 100;
    })();
    var ut = { xhojd: xh, pris: bredd("34 109 kr", 30, 800), styckehojd: hojd(BROD, 15) };
    document.body.removeChild(p);
    return ut;
  }
  function rita() {
    var fonter = [].map.call(kort, function (k) { return k.getAttribute("data-font"); });
    var data = fonter.map(matt);
    var tbody = document.querySelector(".typ-tabell tbody");
    tbody.innerHTML = "";
    var huvud = el("tr");
    huvud.appendChild(el("th", null, ""));
    fonter.forEach(function (f) { huvud.appendChild(el("th", null, f)); });
    var thead = document.createElement("thead");
    thead.appendChild(huvud);
    tbody.parentNode.insertBefore(thead, tbody);
    var RAD = [
      ["X-höjd, % av versalhöjd", function (d) { return d.xhojd; }, 1, "hogre"],
      ["Prisbredd vid 30/800, px", function (d) { return d.pris; }, 0, "lagre"],
      ["Styckehöjd vid 15 px, px", function (d) { return d.styckehojd; }, 0, "lagre"]
    ];
    RAD.forEach(function (r) {
      var tr = el("tr");
      tr.appendChild(el("td", null, r[0]));
      var varden = data.map(r[1]);
      var bast = r[3] === "hogre" ? Math.max.apply(null, varden) : Math.min.apply(null, varden);
      varden.forEach(function (v) {
        var td = el("td", v === bast ? "bast" : null, v.toFixed(r[2]).replace(".", ","));
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { setTimeout(function () { vikter(); rita(); }, 120); });
  } else {
    setTimeout(function () { vikter(); rita(); }, 800);
  }
})();
