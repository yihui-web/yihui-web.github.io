// ================================
// 全局配置
// ================================
const CONFIG = {
    scrollThreshold: 50,
    animationDuration: 2000,
    observerThreshold: 0.2,
    typingSpeed: 80,
};

// ================================
// 导航栏效果
// ================================
const navbar = document.querySelector('.navbar');

function handleNavbarScroll() {
    if (window.scrollY > CONFIG.scrollThreshold) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavbarScroll);

// 移动端菜单切换
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    navLinks?.classList.toggle('active');
    menuToggle?.classList.toggle('active');

    // 防止背景滚动
    document.body.style.overflow = navLinks?.classList.contains('active') ? 'hidden' : '';
}

// 点击导航链接后关闭菜单
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.menu-toggle');
        navLinks?.classList.remove('active');
        menuToggle?.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ================================
// 滚动动画系统
// ================================
class ScrollAnimator {
    constructor() {
        this.elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');
        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window)) {
            this.elements.forEach(el => el.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: CONFIG.observerThreshold,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(el => observer.observe(el));
    }
}

// ================================
// 数字计数动画
// ================================
class NumberAnimator {
    constructor() {
        this.elements = document.querySelectorAll('.stat-number');
        this.animated = new Set();
        this.init();
    }

    init() {
        if (!this.elements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animated.add(entry.target);
                    this.animate(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.elements.forEach(el => observer.observe(el));
    }

    animate(element) {
        const text = element.textContent;
        const target = parseInt(text.replace(/[^0-9]/g, '')) || 0;
        const suffix = text.replace(/[0-9]/g, '');
        const duration = CONFIG.animationDuration;
        const startTime = performance.now();

        const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const current = Math.floor(easedProgress * target);

            element.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    }
}

// ================================
// FAQ 折叠功能
// ================================
class FAQAccordion {
    constructor() {
        this.items = document.querySelectorAll('.faq-item');
        this.init();
    }

    init() {
        this.items.forEach(item => {
            const question = item.querySelector('.faq-question');
            question?.addEventListener('click', () => this.toggle(item));
        });
    }

    toggle(currentItem) {
        const isActive = currentItem.classList.contains('active');

        // 关闭其他
        this.items.forEach(item => {
            if (item !== currentItem) {
                item.classList.remove('active');
            }
        });

        // 切换当前
        currentItem.classList.toggle('active', !isActive);
    }
}

// ================================
// 平滑滚动
// ================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const navHeight = navbar?.offsetHeight || 72;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ================================
// 页面滚动进度指示器
// ================================
class ScrollProgress {
    constructor() {
        this.createProgressBar();
        this.init();
    }

    createProgressBar() {
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'scroll-progress';
        this.progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #2563eb, #06b6d4, #8b5cf6);
            z-index: 9999;
            transition: width 0.1s ease-out;
            width: 0%;
        `;
        document.body.appendChild(this.progressBar);
    }

    init() {
        window.addEventListener('scroll', () => this.update());
    }

    update() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        this.progressBar.style.width = `${progress}%`;
    }
}

// ================================
// 打字机效果
// ================================
class Typewriter {
    constructor(element, texts, speed = CONFIG.typingSpeed) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];

        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let delay = this.isDeleting ? this.speed / 2 : this.speed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            delay = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            delay = 500;
        }

        setTimeout(() => this.type(), delay);
    }
}

// ================================
// 鼠标跟随光标效果（仅桌面端）
// ================================
class CursorGlow {
    constructor() {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        this.cursor = this.createCursor();
        this.init();
    }

    createCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-glow';
        cursor.style.cssText = `
            position: fixed;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
            opacity: 0;
        `;
        document.body.appendChild(cursor);
        return cursor;
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = `${e.clientX}px`;
            this.cursor.style.top = `${e.clientY}px`;
            this.cursor.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        });
    }
}

// ================================
// 卡片倾斜效果
// ================================
class TiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.feature-card, .project-card, .member-card');
        this.init();
    }

    init() {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMove(e, card));
            card.addEventListener('mouseleave', (e) => this.handleLeave(e, card));
        });
    }

    handleMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    }

    handleLeave(e, card) {
        card.style.transform = '';
    }
}

// ================================
// 图片懒加载
// ================================
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }

    init() {
        if (!this.images.length) return;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '50px' });

            this.images.forEach(img => observer.observe(img));
        } else {
            this.images.forEach(img => this.loadImage(img));
        }
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.classList.add('loaded');
        }
    }
}

// ================================
// 粒子背景增强
// ================================
class ParticleEnhancer {
    constructor() {
        this.heroSection = document.querySelector('.hero');
        if (this.heroSection) {
            this.addFloatingElements();
        }
    }

    addFloatingElements() {
        const heroBg = this.heroSection.querySelector('.hero-bg');
        if (!heroBg) return;

        // 添加更多浮动元素
        for (let i = 0; i < 20; i++) {
            const dot = document.createElement('div');
            dot.className = 'floating-dot';
            dot.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatDot ${Math.random() * 10 + 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * -20}s;
            `;
            heroBg.appendChild(dot);
        }

        // 添加动画样式
        if (!document.getElementById('particle-styles')) {
            const style = document.createElement('style');
            style.id = 'particle-styles';
            style.textContent = `
                @keyframes floatDot {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
                    25% { transform: translate(30px, -30px) scale(1.2); opacity: 0.8; }
                    50% { transform: translate(-20px, 20px) scale(0.8); opacity: 0.3; }
                    75% { transform: translate(-30px, -20px) scale(1.1); opacity: 0.6; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// ================================
// 页面可见性处理
// ================================
class VisibilityHandler {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.title = '👋 等你回来...';
            } else {
                document.title = this.getOriginalTitle();
            }
        });
    }

    getOriginalTitle() {
        const metaTitle = document.querySelector('title');
        return metaTitle?.getAttribute('data-original') || document.title;
    }
}

// ================================
// 初始化所有功能
// ================================
document.addEventListener('DOMContentLoaded', () => {
    // 基础功能
    new ScrollAnimator();
    new NumberAnimator();
    new FAQAccordion();
    new SmoothScroll();
    new ScrollProgress();

    // 增强功能
    new CursorGlow();
    new TiltEffect();
    new LazyLoader();
    new ParticleEnhancer();

    // 保存原始标题
    const titleEl = document.querySelector('title');
    if (titleEl) {
        titleEl.setAttribute('data-original', document.title);
    }
    new VisibilityHandler();

    // 页面加载完成动画
    document.body.classList.add('loaded');

    // 为页面元素添加动画类
    addAnimationClasses();

    console.log('🚀 网站已加载完成');
});

// ================================
// 自动添加动画类
// ================================
function addAnimationClasses() {
    // 特色卡片
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.classList.add('fade-in', `delay-${(index % 4) + 1}`);
    });

    // 快速入口
    document.querySelectorAll('.quick-card').forEach((card, index) => {
        card.classList.add('fade-in-left', `delay-${(index % 4) + 1}`);
    });

    // 统计卡片
    document.querySelectorAll('.stat-card').forEach((card, index) => {
        card.classList.add('scale-in', `delay-${(index % 4) + 1}`);
    });

    // 团队成员
    document.querySelectorAll('.member-card').forEach((card, index) => {
        card.classList.add('fade-in', `delay-${(index % 4) + 1}`);
    });

    // 项目卡片
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.classList.add('fade-in', `delay-${(index % 3) + 1}`);
    });

    // 研究方向
    document.querySelectorAll('.research-block').forEach((block, index) => {
        block.classList.add('fade-in-left', `delay-${(index % 2) + 1}`);
    });

    // 时间线
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.classList.add(index % 2 === 0 ? 'fade-in-left' : 'fade-in-right');
    });

    // 优势卡片
    document.querySelectorAll('.advantage-card').forEach((card, index) => {
        card.classList.add('fade-in', `delay-${(index % 4) + 1}`);
    });

    // FAQ
    document.querySelectorAll('.faq-item').forEach((item, index) => {
        item.classList.add('fade-in', `delay-${(index % 4) + 1}`);
    });

    // 触发一次检查
    setTimeout(() => {
        new ScrollAnimator();
    }, 100);
}

// ================================
// 页面完全加载后
// ================================
window.addEventListener('load', () => {
    // 移除加载动画
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
});
