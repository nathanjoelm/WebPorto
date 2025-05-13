// Testimonial Slider with Auto-scroll
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentIndex = 0;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;
    let animationID = 0;
    let autoScrollInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Initialize
    updateSlides();
    startAutoScroll();

    // Auto-scroll function
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            if (!isDragging) {
                currentIndex = (currentIndex + 1) % slides.length;
                updateSlides();
            }
        }, 5000); // Change slide every 5 seconds
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    // Navigation functions
    function updateSlides() {
        const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);
        currentTranslate = -currentIndex * slideWidth;
        prevTranslate = currentTranslate;
        
        track.style.transform = `translateX(${currentTranslate}px)`;
        
        // Update active states
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
        });
        
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlides();
        stopAutoScroll();
        startAutoScroll();
    }

    // Event listeners for buttons
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlides();
        stopAutoScroll();
        startAutoScroll();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlides();
        stopAutoScroll();
        startAutoScroll();
    });

    // Touch events
    track.addEventListener('touchstart', touchStart);
    track.addEventListener('touchmove', touchMove);
    track.addEventListener('touchend', touchEnd);

    // Mouse events
    track.addEventListener('mousedown', touchStart);
    track.addEventListener('mousemove', touchMove);
    track.addEventListener('mouseup', touchEnd);
    track.addEventListener('mouseleave', touchEnd);

    function touchStart(event) {
        isDragging = true;
        startPos = getPositionX(event);
        track.classList.add('dragging');
        stopAutoScroll();
    }

    function touchMove(event) {
        if (!isDragging) return;
        
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function touchEnd() {
        isDragging = false;
        track.classList.remove('dragging');
        
        const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);
        const movedBy = currentTranslate - prevTranslate;
        
        if (Math.abs(movedBy) > slideWidth / 3) {
            if (movedBy < 0) {
                currentIndex++;
            } else {
                currentIndex--;
            }
        }
        
        if (currentIndex < 0) currentIndex = slides.length - 1;
        if (currentIndex >= slides.length) currentIndex = 0;
        
        updateSlides();
        startAutoScroll();
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    // Pause auto-scroll on hover
    track.addEventListener('mouseenter', stopAutoScroll);
    track.addEventListener('mouseleave', startAutoScroll);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in animation to sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-out');
    observer.observe(section);
});

// Form handling
const contactForm = document.getElementById('contactForm');
const messageInput = document.getElementById('message');
const messageCount = document.getElementById('messageCount');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

// Character count
if (messageInput && messageCount) {
    messageInput.addEventListener('input', (e) => {
        const count = e.target.value.length;
        const max = e.target.getAttribute('maxlength');
        messageCount.textContent = `${count}/${max}`;
        
        if (count >= max - 50) {
            messageCount.classList.add('limit');
        } else {
            messageCount.classList.remove('limit');
        }
    });
}

// Form validation
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(`${inputId}Error`);
    
    if (input && errorSpan) {
        input.classList.add('error');
        errorSpan.textContent = message;
        errorSpan.classList.add('visible');
    }
}

function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(`${inputId}Error`);
    
    if (input && errorSpan) {
        input.classList.remove('error');
        errorSpan.textContent = '';
        errorSpan.classList.remove('visible');
    }
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function showSuccessMessage() {
    if (successMessage) {
        successMessage.classList.remove('hidden');
        successMessage.classList.add('visible');
    }
}

function hideSuccessMessage() {
    if (successMessage) {
        successMessage.classList.remove('visible');
        successMessage.classList.add('hidden');
    }
}

