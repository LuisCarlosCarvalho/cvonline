// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Add click listeners to nav links
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            const sectionId = href.substring(1);
            scrollToSection(sectionId);
        }
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Intersection Observer for animations
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

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Observe animated elements
    const animatedElements = document.querySelectorAll(
        '.animate-fade-in-up, .animate-fade-in-left, .animate-fade-in-right, .animate-slide-in-left, .animate-slide-in-right'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Initialize calculator
    initializeCalculator();
    
    // Initialize stats counter
    initializeStatsCounter();
});

// Calculator Logic
class LogisticsCalculator {
    constructor() {
        this.results = {};
        this.initializeEventListeners();
        this.loadSampleData();
    }

    initializeEventListeners() {
        // Get all input fields
        const inputs = document.querySelectorAll('#calculator input[type="number"]');
        
        // Add event listeners to all inputs
        inputs.forEach(input => {
            input.addEventListener('input', () => this.calculateAll());
            input.addEventListener('change', () => this.calculateAll());
        });

        // Initial calculation
        this.calculateAll();
    }

    loadSampleData() {
        // Load sample data after a delay for demonstration
        setTimeout(() => {
            const sampleData = {
                'faturamento-base': '15000',
                'km-rodados': '5000',
                'consumo': '3.5',
                'preco-diesel': '6.50',
                'manutencao-km': '0.15',
                'salario-motorista': '4500',
                'diarias': '800',
                'peso-maximo': '25000',
                'volume-maximo': '80',
                'num-entregas': '120',
                'valor-entrega': '85',
                'eficiencia-rota': '85',
                'tempo-parado': '1.5',
                'pedagios': '800',
                'seguro': '450',
                'licenciamento': '120',
                'depreciacao': '1200',
                'outros-custos': '300',
                'margem-lucro': '15'
            };
            
            Object.keys(sampleData).forEach(key => {
                const input = document.getElementById(key);
                if (input && !input.value) {
                    input.value = sampleData[key];
                }
            });
            
            this.calculateAll();
        }, 1000);
    }

    calculateAll() {
        this.calculateBasicCosts();
        this.calculateOperationalMetrics();
        this.calculateFinalResults();
        this.updateDisplay();
    }

    calculateBasicCosts() {
        // Get input values
        const kmRodados = parseFloat(document.getElementById('km-rodados')?.value) || 0;
        const consumo = parseFloat(document.getElementById('consumo')?.value) || 0;
        const precoDiesel = parseFloat(document.getElementById('preco-diesel')?.value) || 0;
        const manutencaoKm = parseFloat(document.getElementById('manutencao-km')?.value) || 0;
        const salarioMotorista = parseFloat(document.getElementById('salario-motorista')?.value) || 0;
        const diarias = parseFloat(document.getElementById('diarias')?.value) || 0;

        // Calculate fuel cost
        const litrosConsumidos = consumo > 0 ? kmRodados / consumo : 0;
        this.results.custoCombustivel = litrosConsumidos * precoDiesel;

        // Calculate maintenance cost
        this.results.custoManutencao = kmRodados * manutencaoKm;

        // Calculate driver cost
        this.results.custoMotorista = salarioMotorista + diarias;

        // Get additional costs
        this.results.custoPedagios = parseFloat(document.getElementById('pedagios')?.value) || 0;
        this.results.custoSeguro = parseFloat(document.getElementById('seguro')?.value) || 0;
        this.results.custoLicenciamento = parseFloat(document.getElementById('licenciamento')?.value) || 0;
        this.results.custoDepreciacao = parseFloat(document.getElementById('depreciacao')?.value) || 0;
        this.results.custoOutros = parseFloat(document.getElementById('outros-custos')?.value) || 0;
    }

    calculateOperationalMetrics() {
        const pesoMaximo = parseFloat(document.getElementById('peso-maximo')?.value) || 0;
        const volumeMaximo = parseFloat(document.getElementById('volume-maximo')?.value) || 0;
        const numEntregas = parseFloat(document.getElementById('num-entregas')?.value) || 0;
        const valorEntrega = parseFloat(document.getElementById('valor-entrega')?.value) || 0;
        const eficienciaRota = parseFloat(document.getElementById('eficiencia-rota')?.value) || 0;
        const tempoParado = parseFloat(document.getElementById('tempo-parado')?.value) || 0;

        // Calculate capacity
        this.results.capacidadeTotal = `${pesoMaximo} Kg / ${volumeMaximo} m³`;

        // Calculate delivery revenue
        this.results.receitaEntregas = numEntregas * valorEntrega;

        // Calculate efficiency index
        const eficienciaBase = eficienciaRota;
        const penalizacaoTempo = Math.max(0, (tempoParado - 2) * 5); // Penaliza mais de 2h parado
        this.results.indiceEficiencia = Math.max(0, eficienciaBase - penalizacaoTempo);

        // Store operational values
        this.results.kmRodados = parseFloat(document.getElementById('km-rodados')?.value) || 0;
        this.results.numEntregas = numEntregas;
        this.results.valorEntrega = valorEntrega;
    }

