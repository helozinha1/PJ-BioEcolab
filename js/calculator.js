document.addEventListener('DOMContentLoaded', function() {
    // Esta função será chamada quando o botão "Calcular Minha Pegada" for clicado
    window.calcularPegada = function() {
        // 1. Coletar os valores dos campos de entrada
        const energiaEletricaKWh = parseFloat(document.getElementById('energiaEletrica').value) || 0;
        const quilometragemCarroKm = parseFloat(document.getElementById('quilometragemCarro').value) || 0;
        const numeroVoos = parseFloat(document.getElementById('numeroVoos').value) || 0;
        const tipoDieta = document.getElementById('dieta').value;

        // 2. Definir Fatores de Emissão (Dados Essenciais!)
        // IMPORTANTE: Estes são VALORES DE EXEMPLO. Para maior precisão,
        // É CRÍTICO pesquisar e usar dados específicos e atualizados para o BRASIL.
        // Fontes recomendadas: Ministério da Ciência, Tecnologia e Inovações (MCTI),
        // Relatórios do Sistema de Estimativas de Emissões e Remoções de Gases de Efeito Estufa (SEEG).

        // Exemplo de Fatores de Emissão (aproximados para fins de demonstração):
        // (Valores em kg CO2e)

        // Energia Elétrica: Fator de emissão médio do Sistema Interligado Nacional (SIN) do Brasil.
        // O valor do MCTI em 2022 para energia elétrica foi de 0.08 kg CO2e/kWh.
        const fatorEletricidade = 0.08; // kg CO2e por kWh

        // Transporte - Carro (Gasolina/Etanol):
        // Um carro popular no Brasil pode emitir cerca de 0.18 a 0.25 kg CO2e por km.
        // Vamos usar uma média para veículos a gasolina/etanol mistos.
        const fatorCarroKm = 0.20; // kg CO2e por km

        // Transporte - Voos Longos (ida e volta):
        // Voos podem ter grande impacto. Um voo doméstico longo ou internacional pode variar muito.
        // Usaremos uma média robusta para "voos longos" (ex: mais de 3h, um trecho internacional)
        const fatorVooLongo = 1500; // kg CO2e por voo (ida e volta, valor médio, pode ser mais)

        // Dieta: Emissões anuais associadas ao tipo de dieta.
        // Estes são valores globais médios e podem variar por região e hábitos específicos.
        const fatorDieta = {
            padrao: 1800,   // kg CO2e/ano (dieta com carne)
            vegetariana: 1200, // kg CO2e/ano (redução ~30-40% em relação à padrão)
            vegana: 800     // kg CO2e/ano (redução ~50-60% em relação à padrão)
        };

        // 3. Realizar os Cálculos
        let pegadaAnual = 0;

        // Cálculo da eletricidade (consumo mensal * 12 meses * fator)
        pegadaAnual += (energiaEletricaKWh * 12 * fatorEletricidade);

        // Cálculo do carro (quilometragem mensal * 12 meses * fator)
        pegadaAnual += (quilometragemCarroKm * 12 * fatorCarroKm);

        // Cálculo dos voos (número de voos anuais * fator)
        pegadaAnual += (numeroVoos * fatorVooLongo);

        // Cálculo da dieta (valor anual direto do fator)
        pegadaAnual += fatorDieta[tipoDieta];

        // 4. Exibir o Resultado e uma Mensagem de Dicas
        const resultadoElement = document.getElementById('resultadoPegada');
        const mensagemElement = document.getElementById('mensagemReducao');

        resultadoElement.textContent = `${pegadaAnual.toFixed(0)} kg CO2e`; // Arredonda para o número inteiro mais próximo

        let mensagem = "";
        if (pegadaAnual > 6000) {
            mensagem = "Sua pegada de carbono é considerável. Pequenas mudanças em áreas como transporte e energia podem gerar um grande impacto. Explore alternativas sustentáveis!";
        } else if (pegadaAnual > 3000) {
            mensagem = "Você está no caminho certo! Com alguns ajustes em seu consumo e hábitos, é possível reduzir ainda mais sua pegada. Considere a eficiência energética em casa e opções de transporte verde.";
        } else {
            mensagem = "Parabéns! Sua pegada de carbono é relativamente baixa, demonstrando um forte compromisso com a sustentabilidade. Compartilhe suas práticas e inspire outras pessoas!";
        }
        mensagemElement.textContent = mensagem;
    };

    // Opcional: Chama a função calcularPegada() uma vez ao carregar a página
    // para mostrar o resultado inicial (com os valores padrão 0).
    calcularPegada();
});