// netlify/functions/get-news.js

// fetch já é global em ambientes Node.js modernos (Netlify Functions)
// Se tiver problemas, você pode instalar e importar 'node-fetch'
// Para instalar: npm install node-fetch no terminal, na raiz do seu projeto
// import fetch from 'node-fetch'; // Descomente se for necessário

exports.handler = async function(event, context) {
    // 1. Sua chave da API ESTARÁ AQUI, SEGURA nas variáveis de ambiente da Netlify.
    const API_KEY = process.env.NEWS_API_KEY; 

    // Verificação de segurança: a chave precisa estar configurada
    if (!API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro de configuração: A chave da NewsAPI não foi encontrada.' }),
        };
    }

    // Parâmetros da sua busca de notícias
    const query = '(meio%20ambiente%20AND%20desastres%20naturais%20AND%20humanos)';
    const language = 'pt';
    const sortBy = 'relevancy';
    const fromDate = '2025-07-23'; // Você pode tornar isso dinâmico se quiser!

    // Monta a URL completa para a NewsAPI
    const url = `https://newsapi.org/v2/everything?q=${query}&language=${language}&sortBy=${sortBy}&from=${fromDate}&apiKey=${API_KEY}`;

    try {
        // 2. Faz a requisição à NewsAPI (isso acontece no servidor da Netlify, não no navegador)
        const response = await fetch(url);
        const data = await response.json();

        // Tratamento de erros da própria NewsAPI
        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: data.message || 'Erro ao buscar notícias na NewsAPI.' }),
            };
        }

        // 3. Retorna os dados para o seu frontend
        return {
            statusCode: 200,
            headers: {
                // Necessário para o navegador do seu site acessar a função
                'Access-Control-Allow-Origin': '*', // Em produção, mude '*' para o domínio do seu site (ex: 'https://seusite.netlify.app')
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Erro na Netlify Function ao chamar NewsAPI:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro interno do servidor ao buscar notícias.' }),
        };
    }
};