    calculateFinalResults() {
        // Calculate total monthly cost
        this.results.custoTotalMensal = 
            this.results.custoCombustivel +
            this.results.custoManutencao +
            this.results.custoMotorista +
            this.results.custoPedagios +
            this.results.custoSeguro +
            this.results.custoLicenciamento +
            this.results.custoDepreciacao +
            this.results.custoOutros;

        // Calculate cost per km
        this.results.custoPorKm = this.results.kmRodados > 0 ? 
            this.results.custoTotalMensal / this.results.kmRodados : 0;

        // Calculate cost per delivery
        this.results.custoPorEntrega = this.results.numEntregas > 0 ? 
            this.results.custoTotalMensal / this.results.numEntregas : 0;

        // Calculate required revenue (with profit margin)
        const margemLucro = parseFloat(document.getElementById('margem-lucro')?.value) || 0;
        this.results.receitaNecessaria = this.results.custoTotalMensal * (1 + margemLucro / 100);

        // Calculate break-even point
        this.results.pontoEquilibrio = this.results.valorEntrega > 0 ? 
            Math.ceil(this.results.custoTotalMensal / this.results.valorEntrega) : 0;

        // Calculate estimated profit
        this.results.lucroEstimado = this.results.receitaEntregas - this.results.custoTotalMensal;

        // Update faturamento total
        const faturamentoBase = parseFloat(document.getElementById('faturamento-base')?.value) || 0;
        this.results.faturamentoTotal = faturamentoBase + this.results.receitaEntregas;
    }

    updateDisplay() {
        // Update individual cost displays
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        };

        updateElement('custo-combustivel', this.formatCurrency(this.results.custoCombustivel));
        updateElement('custo-manutencao', this.formatCurrency(this.results.custoManutencao));
        updateElement('custo-motorista', this.formatCurrency(this.results.custoMotorista));
        updateElement('receita-entregas', this.formatCurrency(this.results.receitaEntregas));

        // Update additional costs
        updateElement('custo-pedagios', this.formatCurrency(this.results.custoPedagios));
        updateElement('custo-seguro', this.formatCurrency(this.results.custoSeguro));
        updateElement('custo-licenciamento', this.formatCurrency(this.results.custoLicenciamento));
        updateElement('custo-depreciacao', this.formatCurrency(this.results.custoDepreciacao));
        updateElement('custo-outros', this.formatCurrency(this.results.custoOutros));

        // Update margin display
        const margemLucro = parseFloat(document.getElementById('margem-lucro')?.value) || 0;
        updateElement('valor-margem', `${margemLucro}%`);

        // Update faturamento total
        updateElement('faturamento-total', this.formatCurrency(this.results.faturamentoTotal));

        // Update final results
        updateElement('custo-total-mensal', this.formatCurrency(this.results.custoTotalMensal));
        updateElement('custo-por-km', this.formatCurrency(this.results.custoPorKm));
        updateElement('custo-por-entrega', this.formatCurrency(this.results.custoPorEntrega));
        updateElement('receita-necessaria', this.formatCurrency(this.results.receitaNecessaria));
        updateElement('ponto-equilibrio', `${this.results.pontoEquilibrio} entregas`);
        updateElement('lucro-estimado', this.formatCurrency(this.results.lucroEstimado));

        // Update profit color based on value
        const lucroElement = document.getElementById('lucro-estimado');
        if (lucroElement) {
            if (this.results.lucroEstimado > 0) {
                lucroElement.style.color = '#22c55e';
            } else if (this.results.lucroEstimado < 0) {
                lucroElement.style.color = '#ef4444';
            } else {
                lucroElement.style.color = '#64748b';
            }
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    }
}

// Initialize calculator
function initializeCalculator() {
    window.logisticsCalculator = new LogisticsCalculator();
}

