// js/news-carousel.js

// Função para buscar notícias da sua Netlify Function
async function fetchAndRenderNews() {
    const newsCarouselTrack = document.getElementById('newsCarouselTrack');
    const newsCarouselDots = document.getElementById('newsCarouselDots');
    const prevNewsBtn = document.getElementById('prevNewsBtn');
    const nextNewsBtn = document.getElementById('nextNewsBtn');

    // Verifica se os elementos do carrossel de notícias existem na página
    if (!newsCarouselTrack || !newsCarouselDots || !prevNewsBtn || !nextNewsBtn) {
        console.warn('Elementos do carrossel de notícias não encontrados. A funcionalidade não será ativada.');
        return;
    }

    // Limpa qualquer conteúdo existente enquanto carrega
    newsCarouselTrack.innerHTML = '<p class="loading-message">Carregando notícias...</p>';

    try {
        // Chamada para sua Netlify Function
        const response = await fetch('/.netlify/functions/get-news'); 
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Erro HTTP! Status: ${response.status}`);
        }

        const data = await response.json();
        const articles = data.articles; // Os artigos estarão dentro da propriedade 'articles' da resposta

        if (!articles || articles.length === 0) {
            newsCarouselTrack.innerHTML = '<p class="no-news-message">Nenhuma notícia encontrada no momento.</p>';
            // Esconder botões e dots se não houver artigos
            prevNewsBtn.style.display = 'none';
            nextNewsBtn.style.display = 'none';
            newsCarouselDots.style.display = 'none';
            return;
        }

        // Limpa a mensagem de carregamento e os dots antigos
        newsCarouselTrack.innerHTML = '';
        newsCarouselDots.innerHTML = '';

        let currentIndex = 0;
        const visibleCards = getVisibleCardsCount(); // Função para determinar quantos cards são visíveis

        // Renderiza os cards de notícias
        articles.forEach((article, index) => {
            if (article.title && article.url && article.urlToImage && article.description && article.publishedAt) {
                const newsCard = document.createElement('div');
                newsCard.classList.add('news-card');
                newsCard.innerHTML = `
                    <img src="${article.urlToImage}" alt="${article.title}" class="news-thumbnail">
                    <div class="card-content">
                        <h3><a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a></h3>
                        <p class="news-date"><i class="far fa-calendar-alt"></i> ${formatDate(article.publishedAt)}</p>
                        <p class="news-excerpt">${truncateText(article.description, 120)}</p>
                        <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="read-more">Ler Mais <i class="fas fa-chevron-right"></i></a>
                    </div>
                `;
                newsCarouselTrack.appendChild(newsCard);

                // Cria os dots de navegação
                const dot = document.createElement('span');
                dot.classList.add('news-dot');
                dot.dataset.index = index;
                newsCarouselDots.appendChild(dot);
            }
        });

        const newsCards = document.querySelectorAll('.news-carousel-track .news-card');
        const dots = document.querySelectorAll('.news-carousel-dots .news-dot');
        
        // --- Lógica do Carrossel de Notícias ---
        const updateNewsCarousel = () => {
            if (newsCards.length === 0) return;

            const cardWidth = newsCards[0].offsetWidth + (parseFloat(getComputedStyle(newsCards[0]).marginLeft) * 2); // Largura do card + margens
            const offset = -currentIndex * cardWidth;
            newsCarouselTrack.style.transform = `translateX(${offset}px)`;

            dots.forEach((dot, index) => {
                dot.classList.remove('active');
                if (index === currentIndex) {
                    dot.classList.add('active');
                }
            });

            // Gerencia a visibilidade dos botões de navegação
            prevNewsBtn.disabled = currentIndex === 0;
            nextNewsBtn.disabled = currentIndex >= (newsCards.length - visibleCards);

            // Adiciona/Remove classe para esconder botões se houver poucos itens
            if (newsCards.length <= visibleCards) {
                prevNewsBtn.style.display = 'none';
                nextNewsBtn.style.display = 'none';
                newsCarouselDots.style.display = 'none';
            } else {
                prevNewsBtn.style.display = ''; // Volta ao default
                nextNewsBtn.style.display = ''; // Volta ao default
                newsCarouselDots.style.display = ''; // Volta ao default
            }
        };

        const showNextNews = () => {
            if (currentIndex < newsCards.length - visibleCards) {
                currentIndex++;
            } else {
                currentIndex = 0; // Volta para o início se chegar ao fim
            }
            updateNewsCarousel();
        };

        const showPrevNews = () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = newsCards.length - visibleCards; // Vai para o fim se estiver no início
            }
            updateNewsCarousel();
        };

        // Adiciona listeners para os botões de navegação
        prevNewsBtn.addEventListener('click', showPrevNews);
        nextNewsBtn.addEventListener('click', showNextNews);

        // Adiciona listeners para os dots
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                currentIndex = parseInt(dot.dataset.index);
                updateNewsCarousel();
            });
        });

        // Atualiza o carrossel ao redimensionar a janela para ajustar o número de cards visíveis
        window.addEventListener('resize', () => {
            // Re-calcular visibleCards se necessário
            // Para um carrossel que mostra múltiplos itens, recalcular e atualizar
            // seria mais complexo e pode envolver reiniciar o currentIndex
            // Para simplicidade, updateNewsCarousel() já reajusta o offset
            updateNewsCarousel(); 
        });

        // Inicializa o carrossel de notícias
        updateNewsCarousel();

    } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        newsCarouselTrack.innerHTML = '<p class="error-message">Não foi possível carregar as notícias. Tente novamente mais tarde.</p>';
        prevNewsBtn.style.display = 'none';
        nextNewsBtn.style.display = 'none';
        newsCarouselDots.style.display = 'none';
    }
}

// --- Funções Auxiliares ---
function getVisibleCardsCount() {
    const screenWidth = window.innerWidth;
    // Baseado nos seus media queries CSS
    if (screenWidth <= 576) { // Celular
        return 1;
    } else if (screenWidth <= 992) { // Tablet
        return 2;
    } else { // Desktop
        return 3; 
    }
}

function formatDate(isoString) {
    const date = new Date(isoString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Chame a função para buscar e renderizar as notícias quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderNews();
});