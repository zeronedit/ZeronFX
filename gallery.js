// --- Splash Screen ---
const splashScreen = document.getElementById('splash-screen');
if (splashScreen) {
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 500); // Match the transition duration
    }, 2000); // Show splash screen for 2 seconds
}
document.addEventListener('DOMContentLoaded', function() {
    // Use global products array from products-data.js

    // Load products into the grid
    const productGrid = document.querySelector('.product-grid');
    
    products.forEach(product => {
        const productLink = document.createElement('a');
        productLink.href = `product.html?id=${product.id}`;
        productLink.className = 'product-card-link';

        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h4 class="product-title">${product.title}</h4>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price}</div>
            </div>
        `;
        
        productLink.appendChild(productCard);
        productGrid.appendChild(productLink);
    });

    // Hero video animation
    const heroVideo = document.getElementById('hero-video');
    // In a real implementation, you would replace this with your actual video element
    heroVideo.innerHTML = `
        <video autoplay loop muted playsinline>
            <source src="your-showcase-video.mp4" type="video/mp4">
        </video>
        <div class="video-overlay"></div>
    `;

    // Category hover effects
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.category-icon');
            icon.style.transform = 'scale(1.1)';
            icon.style.backgroundColor = 'var(--primary-color)';
            icon.style.color = 'white';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.category-icon');
            icon.style.transform = 'scale(1)';
            icon.style.backgroundColor = 'white';
            icon.style.color = 'var(--primary-color)';
        });
        
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            // Filter products by category in a real implementation
            console.log(`Filtering by ${category}`);
        });
    });

    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = e.target.getAttribute('data-id');
            const product = products.find(p => p.id == productId);
            
            // In a real implementation, you would add this to a cart array or send to a server
            console.log(`Added to cart: ${product.title}`);
            
            // Visual feedback
            e.target.textContent = 'Added!';
            e.target.style.backgroundColor = 'var(--accent-color)';
            
            setTimeout(() => {
                e.target.textContent = 'Add to Cart';
                e.target.style.backgroundColor = 'var(--primary-color)';
            }, 1500);
        }
    });

    // Search functionality
    const searchInput = document.querySelector('.search-container input');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            const description = card.querySelector('.product-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Testimonial slider - in a real implementation you would fetch real testimonials
    const testimonials = [
        {
            quote: "These templates have saved me so much time on client projects. The quality is amazing!",
            author: "Alex M., Video Editor"
        },
        {
            quote: "I've purchased from many template sites, but this one stands out for its creativity.",
            author: "Jamie T., Content Creator"
        },
        {
            quote: "The customer support is fantastic. Helped me customize a template for my specific needs.",
            author: "Sam R., YouTuber"
        }
    ];
    
    const testimonialSlider = document.querySelector('.testimonial-slider');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonialSlider.innerHTML = `
            <div class="testimonial">
                <p class="quote">"${testimonials[index].quote}"</p>
                <p class="author">- ${testimonials[index].author}</p>
            </div>
        `;
    }
    
    showTestimonial(currentTestimonial);
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
});