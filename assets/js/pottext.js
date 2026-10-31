
(function (w) {
  var FORM = {
    "ROT-avdrag":      {annan: "Grön teknik"},
    "grön teknik":     {annan: "ROT"},
    "skattereduktion": {annan: null}   
  };
  var INLEDNING = "inkl. moms, efter ";
  function helaMeningen(bas, harAnnan) {
    var f = FORM[bas];
    if (!f) throw new Error("ampyPottext: okand pott " + bas);
    return INLEDNING + bas + (harAnnan && f.annan ? " och " + f.annan : "");
  }
  w.ampyPottext = function (bas, harAnnan) { return helaMeningen(bas, harAnnan); };
  w.ampyPottsvans = function (bas, harAnnan) {
    return helaMeningen(bas, harAnnan).slice(INLEDNING.length - "efter ".length);
  };
})(window);
