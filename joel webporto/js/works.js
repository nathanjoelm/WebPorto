// Load works data
async function loadWorks() {
    try {
        const response = await fetch('assets/works/metadata/works.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading works:', error);
        return { works: [], categories: [] };
    }
}

// Initialize the work page
async function initWorkPage() {
    const data = await loadWorks();
    setupCategories(data.categories);
    setupFeaturedWorks(data.works);
    setupWorksGrid(data.works);
    setupMoreProjects(data.works);
    initParallax();
}

// Setup category filters
function setupCategories(categories) {
    const filterContainer = document.getElementById('categoryFilters');
    if (!filterContainer) return;

    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.addEventListener('click', () => filterWorks(category));
        if (category === 'All') button.classList.add('active');
        filterContainer.appendChild(button);
    });
}

// Filter works by category
function filterWorks(category) {
    const buttons = document.querySelectorAll('.category-filters button');
    buttons.forEach(btn => btn.classList.toggle('active', btn.textContent === category));

    const works = document.querySelectorAll('.work-item');
    works.forEach(work => {
        const workCategory = work.dataset.category;
        work.style.display = (category === 'All' || workCategory === category) ? 'block' : 'none';
    });
}

// Create work item element
function createWorkItem(work) {
    const workItem = document.createElement('div');
    workItem.className = 'work-item';
    workItem.dataset.category = work.category;

    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'work-item-media';

    // Create thumbnail image
    const img = document.createElement('img');
    img.src = work.thumbnail;
    img.alt = work.title;
    mediaContainer.appendChild(img);

    // Create video element
    const video = document.createElement('video');
    video.src = work.video;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    mediaContainer.appendChild(video);

    // Create info overlay
    const info = document.createElement('div');
    info.className = 'work-item-info';
    info.innerHTML = `
        <h3>${work.title}</h3>
        <p>${work.description}</p>
    `;

    workItem.appendChild(mediaContainer);
    workItem.appendChild(info);

    // Add hover effects
    workItem.addEventListener('mouseenter', () => {
        video.play();
    });

    workItem.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
    });

    // Add click handler
    workItem.addEventListener('click', () => {
        window.location.href = work.link;
    });

    return workItem;
}

// Setup featured works section
function setupFeaturedWorks(works) {
    const container = document.getElementById('featuredWorks');
    if (!container) return;

    const featuredWorks = works.filter(work => work.featured);
    featuredWorks.forEach(work => {
        container.appendChild(createWorkItem(work));
    });
}

// Setup main works grid
function setupWorksGrid(works) {
    const container = document.getElementById('worksGrid');
    if (!container) return;

    works.forEach(work => {
        container.appendChild(createWorkItem(work));
    });
}

// Setup more projects section
function setupMoreProjects(works) {
    const container = document.getElementById('moreProjects');
    if (!container) return;

    const nonFeaturedWorks = works.filter(work => !work.featured).slice(0, 3);
    nonFeaturedWorks.forEach(work => {
        container.appendChild(createWorkItem(work));
    });
}

// Initialize parallax effect
function initParallax() {
    const parallaxSections = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        parallaxSections.forEach(section => {
            const distance = window.pageYOffset;
            const background = section.querySelector('.parallax-bg');
            background.style.transform = `translateY(${distance * 0.5}px)`;
        });
    });
}

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all project sections
document.querySelectorAll('.project-section').forEach(section => {
    observer.observe(section);
});

// Parallax effect on scroll
let ticking = false;
const projectImages = document.querySelectorAll('.project-image');

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            projectImages.forEach(image => {
                const rect = image.getBoundingClientRect();
                const parentRect = image.parentElement.getBoundingClientRect();
                
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                    const translateY = Math.min(50, Math.max(-50, (scrollPercent - 0.5) * 100));
                    image.style.transform = `scale(1.1) translateY(${translateY}px)`;
                }
            });
            ticking = false;
        });
        ticking = true;
    }
});

// Split hero animation
const splitShape = document.querySelector('.split-shape');
let lastScrollY = window.pageYOffset;

window.addEventListener('scroll', () => {
    const currentScrollY = window.pageYOffset;
    const scrollDiff = currentScrollY - lastScrollY;
    
    if (splitShape) {
        const rotation = Math.min(30, Math.max(-30, scrollDiff));
        splitShape.style.transform = `skewX(-20deg) rotate(${rotation}deg)`;
    }
    
    lastScrollY = currentScrollY;
});

// Smooth scroll for anchor links
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

// Initialize on load
window.addEventListener('load', () => {
    // Add visible class to first project section
    const firstProject = document.querySelector('.project-section');
    if (firstProject) {
        firstProject.classList.add('visible');
    }
});

// Scroll arrow rotation
const scrollArrow = document.querySelector('.scroll-arrow svg');
let lastScrollPosition = window.pageYOffset;
const maxRotation = 90; // Maximum rotation in degrees

window.addEventListener('scroll', () => {
    if (scrollArrow) {
        const currentScroll = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const scrollPercentage = Math.min(currentScroll / windowHeight, 1);
        
        // Calculate rotation based on scroll percentage
        const rotation = scrollPercentage * maxRotation;
        
        // Apply rotation transform
        scrollArrow.style.transform = `rotate(${rotation}deg)`;
        
        // Update last scroll position
        lastScrollPosition = currentScroll;
    }
});

// Add click handler to scroll to next section
document.querySelector('.scroll-arrow').addEventListener('click', () => {
    const nextSection = document.querySelector('.featured-work');
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
    }
});

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', initWorkPage);

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('workSearch');
    const filterTags = document.querySelectorAll('.filter-tag');
    const workItems = document.querySelectorAll('.work-item');
    let currentCategory = 'all';

    // Search functionality
    searchInput.addEventListener('input', filterWorks);

    // Filter tag functionality
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Update active state
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            
            // Update current category and filter works
            currentCategory = tag.dataset.category;
            filterWorks();
        });
    });

    function filterWorks() {
        const searchTerm = searchInput.value.toLowerCase();

        workItems.forEach(item => {
            const category = item.dataset.category;
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            const itemCategory = item.querySelector('.work-category').textContent.toLowerCase();

            const matchesSearch = title.includes(searchTerm) || 
                                description.includes(searchTerm) || 
                                itemCategory.includes(searchTerm);
            
            const matchesCategory = currentCategory === 'all' || category === currentCategory;

            if (matchesSearch && matchesCategory) {
                item.style.display = '';
                // Add fade-in animation
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.opacity = '1';
                }, 50);
            } else {
                item.style.display = 'none';
            }
        });

        // Check if no results found
        const visibleItems = Array.from(workItems).filter(item => item.style.display !== 'none');
        const noResultsMessage = document.querySelector('.no-results');
        
        if (visibleItems.length === 0) {
            if (!noResultsMessage) {
                const message = document.createElement('div');
                message.className = 'no-results';
                message.innerHTML = `
                    <p>No works found matching your search.</p>
                    <button onclick="clearSearch()">Clear Search</button>
                `;
                document.querySelector('.works-grid').appendChild(message);
            }
        } else if (noResultsMessage) {
            noResultsMessage.remove();
        }
    }

    // Function to clear search
    window.clearSearch = function() {
        searchInput.value = '';
        filterTags.forEach(t => {
            if (t.dataset.category === 'all') {
                t.classList.add('active');
            } else {
                t.classList.remove('active');
            }
        });
        currentCategory = 'all';
        filterWorks();
    }

    // Add smooth transitions for work items
    workItems.forEach(item => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });

    // Initialize with all items visible
    filterWorks();
}); 