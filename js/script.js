// js/script.js

// 1. Menu de Navegação Responsivo (Hamburger Menu)
const setupNavbar = () => {
    // Seleciona o botão do hambúrguer e o menu de navegação
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    // Seleciona todos os links dentro do menu de navegação
    const navLinks = document.querySelectorAll('.nav-menu li a');

    // **VERIFICAÇÃO DE ELEMENTOS**: Adicionado console.log para depuração
    if (!hamburger) {
        console.error('Erro: Elemento .hamburger-menu não encontrado. Verifique seu HTML.');
        return;
    }
    if (!navMenu) {
        console.error('Erro: Elemento .nav-menu não encontrado. Verifique seu HTML.');
        return;
    }
    if (navLinks.length === 0) {
        console.warn('Aviso: Nenhum link de navegação encontrado dentro de .nav-menu. Verifique seu HTML.');
    }

    // Função para abrir/fechar o menu
    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        // Impede a rolagem do corpo quando o menu está aberto
        document.body.classList.toggle('no-scroll'); 

        // Cria e gerencia o overlay para fechar ao clicar fora
        if (navMenu.classList.contains('active')) {
            createOverlay();
        } else {
            removeOverlay();
        }
    };

    // Função para fechar o menu
    const closeMenu = () => {
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
            removeOverlay();
        }
    };

    // Cria o overlay dinamicamente
    const createOverlay = () => {
        let overlay = document.querySelector('.menu-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.classList.add('menu-overlay');
            document.body.appendChild(overlay);
        }
        // Adiciona listener de clique ao overlay para fechar o menu
        overlay.addEventListener('click', closeMenu);
    };

    // Remove o overlay dinamicamente
    const removeOverlay = () => {
        const overlay = document.querySelector('.menu-overlay');
        if (overlay) {
            overlay.removeEventListener('click', closeMenu); // Remove o listener antes de remover o elemento
            overlay.remove();
        }
    };

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', toggleMenu);

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Opcional: Adicionar um listener para redimensionamento da janela
    // Para fechar o menu se a janela for redimensionada para desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && navMenu.classList.contains('active')) { // Supondo 992px como breakpoint mobile
            closeMenu();
        }
    });
};


// 2. Carrossel Automático de Banners (Apenas para a Home Page)
const setupCarousel = () => {
    // Seleciona o container do carrossel
    const carouselContainer = document.querySelector('.carousel-container');
    // Se o carrossel não existir na página (ex: em páginas internas), a função não faz nada
    if (!carouselContainer) {
        return;
    }

    // Seleciona os elementos internos do carrossel
    const carouselTrack = carouselContainer.querySelector('.carousel-track');
    const carouselSlides = carouselContainer.querySelectorAll('.carousel-slide');
    const prevButton = carouselContainer.querySelector('.carousel-prev');
    const nextButton = carouselContainer.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');

    // Verifica se os elementos essenciais do carrossel foram encontrados
    if (!carouselTrack || carouselSlides.length === 0) {
        console.warn('Elementos do carrossel (track, slides ou botões) não encontrados. Verifique o HTML.');
        return;
    }

    let currentIndex = 0; // Índice do slide atual
    const slideCount = carouselSlides.length; // Número total de slides
    let autoSlideInterval; // Variável para armazenar o ID do intervalo de auto-slide

    // Cria e adiciona os "dots" de navegação para o carrossel
    if (dotsContainer) { // Verifica se o container dos dots existe
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.index = i; // Armazena o índice do slide no data-attribute
            dotsContainer.appendChild(dot);
            // Adiciona listener de clique para navegar para o slide correspondente
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
            });
        }
    }
    const dots = document.querySelectorAll('.carousel-dots .dot'); // Seleciona todos os dots criados

    // Atualiza a posição do carrossel e o dot ativo
    const updateCarousel = () => {
        // Calcula o deslocamento horizontal para mostrar o slide atual
        const offset = -currentIndex * 100;
        carouselTrack.style.transform = `translateX(${offset}%)`;

        // Atualiza a classe 'active' nos dots de navegação
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    // Exibe o próximo slide
    const showNextSlide = () => {
        currentIndex = (currentIndex + 1) % slideCount; // Avança para o próximo slide, voltando ao início se chegar ao fim
        updateCarousel();
    };

    // Exibe o slide anterior
    const showPrevSlide = () => {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount; // Volta para o slide anterior, indo para o fim se estiver no início
        updateCarousel();
    };

    // Adiciona listeners de clique aos botões de navegação (anterior/próximo)
    if (nextButton) {
        nextButton.addEventListener('click', showNextSlide);
    }
    if (prevButton) {
        prevButton.addEventListener('click', showPrevSlide);
    }

    // Inicia o auto-slide do carrossel
    const startAutoSlide = () => {
        autoSlideInterval = setInterval(showNextSlide, 5000); // Troca de slide a cada 5 segundos
    };

    // Para o auto-slide do carrossel
    const stopAutoSlide = () => {
        clearInterval(autoSlideInterval);
    };

    // Pausa o auto-slide quando o mouse entra no carrossel e retoma quando sai
    carouselContainer.addEventListener('mouseenter', stopAutoSlide);
    carouselContainer.addEventListener('mouseleave', startAutoSlide);

    // Inicia o auto-slide e atualiza o carrossel para o estado inicial ao carregar a página
    startAutoSlide();
    updateCarousel();
};


// 3. Inicialização do AOS (Animate On Scroll)
const initAOS = () => {
    // Verifica se a biblioteca AOS está carregada no ambiente
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000, // Duração das animações em milissegundos
            easing: 'ease-in-out', // Curva de aceleração da animação
            once: true, // Apenas anima uma vez ao rolar para baixo
            mirror: false // Não anima novamente ao rolar para cima
        });
    } else {
        console.warn('A biblioteca AOS não foi carregada. Verifique se a tag script está correta e acessível.');
    }
};

// Inicializa todas as funcionalidades quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    setupNavbar();      // Configura o menu de navegação
    setupCarousel();    // Configura o carrossel de banners (só executa se houver carrossel na página)
    initAOS();          // Inicializa as animações de rolagem
});
