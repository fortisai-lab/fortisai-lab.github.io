// Star class with improved visibility
class Star {
    constructor() {
        this.reset();
        this.z = Math.random() * 2000; // More depth variation
    }
    
    reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.z = 2000;
        this.size = Math.random() * 2 + 0.5;
    }
    
    move() {
        this.z = this.z - 1;
        if (this.z <= 0) {
            this.reset();
        }
    }
    
    show() {
        let x, y, s;
        x = (this.x - window.innerWidth/2) * (1000/this.z) + window.innerWidth/2;
        y = (this.y - window.innerHeight/2) * (1000/this.z) + window.innerHeight/2;
        s = this.size * (1000/this.z);
        
        return {x, y, s};
    }
}

function createStarfield() {
    const canvas = document.createElement('canvas');
    canvas.classList.add('starfield');
    document.querySelector('.site-background').appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    // Increase number of stars
    let stars = Array(600).fill().map(() => new Star());
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(3, 3, 8, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        stars.forEach(star => {
            star.move();
            const {x, y, s} = star.show();
            
            // Enhanced star glow
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, s * 3);
            gradient.addColorStop(0, 'rgba(20, 241, 149, 1)');    // Bright core
            gradient.addColorStop(0.1, 'rgba(20, 241, 149, 0.4)'); // Neon green
            gradient.addColorStop(0.2, 'rgba(0, 144, 179, 0.2)');  // Cyan
            gradient.addColorStop(0.4, 'rgba(43, 0, 179, 0.1)');   // Blue
            gradient.addColorStop(1, 'transparent');
            
            // Larger glow
            ctx.beginPath();
            ctx.arc(x, y, s * 3, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Brighter core
            ctx.beginPath();
            ctx.arc(x, y, s * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', resize);
    resize();
    animate();
}

// Add starfield CSS
const style = document.createElement('style');
style.textContent = `
    .starfield {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
        background: transparent;
    }
`;
document.head.appendChild(style);

// Cursor haze effect
function initCursorHaze() {
    if (window.matchMedia('(hover: hover)').matches) {
        const haze = document.createElement('div');
        haze.classList.add('cursor-haze');
        document.body.appendChild(haze);
        
        let isVisible = false;
        
        document.addEventListener('mousemove', (e) => {
            if (!isVisible) {
                isVisible = true;
                haze.style.opacity = '1';
            }
            
            haze.style.left = e.clientX + 'px';
            haze.style.top = e.clientY + 'px';
        });
        
        document.addEventListener('mouseleave', () => {
            isVisible = false;
            haze.style.opacity = '0';
        });
    }
}

// Parallax effect
function initParallax() {
    const cards = document.querySelectorAll('.feature-card, .stat-card');
    
    // Only initialize parallax on non-touch devices
    if (window.matchMedia('(hover: hover)').matches) {
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 15;
                const rotateY = (centerX - x) / 15;
                
                card.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    scale3d(1.02, 1.02, 1.02)
                    translateZ(10px)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'none';
            });
        });
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    createStarfield();
    
    // Rest of your initialization code...
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.feature-card, .stat-card, .requirement-item')
        .forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });

    window.copyAddress = function() {
        const address = 'F9TdzTUXPN3hEB7Zyfn4qHc8PyTDZCkarrGTGE9opump';
        navigator.clipboard.writeText(address).then(() => {
            const copyButton = document.querySelector('.copy-button');
            const originalIcon = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => copyButton.innerHTML = originalIcon, 2000);
        });
    };

    initFAQ();
    initCursorHaze();
    initParallax();
});

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = null;
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            
            // Handle animation
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
            }
        });
    });
}

// Initialize FAQ when document is loaded
document.addEventListener('DOMContentLoaded', initFAQ); 
