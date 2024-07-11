document.addEventListener('DOMContentLoaded', function() {
    const loanTypeSelect = document.getElementById('loan-type');
    const cuotasGroup = document.getElementById('cuotas-group');
    const plazoGroup = document.getElementById('plazo-group');
    const loanForm = document.getElementById('loan-form');
    const resultadoDiv = document.getElementById('resultado');

    loanTypeSelect.addEventListener('change', function() {
        const selectedLoanType = loanTypeSelect.value;

        if (selectedLoanType === 'tasa_adelantada' || selectedLoanType === 'tasa_vencida') {
            cuotasGroup.style.display = 'none';
            plazoGroup.style.display = 'block';
            document.getElementById('num-cuotas').required = false;
            document.getElementById('loan-term').required = true;
        } else {
            cuotasGroup.style.display = 'block';
            plazoGroup.style.display = 'none';
            document.getElementById('num-cuotas').required = true;
            document.getElementById('loan-term').required = false;
        }
    });

    loanForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const loanType = loanTypeSelect.value;
        const capital = parseFloat(document.getElementById('capital').value);
        const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
        const numCuotas = parseInt(document.getElementById('num-cuotas').value);
        const loanTerm = parseInt(document.getElementById('loan-term').value);

        let resultado = '';
        const tna = interestRate * 12;
        const tea = Math.pow(1 + interestRate, 12) - 1;

        switch (loanType) {
            case 'frances':
                resultado = calcularSistemaFrances(capital, interestRate, numCuotas);
                break;
            case 'aleman':
                resultado = calcularSistemaAleman(capital, interestRate, numCuotas);
                break;
            case 'directo':
                resultado = calcularPagoDirecto(capital, interestRate, numCuotas);
                break;
            case 'tasa_adelantada':
                resultado = calcularTasaAdelantada(capital, interestRate, loanTerm);
                break;
            case 'tasa_vencida':
                resultado = calcularTasaVencida(capital, interestRate, loanTerm);
                break;
        }

        resultado += `<p>TNA: ${(tna * 100).toFixed(2)}%</p>`;
        resultado += `<p>TEA: ${(tea * 100).toFixed(2)}%</p>`;
        resultadoDiv.innerHTML = resultado;
    });

    function calcularSistemaFrances(capital, tasa, cuotas) {
        const cuota = (capital * tasa) / (1 - Math.pow(1 + tasa, -cuotas));
        let resultado = '<table><tr><th>Cuota</th><th>Amortización</th><th>Interés</th><th>Valor de Cuota</th></tr>';
        for (let i = 0; i < cuotas; i++) {
            const interes = capital * tasa;
            const amortizacion = cuota - interes;
            capital -= amortizacion;
            resultado += `<tr><td>${i + 1}</td><td>${amortizacion.toFixed(2)}</td><td>${interes.toFixed(2)}</td><td>${cuota.toFixed(2)}</td></tr>`;
        }
        resultado += '</table>';
        return resultado;
    }

    function calcularSistemaAleman(capital, tasa, cuotas) {
        const amortizacion = capital / cuotas;
        let resultado = '<table><tr><th>Cuota</th><th>Amortización</th><th>Interés</th><th>Valor de Cuota</th></tr>';
        for (let i = 0; i < cuotas; i++) {
            const interes = (capital - i * amortizacion) * tasa;
            const cuota = amortizacion + interes;
            resultado += `<tr><td>${i + 1}</td><td>${amortizacion.toFixed(2)}</td><td>${interes.toFixed(2)}</td><td>${cuota.toFixed(2)}</td></tr>`;
        }
        resultado += '</table>';
        return resultado;
    }

    function calcularPagoDirecto(capital, tasa, cuotas) {
        const cuota = capital / cuotas;
        let resultado = '<table><tr><th>Cuota</th><th>Amortización</th><th>Interés</th><th>Valor de Cuota</th></tr>';
        for (let i = 0; i < cuotas; i++) {
            const interes = capital * tasa;
            const totalCuota = cuota + interes;
            resultado += `<tr><td>${i + 1}</td><td>${cuota.toFixed(2)}</td><td>${interes.toFixed(2)}</td><td>${totalCuota.toFixed(2)}</td></tr>`;
        }
        resultado += '</table>';
        return resultado;
    }

    function calcularTasaAdelantada(capital, tasa, plazo) {
        let nTasa = 1 + tasa;
        let nRaiz = plazo / 30;
        let nPotencia = 1 - ((1 / nTasa) ** nRaiz);
        let nTNA = ((365 / plazo) * nPotencia) * 100;
        let intereses = capital * nTNA * plazo / 36500;
        let total = capital + intereses;
        let caja = capital - intereses;
        let resultado = `<p>Capital: ${capital.toFixed(2)}</p>`;
        resultado += `<p>Intereses: ${intereses.toFixed(2)}</p>`;
        resultado += `<p>Total del Préstamo: ${total.toFixed(2)}</p>`;
        resultado += `<p>Uds se lleva: ${caja.toFixed(2)}</p>`;
        return resultado;
    }

    function calcularTasaVencida(capital, tasa, plazo) {
    //    const total = capital * Math.pow(1 + tasa, plazo);
    //    const intereses = total - capital;
        let nTasa = 1 + tasa;
        let nRaiz = plazo / 30;
        let nPotencia = (nTasa ** nRaiz) - 1;
        let nTNA = ((365 / plazo) * nPotencia) * 100;
        let intereses = capital * nTNA * plazo / 36500;
        let total = capital + intereses;
        let caja = capital - intereses;
        let resultado = `<p>Capital: ${capital.toFixed(2)}</p>`;
        resultado += `<p>Intereses: ${intereses.toFixed(2)}</p>`;
        resultado += `<p>Total del Préstamo: ${total.toFixed(2)}</p>`;
        return resultado;
    }
});
