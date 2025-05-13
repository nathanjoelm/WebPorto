// Parallax effect for the about page hero section
document.addEventListener('DOMContentLoaded', function() {
    const parallaxImage = document.querySelector('.about-hero-image');
    const parallaxContent = document.querySelector('.about-hero-content');
    const aboutSection = document.querySelector('.about-section');
    
    // Check if we're on the about page
    if (parallaxImage && parallaxContent) {
        // Store initial positions
        let imageInitialPosition = 0;
        let contentInitialPosition = 0;
        
        // Create a throttled scroll function for better performance
        let lastScrollTime = 0;
        const throttleDelay = 10; // ms
        
        // Check for requestAnimationFrame support
        const requestAnimFrame = window.requestAnimationFrame || 
                                window.webkitRequestAnimationFrame || 
                                window.mozRequestAnimationFrame || 
                                function(callback) { window.setTimeout(callback, 1000 / 60); };
        
        // Function to create parallax effect
        function updateParallax() {
            const currentTime = new Date().getTime();
            
            if (currentTime - lastScrollTime > throttleDelay) {
                lastScrollTime = currentTime;
                
                // Get scroll position
                const scrollPosition = window.scrollY;
                const windowHeight = window.innerHeight;
                
                // Only apply parallax if in viewport
                if (scrollPosition < windowHeight) {
                    // Calculate transforms with different speeds for layered effect
                    const translateY = scrollPosition * 0.4; // Slower for background
                    const contentTranslateY = scrollPosition * 0.2; // Faster for content
                    const opacity = 1 - (scrollPosition / windowHeight * 0.7); // Fade out effect
                    
                    // Apply transforms
                    parallaxImage.style.transform = `translateY(${translateY}px)`;
                    parallaxContent.style.transform = `translateY(${contentTranslateY}px)`;
                    parallaxContent.style.opacity = Math.max(opacity, 0.3); // Don't go completely transparent
                }
            }
            
            // Continue animation loop
            requestAnimFrame(updateParallax);
        }
        
        // Start animation loop
        updateParallax();
        
        // Add smooth transition class after initial load
        setTimeout(() => {
            parallaxImage.classList.add('loaded');
            parallaxContent.classList.add('loaded');
        }, 100);
    }
    
    // Fade-in animation for content sections using Intersection Observer
    if ('IntersectionObserver' in window) {
        const fadeElements = document.querySelectorAll('.about-section, .tools, .clients, .testimonials');
        
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    // Once the animation is complete, unobserve the element
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });
        
        // Observe all elements that should fade in
        fadeElements.forEach(element => {
            element.classList.add('fade-out'); // Start with the fade-out state
            fadeObserver.observe(element);
        });
    }
    
    // Add a parallax scroll effect to the hero image on mouse movement
    const parallaxContainer = document.querySelector('.about-hero-parallax');
    
    if (parallaxContainer) {
        parallaxContainer.addEventListener('mousemove', (e) => {
            // Only apply mouse parallax if we're not scrolled down
            if (window.scrollY < 100) {
                const xPos = (e.clientX / window.innerWidth - 0.5) * 20; // -10 to 10px
                const yPos = (e.clientY / window.innerHeight - 0.5) * 20; // -10 to 10px
                
                parallaxImage.style.transform = `translateX(${-xPos}px) translateY(${-yPos}px)`;
            }
        });
        
        // Reset position when mouse leaves
        parallaxContainer.addEventListener('mouseleave', () => {
            if (window.scrollY < 100) {
                parallaxImage.style.transform = 'translateX(0) translateY(0)';
            }
        });
    }
}); 