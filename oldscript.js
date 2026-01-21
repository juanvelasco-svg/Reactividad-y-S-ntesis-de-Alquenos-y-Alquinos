// Mapa Mental Interactivo - Química Orgánica
// Script principal para funcionalidad interactiva

document.addEventListener('DOMContentLoaded', function() {
    // Estado de la aplicación
    const appState = {
        progress: 0,
        completedSections: new Set(),
        bookmarkedCards: new Set(),
        reviewedCards: 0,
        currentSection: 'fundamentos'
    };

    // Inicialización
    init();

    function init() {
        // Cargar estado desde localStorage
        loadState();
        
        // Configurar event listeners
        setupNavigation();
        setupSectionControls();
        setupCardInteractions();
        setupFooterTools();
        setupQuizSystem();
        
        // Actualizar UI inicial
        updateProgress();
        updateStats();
    }

    // NAVEGACIÓN
    function setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remover clase active de todos los enlaces
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Agregar clase active al enlace clickeado
                this.classList.add('active');
                
                // Obtener la sección destino
                const sectionId = this.getAttribute('data-section');
                const targetSection = document.getElementById(sectionId + '-alquenos');
                
                if (targetSection) {
                    // Ocultar todas las secciones
                    document.querySelectorAll('.content-section').forEach(section => {
                        section.classList.remove('active');
                    });
                    
                    // Mostrar sección destino
                    targetSection.classList.add('active');
                    
                    // Actualizar sección actual
                    appState.currentSection = sectionId;
                    
                    // Actualizar progreso de lectura
                    if (!appState.completedSections.has(sectionId)) {
                        appState.reviewedCards++;
                        updateStats();
                    }
                }
            });
        });
    }

    // CONTROLES DE SECCIÓN
    function setupSectionControls() {
        // Botones de expandir/contraer
        document.querySelectorAll('.btn-toggle').forEach(button => {
            button.addEventListener('click', function() {
                const sectionId = this.getAttribute('data-section');
                const section = document.getElementById(sectionId + '-alquenos');
                const cardsContainer = section.querySelector('.cards-container');
                
                if (cardsContainer.style.display === 'none') {
                    cardsContainer.style.display = 'grid';
                    this.innerHTML = '<i class="fas fa-expand"></i> Expandir/Contraer';
                } else {
                    cardsContainer.style.display = 'none';
                    this.innerHTML = '<i class="fas fa-compress"></i> Expandir/Contraer';
                }
            });
        });

        // Botones de marcar como completado
        document.querySelectorAll('.btn-mark-complete').forEach(button => {
            button.addEventListener('click', function() {
                const sectionId = this.getAttribute('data-section');
                const icon = this.querySelector('i');
                
                if (appState.completedSections.has(sectionId)) {
                    // Desmarcar
                    appState.completedSections.delete(sectionId);
                    icon.className = 'far fa-check-circle';
                    this.style.opacity = '0.8';
                } else {
                    // Marcar
                    appState.completedSections.add(sectionId);
                    icon.className = 'fas fa-check-circle';
                    this.style.opacity = '1';
                    this.style.background = 'var(--success-color)';
                    
                    // Animación de confirmación
                    this.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 300);
                }
                
                updateProgress();
                updateStats();
                saveState();
            });
        });
    }

    // INTERACCIONES CON TARJETAS
    function setupCardInteractions() {
        // Marcadores de tarjetas
        document.querySelectorAll('.btn-bookmark').forEach(button => {
            button.addEventListener('click', function() {
                const cardId = this.getAttribute('data-card');
                const icon = this.querySelector('i');
                
                if (appState.bookmarkedCards.has(cardId)) {
                    // Remover marcador
                    appState.bookmarkedCards.delete(cardId);
                    icon.className = 'far fa-bookmark';
                    this.style.color = 'var(--gray-dark)';
                } else {
                    // Agregar marcador
                    appState.bookmarkedCards.add(cardId);
                    icon.className = 'fas fa-bookmark';
                    this.style.color = 'var(--secondary-color)';
                    
                    // Animación
                    this.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 300);
                }
                
                saveState();
            });
        });

        // Tests rápidos
        document.querySelectorAll('.btn-quiz').forEach(button => {
            button.addEventListener('click', function() {
                const quizId = this.getAttribute('data-quiz');
                showQuiz(quizId);
            });
        });
    }

    // SISTEMA DE QUIZ
    function setupQuizSystem() {
        const quizModal = document.getElementById('quizModal');
        const closeModal = document.querySelector('.close-modal');
        const quizContent = document.getElementById('quizContent');

        // Base de datos de preguntas
        const quizDatabase = {
            '1.1': {
                title: 'Test: Enlace doble C=C',
                questions: [
                    {
                        question: '¿Cuál es la principal característica del enlace π en los alquenos?',
                        options: [
                            'Es más fuerte que el enlace σ',
                            'Los electrones están deslocalizados por encima y debajo del plano molecular',
                            'Solo existe en moléculas lineales',
                            'Es polar por naturaleza'
                        ],
                        correct: 1,
                        explanation: 'El enlace π tiene electrones deslocalizados que están expuestos a ataques electrófilos.'
                    },
                    {
                        question: '¿Cómo se comporta el enlace doble en reacciones químicas?',
                        options: [
                            'Como un electrófilo',
                            'Como un nucleófilo',
                            'Como un radical libre',
                            'Como una base débil'
                        ],
                        correct: 1,
                        explanation: 'El enlace π actúa como nucleófilo, donando electrones a especies electrófilas.'
                    }
                ]
            },
            '1.3': {
                title: 'Test: Regla de Markovnikov',
                questions: [
                    {
                        question: 'Según la regla de Markovnikov original, ¿a qué carbono se une el protón?',
                        options: [
                            'Al carbono más sustituido',
                            'Al carbono menos sustituido',
                            'Al carbono con más hidrógenos',
                            'Al carbono con menos hidrógenos'
                        ],
                        correct: 2,
                        explanation: 'Markovnikov observó que el protón se une al carbono que ya tiene más hidrógenos.'
                    }
                ]
            }
        };

        // Cerrar modal
        closeModal.addEventListener('click', () => {
            quizModal.style.display = 'none';
        });

        // Cerrar al hacer clic fuera del modal
        window.addEventListener('click', (e) => {
            if (e.target === quizModal) {
                quizModal.style.display = 'none';
            }
        });

        // Función para mostrar quiz
        window.showQuiz = function(quizId) {
            const quiz = quizDatabase[quizId];
            if (!quiz) {
                quizContent.innerHTML = '<p>Quiz no disponible para esta sección.</p>';
                quizModal.style.display = 'flex';
                return;
            }

            let html = `
                <h2>${quiz.title}</h2>
                <div class="quiz-container">
            `;

            quiz.questions.forEach((q, index) => {
                html += `
                    <div class="quiz-question" data-question="${index}">
                        <h3>${index + 1}. ${q.question}</h3>
                        <div class="quiz-options">
                `;

                q.options.forEach((option, optIndex) => {
                    html += `
                        <div class="quiz-option">
                            <input type="radio" id="q${index}_opt${optIndex}" 
                                   name="question_${index}" value="${optIndex}">
                            <label for="q${index}_opt${optIndex}">${option}</label>
                        </div>
                    `;
                });

                html += `
                        </div>
                        <div class="quiz-explanation" id="explanation_${index}" 
                             style="display: none;">
                            <strong>Explicación:</strong> ${q.explanation}
                        </div>
                    </div>
                `;
            });

            html += `
                    <div class="quiz-controls">
                        <button id="submitQuiz" class="btn-quiz">Verificar Respuestas</button>
                        <button id="resetQuiz" class="btn-bookmark">Reiniciar Quiz</button>
                    </div>
                </div>
            `;

            quizContent.innerHTML = html;
            quizModal.style.display = 'flex';

            // Configurar botones del quiz
            document.getElementById('submitQuiz').addEventListener('click', checkQuizAnswers);
            document.getElementById('resetQuiz').addEventListener('click', () => showQuiz(quizId));
        };

        function checkQuizAnswers() {
            const questions = quizDatabase[document.querySelector('h2').textContent.replace('Test: ', '')].questions;
            let score = 0;

            questions.forEach((q, index) => {
                const selected = document.querySelector(`input[name="question_${index}"]:checked`);
                const explanation = document.getElementById(`explanation_${index}`);
                
                if (selected) {
                    if (parseInt(selected.value) === q.correct) {
                        score++;
                        explanation.style.display = 'block';
                        explanation.style.background = '#d4edda';
                        explanation.style.color = '#155724';
                    } else {
                        explanation.style.display = 'block';
                        explanation.style.background = '#f8d7da';
                        explanation.style.color = '#721c24';
                    }
                } else {
                    explanation.style.display = 'block';
                    explanation.innerHTML += '<br><strong>No seleccionaste una opción.</strong>';
                    explanation.style.background = '#fff3cd';
                    explanation.style.color = '#856404';
                }
            });

            // Mostrar resultado
            const result = document.createElement('div');
            result.className = 'quiz-result';
            result.innerHTML = `
                <h3>Resultado: ${score}/${questions.length}</h3>
                <p>${score === questions.length ? '¡Excelente! 🎯' : '¡Sigue practicando! 📚'}</p>
            `;
            
            quizContent.appendChild(result);
            
            // Actualizar estadísticas si se completó bien
            if (score === questions.length) {
                appState.reviewedCards++;
                updateStats();
                saveState();
            }
        }
    }

    // HERRAMIENTAS DEL FOOTER
    function setupFooterTools() {
        // Reiniciar progreso
        document.getElementById('resetProgress').addEventListener('click', function() {
            if (confirm('¿Estás seguro de que quieres reiniciar todo tu progreso?')) {
                appState.progress = 0;
                appState.completedSections.clear();
                appState.bookmarkedCards.clear();
                appState.reviewedCards = 0;
                
                // Reset UI
                document.querySelectorAll('.btn-mark-complete').forEach(btn => {
                    btn.querySelector('i').className = 'far fa-check-circle';
                    btn.style.background = '';
                    btn.style.opacity = '0.8';
                });
                
                document.querySelectorAll('.btn-bookmark').forEach(btn => {
                    btn.querySelector('i').className = 'far fa-bookmark';
                    btn.style.color = '';
                });
                
                updateProgress();
                updateStats();
                saveState();
                
                // Animación de confirmación
                this.innerHTML = '<i class="fas fa-check"></i> ¡Reiniciado!';
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-redo"></i> Reiniciar Progreso';
                }, 2000);
            }
        });

        // Generar quiz personalizado
        document.getElementById('generateQuiz').addEventListener('click', function(e) {
            e.preventDefault();
            alert('Próximamente: Generador de quizzes personalizados basado en tu progreso.');
        });

        // Tarjetas de estudio
        document.getElementById('flashcards').addEventListener('click', function(e) {
            e.preventDefault();
            if (appState.bookmarkedCards.size > 0) {
                alert(`Tienes ${appState.bookmarkedCards.size} tarjetas guardadas para estudio.`);
            } else {
                alert('Guarda algunas tarjetas primero usando el botón de marcador.');
            }
        });
    }

    // ACTUALIZACIÓN DE PROGRESO
    function updateProgress() {
        const totalSections = 6; // Número total de secciones principales
        const completed = appState.completedSections.size;
        appState.progress = Math.round((completed / totalSections) * 100);
        
        // Actualizar barra de progreso
        const progressBar = document.getElementById('progressBar');
        const progressPercent = document.getElementById('progressPercent');
        
        progressBar.style.width = `${appState.progress}%`;
        progressPercent.textContent = `${appState.progress}%`;
        
        // Cambiar color según progreso
        if (appState.progress < 30) {
            progressBar.style.background = 'linear-gradient(90deg, #e74c3c, #f39c12)';
        } else if (appState.progress < 70) {
            progressBar.style.background = 'linear-gradient(90deg, #f39c12, #f1c40f)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #27ae60, #2ecc71)';
        }
    }

    function updateStats() {
        document.getElementById('completedSections').textContent = 
            `${appState.completedSections.size}/6`;
        document.getElementById('reviewedCards').textContent = 
            `${appState.reviewedCards}`;
    }

    // PERSISTENCIA
    function saveState() {
        const state = {
            progress: appState.progress,
            completedSections: Array.from(appState.completedSections),
            bookmarkedCards: Array.from(appState.bookmarkedCards),
            reviewedCards: appState.reviewedCards
        };
        localStorage.setItem('organicChemistryMindmap', JSON.stringify(state));
    }

    function loadState() {
        const saved = localStorage.getItem('organicChemistryMindmap');
        if (saved) {
            const state = JSON.parse(saved);
            
            appState.progress = state.progress || 0;
            appState.completedSections = new Set(state.completedSections || []);
            appState.bookmarkedCards = new Set(state.bookmarkedCards || []);
            appState.reviewedCards = state.reviewedCards || 0;
            
            // Aplicar estado guardado a la UI
            state.completedSections?.forEach(sectionId => {
                const button = document.querySelector(`[data-section="${sectionId}"]`);
                if (button) {
                    const icon = button.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-check-circle';
                        button.style.background = 'var(--success-color)';
                        button.style.opacity = '1';
                    }
                }
            });
            
            state.bookmarkedCards?.forEach(cardId => {
                const button = document.querySelector(`[data-card="${cardId}"]`);
                if (button) {
                    const icon = button.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-bookmark';
                        button.style.color = 'var(--secondary-color)';
                    }
                }
            });
        }
    }

    // ANIMACIONES ADICIONALES
    function addAnimations() {
        // Animación al cargar tarjetas
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Aplicar animación a todas las tarjetas
        document.querySelectorAll('.card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });
    }

    // Inicializar animaciones después de un breve retraso
    setTimeout(addAnimations, 500);

    // EXPORTAR FUNCIONES GLOBALES
    window.showQuiz = showQuiz;
});
