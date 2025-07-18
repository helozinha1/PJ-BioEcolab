// --- Dados de Consumo de Água (Valores Médios em Litros) ---
const consumoAgua = {
    escovacao: {
        torneiraAberta: 12,
        torneiraFechada: 1,
    },
    banhoDucha: {
        quinzeMinutosRegistroMeioAberto: 135,
        cincoMinutosFechandoRegistro: 45,
    },
    banhoChuveiroEletrico: {
        quinzeMinutosRegistroMeioAberto: 45,
        cincoMinutosFechandoRegistro: 15,
    },
    lavarLouca: {
        torneiraAbertaTotal: 105,
        torneiraFechadaEnsaboa: 20,
    },
    torneiraPingandoPorDia: 46,
};

// --- Funções de Cálculo (Mantêm as mesmas que já definimos) ---
function calcularEscovacao(torneiraLigada) {
    let consumo;
    let economia;
    if (torneiraLigada) {
        consumo = consumoAgua.escovacao.torneiraAberta;
        economia = 0;
    } else {
        consumo = consumoAgua.escovacao.torneiraFechada;
        economia = consumoAgua.escovacao.torneiraAberta - consumoAgua.escovacao.torneiraFechada;
    }
    return { consumo, economia };
}

function calcularBanho(tipoChuveiro, fechouRegistroAoEnsaboa) {
    let consumo;
    let economia = 0;
    if (tipoChuveiro === 'ducha') {
        if (fechouRegistroAoEnsaboa) {
            consumo = consumoAgua.banhoDucha.cincoMinutosFechandoRegistro;
            economia = consumoAgua.banhoDucha.quinzeMinutosRegistroMeioAberto - consumo;
        } else {
            consumo = consumoAgua.banhoDucha.quinzeMinutosRegistroMeioAberto;
            economia = 0;
        }
    } else if (tipoChuveiro === 'eletrico') {
        if (fechouRegistroAoEnsaboa) {
            consumo = consumoAgua.banhoChuveiroEletrico.cincoMinutosFechandoRegistro;
            economia = consumoAgua.banhoChuveiroEletrico.quinzeMinutosRegistroMeioAberto - consumo;
        } else {
            consumo = consumoAgua.banhoChuveiroEletrico.quinzeMinutosRegistroMeioAberto;
            economia = 0;
        }
    } else {
        return { consumo: 0, economia: 0 };
    }
    return { consumo, economia };
}

function calcularLavarLouca(torneiraLigadaTempoTodo) {
    let consumo;
    let economia;
    if (torneiraLigadaTempoTodo) {
        consumo = consumoAgua.lavarLouca.torneiraAbertaTotal;
        economia = 0;
    } else {
        consumo = consumoAgua.lavarLouca.torneiraFechadaEnsaboa;
        economia = consumoAgua.lavarLouca.torneiraAbertaTotal - consumoAgua.lavarLouca.torneiraFechadaEnsaboa;
    }
    return { consumo, economia };
}

function calcularTorneiraPingando(dias) {
    return consumoAgua.torneiraPingandoPorDia * dias;
}

// --- Dados de Poluição do Brasil ---
const dadosPoluicaoBrasil = {
    emissoesGasesEstufa: {
        rankingGlobalHistorico: "4º no mundo em ranking de emissão de gases poluentes desde 1850",
        volumeCO2Historico: "112,9 bilhões de toneladas de CO2 (GtCO2)",
        principalCausaHistorica: "Mais de 85% desse volume está associado à derrubada de florestas.",
        emissoes2022: "2,3 bilhões de toneladas brutas de gases de efeito estufa",
        causa2022: "As alterações no uso da terra (desmatamento da Amazônia) são responsáveis pela maior parte dessas emissões (92%).",
    },
    queimadas: {
        recorde2024: "O Brasil bateu recorde de emissões de carbono em 2024 desde que os dados passaram a ser monitorados, com quase 100% mais queimadas.",
        volumeSetembro: "Somente em setembro, cerca de 60 megatoneladas de gás foram emitidas, principalmente do bioma amazônico.",
    },
    poluicaoPlastico: {
        volumeAnualOceano: "1,3 milhão de toneladas de plástico no oceano",
        rankingGlobal: "8º país do globo e o maior poluidor da América Latina nesse quesito.",
    },
};

// --- Funções de Manipulação da DOM (Interface) ---

