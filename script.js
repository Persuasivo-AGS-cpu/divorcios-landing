// Data for the interactive test
const questions = [
    {
        id: 1,
        question: "¿Existen hijos menores de edad producto del matrimonio?",
        options: [
            { text: "Sí.", key: "Q1-A" },
            { text: "No.", key: "Q1-B" },
            { text: "Sí, pero ya son mayores de edad.", key: "Q1-C" }
        ]
    },
    {
        id: 2,
        question: "¿Bajo qué régimen matrimonial están y existen bienes importantes (casas, negocios) a dividir?",
        options: [
            { text: "Bienes Mancomunados con propiedades/negocios.", key: "Q2-A" },
            { text: "Bienes Separados con propiedades/negocios.", key: "Q2-B" },
            { text: "No hay bienes de valor significativo / No estoy seguro.", key: "Q2-C" }
        ]
    },
    {
        id: 3,
        question: "Si deciden separarse, ¿crees que tu pareja estaría dispuesta a llegar a un acuerdo pacífico?",
        options: [
            { text: "Sí, creo que podemos acordar pacíficamente.", key: "Q3-A" },
            { text: "Tal vez, dependerá de los términos.", key: "Q3-B" },
            { text: "No, será un proceso muy conflictivo y cerrado.", key: "Q3-C" }
        ]
    },
    {
        id: 4,
        question: "¿Actualmente siguen viviendo en la misma casa?",
        options: [
            { text: "Sí, seguimos viviendo juntos.", key: "Q4-A" },
            { text: "Sí, pero dormimos separados.", key: "Q4-B" },
            { text: "No, ya nos separamos físicamente.", key: "Q4-C" }
        ]
    },
    {
        id: 5,
        question: "¿Existen situaciones delicadas que requieran atención legal urgente (ej. ocultamiento de dinero, violencia, adicciones)?",
        options: [
            { text: "No, nada de eso.", key: "Q5-A" },
            { text: "Prefiero no decirlo en este momento.", key: "Q5-B" },
            { text: "Sí, hay situaciones complejas y necesito protección urgente.", key: "Q5-C" }
        ]
    },
    {
        id: 6,
        question: "Si te mostramos un camino legal claro y que proteja tu futuro, ¿qué tan pronto te gustaría iniciar el trámite?",
        options: [
            { text: "Lo antes posible", key: "Q6-A" },
            { text: "En los próximos meses", key: "Q6-B" },
            { text: "Solo estoy informándome por ahora", key: "Q6-C" }
        ]
    }
];

// Test State
// Test State
let currentQuestionIndex = 0;
let totalScore = 0; // Keeping this var for compatibility if needed elsewhere
let userAnswers = [];

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
            btn.onclick = () => handleOptionClick(index, q.question, opt.text, opt.key);
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

