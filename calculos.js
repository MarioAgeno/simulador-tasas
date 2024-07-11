console.log("calculos en JS");

let capital = 100000
let tasa = 5
let plazo = 30
/*
const total = capital * Math.pow(1 + tasa, plazo);
console.log(total);
console.log(plazo);
*/

let nTasa = 1 + tasa / 100;
console.log(nTasa);
console.log(plazo);

let nRaiz = plazo / 30;
let nPotencia = 1 - ((1 / nTasa) ** nRaiz);
console.log(nPotencia);

let nTNA = ((365 / plazo) * nPotencia) * 100;
console.log(nTNA);

let intereses = capital * nTNA * plazo / 36500;
console.log(intereses);

let total = capital + intereses;
console.log(total);