// Analisador de Água
document.getElementById('calcularAgua').addEventListener('click', () => {
    const escovacaoLigada = document.getElementById('escovacao').value === 'sim';
    const tipoChuveiro = document.getElementById('tipoChuveiro').value;
    const banhoRegistroFechado = document.getElementById('banhoRegistro').value === 'sim';
    const lavarLoucaLigada = document.getElementById('lavarLouca').value === 'sim';
    const diasPingando = parseInt(document.getElementById('diasPingando').value);

    let consumoTotal = 0;
    let economiaPotencial = 0;
    let resultadosHTML = '<h3>Seu Consumo Estimado e Potencial de Economia:</h3>';

    // Escovação
    const resEscovacao = calcularEscovacao(escovacaoLigada);
    consumoTotal += resEscovacao.consumo;
    economiaPotencial += resEscovacao.economia;
    resultadosHTML += `<p><strong>Escovação:</strong> Consumo de ${resEscovacao.consumo} litros. Economia potencial de ${resEscovacao.economia} litros.</p>`;

    // Banho
    const resBanho = calcularBanho(tipoChuveiro, banhoRegistroFechado);
    consumoTotal += resBanho.consumo;
    economiaPotencial += resBanho.economia;
    resultadosHTML += `<p><strong>Banho (${tipoChuveiro}):</strong> Consumo de ${resBanho.consumo} litros. Economia potencial de ${resBanho.economia} litros.</p>`;

    // Lavar Louça
    const resLouca = calcularLavarLouca(lavarLoucaLigada);
    consumoTotal += resLouca.consumo;
    economiaPotencial += resLouca.economia;
    resultadosHTML += `<p><strong>Lavar Louça:</strong> Consumo de ${resLouca.consumo} litros. Economia potencial de ${resLouca.economia} litros.</p>`;

    // Torneira Pingando
    if (diasPingando > 0) {
        const gastoPingando = calcularTorneiraPingando(diasPingando);
        consumoTotal += gastoPingando;
        resultadosHTML += `<p><strong>Torneira Pingando:</strong> Gastou ${gastoPingando.toFixed(2)} litros em ${diasPingando} dias.</p>`;
    } else {
        resultadosHTML += `<p><strong>Torneira Pingando:</strong> Nenhuma torneira pingando informada. Ótimo! 🎉</p>`;
    }

    resultadosHTML += `<p class="total-agua"><strong>Consumo total estimado: ${consumoTotal.toFixed(2)} litros.</strong></p>`;
    resultadosHTML += `<p class="total-agua"><strong>Economia total potencial: ${economiaPotencial.toFixed(2)} litros.</strong></p>`;
    resultadosHTML += `<p>Lembre-se: Pequenas atitudes fazem uma grande diferença! 🌍💚</p>`;

    const resultadoDiv = document.getElementById('resultadoAgua');
    resultadoDiv.innerHTML = resultadosHTML;
    resultadoDiv.style.display = 'block'; // Mostra a div de resultados
});


// Analisador de Poluição
document.getElementById('mostrarPoluicao').addEventListener('click', () => {
    let resultadosHTML = '<h3>Dados Cruciais sobre a Poluição no Brasil:</h3>';

    resultadosHTML += '<h4>🏭 Emissões de Gases de Efeito Estufa:</h4>';
    resultadosHTML += `<ul>`;
    resultadosHTML += `<li>${dadosPoluicaoBrasil.emissoesGasesEstufa.rankingGlobalHistorico}</li>`;
    resultadosHTML += `<li>Volume Acumulado de CO2 (desde 1850): ${dadosPoluicaoBrasil.emissoesGasesEstufa.volumeCO2Historico}</li>`;
    resultadosHTML += `<li>Principal Causa Histórica: ${dadosPoluicaoBrasil.emissoesGasesEstufa.principalCausaHistorica}</li>`;
    resultadosHTML += `<li>Emissões Brutas em 2022: ${dadosPoluicaoBrasil.emissoesGasesEstufa.emissoes2022}</li>`;
    resultadosHTML += `<li>Causa Primária em 2022: ${dadosPoluicaoBrasil.emissoesGasesEstufa.causa2022}</li>`;
    resultadosHTML += `</ul>`;

    resultadosHTML += '<h4>🔥 Impacto das Queimadas:</h4>';
    resultadosHTML += `<ul>`;
    resultadosHTML += `<li>Recorde de Emissões em 2024: ${dadosPoluicaoBrasil.queimadas.recorde2024}</li>`;
    resultadosHTML += `<li>Volume em Setembro (Principalmente Amazônia): ${dadosPoluicaoBrasil.queimadas.volumeSetembro}</li>`;
    resultadosHTML += `</ul>`;

    resultadosHTML += '<h4>🗑️ Poluição Plástica nos Oceanos:</h4>';
    resultadosHTML += `<ul>`;
    resultadosHTML += `<li>Volume Anual Despejado: ${dadosPoluicaoBrasil.poluicaoPlastico.volumeAnualOceano}</li>`;
    resultadosHTML += `<li>Posição Global: ${dadosPoluicaoBrasil.poluicaoPlastico.rankingGlobal}</li>`;
    resultadosHTML += `</ul>`;

    resultadosHTML += `<p class="total-poluicao">Esses dados ressaltam a urgência de ações e conscientização para proteger o meio ambiente brasileiro. Cada um pode fazer a sua parte! 🌳</p>`;

    const resultadoDiv = document.getElementById('resultadoPoluicao');
    resultadoDiv.innerHTML = resultadosHTML;
    resultadoDiv.style.display = 'block'; // Mostra a div de resultados
});
const dadosReciclagem = {
    temposDecomposicao: {
        papel: "3 a 6 meses",
        plastico: "400 anos ou mais",
        vidro: "Mais de 10.000 anos (indefinido)",
        metal: "100 a 500 anos",
        organico: "Alguns dias a 1 ano", // Para comparação
    },
    economiaReciclagemPorKg: { // Exemplo de impacto (redução de CO2e por kg reciclado)
        papel: 1.2, // kg CO2e evitados por kg de papel reciclado
        plastico: 1.5, // kg CO2e evitados por kg de plástico reciclado
        vidro: 0.3, // kg CO2e evitados por kg de vidro reciclado
        metal: 3.0, // kg CO2e evitados por kg de metal reciclado
    }
};

