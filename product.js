document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    // Use global products array from products-data.js

    // Find the current product
    const currentProduct = products.find(product => product.id == productId);

    if (!currentProduct) {
        // Redirect if product not found
        window.location.href = 'gallery.html';
        return;
    }

    // Load product data into the page
    loadProductData(currentProduct);

    // Initialize product gallery
    initProductGallery(currentProduct);

    // Load related products
    loadRelatedProducts(currentProduct);

    // Add to cart functionality
    setupAddToCart(currentProduct);

    // Preview modal functionality
    setupPreviewModal(currentProduct);
});

function loadProductData(product) {
    // Title
    document.querySelector('.product-title').textContent = product.title;
    // Category
    document.querySelector('.product-category').textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
    // Rating
    document.querySelector('.product-rating').innerHTML =
        `<i class="fas fa-star"></i> ${product.rating} (${product.reviews} reviews)`;
    // Price, old price, discount
    const priceEl = document.querySelector('.product-price');
    const oldPriceEl = document.querySelector('.old-price');
    const discountEl = document.querySelector('.discount');
    priceEl.textContent = `$${product.price.toFixed(2)}`;
    if (product.oldPrice && product.oldPrice > product.price) {
        oldPriceEl.textContent = `$${product.oldPrice.toFixed(2)}`;
        const discount = Math.round(100 - (product.price / product.oldPrice) * 100);
        discountEl.textContent = `${discount}% OFF`;
    } else {
        oldPriceEl.textContent = '';
        discountEl.textContent = '';
    }
    // Description
    document.querySelector('.product-description').textContent = product.description;
    // Features
    const featuresList = document.querySelector('.features-list');
    featuresList.innerHTML = product.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('');
    // Details (example: you can expand this as needed)
    document.querySelector('.product-details').innerHTML = `
        <div class="detail-item"><h3><i class="fas fa-file-archive"></i> File Includes</h3><p>${product.features.join(', ')}</p></div>
        <div class="detail-item"><h3><i class="fas fa-desktop"></i> Compatibility</h3><p>${product.category}</p></div>
    `;
}

function initProductGallery(product) {
    const mainVideoContainer = document.querySelector('.main-video');
    const thumbnailContainer = document.querySelector('.product-thumbnails');
    // Main video or image
    if (product.previewVideo) {
        mainVideoContainer.innerHTML = `<video controls autoplay muted><source src="${product.previewVideo}" type="video/mp4"></video>`;
    } else if (product.image) {
        mainVideoContainer.innerHTML = `<img src="${product.image}" alt="${product.title}" />`;
    } else {
        mainVideoContainer.innerHTML = '';
    }
    // Thumbnails
    thumbnailContainer.innerHTML = '';
    if (product.gallery && product.gallery.length > 0) {
        product.gallery.forEach((src, idx) => {
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail';
            thumb.innerHTML = src.endsWith('.mp4')
                ? `<video muted><source src="${src}" type="video/mp4"></video>`
                : `<img src="${src}" alt="${product.title} Preview ${idx + 1}">`;
            thumb.addEventListener('click', () => {
                if (src.endsWith('.mp4')) {
                    mainVideoContainer.innerHTML = `<video controls autoplay muted><source src="${src}" type="video/mp4"></video>`;
                } else {
                    mainVideoContainer.innerHTML = `<img src="${src}" alt="${product.title} Preview ${idx + 1}" />`;
                }
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
            thumbnailContainer.appendChild(thumb);
        });
    }
}

function loadRelatedProducts(currentProduct) {
    const relatedProductsContainer = document.querySelector('.related-products-grid');
    if (!relatedProductsContainer) return;

    // Filter products from same category (excluding current product)
    const relatedProducts = products.filter(
        product => product.category === currentProduct.category && product.id !== currentProduct.id
    ).slice(0, 4); // Get max 4 related products

    if (relatedProducts.length === 0) {
        relatedProductsContainer.parentElement.style.display = 'none';
        return;
    }

    // Create product cards
    relatedProductsContainer.innerHTML = relatedProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.mainImage}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h4 class="product-title">${product.title}</h4>
                <div class="product-price">$${product.discountedPrice ? product.discountedPrice.toFixed(2) : product.price.toFixed(2)}</div>
                <a href="product.html?id=${product.id}" class="btn-view-product">View Product</a>
            </div>
        </div>
    `).join('');
}

function setupAddToCart(product) {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const quantityInput = document.querySelector('.quantity-input');

    if (!addToCartBtn) return;

    addToCartBtn.addEventListener('click', function() {
        const quantity = parseInt(quantityInput.value) || 1;
        
        // Get existing cart from localStorage or create new one
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product already in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: product.discountedPrice || product.price,
                image: product.mainImage,
                quantity: quantity
            });
        }
        
        // Save back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count in header
        updateCartCount();
        
        // Show confirmation
        showAddToCartConfirmation(product.title, quantity);
    });
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

function showAddToCartConfirmation(productTitle, quantity) {
    const confirmation = document.createElement('div');
    confirmation.className = 'add-to-cart-confirmation';
    confirmation.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Added ${quantity} ${quantity > 1 ? 'items' : 'item'} of "${productTitle}" to your cart</span>
    `;
    
    document.body.appendChild(confirmation);
    
    setTimeout(() => {
        confirmation.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        confirmation.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(confirmation);
        }, 300);
    }, 3000);
}

function setupPreviewModal(product) {
    const previewBtn = document.querySelector('.preview-btn');
    const modal = document.querySelector('.preview-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalContent = document.querySelector('.modal-content');

    if (!previewBtn || !product.previewVideo) {
        if (previewBtn) previewBtn.style.display = 'none';
        return;
    }

    previewBtn.addEventListener('click', () => {
        openPreviewModal(product.previewVideo, true);
    });

    modalClose.addEventListener('click', () => {
        closePreviewModal();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePreviewModal();
        }
    });

    function openPreviewModal(src, isVideo) {
        if (isVideo) {
            modalContent.innerHTML = `
                <video controls autoplay>
                    <source src="${src}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
        } else {
            modalContent.innerHTML = `<img src="${src}" alt="Product Preview">`;
        }
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closePreviewModal() {
        // Pause any video that's playing
        const video = modalContent.querySelector('video');
        if (video) {
            video.pause();
        }
        
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Initialize cart count on page load
updateCartCount();

// Header scroll behavior
// Add this to your existing JavaScript (gallery.js or product.js)
let lastScrollPosition = 0;
const header = document.querySelector('.gallery-header');
const scrollThreshold = 100; // How far to scroll before hiding
const headerHeight = header.offsetHeight;

// Set initial body padding to prevent content jump
document.body.style.paddingTop = `${headerHeight}px`;

window.addEventListener('scroll', function() {
    const currentScrollPosition = window.pageYOffset;
    
    // At top of page - always show
    if (currentScrollPosition <= 0) {
        header.style.transform = 'translateY(0)';
        return;
    }
    
    // Scroll down - hide header
    if (currentScrollPosition > lastScrollPosition && currentScrollPosition > scrollThreshold) {
        header.style.transform = `translateY(-${headerHeight}px)`;
    } 
    // Scroll up - show header
    else if (currentScrollPosition < lastScrollPosition) {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollPosition = currentScrollPosition;
});

// Handle resize to maintain proper header height
window.addEventListener('resize', function() {
    const newHeight = header.offsetHeight;
    document.body.style.paddingTop = `${newHeight}px`;
});
