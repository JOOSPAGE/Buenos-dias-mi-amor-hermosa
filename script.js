// Configuración
const phrases = [
    "¡Buenos días, mi amor! Espero que tu día comience con una sonrisa",
    "Me gustaria que durmieras un poco mas para que tengas energia todo el dia",
    "A veces no soy bueno con las palabras pero ten la certeza de que eres muy especial",
    "Te mando un abrazo enorme para que empieces el día feliz",
    "Que cada pelicano que veas te recuerde cuánto te quiero jaja Te amo",
    "Hoy será un gran día porque tú existes en él",
    "¡Te deseo un día tan bonito como tu sonrisa!"
];

// Variables
let currentSlide = 0;
let slideInterval;
const totalSlides = phrases.length;
const starsContainer = document.getElementById('stars');
const introScreen = document.getElementById('intro-screen');
const heart = document.getElementById('heart');
const bgMusic = document.getElementById('bg-music');
const progressDots = document.getElementById('progress-dots');
const slides = document.querySelectorAll('.slide');

// Init
init();

function init() {
    createProgressDots();
    preloadImages();
    setEventListeners();
}

// Crear puntos
function createProgressDots() {
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.dataset.index = i;
        if (i === 0) dot.classList.add('active');
        progressDots.appendChild(dot);
    }
}

// Precarga
function preloadImages() {
    document.querySelectorAll('.slide img').forEach(img => {
        new Image().src = img.src;
    });
}

// Hacker effect
const hackerLetters = "01!@#$%^&*()_+-=[]{}|;:,.<>?/";

function hackerEffect(element, finalText, iterations = 3) {
    let iteration = 0;

    clearInterval(element._interval);

    element._interval = setInterval(() => {
        element.textContent = element.textContent.split('')
            .map((letter, index) => {
                if (index < iteration || letter === ' ') return finalText[index];
                return hackerLetters[Math.floor(Math.random() * hackerLetters.length)];
            }).join('');

        if (iteration >= finalText.length) {
            clearInterval(element._interval);
            element.classList.add('complete');
        }

        iteration += 1 / iterations;
    }, 30);
}

// Estrellas
function createStars() {
    const starCount = Math.min(130, window.innerWidth / 8);

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * -100}px`;

        const duration = Math.random() * 10 + 5;
        star.style.animationDuration = `${duration}s`;

        star.style.animationDelay = `${Math.random() * 5}s`;

        starsContainer.appendChild(star);
    }
}

// Mostrar slide
function showSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    currentSlide = index;

    slides.forEach(s => s.classList.remove('active'));
    slides[index].classList.add('active');

    document.querySelectorAll('.dot').forEach((dot, i) =>
        dot.classList.toggle('active', i === index)
    );

    document.querySelectorAll('.hacker-text').forEach(t => t.classList.remove('complete'));

    const message = document.querySelector(`#message${index + 1} .hacker-text`);
    hackerEffect(message, phrases[index]);

    resetSlideInterval();
}

// Siguiente / anterior
function nextSlide() {
    showSlide((currentSlide + 1) % totalSlides);
}

function prevSlide() {
    showSlide((currentSlide - 1 + totalSlides) % totalSlides);
}

// Start
function startPresentation() {
    introScreen.style.opacity = '0';

    setTimeout(() => {
        introScreen.style.display = 'none';
    }, 1000);

    createStars();
    showSlide(0);

    bgMusic.volume = 0.3;
    bgMusic.play().catch(() => {
        bgMusic.muted = true;
        bgMusic.play().then(() => setTimeout(() => bgMusic.muted = false, 500));
    });

    resetSlideInterval();
}

function resetSlideInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 8000);
}

// Eventos
function setEventListeners() {
    heart.addEventListener('click', startPresentation);

    document.addEventListener('click', (e) => {
        if (introScreen.style.display === 'none' && !e.target.classList.contains('dot')) {
            nextSlide();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (introScreen.style.display === 'none') {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        }
    });

    document.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
            showSlide(parseInt(e.target.dataset.index));
        });
    });

    window.addEventListener('load', adjustImages);
    window.addEventListener('resize', adjustImages);
}

function adjustImages() {
    const size = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.5, 300);
    document.querySelectorAll('.slide img').forEach(
        img => (img.style.width = img.style.height = `${size}px`)
    );
}