// --- FUNÇÕES DE MANIPULAÇÃO DA DOM (Interface) ---

// --- Código do Analisador de Água (Mantenha aqui) ---
// document.getElementById('calcularAgua').addEventListener('click', () => { ... });

// --- NOVO Analisador de Reciclagem ---
document.getElementById('analisarReciclagem').addEventListener('click', () => {
    const pesoLixoSemanal = parseFloat(document.getElementById('pesoLixoSemanal').value);
    const reciclaPapel = document.getElementById('reciclaPapel').checked;
    const reciclaPlastico = document.getElementById('reciclaPlastico').checked;
    const reciclaVidro = document.getElementById('reciclaVidro').checked;
    const reciclaMetal = document.getElementById('reciclaMetal').checked;

    let resultadosHTML = '<h3>Sua Análise de Descarte e Reciclagem:</h3>';

    if (isNaN(pesoLixoSemanal) || pesoLixoSemanal < 0) {
        resultadosHTML += '<p style="color: red;">Por favor, insira um peso de lixo semanal válido.</p>';
        document.getElementById('resultadoReciclagem').innerHTML = resultadosHTML;
        document.getElementById('resultadoReciclagem').style.display = 'block';
        return;
    }

    resultadosHTML += `<p>Sua casa gera aproximadamente <strong>${pesoLixoSemanal.toFixed(1)} kg de lixo por semana</strong>.</p>`;
    resultadosHTML += `<p>Isso significa cerca de <strong>${(pesoLixoSemanal * 52).toFixed(1)} kg de lixo por ano!</strong></p>`;

    let materiaisReciclados = [];
    let economiaCO2eTotal = 0;

    if (reciclaPapel) {
        materiaisReciclados.push("Papel");
        economiaCO2eTotal += dadosReciclagem.economiaReciclagemPorKg.papel * pesoLixoSemanal * 0.2; // Estimativa: 20% do lixo total é papel
    }
    if (reciclaPlastico) {
        materiaisReciclados.push("Plástico");
        economiaCO2eTotal += dadosReciclagem.economiaReciclagemPorKg.plastico * pesoLixoSemanal * 0.15; // Estimativa: 15% do lixo total é plástico
    }
    if (reciclaVidro) {
        materiaisReciclados.push("Vidro");
        economiaCO2eTotal += dadosReciclagem.economiaReciclagemPorKg.vidro * pesoLixoSemanal * 0.1; // Estimativa: 10% do lixo total é vidro
    }
    if (reciclaMetal) {
        materiaisReciclados.push("Metal");
        economiaCO2eTotal += dadosReciclagem.economiaReciclagemPorKg.metal * pesoLixoSemanal * 0.05; // Estimativa: 5% do lixo total é metal
    }

    if (materiaisReciclados.length > 0) {
        resultadosHTML += `<p>Você recicla: <strong>${materiaisReciclados.join(', ')}</strong>.</p>`;
        resultadosHTML += `<p>Ao reciclar, você ajuda a evitar aproximadamente <strong>${economiaCO2eTotal.toFixed(2)} kg de CO2 equivalente por semana</strong>! (Estimativa)</p>`;
        resultadosHTML += `<p>Lembre-se de sempre lavar e separar corretamente os materiais!</p>`;
    } else {
        resultadosHTML += `<p>Parece que você não recicla nenhum desses materiais. Começar a reciclar pode fazer uma grande diferença!</p>`;
    }

    resultadosHTML += '<h4>Tempo de Decomposição dos Materiais:</h4>';
    resultadosHTML += '<ul>';
    for (const material in dadosReciclagem.temposDecomposicao) {
        resultadosHTML += `<li><strong>${material.charAt(0).toUpperCase() + material.slice(1)}:</strong> ${dadosReciclagem.temposDecomposicao[material]}</li>`;
    }
    resultadosHTML += '</ul>';

    resultadosHTML += `<p class="total-reciclagem">Sua ação faz a diferença! A reciclagem economiza recursos naturais e reduz a poluição. 🌎</p>`;

    const resultadoDiv = document.getElementById('resultadoReciclagem');
    resultadoDiv.innerHTML = resultadosHTML;
    resultadoDiv.style.display = 'block'; 
});
