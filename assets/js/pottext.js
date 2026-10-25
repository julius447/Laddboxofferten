/* POTTMENINGEN UNDER "ATT BETALA". EN HARLEDNING, INTE FEM.

   AGARENS ORD, UPPGIFT 3, 25 OKTOBER, ORDAGRANT:

     "Jag testade att lagga till en laddbox pa elcentralsmallen, och da kom
      foljande text upp: 'Tva avdrag: elcentralen ar ROT, laddpunkten ar gron
      teknik. Priserna ar inklusive moms och efter avdrag.' Har vill vi BARA
      uppdatera nuvarande 'inkl. moms, efter ROT-avdrag' till: 'inkl. moms,
      efter ROT-avdrag och Gron teknik'. Det vill saga ingen ny rad, inga
      shenanigans, utan bara att vi uppdaterar texten som ar under 'att
      betala'. Sa det kommer att vara den enda texten som syns under 'att
      betala'. (...) pa alla platser dar vi har den har logiken och den har
      texten vill jag att du ska implementera ovanstaende feedback som en
      GLOBAL FIX."

   Och for batteriet och laddboxen:

     "da star det har: 'inklusive moms efter gron teknik'. Likadant dar. Det
      borde sta 'inklusive moms efter gron teknik och ROT' nar jag lagger till
      en elcentral. (...) Jag testade aven att lagga till en Plejd och en
      spotlight. Det sag bra ut, men da gar det ateriger under ROT, sa dar
      maste det uppdateras."

   Servicemallen ar undantaget, och det ar agarens eget: "Det som ar bra med
   servicemallen ar att det star 'inklusive moms efter skattereduktion'. Den
   texten kan ju alltid sta kvar och andras aldrig." Skattereduktion ar
   overordet for bada potterna, sa den behover ingen tillaggsform.

   VARFOR EN FIL OCH INTE TRE RADER I TRE SKRIPT: det har ar precis samma
   defektklass som har kostat mest i projektet. Samma mening i tre skript blir
   tre meningar sa fort nagon rattar en av dem. Fem mallar sa fem olika saker
   om samma avdrag den 23 oktober, och rattningen den gangen var fem
   handpaslag som drev isar igen. */
(function (w) {
  /* Mallens egen pott, och vad tillaggspotten heter NAR den kommer in.
     Versalerna ar agarens egna och skiljer sig mellan mallarna: han skrev
     "och Gron teknik" med versal pa elcentralen och "och ROT" pa de andra.
     Hans text, inte min normalisering. */
  var FORM = {
    "ROT-avdrag":      {annan: "Grön teknik"},
    "grön teknik":     {annan: "ROT"},
    "skattereduktion": {annan: null}   // overordet, taecker bada
  };

  /* bas          mallens egen pott, ordagrant som den star i markupen
     harAnnan     har kunden valt nagot ur den ANDRA potten just nu
     Returnerar HELA meningen, inte bara svansen: en anropare som satter ihop
     "inkl. moms, efter " + svansen pa egen hand ar en fjarde kopia. */
  var INLEDNING = "inkl. moms, efter ";

  /* SVANSEN, utan inledningen. Prisbaren har sin egen etikett ("Att betala:")
     ovanfor och ska darfor bara saga "efter gron teknik och ROT".

     DEN HAR FUNKTIONEN FINNS FOR ATT ALTERNATIVET AR VARRE. Batterimallen
     kapade "inkl. moms, " ur hela meningen med en str.slice, vilket fungerar
     tills nagon andrar inledningen; da far baren en stympad mening och
     ingenting sager ifran. Och skrev baren sin egen sammansattning vore det en
     andra harledning, alltsa samma defekt som hela filen finns for att
     forhindra: batteriets bar sa "efter gron teknik" aven med en elcentral
     vald, pa samma sida dar summeringen redan sa ratt. Tva ytor, tva svar. */
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
