// Main JavaScript for KPRFlow Enterprise Web Application

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeCalculator();
    initializePropertyCards();
    initializeAnimations();
    initializeScrollEffects();
});

// Navigation Functions
function initializeNavigation() {
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.md\\:hidden button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Calculator Functions
function initializeCalculator() {
    const calculateButton = document.querySelector('#calculator button');
    const resultDiv = document.querySelector('#calculator .bg-blue-50');
    
    if (calculateButton && resultDiv) {
        calculateButton.addEventListener('click', function() {
            const propertyPrice = parseFloat(document.querySelector('input[placeholder="Rp 500.000.000"]').value) || 500000000;
            const dpPercentage = parseFloat(document.querySelector('input[placeholder="30"]').value) || 30;
            const interestRate = parseFloat(document.querySelector('input[placeholder="6.5"]').value) || 6.5;
            const tenorYears = parseInt(document.querySelector('input[placeholder="10"]').value) || 10;
            
            const dp = propertyPrice * (dpPercentage / 100);
            const loanAmount = propertyPrice - dp;
            const monthlyRate = interestRate / 100 / 12;
            const totalMonths = tenorYears * 12;
            
            // Calculate monthly installment using PMT formula
            const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
            
            // Update result display
            resultDiv.classList.remove('hidden');
            resultDiv.innerHTML = `
                <h4 class="font-semibold text-blue-800 mb-2">Hasil Perhitungan:</h4>
                <div class="space-y-2 text-gray-700">
                    <div class="flex justify-between">
                        <span>DP:</span>
                        <span class="font-semibold">Rp ${dp.toLocaleString('id-ID')}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Pokok Pinjaman:</span>
                        <span class="font-semibold">Rp ${loanAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Cicilan/Bulan:</span>
                        <span class="font-semibold text-blue-600">Rp ${monthlyPayment.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
                    </div>
                </div>
            `;
        });
    }
}

// Property Cards Functions
function initializePropertyCards() {
    const propertyCards = document.querySelectorAll('.property-card');
    
    propertyCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.05)';
            }, 100);
        });
        
        // Add hover effect with delay
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
        });
    });
}

// Animation Functions
function initializeAnimations() {
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Scroll Effects
function initializeScrollEffects() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('nav');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        
        // Add shadow to navbar on scroll
        if (scrollTop > 10) {
            navbar.classList.add('shadow-lg');
        } else {
            navbar.classList.remove('shadow-lg');
        }
    });
}

// Form Validation
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('border-red-500');
            isValid = false;
        } else {
            input.classList.remove('border-red-500');
        }
    });
    
    return isValid;
}

// Loading State
function showLoading(element) {
    element.disabled = true;
    element.innerHTML = '<i class="fas fa-spinner loading mr-2"></i>Memproses...';
}

function hideLoading(element, originalText) {
    element.disabled = false;
    element.innerHTML = originalText;
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// API Functions (for future integration)
async function submitKPRApplication(formData) {
    try {
        showLoading(document.querySelector('button[type="submit"]'));
        
        const response = await fetch('/api/kpr-application', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showNotification('Pengajuan KPR berhasil dikirim!', 'success');
            return await response.json();
        } else {
            throw new Error('Failed to submit application');
        }
    } catch (error) {
        showNotification('Terjadi kesalahan. Silakan coba lagi.', 'error');
        console.error('Error:', error);
    } finally {
        hideLoading(document.querySelector('button[type="submit"]'), 'Kirim Pengajuan');
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(amount);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize on page load
window.addEventListener('load', function() {
    console.log('KPRFlow Enterprise Web Application loaded successfully!');
});

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page is hidden');
    } else {
        console.log('Page is visible');
    }
});