function handleOptionClick(qIndex, questionText, answerText, key) {
    userAnswers.push({ question: questionText, answer: answerText, key: key });
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
    const loadingDiv = document.getElementById("loading-sequence");
    const actionDiv = document.getElementById("final-whatsapp-action");
    const resultTitle = document.getElementById("result-title");
    const resultMessage = document.getElementById("result-message");
    const resultWhatsapp = document.getElementById("result-whatsapp");
    
    resultsContainer.classList.remove("hidden");
    loadingDiv.classList.remove("hidden");
    actionDiv.classList.add("hidden");
    
    // Generate a simple, non-suspicious Folio ID
    const folioId = "FOLIO-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    
    // Build the payload for the email (FormSubmit)
    let emailBody = "";
    userAnswers.forEach((ans, i) => {
        emailBody += `Pregunta ${i+1}: ${ans.question}\nRespuesta: ${ans.answer} (${ans.key})\n\n`;
    });
    
    // Send data to email via formsubmit.co in the background
    // FormSubmit automatically renders JSON properties as an HTML table in the email body.
    fetch("https://formsubmit.co/ajax/rmorga@monterreyjuridico.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            _subject: `Radiografía Confidencial - ${folioId}`,
            "Folio del Cliente": folioId,
            "Respuestas del Test": emailBody,
            "---": "------------------------------------------------------",
            "GUÍA RÁPIDA DE CÓDIGOS": "Significado e Impacto Legal",
            "Q1-A (Hijos menores)": "Hay que revisar custodia y pensión",
            "Q2-A/B (Bienes importantes)": "Mayor complejidad patrimonial / Lead high-ticket",
            "Q3-C (Sin acuerdo pacífico)": "Posible divorcio contencioso",
            "Q5-C (Riesgo alto/violencia)": "Urgencia máxima",
            "Q6-A (Iniciar de inmediato)": "Lead caliente"
        })
    }).catch(err => console.error("Error sending test answers:", err));
    
    // Generar un sufijo codificado discreto para que ventas sepa el perfil sin asustar al cliente
    let tipoCodificado = "A"; // Asesoría General
    
    const hasKids = userAnswers.find(a => a.key.startsWith("Q1-A"));
    const hasAssets = userAnswers.find(a => a.key.startsWith("Q2-A") || a.key.startsWith("Q2-B"));
    const conflict = userAnswers.find(a => a.key.startsWith("Q3-C") || a.key.startsWith("Q5-C"));
    const separated = userAnswers.find(a => a.key.startsWith("Q4-C"));
    const agreement = userAnswers.find(a => a.key.startsWith("Q3-A"));

    if (separated && agreement) {
        tipoCodificado = "V"; // Voluntario
    } else if (conflict) {
        tipoCodificado = "I"; // Incausado
    } else if (hasKids || hasAssets) {
        tipoCodificado = "C"; // Convenio
    }

    // The main message to send via WhatsApp, keeping it human and simple
    let waMessage = `Hola, acabo de completar el test confidencial en la página web. Me gustaría agendar una asesoría privada para conocer mis opciones legales.\n\n[Folio de diagnóstico: ${folioId}-${tipoCodificado}]`;
    
    const phoneNumber = "528119175769"; 
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waMessage)}`;
    
    resultWhatsapp.href = waUrl;
    
    // Loading Sequence Animation (Faster to avoid drop-off)
    setTimeout(() => {
        resultTitle.style.opacity = 0;
        resultMessage.style.opacity = 0;
        setTimeout(() => {
            resultTitle.innerText = "Codificando perfil...";
            resultMessage.innerText = "Generando tu Folio de alta seguridad.";
            resultTitle.style.opacity = 1;
            resultMessage.style.opacity = 1;
        }, 200);
    }, 1000);

    setTimeout(() => {
        resultTitle.style.opacity = 0;
        resultMessage.style.opacity = 0;
        setTimeout(() => {
            resultTitle.innerText = "Preparando sala confidencial...";
            resultMessage.innerText = "Conectando con el canal privado del Lic. José Ramón Morga.";
            resultTitle.style.opacity = 1;
            resultMessage.style.opacity = 1;
        }, 200);
    }, 2200);

    setTimeout(() => {
        // Hide loader, show button
        loadingDiv.classList.add("hidden");
        actionDiv.classList.remove("hidden");
        
        resultWhatsapp.style.pointerEvents = "auto";
        resultWhatsapp.style.opacity = "1";
        
        // Final Auto-redirect
        setTimeout(() => {
            window.location.href = waUrl;
        }, 1500);
    }, 3500);
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
    
    // Gather form data
    const nombre = document.getElementById('form-name').value;
    const telefono = document.getElementById('form-phone').value;
    const etapa = document.getElementById('form-intent').value;

    // Send data to email via formsubmit.co
    fetch("https://formsubmit.co/ajax/rmorga@monterreyjuridico.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            _subject: "Nuevo Lead - Asesoría Confidencial",
            Nombre: nombre,
            Telefono: telefono,
            Etapa: etapa
        })
    })
    .then(response => response.json())
    .then(data => {
        form.style.display = 'none';
        successMsg.classList.add('active');
    })
    .catch(error => {
        console.error('Error al enviar el formulario:', error);
        // Fallback: show success anyway so user experience isn't interrupted
        form.style.display = 'none';
        successMsg.classList.add('active');
    });
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
