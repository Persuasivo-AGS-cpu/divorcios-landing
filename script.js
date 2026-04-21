// Data for the interactive test
const questions = [
    {
        id: 1,
        question: "¿Con qué frecuencia discuten tú y tu pareja?",
        options: [
            { text: "Casi nunca, hay paz", score: 0 },
            { text: "A veces, pero es normal", score: 1 },
            { text: "Frecuentemente, por detalles", score: 2 },
            { text: "Constantemente, es agotador", score: 4 }
        ]
    },
    {
        id: 2,
        question: "¿Logran resolver los conflictos después de discutir?",
        options: [
            { text: "Sí, siempre llegamos a acuerdos", score: 0 },
            { text: "A veces, dependiendo del tema", score: 1 },
            { text: "Rara vez, se quedan cosas pendientes", score: 3 },
            { text: "Nunca, se vuelve un ciclo", score: 4 }
        ]
    },
    {
        id: 3,
        question: "¿Aún sienten cariño el uno por el otro?",
        options: [
            { text: "Sí, mucho", score: 0 },
            { text: "Hay cariño, pero está apagado", score: 2 },
            { text: "No estoy seguro/a", score: 3 },
            { text: "No, el cariño se ha perdido", score: 4 }
        ]
    },
    {
        id: 4,
        question: "¿Han mencionado el divorcio?",
        options: [
            { text: "Nunca", score: 0 },
            { text: "Solo en momentos de mucho enojo", score: 2 },
            { text: "Sí, lo hemos hablado como posibilidad", score: 3 },
            { text: "Constantemente, parece inevitable", score: 5 }
        ]
    },
    {
        id: 5,
        question: "¿Existe confianza entre ustedes?",
        options: [
            { text: "Totalmente", score: 0 },
            { text: "Hay algunas dudas", score: 2 },
            { text: "Se ha roto, pero queremos reconstruirla", score: 3 },
            { text: "La confianza está completamente rota", score: 5 }
        ]
    },
    {
        id: 6,
        question: "¿Cuánto tiempo llevan con este tipo de problemas?",
        options: [
            { text: "Semanas, es reciente", score: 1 },
            { text: "Algunos meses", score: 2 },
            { text: "De 1 a 3 años", score: 4 },
            { text: "Más de 3 años", score: 5 }
        ]
    },
    {
        id: 7,
        question: "¿Ambos quieren mejorar la relación?",
        options: [
            { text: "Sí, ambos estamos comprometidos", score: 0 },
            { text: "Yo quiero, no sé mi pareja", score: 2 },
            { text: "Mi pareja quiere, yo no estoy seguro/a", score: 3 },
            { text: "Ninguno de los dos parece interesado", score: 5 }
        ]
    },
    {
        id: 8,
        question: "¿Existen factores complicados (infidelidad, adicciones, violencia)?",
        options: [
            { text: "No, nada de eso", score: 0 },
            { text: "Hay problemas financieros fuertes", score: 2 },
            { text: "Hubo infidelidad en el pasado", score: 4 },
            { text: "Sí, existen situaciones muy complejas", score: 6 }
        ]
    },
    {
        id: 9,
        question: "¿Qué tan felices son hoy en el matrimonio?",
        options: [
            { text: "Muy felices", score: 0 },
            { text: "Se puede estar mejor", score: 1 },
            { text: "Tristes y frustrados", score: 3 },
            { text: "Profundamente infelices", score: 5 }
        ]
    },
    {
        id: 10,
        question: "Si pudieras decidir hoy sobre el futuro de la relación...",
        options: [
            { text: "Elegiría seguir y luchar por la relación", score: 0 },
            { text: "Tomaría un tiempo de separación", score: 3 },
            { text: "Buscaría asesoría para divorciarme", score: 5 },
            { text: "Ya he decidido divorciarme", score: 6 }
        ]
    }
];

// Test State
let currentQuestionIndex = 0;
let totalScore = 0;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    initTest();
    initAccordion();
    initScrollReveal();
    initWhatsAppTooltip();
    
    // Header scroll effect
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile menu toggle
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }
});

