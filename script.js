// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const backToTop = document.getElementById('backToTop');
const cubeNetwork = document.getElementById('cubeNetwork');

// ===== Cube Network Background =====
function createCubeNetwork() {
    if (!cubeNetwork) return;
    
    const numCubes = window.innerWidth < 768 ? 15 : 30;
    const cubes = [];
    
    // Create SVG for connection lines
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.pointerEvents = 'none';
    
    // Add gradient definition
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'lineGradient');
    gradient.innerHTML = `
        <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3"/>
        <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#10b981" stop-opacity="0.3"/>
    `;
    defs.appendChild(gradient);
    svg.appendChild(defs);
    cubeNetwork.appendChild(svg);
    
    // Create cubes
    for (let i = 0; i < numCubes; i++) {
        const cube = document.createElement('div');
        cube.className = 'network-cube';
        
        // Random type for color variation
        const types = ['', 'accent', 'secondary'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        if (randomType) cube.classList.add(randomType);
        
        // Create cube faces
        const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
        faces.forEach(face => {
            const faceEl = document.createElement('div');
            faceEl.className = `face ${face}`;
            cube.appendChild(faceEl);
        });
        
        // Random position
        const x = Math.random() * (window.innerWidth - 40);
        const y = Math.random() * (window.innerHeight - 40);
        
        cube.style.left = x + 'px';
        cube.style.top = y + 'px';
        cube.style.animationDelay = (Math.random() * 8) + 's';
        cube.style.animationDuration = (6 + Math.random() * 6) + 's';
        
        cubeNetwork.appendChild(cube);
        cubes.push({ element: cube, x: x + 10, y: y + 10 });
    }
    
    // Create connections between nearby cubes
    const maxDistance = window.innerWidth < 768 ? 150 : 200;
    
    for (let i = 0; i < cubes.length; i++) {
        for (let j = i + 1; j < cubes.length; j++) {
            const dx = cubes[i].x - cubes[j].x;
            const dy = cubes[i].y - cubes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', cubes[i].x);
                line.setAttribute('y1', cubes[i].y);
                line.setAttribute('x2', cubes[j].x);
                line.setAttribute('y2', cubes[j].y);
                line.setAttribute('class', 'connection-line');
                line.style.animationDelay = (Math.random() * 4) + 's';
                svg.appendChild(line);
            }
        }
    }
}

// Initialize cube network
createCubeNetwork();

// Recreate on resize (debounced)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (cubeNetwork) {
            cubeNetwork.innerHTML = '';
            createCubeNetwork();
        }
    }, 250);
});

// ===== Navigation Toggle =====
if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
        const icon = navToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    // Close menu when clicking on a link
    document.querySelectorAll('#mobileMenu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });
}

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.classList.add('shadow-lg', 'shadow-primary/10');
        } else {
            navbar.classList.remove('shadow-lg', 'shadow-primary/10');
        }
    }

    // Back to top button visibility
    if (backToTop) {
        if (window.scrollY > 500) {
            backToTop.classList.remove('opacity-0', 'invisible');
            backToTop.classList.add('opacity-100', 'visible');
        } else {
            backToTop.classList.add('opacity-0', 'invisible');
            backToTop.classList.remove('opacity-100', 'visible');
        }
    }
});

// ===== Back to Top =====
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Counter Animation =====
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Trigger counter animation when hero section is visible
            if (entry.target.id === 'hero') {
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observe sections for animations
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Add fade-up class to elements
document.querySelectorAll('.group').forEach(el => {
    el.classList.add('fade-up');
    observer.observe(el);
});

// ===== Smooth Scroll for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Form Submission with Formspree =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(contactForm);
            
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.classList.remove('bg-primary');
                submitBtn.classList.add('bg-green-500');
                contactForm.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.classList.remove('bg-green-500');
                    submitBtn.classList.add('bg-primary');
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            // Error
            submitBtn.innerHTML = '<i class="fas fa-times"></i> Failed to Send';
            submitBtn.classList.remove('bg-primary');
            submitBtn.classList.add('bg-red-500');
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.classList.remove('bg-red-500');
                submitBtn.classList.add('bg-primary');
                submitBtn.disabled = false;
            }, 3000);
        }
    });
}

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`nav a[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('text-primary');
                link.classList.add('text-gray-400');
            });
            if (navLink) {
                navLink.classList.remove('text-gray-400');
                navLink.classList.add('text-primary');
            }
        }
    });
});

// ===== Card Hover Effects =====
document.querySelectorAll('.group').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ===== Skill Cards Animation Delay =====
document.querySelectorAll('#skills .group, #skills > div > div > div').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.05}s`;
});

// ===== Project Cards Animation Delay =====
document.querySelectorAll('#projects > div > div').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// ===== Easter Egg - Konami Code =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        document.body.style.animation = 'gradient 2s ease infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// ===== Console Easter Egg =====
console.log('%c 🚀 DevOps Engineer Portfolio ', 'background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; font-size: 20px; padding: 10px 20px; border-radius: 5px; font-weight: bold;');
console.log('%c Built with Tailwind CSS & Passion for Automation ', 'color: #3b82f6; font-size: 14px;');
console.log('%c Infrastructure as Code | CI/CD | Cloud Native ', 'color: #8b5cf6; font-size: 12px;');

// ===== Performance: Lazy Load Images =====
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ===== Page Load Animation =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements with stagger
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const heroElements = heroSection.querySelectorAll('.relative > div');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 200 + (index * 150));
        });
    }
});

// ===== Smooth reveal on scroll =====
const revealElements = document.querySelectorAll('.fade-up');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));