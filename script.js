const mobileMenu = document.getElementById('mobileMenu');
const rail = document.getElementById('rail');

if (mobileMenu && rail) {
    mobileMenu.addEventListener('click', () => {
        const isOpen = rail.classList.toggle('is-open');
        mobileMenu.setAttribute('aria-expanded', isOpen);
    });
}

// Highlight the active section link in the rail as you scroll
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.rail__link');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            links.forEach((link) => link.classList.remove('is-active'));
            const activeLink = document.querySelector(`.rail__link[href="#${entry.target.id}"]`);
            if (activeLink) activeLink.classList.add('is-active');
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach((section) => observer.observe(section));

// --- Scroll reveal ---
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('is-visible'), i * 60);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealEls.forEach((el) => revealObserver.observe(el));

// --- Section transition overlay (typed terminal command) ---
// Only intercept internal anchor links (e.g. #about) — external links
// (GitHub, LinkedIn, project repos) are real URLs and should navigate normally.
const overlay = document.getElementById('transitionOverlay');
const overlayCommand = document.getElementById('transitionCommand');
const navLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

function typeCommand(text, done) {
    overlayCommand.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
        overlayCommand.textContent += text[i];
        i++;
        if (i === text.length) {
            clearInterval(interval);
            setTimeout(done, 180);
        }
    }, 28);
}

navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').slice(1);
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;

        e.preventDefault();
        overlay.classList.add('is-active');
        typeCommand(`$ cd ./${targetId}`, () => {
            targetEl.scrollIntoView({ behavior: 'auto', block: 'start' });
            setTimeout(() => overlay.classList.remove('is-active'), 150);
        });

        if (rail.classList.contains('is-open')) {
            rail.classList.remove('is-open');
            mobileMenu.setAttribute('aria-expanded', false);
        }
    });
});

// --- Contact form (EmailJS) ---
emailjs.init('sj9frGDkiXOjO3pJE');

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;
        formStatus.textContent = '';
        formStatus.className = 'form-status';

        emailjs.sendForm('service_2l6nz5g', 'template_mlr8fwm', contactForm)
            .then(() => {
                formStatus.textContent = 'Message sent — thanks for reaching out.';
                formStatus.classList.add('is-success');
                contactForm.reset();
            })
            .catch((error) => {
                formStatus.textContent = 'Something went wrong. Try again, or email me directly.';
                formStatus.classList.add('is-error');
                console.error('EmailJS error:', error);
            })
            .finally(() => {
                submitBtn.classList.remove('is-loading');
                submitBtn.disabled = false;
            });
    });
}