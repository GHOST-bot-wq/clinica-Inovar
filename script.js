/**
 * Instituto Inovar — Fisioterapia | Pilates | Estética
 * Front-end Scripts & Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- CONFIGURAÇÃO GERAL DO CLIENTE ---
    const CLINIC_CONFIG = {
        name: 'Instituto Inovar',
        whatsappPhone: '559988231248',
        whatsappFormatted: '+55 (99) 8823-1248',
        defaultMessage: 'Olá! Conheci o site do Instituto Inovar e gostaria de saber mais sobre os atendimentos.',
        instagram: 'https://www.instagram.com/inovar.caxias/'
    };

    // --- 1. ATUALIZAÇÃO DINÂMICA DE LINKS WHATSAPP ---
    const updateWhatsAppLinks = () => {
        const whatsappElements = document.querySelectorAll('.js-whatsapp-link');
        const encodedDefaultMsg = encodeURIComponent(CLINIC_CONFIG.defaultMessage);
        const fullWhatsAppUrl = `https://wa.me/${CLINIC_CONFIG.whatsappPhone}?text=${encodedDefaultMsg}`;

        whatsappElements.forEach(el => {
            // Se o link ainda não tiver um texto customizado definido no href, insere o padrão
            if (!el.getAttribute('href') || el.getAttribute('href').includes('wa.me')) {
                // mantém se tiver query específica, caso contrário usa o padrão
                const currentHref = el.getAttribute('href') || '';
                if (!currentHref.includes('?text=')) {
                    el.setAttribute('href', fullWhatsAppUrl);
                }
            }
        });
    };

    updateWhatsAppLinks();

    // --- 2. HEADER STICKY & SCROLL DETECTION ---
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Executa ao carregar para o caso de reload no meio da página

    // --- 3. MENU MOBILE DRAWER & HAMBURGUER TOGGLE ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        const toggleMenu = () => {
            const isActive = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            document.body.style.overflow = isActive ? 'hidden' : '';
        };

        const closeMenu = () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        };

        hamburger.addEventListener('click', toggleMenu);

        // Fechar ao clicar em qualquer link da navegação
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Fechar ao clicar fora do menu
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !hamburger.contains(e.target)) {
                closeMenu();
            }
        });

        // Fechar com a tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // --- 4. SCROLL SUAVE PARA ÂNCORAS ---
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 5. INTERSECTION OBSERVER PARA ANIMAÇÕES (.animate) ---
    const animateElements = document.querySelectorAll('.animate');
    if ('IntersectionObserver' in window && animateElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.15
        };

        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Anima uma única vez
                }
            });
        }, observerOptions);

        animateElements.forEach(el => animationObserver.observe(el));
    } else {
        // Fallback para navegadores antigos ou sem suporte
        animateElements.forEach(el => el.classList.add('is-visible'));
    }

    // --- 6. VALIDAÇÃO E ENVIO DO FORMULÁRIO DE CONTATO VIA WHATSAPP ---
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nomeInput = document.getElementById('nome');
            const telefoneInput = document.getElementById('telefone');
            const unidadeInput = document.getElementById('unidade');
            const servicoInput = document.getElementById('servico');
            const mensagemInput = document.getElementById('mensagem');
            const btnSubmit = document.getElementById('btnSubmit');

            let isValid = true;

            // Validação Nome
            const nomeGroup = nomeInput.closest('.form-group');
            if (!nomeInput.value.trim()) {
                nomeGroup.classList.add('has-error');
                isValid = false;
            } else {
                nomeGroup.classList.remove('has-error');
            }

            // Validação Telefone
            const telGroup = telefoneInput.closest('.form-group');
            const cleanedTel = telefoneInput.value.replace(/\D/g, '');
            if (!telefoneInput.value.trim() || cleanedTel.length < 8) {
                telGroup.classList.add('has-error');
                isValid = false;
            } else {
                telGroup.classList.remove('has-error');
            }

            // Validação Unidade
            const unidadeGroup = unidadeInput.closest('.form-group');
            if (!unidadeInput.value) {
                unidadeGroup.classList.add('has-error');
                isValid = false;
            } else {
                unidadeGroup.classList.remove('has-error');
            }

            // Validação Serviço
            const servicoGroup = servicoInput.closest('.form-group');
            if (!servicoInput.value) {
                servicoGroup.classList.add('has-error');
                isValid = false;
            } else {
                servicoGroup.classList.remove('has-error');
            }

            if (!isValid) {
                return;
            }

            // Formata mensagem para WhatsApp
            const nome = nomeInput.value.trim();
            const tel = telefoneInput.value.trim();
            const unidade = unidadeInput.value;
            const servico = servicoInput.value;
            const msg = mensagemInput ? mensagemInput.value.trim() : '';

            let waText = `Olá! Gostaria de informações/agendamento no Instituto Inovar.\n\n`;
            waText += `*Nome:* ${nome}\n`;
            waText += `*WhatsApp:* ${tel}\n`;
            waText += `*Unidade:* ${unidade}\n`;
            waText += `*Serviço:* ${servico}\n`;
            if (msg) {
                waText += `*Mensagem:* ${msg}\n`;
            }

            const encodedWa = encodeURIComponent(waText);
            const targetUrl = `https://wa.me/${CLINIC_CONFIG.whatsappPhone}?text=${encodedWa}`;

            // Exibir feedback ao usuário
            if (formSuccess) {
                formSuccess.style.display = 'block';
            }
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.innerHTML = '<span>Redirecionando...</span>';
            }

            // Redireciona para o WhatsApp após breve delay
            setTimeout(() => {
                window.open(targetUrl, '_blank', 'noopener,noreferrer');
                contactForm.reset();
                if (btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.innerHTML = '<span>Enviar Mensagem via WhatsApp</span>';
                }
            }, 800);
        });

        // Limpar erro ao digitar
        ['nome', 'telefone', 'unidade', 'servico'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    input.closest('.form-group').classList.remove('has-error');
                });
                input.addEventListener('change', () => {
                    input.closest('.form-group').classList.remove('has-error');
                });
            }
        });
    }

    // --- 7. ATUALIZAÇÃO DO ANO NO FOOTER ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- 8. IMAGEM DE FUNDO DO HERO (fachada.jpg) ---
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const heroImg = new Image();
        heroImg.onload = () => {
            heroSection.style.backgroundImage = `url('public/images/fachada.jpg')`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
            heroSection.style.backgroundRepeat = 'no-repeat';
            heroSection.classList.add('has-bg-image');
        };
        heroImg.src = 'public/images/fachada.jpg';
    }
});
