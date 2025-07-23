// netlify/functions/get-news.js

// fetch já é global em ambientes Node.js modernos (Netlify Functions)
// Se tiver problemas, você pode instalar e importar 'node-fetch'
// Para instalar: npm install node-fetch no terminal, na raiz do seu projeto
// import fetch from 'node-fetch'; // Descomente se for necessário

exports.handler = async function(event, context) {
    const API_KEY = process.env.NEWS_API_KEY; 

    if (!API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro de configuração: A chave da NewsAPI não foi encontrada.' }),
        };
    }

    const query = 'desastre%20natural'; // Mudei de 'meio ambiente' para 'desastre ambiental' para refletir o novo foco
    const language = 'pt';
    const sortBy = 'relevancy';
    // REMOVIDO: const fromDate = '2025-07-23'; 

    // A URL AGORA NÃO INCLUI O PARÂMETRO 'from'
    const url = `https://newsapi.org/v2/everything?q=${query}&language=${language}&sortBy=${sortBy}&apiKey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: data.message || 'Erro ao buscar notícias na NewsAPI.' }),
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Em produção, mude '*' para o domínio do seu site
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