function initTest() {
    const questionsContainer = document.getElementById("test-questions");
    questionsContainer.innerHTML = "";
    currentQuestionIndex = 0;
    totalScore = 0;
    
    // Generate HTML for all questions
    questions.forEach((q, index) => {
        const slide = document.createElement("div");
        slide.className = `question-slide ${index === 0 ? "active" : ""}`;
        slide.id = `q-${index}`;
        
        const title = document.createElement("h3");
        title.innerText = `${q.id}. ${q.question}`;
        slide.appendChild(title);
        
        const optionsGrid = document.createElement("div");
        optionsGrid.className = "options-grid";
        
        q.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.innerText = opt.text;
            btn.onclick = () => handleOptionClick(index, opt.score);
            optionsGrid.appendChild(btn);
        });
        
        slide.appendChild(optionsGrid);
        questionsContainer.appendChild(slide);
    });
    
    updateProgressBar();
}

function updateProgressBar() {
    const progress = (currentQuestionIndex / questions.length) * 100;
    document.getElementById("progress-bar").style.width = `${progress}%`;
    
    const counter = document.getElementById("question-counter");
    if (counter && currentQuestionIndex < questions.length) {
        counter.innerText = `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`;
    }
}

function startTestUI() {
    document.getElementById("test-intro-container").classList.add("hidden");
    document.getElementById("test-ui-container").classList.remove("hidden");
    document.getElementById("test-ui-container").scrollIntoView({ behavior: 'smooth', block: 'center' });
    initTest(); // Reset state
    document.getElementById("test-questions").style.display = "block";
    document.getElementById("test-results").classList.add("hidden");
}

