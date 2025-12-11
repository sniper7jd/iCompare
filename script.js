let specsData = null;

// Load specs and initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    // Determine category from current page
    const activeLink = document.querySelector('.tab-link.active');
    if (!activeLink) {
        console.error('No active tab link found');
        return;
    }
    const currentCategory = activeLink.textContent.trim();
    console.log('Current category:', currentCategory);
    
    fetch('specs.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load specs.json');
            return response.json();
        })
        .then(data => {
            specsData = data;
            console.log('Loaded data:', data.length, 'products');
            updateDropdowns(data, currentCategory);
            setupEventListeners();
        })
        .catch(error => {
            console.error('Error loading specs:', error);
            alert('Error loading product data. Check console for details.');
        });
}

function setupEventListeners() {
    const s1 = document.getElementById('model-selector-1');
    const s2 = document.getElementById('model-selector-2');
    
    // Remove existing listeners by cloning
    const newS1 = s1.cloneNode(true);
    const newS2 = s2.cloneNode(true);
    s1.parentNode.replaceChild(newS1, s1);
    s2.parentNode.replaceChild(newS2, s2);
    
    newS1.addEventListener('change', showComparison);
    newS2.addEventListener('change', showComparison);
}

// Update dropdowns
function updateDropdowns(data, category) {
    const products = data.filter(p => p.category === category);
    console.log(`Found ${products.length} products for category: ${category}`);
    
    const s1 = document.getElementById('model-selector-1');
    const s2 = document.getElementById('model-selector-2');
    
    if (!s1 || !s2) {
        console.error('Dropdown elements not found');
        return;
    }
    
    // Clear dropdowns
    while (s1.options.length > 0) {
        s1.remove(0);
    }
    while (s2.options.length > 0) {
        s2.remove(0);
    }
    
    // Add default option
    const defaultOpt1 = document.createElement('option');
    defaultOpt1.value = '';
    defaultOpt1.textContent = 'Choose a model';
    s1.appendChild(defaultOpt1);
    
    const defaultOpt2 = document.createElement('option');
    defaultOpt2.value = '';
    defaultOpt2.textContent = 'Choose a model';
    s2.appendChild(defaultOpt2);
    
    // Add product options
    products.forEach(p => {
        const opt1 = document.createElement('option');
        opt1.value = p.id;
        opt1.textContent = p.model;
        s1.appendChild(opt1);
        
        const opt2 = document.createElement('option');
        opt2.value = p.id;
        opt2.textContent = p.model;
        s2.appendChild(opt2);
    });
    
    console.log(`Populated ${s1.options.length - 1} options in dropdown 1`);
    console.log(`Populated ${s2.options.length - 1} options in dropdown 2`);
}

// Show comparison
function showComparison() {
    if (!specsData) return;
    
    const id1 = document.getElementById('model-selector-1').value;
    const id2 = document.getElementById('model-selector-2').value;
    const section = document.getElementById('compare-section');
    
    if (!id1 && !id2) {
        section.innerHTML = '';
        return;
    }
    
    const p1 = id1 ? specsData.find(p => p.id === id1) : null;
    const p2 = id2 ? specsData.find(p => p.id === id2) : null;
    
    section.innerHTML = `
        <div class="products-comparison">
            ${p1 ? createCard(p1) : '<div class="product-column"><div class="placeholder">Choose a model</div></div>'}
            ${p1 && p2 ? '<div class="vs-divider"><span>vs</span></div>' : ''}
            ${p2 ? createCard(p2) : '<div class="product-column"><div class="placeholder">Choose a model</div></div>'}
        </div>
    `;
}

// Create product card
function createCard(p) {
    return `
        <div class="product-column">
            <div class="product-card">
                <img src="${p.image}" alt="${p.model}" class="product-image">
                <h2 class="product-name">${p.model}</h2>
                <p class="product-release">${p.release_date}</p>
                <table class="specs-table">
                    <tr><td>Display</td><td>${p.display}</td></tr>
                    <tr><td>Processor</td><td>${p.processor}</td></tr>
                    <tr><td>Graphics</td><td>${p.graphics}</td></tr>
                    <tr><td>Memory</td><td>${p.ram}</td></tr>
                    <tr><td>Storage</td><td>${p.storage}</td></tr>
                    <tr><td>Original OS</td><td>${p.os_original}</td></tr>
                    <tr><td>Latest OS</td><td>${p.os_max}</td></tr>
                    <tr><td>Battery</td><td>${p.battery}</td></tr>
                    <tr><td>Rear Camera</td><td>${p.camera_rear}</td></tr>
                    <tr><td>Front Camera</td><td>${p.camera_front}</td></tr>
                </table>
            </div>
        </div>
    `;
}