// Export results function
function exportResults() {
    const calculator = window.logisticsCalculator;
    if (!calculator) return;
    
    const results = calculator.results;
    
    let reportContent = `RELATÓRIO DE CÁLCULO LOGÍSTICO\n`;
    reportContent += `Data: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
    
    reportContent += `CUSTOS OPERACIONAIS:\n`;
    reportContent += `- Combustível: ${calculator.formatCurrency(results.custoCombustivel)}\n`;
    reportContent += `- Manutenção: ${calculator.formatCurrency(results.custoManutencao)}\n`;
    reportContent += `- Motorista: ${calculator.formatCurrency(results.custoMotorista)}\n`;
    reportContent += `- Pedágios: ${calculator.formatCurrency(results.custoPedagios)}\n`;
    reportContent += `- Seguro: ${calculator.formatCurrency(results.custoSeguro)}\n`;
    reportContent += `- Outros: ${calculator.formatCurrency(results.custoOutros)}\n\n`;
    
    reportContent += `RESULTADOS FINAIS:\n`;
    reportContent += `- Custo Total Mensal: ${calculator.formatCurrency(results.custoTotalMensal)}\n`;
    reportContent += `- Custo por Km: ${calculator.formatCurrency(results.custoPorKm)}\n`;
    reportContent += `- Custo por Entrega: ${calculator.formatCurrency(results.custoPorEntrega)}\n`;
    reportContent += `- Receita Necessária: ${calculator.formatCurrency(results.receitaNecessaria)}\n`;
    reportContent += `- Ponto de Equilíbrio: ${results.pontoEquilibrio} entregas\n`;
    reportContent += `- Lucro Estimado: ${calculator.formatCurrency(results.lucroEstimado)}\n`;
    
    // Create and download file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-logistico-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert('Relatório exportado com sucesso!');
}

// Reset calculator function
function resetCalculator() {
    if (confirm('Tem certeza que deseja limpar todos os campos?')) {
        const inputs = document.querySelectorAll('#calculator input[type="number"]');
        inputs.forEach(input => {
            input.value = '';
        });
        if (window.logisticsCalculator) {
            window.logisticsCalculator.calculateAll();
        }
    }
}

// Stats counter animation
function initializeStatsCounter() {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const finalNumber = parseInt(stat.textContent);
        let currentNumber = 0;
        const increment = finalNumber / 50;
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                stat.textContent = finalNumber + '+';
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(currentNumber) + '+';
            }
        }, 50);
    });
}

// Contact Form Handling
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        contact: formData.get('contact'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    // Basic form validation
    if (!data.name || !data.email || !data.contact || !data.subject || !data.message) {
        showMessage('Por favor, preencha todos os campos.', 'error');
        return;
    }

    if (!isValidEmail(data.email)) {
        showMessage('Por favor, insira um email válido.', 'error');
        return;
    }

    if (!isValidPhone(data.contact)) {
        showMessage('Por favor, insira um número de contato válido.', 'error');
        return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;

    // Send email
    sendEmail(data)
        .then(response => {
            if (response.ok) {
                contactForm.reset();
                showMessage('Mensagem enviada com sucesso!', 'success');
            } else {
                throw new Error('Erro no envio');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            showMessage('Erro ao enviar mensagem. Tente novamente.', 'error');
        })
        .finally(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
});

// Email sending function
async function sendEmail(data) {
    try {
        const response = await fetch('http://localhost:3001/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            return response;
        } else {
            throw new Error('Server error');
        }
    } catch (error) {
        // Fallback to WhatsApp
        sendMessageToWhatsApp(data);
        return { ok: true };
    }
}

// WhatsApp fallback function
function sendMessageToWhatsApp(data) {
    const message = `🔔 Nova mensagem do portfólio

👤 Nome: ${data.name}
📧 Email: ${data.email}
📱 Contato: ${data.contact}
📋 Assunto: ${data.subject}

💬 Mensagem:
${data.message}

⏰ Enviado em: ${new Date().toLocaleString('pt-BR')}`;

    const phoneNumber = '351964300708';
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
}

// Validation functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Show message function
function showMessage(text, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;

    // Insert message in form
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
        messageContainer.appendChild(message);
    } else {
        contactForm.insertBefore(message, contactForm.firstChild);
    }

    // Remove message after 5 seconds
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Portfolio card hover effects
document.addEventListener('DOMContentLoaded', () => {
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    portfolioCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) rotateX(5deg)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0)';
        });
    });
});

// Contact items click to copy
document.addEventListener('DOMContentLoaded', () => {
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        const details = item.querySelector('p');
        
        item.addEventListener('click', () => {
            if (details && (details.textContent.includes('@') || details.textContent.includes('+'))) {
                navigator.clipboard.writeText(details.textContent).then(() => {
                    const originalText = details.textContent;
                    details.textContent = 'Copiado!';
                    details.style.color = '#22d3ee';
                    
                    setTimeout(() => {
                        details.textContent = originalText;
                        details.style.color = '#64748b';
                    }, 2000);
                });
            }
        });
    });
});

// Parallax effect for home section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const homeSection = document.querySelector('.home-section');
    
    if (homeSection) {
        const parallaxSpeed = scrolled * 0.1;
        homeSection.style.transform = `translateY(${parallaxSpeed}px)`;
    }
});

// Error handling for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" fill="%23999" font-family="Arial" font-size="16">Imagem não encontrada</text></svg>';
        });
    });
});

// Performance optimization - lazy loading for heavy elements
document.addEventListener('DOMContentLoaded', () => {
    const lazyElements = document.querySelectorAll('.portfolio-card img, .profile-image');

    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                lazyObserver.unobserve(entry.target);
            }
        });
    });

    lazyElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.5s ease';
        lazyObserver.observe(element);
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Remove any loading screens if present
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 500);
    }
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollPolyfill = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };
    
    document.addEventListener('DOMContentLoaded', smoothScrollPolyfill);
}