async function handleSubmit(e) {
    e.preventDefault();
    let isValid = true;
    
    // Clear previous errors
    ['firstName', 'lastName', 'email', 'inquiry', 'message'].forEach(clearError);
    
    // Validate first name
    const firstName = document.getElementById('firstName').value.trim();
    if (!firstName) {
        showError('firstName', 'Please enter your first name');
        isValid = false;
    } else if (firstName.length < 2) {
        showError('firstName', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate last name
    const lastName = document.getElementById('lastName').value.trim();
    if (!lastName) {
        showError('lastName', 'Please enter your last name');
        isValid = false;
    } else if (lastName.length < 2) {
        showError('lastName', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('email').value.trim();
    if (!email) {
        showError('email', 'Please enter your email address');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate inquiry
    const inquiry = document.getElementById('inquiry').value;
    if (!inquiry) {
        showError('inquiry', 'Please select an inquiry type');
        isValid = false;
    }
    
    // Validate message
    const message = document.getElementById('message').value.trim();
    if (!message) {
        showError('message', 'Please enter your message');
        isValid = false;
    } else if (message.length < 10) {
        showError('message', 'Message must be at least 10 characters');
        isValid = false;
    }
    
    if (isValid) {
        // Show loading state
        submitBtn.classList.add('loading');
        
        try {
            // Get inquiry-specific template
            let template = '';
            switch(inquiry) {
                case 'UI/UX':
                    template = `\n\n---\nI'm interested in discussing a UI/UX project. Here are some details about what I need:\n- Target audience: [Please describe]\n- Project scope: [Website/App/Other]\n- Timeline: [Estimated timeframe]\n- Budget: [If applicable]`;
                    break;
                case 'Video Animation':
                    template = `\n\n---\nI'd like to discuss a video animation project. Here are some details:\n- Video type: [Explainer/Commercial/Other]\n- Duration: [Estimated length]\n- Style preferences: [If any]\n- Deadline: [If applicable]`;
                    break;
                case 'Graphic Design':
                    template = `\n\n---\nI'm looking for graphic design services. Here's what I need:\n- Design type: [Logo/Branding/Print/Other]\n- Color preferences: [If any]\n- Quantity: [Number of designs]\n- Usage: [Where will it be used?]`;
                    break;
                case 'Content Creation':
                    template = `\n\n---\nI need content creation services. Here are the details:\n- Content type: [Blog/Social Media/Other]\n- Topics: [Main subjects]\n- Frequency: [How often needed]\n- Tone/style: [If specific]`;
                    break;
                default:
                    template = ''; // For 'Other' option
            }

            // Format email body
            const emailBody = `
Name: ${firstName} ${lastName}
Email: ${email}
Inquiry Type: ${inquiry}

Message:
${message}${template}
            `.trim();

            // Format email subject
            const subject = `New Inquiry: ${inquiry} - ${firstName} ${lastName}`;

            // Create mailto link with user's email pre-filled
            const mailtoLink = `mailto:nathanaeljoel4@gmail.com?cc=${encodeURIComponent(email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            contactForm.reset();
            messageCount.textContent = '0/500';
            
        } catch (error) {
            console.error('Error sending message:', error);
            alert('There was an error sending your message. Please try again.');
        } finally {
            // Hide loading state
            submitBtn.classList.remove('loading');
        }
    }
    
    return false;
}

// Close success message when clicking outside
if (successMessage) {
    successMessage.addEventListener('click', (e) => {
        if (e.target === successMessage) {
            hideSuccessMessage();
        }
    });
}

// Add animation classes for the work items
document.querySelectorAll('.work-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.classList.add('hover');
    });
    
    item.addEventListener('mouseleave', () => {
        item.classList.remove('hover');
    });
});

// Navigation active state
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (currentPath === linkPath || 
            (currentPath === '/' && linkPath.includes('index.html')) ||
            (currentPath.includes('index.html') && linkPath.includes('index.html'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Services list interaction
document.addEventListener('DOMContentLoaded', () => {
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            // Close all other items
            serviceItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});

// YouTube Player API Integration
let players = [];

function onYouTubeIframeAPIReady() {
    // Get all YouTube iframes
    const youtubeIframes = document.querySelectorAll('.video-container iframe[src*="youtube.com"]');
    
    // Initialize players for each iframe
    youtubeIframes.forEach((iframe, index) => {
        // Extract video ID from src
        const videoId = iframe.src.split('embed/')[1].split('?')[0];
        
        // Replace iframe with div for YouTube player
        const divId = `youtube-player-${index}`;
        const div = document.createElement('div');
        div.id = divId;
        iframe.parentNode.replaceChild(div, iframe);
        
        // Create player
        const player = new YT.Player(divId, {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                autoplay: 0,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                mute: 1
            }
        });
        
        players.push(player);
    });
}

// Handle hover events for work items
document.addEventListener('DOMContentLoaded', () => {
    const workItems = document.querySelectorAll('.work-scroll-item');
    
    workItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            if (players[index]) {
                players[index].playVideo();
            }
            
            // Handle Instagram embeds
            const instagramEmbed = item.querySelector('.instagram-media');
            if (instagramEmbed) {
                instagramEmbed.style.opacity = '1';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (players[index]) {
                players[index].pauseVideo();
            }
            
            // Handle Instagram embeds
            const instagramEmbed = item.querySelector('.instagram-media');
            if (instagramEmbed) {
                instagramEmbed.style.opacity = '0';
            }
        });
    });
});

// Smooth scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add cursor pointer to footer logo
document.addEventListener('DOMContentLoaded', function() {
    const footerLogo = document.querySelector('footer .logo a');
    if (footerLogo) {
        footerLogo.style.cursor = 'pointer';
    }
});

// Testimonials functionality
document.addEventListener('DOMContentLoaded', function() {
    const testimonialCards = document.querySelectorAll('.testimonial-card:not(.clone)');
    const navDots = document.querySelectorAll('.nav-dot');
    const track = document.querySelector('.testimonial-track');
    const container = document.querySelector('.testimonial-container');
    let currentIndex = 0;
    let autoScrollInterval;
    let isHovered = false;

    function updateTestimonials(index, doScroll = true, smooth = true) {
        // Clamp index
        if (index < 0) index = testimonialCards.length - 1;
        if (index >= testimonialCards.length) index = 0;
        currentIndex = index;
        const card = testimonialCards[index];

        // Only scroll if doScroll is true AND the container is in the viewport
        if (card && doScroll) {
            const containerRect = container.getBoundingClientRect();
            const inView = containerRect.top >= 0 && containerRect.bottom <= window.innerHeight;
            if (inView) {
                card.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', inline: 'center', block: 'nearest' });
            }
        }

        // Update active state
        testimonialCards.forEach((c, i) => c.classList.toggle('active', i === index));
        navDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    // Dot navigation
    navDots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            updateTestimonials(i, true);
            resetAutoScroll();
        });
    });

    // Auto-advance
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            if (!isHovered) {
                updateTestimonials(currentIndex + 1, true);
            }
        }, 5000);
    }
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    function resetAutoScroll() {
        stopAutoScroll();
        startAutoScroll();
    }

    // Pause auto-scroll on hover
    if (container) {
        container.addEventListener('mouseenter', () => { isHovered = true; stopAutoScroll(); });
        container.addEventListener('mouseleave', () => { isHovered = false; startAutoScroll(); });
    }

    // Keyboard navigation (optional)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            updateTestimonials(currentIndex - 1, true);
            resetAutoScroll();
        } else if (e.key === 'ArrowRight') {
            updateTestimonials(currentIndex + 1, true);
            resetAutoScroll();
        }
    });

    // Swipe navigation for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    if (container) {
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchEndX < touchStartX - 50) {
                updateTestimonials(currentIndex + 1, true);
                resetAutoScroll();
            } else if (touchEndX > touchStartX + 50) {
                updateTestimonials(currentIndex - 1, true);
                resetAutoScroll();
            }
        }, { passive: true });
    }

    // Initialize
    updateTestimonials(0, false, false);
    startAutoScroll();
});

// Smooth scroll function for the Get Started button
document.addEventListener('DOMContentLoaded', function() {
    const getStartedBtn = document.querySelector('a[href="#work"]');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector('.past-works');
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
});

// Check if we're on the about page to initialize special effects
const aboutHeroParallax = document.querySelector('.about-hero-parallax');
if (aboutHeroParallax) {
    // Add class to body for page-specific styling
    document.body.classList.add('about-page');
    
    // Ensure the header is transparent initially and changes on scroll
    const header = document.querySelector('header');
    if (header) {
        // Make header transparent at top
        updateHeaderTransparency();
        
        // Update header transparency on scroll
        window.addEventListener('scroll', updateHeaderTransparency);
    }
}

// Function to handle header transparency for about page
function updateHeaderTransparency() {
    const header = document.querySelector('header');
    if (header && document.body.classList.contains('about-page')) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            header.classList.remove('transparent');
        } else {
            header.classList.add('transparent');
            header.classList.remove('scrolled');
        }
    }
}

// Header hide/show on scroll
let lastScrollY = window.scrollY;
let ticking = false;
const header = document.querySelector('header');

function handleHeaderScroll() {
    const currentScrollY = window.scrollY;
    if (!header) return;
    if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down
        header.classList.add('header-hide');
        header.classList.remove('header-show');
    } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        header.classList.remove('header-hide');
        header.classList.add('header-show');
    }
    lastScrollY = currentScrollY;
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(handleHeaderScroll);
        ticking = true;
    }
}); 