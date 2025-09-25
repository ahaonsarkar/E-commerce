document.addEventListener('DOMContentLoaded', () => {
    const homePage = document.getElementById('home-page');
    const productsPage = document.getElementById('products-page');
    const productDetailPage = document.getElementById('product-detail-page');
    const cartPage = document.getElementById('cart-page');
    const checkoutPage = document.getElementById('checkout-page');
    const paymentPage = document.getElementById('payment-page');
    const orderPlacedPage = document.getElementById('order-placed-page');

    const backButton = document.getElementById('back-button');
    const categoryGrid = document.getElementById('category-section');
    const productList = document.getElementById('product-list');
    const productDetailContainer = document.getElementById('product-detail-container');
    const categoryTitle = document.getElementById('category-title');
    const cartCountSpan = document.getElementById('cart-count');
    const homeLink = document.getElementById('home-link');
    const cartIconContainer = document.getElementById('cart-icon-container');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const slides = document.querySelectorAll('.carousel-slide');
    
    // Checkout Page Elements
    const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout');
    const proceedToPaymentBtn = document.getElementById('proceed-to-payment');
    const summaryItemsContainer = document.getElementById('summary-items');
    const grandTotalSpan = document.getElementById('grand-total');

    // Payment Page Elements
    const buyNowBtn = document.getElementById('buy-now');

    let currentSlide = 0;
    let currentView = 'home';
    let lastViewBeforeCart = 'home-page';
    let cart = []; // The data structure to store our cart items
    const DELIVERY_CHARGE = 50;

    // --- Banner Carousel Logic ---
    function showSlide(index) {
        slides.forEach((slide) => {
            slide.classList.remove('active');
        });
        slides[index].classList.add('active');
    }

    function autoSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    setInterval(autoSlide, 5000); // Change slide every 5 seconds

    // --- Product Data ---
    const products = {
        'apparel': [
            { id: 'apparel-1', name: 'Cool T-Shirt', price: 25.00, description: 'A comfortable and stylish t-shirt made from 100% organic cotton. Perfect for any casual occasion.', image: 'https://placehold.co/400x400/1a1a1a/fff?text=T-Shirt' },
            { id: 'apparel-2', name: 'Cozy Hoodie', price: 45.00, description: 'Stay warm and fashionable with this soft, fleece-lined hoodie. Features a front pocket and adjustable hood.', image: 'https://placehold.co/400x400/1a1a1a/fff?text=Hoodie' }
        ],
        'home-goods': [
            { id: 'home-1', name: 'Stylish Mug', price: 15.00, description: 'Enjoy your morning coffee in this elegant, minimalist mug. Dishwasher safe and microwave friendly.', image: 'https://placehold.co/400x400/f0f2f5/333?text=Mug' },
            { id: 'home-2', name: 'Ceramic Vase', price: 30.00, description: 'A beautiful hand-crafted vase to add a touch of sophistication to your home decor.', image: 'https://placehold.co/400x400/d1d5db/4b5563?text=Vase' }
        ],
        'electronics': [
            { id: 'elec-1', name: 'Wireless Headphones', price: 99.00, description: 'High-fidelity audio with a comfortable, over-ear design. Features noise cancellation and long battery life.', image: 'https://placehold.co/400x400/ff5722/fff?text=Headphones' },
            { id: 'elec-2', name: 'Smart Speaker', price: 75.00, description: 'Control your smart home and play music with simple voice commands. A must-have for any modern home.', image: 'https://placehold.co/400x400/ff5722/fff?text=Speaker' }
        ]
    };

    // --- Navigation Logic ---
    function showView(viewId) {
        const allViews = [homePage, productsPage, productDetailPage, cartPage, checkoutPage, paymentPage, orderPlacedPage];
        allViews.forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(viewId).classList.add('active');
        
        if (viewId === 'home-page') {
            backButton.style.display = 'none';
        } else {
            backButton.style.display = 'block';
        }
        currentView = viewId;
    }

    // Handles the back button functionality
    backButton.addEventListener('click', () => {
        if (currentView === 'products-page') {
            showView('home-page');
        } else if (currentView === 'product-detail-page') {
            showView('products-page');
        } else if (currentView === 'cart-page') {
            showView(lastViewBeforeCart);
        } else if (currentView === 'checkout-page') {
            showView('cart-page');
        } else if (currentView === 'payment-page') {
            showView('checkout-page');
        }
    });

    // Handles the Home link in the header
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showView('home-page');
    });
    
    // Open the cart page when the cart icon is clicked
    cartIconContainer.addEventListener('click', () => {
        lastViewBeforeCart = currentView; // Store the current view before going to the cart
        renderCart();
        showView('cart-page');
    });

    // --- Event Listeners ---
    
    // Go to checkout page from cart
    proceedToCheckoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            renderCheckoutSummary();
            showView('checkout-page');
        } else {
            alert('Your cart is empty. Please add some products first.');
        }
    });
    
    // Go to payment page from checkout
    proceedToPaymentBtn.addEventListener('click', () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        
        if (name && email && address) {
            showView('payment-page');
        } else {
            alert('Please fill out all customer information fields.');
        }
    });
    
    // Finalize order
    buyNowBtn.addEventListener('click', () => {
        showView('order-placed-page');
    });


    // Category card click handler
    categoryGrid.addEventListener('click', (event) => {
        const categoryCard = event.target.closest('.category-card');
        if (categoryCard) {
            const category = categoryCard.dataset.category;
            const productsInCategory = products[category];
            
            categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
            renderProducts(productsInCategory);
            showView('products-page');
        }
    });

    // Product card click handler
    productList.addEventListener('click', (event) => {
        const productCard = event.target.closest('.product-card');
        const addToCartBtn = event.target.closest('.add-to-cart');

        if (addToCartBtn) {
            event.stopPropagation(); // Prevent the parent card click
            const productId = addToCartBtn.dataset.id;
            const productData = getProductDataById(productId);
            if (productData) {
                addToCart(productData);
            }
        } else if (productCard) {
            const productId = productCard.dataset.id;
            const productData = getProductDataById(productId);
            if (productData) {
                renderProductDetail(productData);
                showView('product-detail-page');
            }
        }
    });
    
    // Add to cart button on the detail page
    productDetailContainer.addEventListener('click', (event) => {
        const addToCartBtn = event.target.closest('.add-to-cart');
        if (addToCartBtn) {
            const productId = addToCartBtn.dataset.id;
            const productData = getProductDataById(productId);
            if (productData) {
                addToCart(productData);
            }
        }
    });

    // Handle quantity and remove buttons on the cart page
    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        const cartItem = target.closest('.cart-item');
        if (!cartItem) return;

        const productId = cartItem.dataset.id;

        if (target.classList.contains('increase-btn')) {
            changeQuantity(productId, 1);
        } else if (target.classList.contains('decrease-btn')) {
            changeQuantity(productId, -1);
        } else if (target.classList.contains('remove-btn')) {
            removeFromCart(productId);
        }
    });

    // --- Cart Logic Functions ---
    function addToCart(productData) {
        const existingItem = cart.find(item => item.id === productData.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...productData, quantity: 1 });
        }
        updateCartCount();
        console.log(`Added "${productData.name}" to cart. Cart:`, cart);
    }

    function changeQuantity(productId, amount) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += amount;
            if (item.quantity <= 0) {
                removeFromCart(productId);
            }
        }
        updateCartCount();
        renderCart();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartCount();
        renderCart();
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
            cartTotalSpan.textContent = '₹0.00';
            return;
        }

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.dataset.id = item.id;
            total += item.price * item.quantity;
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>₹${item.price.toFixed(2)}</p>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease-btn">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase-btn">+</button>
                </div>
                <button class="remove-btn">Remove</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
        cartTotalSpan.textContent = `₹${total.toFixed(2)}`;
    }
    
    // --- New Checkout Logic Functions ---
    function renderCheckoutSummary() {
        summaryItemsContainer.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            const summaryItem = document.createElement('div');
            summaryItem.classList.add('summary-item');
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            summaryItem.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>₹${itemTotal.toFixed(2)}</span>
            `;
            summaryItemsContainer.appendChild(summaryItem);
        });
        
        const grandTotal = subtotal + DELIVERY_CHARGE;
        grandTotalSpan.textContent = `₹${grandTotal.toFixed(2)}`;
    }

    // --- Helper Functions ---
    function renderProducts(products) {
        productList.innerHTML = ''; // Clear previous products
        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.dataset.id = product.id;
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">₹${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            `;
            productList.appendChild(card);
        });
    }

    function renderProductDetail(product) {
        productDetailContainer.innerHTML = `
            <img class="product-detail-image" src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h2>${product.name}</h2>
                <p class="price">₹${product.price.toFixed(2)}</p>
                <p>${product.description}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
    }

    function getProductDataById(productId) {
        for (const category in products) {
            const product = products[category].find(p => p.id === productId);
            if (product) {
                return product;
            }
        }
        return null;
    }
});