function resetTestUI() {
    document.getElementById("test-ui-container").classList.add("hidden");
    document.getElementById("test-intro-container").classList.remove("hidden");
    document.getElementById("interactive-test").scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleOptionClick(qIndex, score) {
    totalScore += score;
    const currentSlide = document.getElementById(`q-${qIndex}`);
    
    // Animate out
    currentSlide.classList.remove("active");
    currentSlide.classList.add("prev");
    
    currentQuestionIndex++;
    updateProgressBar();
    
    if (currentQuestionIndex < questions.length) {
        // Show next
        setTimeout(() => {
            // Wait for transition before hiding completely
            setTimeout(() => { currentSlide.style.display = "none"; }, 500);
            
            const nextSlide = document.getElementById(`q-${currentQuestionIndex}`);
            nextSlide.style.display = "block";
            // slight delay to ensure display:block applies before class active
            setTimeout(() => nextSlide.classList.add("active"), 10);
        }, 150); // Small delay to create a sequence feel
    } else {
        // Show results
        setTimeout(() => {
            document.getElementById("test-questions").style.display = "none";
            showResults();
        }, 500);
    }
}

function showResults() {
    const resultsContainer = document.getElementById("test-results");
    const resultTitle = document.getElementById("result-title");
    const resultMessage = document.getElementById("result-message");
    const resultWhatsapp = document.getElementById("result-whatsapp");
    
    resultsContainer.classList.remove("hidden");
    
    let title = "";
    let message = "";
    let waMessage = "";
    
    // States Calculation: Max score is around 48.
    // 0-15: Salvageable
    // 16-30: In Crisis
    // 31+: Likely Ending
    
    if (totalScore < 16) {
        title = "Tu matrimonio parece rescatable";
        message = "Según tus respuestas, existen problemas pero también hay indicadores fuertes de cariño y compromiso. Podrían beneficiarse de terapia de pareja antes de considerar opciones legales.";
        waMessage = "Hola, completé el test matrimonial y el resultado indica que mi matrimonio es rescatable, pero me gustaría recibir información sobre protección de patrimonio por prevención. ¿Pueden orientarme?";
    } else if (totalScore < 30) {
        title = "Relación en Crisis";
        message = "La relación está atravesando una crisis significativa. Hay un desgaste notable en la confianza y comunicación. Es un momento crucial donde es prudente conocer tus derechos y opciones legales de manera confidencial para protegerte ante cualquier eventualidad.";
        waMessage = "Hola, completé el test y me indica que mi relación está en crisis. Me gustaría agendar una asesoría confidencial para conocer mis derechos legales en caso de una separación.";
    } else {
        title = "Relación posiblemente terminando";
        message = "Tus respuestas reflejan una relación con un daño profundo, donde quizás el límite ya se ha cruzado. Cuando hay este nivel de fractura, lo más responsable para tu paz mental es asesorarte y entender el proceso de separación legal.";
        waMessage = "Hola, completé el test y me indica que mi relación posiblemente está terminando. Quisiera una asesoría urgente y confidencial para iniciar un trámite de divorcio.";
    }
    
    resultTitle.innerText = title;
    resultMessage.innerText = message;
    
    const phoneNumber = "528119175769"; 
    resultWhatsapp.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waMessage)}`;
}

// Smooth scroll wrapper to start test
function scrollToTest() {
    startTestUI();
}

// FAQ Accordion Logic
function initAccordion() {
    const items = document.querySelectorAll(".accordion-item");
    
    items.forEach(item => {
        const header = item.querySelector(".accordion-header");
        
        header.addEventListener("click", () => {
            const isActive = item.classList.contains("active");
            
            // Close all
            items.forEach(i => {
                i.classList.remove("active");
                i.querySelector(".accordion-content").style.maxHeight = null;
            });
            
            // Open clicked if it wasn't active
            if (!isActive) {
                item.classList.add("active");
                const content = item.querySelector(".accordion-content");
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
}

// Visual Effects & UI Interactions
function initScrollReveal() {
    // Dynamically assign reveal class so HTML stays clean
    const elementsToReveal = document.querySelectorAll('.section-title, .section-subtitle, .card, .timeline-step-hz, .accordion-col');
    elementsToReveal.forEach((el, index) => {
        el.classList.add('reveal');
        // Stagger delays for grid items
        if (el.classList.contains('card') || el.classList.contains('timeline-step-hz')) {
            const delayClass = 'reveal-delay-' + ((index % 3) + 1);
            el.classList.add(delayClass);
        }
    });

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initWhatsAppTooltip() {
    const tooltip = document.getElementById('wa-tooltip');
    const wrapper = document.getElementById('wa-tooltip-wrapper');
    
    if (tooltip && wrapper) {
        // Auto show after 3.5s to catch attention
        setTimeout(() => {
            tooltip.classList.add('show');
            setTimeout(() => tooltip.classList.remove('show'), 5000);
        }, 3500);
        
        // Hover interaction
        wrapper.addEventListener('mouseenter', () => tooltip.classList.add('show'));
        wrapper.addEventListener('mouseleave', () => tooltip.classList.remove('show'));
    }
}

// Smart Form Handler
function handleSmartForm(event) {
    event.preventDefault();
    
    const form = document.getElementById('contact-smart-form');
    const successMsg = document.getElementById('smart-form-success');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (!form || !successMsg || !submitBtn) return;
    
    // Simulate secure loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Encriptando y enviando...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    // Simulate network request
    setTimeout(() => {
        form.style.display = 'none';
        successMsg.classList.add('active');
    }, 1800);
}

// Custom Select Logic
document.addEventListener('DOMContentLoaded', () => {
    const customSelects = document.querySelectorAll('.custom-select-container');
    
    customSelects.forEach(container => {
        const trigger = container.querySelector('.custom-select-trigger');
        const list = container.querySelector('.custom-options-list');
        const options = list.querySelectorAll('li');
        const hiddenSelect = container.querySelector('select');
        const selectedText = container.querySelector('.selected-text');
        
        if (!trigger || !list || !hiddenSelect) return;
        
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            container.classList.toggle('open');
        });
        
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                // Update text
                selectedText.textContent = option.textContent;
                // Update hidden select
                hiddenSelect.value = option.dataset.value;
                // Add has-value class for floating label
                container.classList.add('has-value');
                // Close list
                container.classList.remove('open');
                // Remove required warning if it was touched
                hiddenSelect.removeAttribute('required');
            });
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                container.classList.remove('open');
            }
        });
    });
});
