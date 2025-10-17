// menu.js - Sistema de Menú y Productos

// Definición de productos
const products = {
    // Dobladas individuales
    'doblada-res': { name: 'Doblada de Res', price: 18, category: 'dobladas' },
    'doblada-pollo': { name: 'Doblada de Pollo', price: 18, category: 'dobladas' },
    'doblada-cerdo': { name: 'Doblada de Cerdo', price: 18, category: 'dobladas' },
    'doblada-chile': { name: 'Doblada de Chile Relleno', price: 18, category: 'dobladas' },
    'doblada-queso': { name: 'Doblada de Queso', price: 18, category: 'dobladas' },
    'doblada-queso-jalapeno': { name: 'Doblada de Queso Jalapeño', price: 18, category: 'dobladas' },
    'doblada-queso-loroco': { name: 'Doblada de Queso Loroco', price: 18, category: 'dobladas' },
    
    // Bebidas
    'jamaica': { name: 'Jamaica Natural', price: 8, category: 'bebidas' },
    'horchata': { name: 'Horchata Casera', price: 8, category: 'bebidas' },
    'limonada': { name: 'Limonada Fresca', price: 8, category: 'bebidas' },
    'cocacola': { name: 'Coca Cola', price: 6, category: 'bebidas' },
    'sprite': { name: 'Sprite', price: 6, category: 'bebidas' },
    'fanta': { name: 'Fanta Naranja', price: 6, category: 'bebidas' },
    'agua': { name: 'Agua Pura', price: 4, category: 'bebidas' }
};

// Definición de combos
const combos = {
    'combo-doblao': {
        name: 'El Doblao',
        price: 39,
        description: '2 dobladas a tu elección + bebida + salsas',
        numDobladas: 2,
        includeDrink: true,
        includeExtras: true
    },
    'tacos-res': {
        name: 'Tacos de Res',
        price: 30,
        description: '3 tacos doble tortilla + salsas + limón y sal + bebida',
        type: 'tacos',
        meatType: 'res',
        numTacos: 3,
        includeDrink: true,
        includeExtras: true
    },
    'combo-individual': {
        name: 'Combo Individual',
        price: 25,
        description: '1 doblada a tu elección + bebida',
        numDobladas: 1,
        includeDrink: true,
        includeExtras: true
    },
    'tacos-cerdo': {
        name: 'Tacos de Cerdo',
        price: 25,
        description: '3 tacos doble tortilla + salsas + limón y sal + bebida',
        type: 'tacos',
        meatType: 'cerdo',
        numTacos: 3,
        includeDrink: true,
        includeExtras: true
    },
    'tacos-pollo': {
        name: 'Tacos de Pollo',
        price: 25,
        description: '3 tacos doble tortilla + salsas + limón y sal + bebida',
        type: 'tacos',
        meatType: 'pollo',
        numTacos: 3,
        includeDrink: true,
        includeExtras: true
    },
    'combo-triple': {
        name: 'El Triple Sabor',
        price: 56,
        description: '3 dobladas a tu elección + bebida + salsas',
        numDobladas: 3,
        includeDrink: true,
        includeExtras: true
    },
    'combo-taquero': {
        name: 'El Taquero',
        price: 80,
        description: '9 tacos (3 porciones) + 3 bebidas + salsas',
        type: 'tacos-multiple',
        numPorciones: 3,
        includeDrinks: 3,
        includeExtras: true
    },
    'combo-familiar': {
        name: 'Combo Familiar',
        price: 120,
        description: '6 dobladas a tu elección + 3 bebidas + salsas',
        numDobladas: 6,
        includeDrinks: 3,
        includeExtras: true
    }
};

// Opciones de extras
const extrasOptions = {
    extras: [
        { id: 'extra-queso', name: 'Extra Queso', price: 6 },
        { id: 'extra-carne', name: 'Extra Carne', price: 6 },
        { id: 'extra-salsas', name: 'Extra Salsa', price: 5 },
        { id: 'extra-picante', name: 'Extra Salsa Picante', price: 4 }
    ]
};

// Generar HTML del menú
function renderMenu() {
    const menuContainer = document.getElementById('menuContainer');
    if (!menuContainer) return;

    let html = '';

    // 🔥 PROMOCIONES ESPECIALES
    html += `
        <div class="menu-category">
            <div class="category-header promo-header">
                🔥 PROMOCIONES ESPECIALES
                <span style="float: right; font-size: 0.85rem; opacity: 0.95;">¡Los más vendidos!</span>
            </div>
            <div class="menu-grid">
    `;

    html += createComboCard('combo-doblao', combos['combo-doblao']);
    html += createComboCard('tacos-res', combos['tacos-res']);
    html += createComboCard('combo-taquero', combos['combo-taquero']);
    html += createComboCard('combo-familiar', combos['combo-familiar']);

    html += `</div></div>`;

    // 🍽️ COMBOS NORMALES
    html += `
        <div class="menu-category">
            <div class="category-header">
                🍽️ Combos Completos
            </div>
            <div class="menu-grid">
    `;

    html += createComboCard('combo-individual', combos['combo-individual']);
    html += createComboCard('combo-triple', combos['combo-triple']);
    html += createComboCard('tacos-cerdo', combos['tacos-cerdo']);
    html += createComboCard('tacos-pollo', combos['tacos-pollo']);

    html += `</div></div>`;

    // 🥙 DOBLADAS INDIVIDUALES
    html += `
        <div class="menu-category">
            <div class="category-header">
                🥙 Dobladas Individuales
                <span style="float: right; font-size: 0.9rem; opacity: 0.9;">Q18 c/u</span>
            </div>
            <div class="menu-grid menu-grid-items">
    `;

    Object.entries(products).forEach(([id, product]) => {
        if (product.category === 'dobladas') {
            html += createMenuItem(id, product);
        }
    });

    html += `</div></div>`;

    // 🥤 BEBIDAS
    html += `
        <div class="menu-category">
            <div class="category-header">
                🥤 Bebidas Refrescantes
            </div>
            <div class="menu-grid menu-grid-items">
    `;

    Object.entries(products).forEach(([id, product]) => {
        if (product.category === 'bebidas') {
            html += createMenuItem(id, product);
        }
    });

    html += `</div></div>`;

    menuContainer.innerHTML = html;
}

// Crear item individual del menú - TODO CLICKEABLE
function createMenuItem(id, product) {
    const imagePath = `assets/images/products/${id}.jpg`;
    return `
        <div class="menu-item" id="item-${id}" onclick="handleMenuItemClick('${id}')">
            <div class="menu-item-image">
                <img src="${imagePath}" 
                     alt="${product.name}" 
                     width="85" 
                     height="85"
                     loading="lazy"
                     onerror="this.onerror=null; this.src='assets/images/products/placeholder.jpg';">
            </div>
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <div>
                        <h4>${product.name}</h4>
                        <p>${getProductDescription(id)}</p>
                        <div class="price">Q${product.price}</div>
                    </div>
                </div>
            </div>
            <div class="quantity-controls" id="controls-${id}" onclick="event.stopPropagation()">
                <button class="qty-btn" onclick="changeQuantity('${id}', -1); event.stopPropagation();" aria-label="Disminuir cantidad">−</button>
                <div class="qty-display" id="qty-${id}">0</div>
                <button class="qty-btn" onclick="changeQuantity('${id}', 1); event.stopPropagation();" aria-label="Aumentar cantidad">+</button>
                <button class="clear-item-btn" onclick="clearItem('${id}'); event.stopPropagation();" aria-label="Eliminar item">🗑️</button>
            </div>
        </div>
    `;
}

// Crear tarjeta de combo - TODO CLICKEABLE (ARREGLADO)
function createComboCard(comboId, combo) {
    const imagePath = `assets/images/products/${comboId}.jpg`;
    return `
        <div class="combo-card" onclick="openComboModal('${comboId}')">
            <div class="menu-item-image combo-image">
                <img src="${imagePath}" 
                     alt="${combo.name}" 
                     width="100%" 
                     height="150"
                     loading="lazy"
                     onerror="this.onerror=null; this.src='assets/images/products/placeholder.jpg';">
                <div class="menu-item-badge combo-badge">Q${combo.price}</div>
            </div>
            <div class="menu-item-content">
                <h4>${combo.name}</h4>
                <p>${combo.description}</p>
                <button class="combo-btn" onclick="openComboModal('${comboId}'); event.stopPropagation();">
                    ✨ Personalizar Combo
                </button>
                <div id="${comboId}-combos-list" class="combo-added-list" onclick="event.stopPropagation()"></div>
            </div>
        </div>
    `;
}

// Obtener descripción del producto
function getProductDescription(id) {
    const descriptions = {
        'doblada-res': 'Deliciosa carne de res sazonada con especias tradicionales',
        'doblada-pollo': 'Pollo jugoso y bien sazonado con hierbas guatemaltecas',
        'doblada-cerdo': 'Cerdo tierno y sabroso con sazón especial',
        'doblada-chile': 'Chile relleno tradicional guatemalteco',
        'doblada-queso': 'Queso derretido cremoso y delicioso',
        'doblada-queso-jalapeno': 'Queso cremoso con un toque picante de jalapeño',
        'doblada-queso-loroco': 'Queso con loroco fresco, sabor auténtico guatemalteco',
        'jamaica': 'Refrescante bebida natural preparada del día',
        'horchata': 'Tradicional horchata guatemalteca preparada artesanalmente',
        'limonada': 'Natural y refrescante, perfecta para acompañar',
        'cocacola': 'Bien fría y refrescante',
        'sprite': 'Refrescante sabor lima-limón',
        'fanta': 'Delicioso sabor naranja burbujeante',
        'agua': 'Agua pura embotellada'
    };
    return descriptions[id] || '';
}

// Abrir modal de combo
function openComboModal(comboId) {
    const combo = combos[comboId];
    if (!combo) return;

    window.currentCombo = {
        id: comboId,
        ...combo
    };

    let html = `<p style="margin-bottom: 20px; text-align: center; color: var(--gray-600);">
        🎯 Personaliza tu <strong style="color: var(--primary-red);">${combo.name}</strong>
    </p>`;

    // El Taquero - Combo especial
    if (combo.type === 'tacos-multiple') {
        html += `
            <div class="modal-group combo-info">
                <p style="text-align: center; padding: 15px; background: var(--gray-100); border-radius: 10px; margin-bottom: 15px;">
                    🌮 <strong>9 Tacos (3 porciones de 3)</strong><br>
                    <span style="font-size: 0.85rem; color: var(--gray-600);">
                        Selecciona hasta 3 porciones. Cada porción trae 3 tacos
                    </span>
                </p>
            </div>
        `;

        html += `<div class="modal-group">
            <label>🌮 Porción 1 (3 tacos):</label>
            <select id="porcion0" class="modal-select">
                <option value="res">🥩 Tacos de Res</option>
                <option value="pollo">🍗 Tacos de Pollo</option>
                <option value="cerdo">🐷 Tacos de Cerdo</option>
            </select>
        </div>`;

        html += `<div class="modal-group">
            <label>🌮 Porción 2 (3 tacos):</label>
            <select id="porcion1" class="modal-select">
                <option value="res">🥩 Tacos de Res</option>
                <option value="pollo">🍗 Tacos de Pollo</option>
                <option value="cerdo">🐷 Tacos de Cerdo</option>
            </select>
        </div>`;

        html += `<div class="modal-group">
            <label>🌮 Porción 3 (3 tacos):</label>
            <select id="porcion2" class="modal-select">
                <option value="res">🥩 Tacos de Res</option>
                <option value="pollo">🍗 Tacos de Pollo</option>
                <option value="cerdo">🐷 Tacos de Cerdo</option>
            </select>
        </div>`;

        // 3 Bebidas
        for (let i = 0; i < 3; i++) {
            html += `
                <div class="modal-group">
                    <label>🥤 Bebida ${i + 1}:</label>
                    <select id="bebida${i}" class="modal-select">
                        <option value="jamaica">🟣 Jamaica Natural</option>
                        <option value="horchata">🤍 Horchata Casera</option>
                        <option value="limonada">🟡 Limonada Fresca</option>
                        <option value="cocacola">🔴 Coca Cola</option>
                        <option value="sprite">🟢 Sprite</option>
                        <option value="fanta">🟠 Fanta Naranja</option>
                        <option value="agua">💧 Agua Pura</option>
                    </select>
                </div>
            `;
        }
    }
    // Tacos simples
    else if (combo.type === 'tacos') {
        html += `
            <div class="modal-group combo-info">
                <p style="text-align: center; padding: 15px; background: var(--gray-100); border-radius: 10px;">
                    🌮 <strong>3 Tacos de ${combo.meatType.toUpperCase()}</strong><br>
                    <span style="font-size: 0.9rem; color: var(--gray-600);">
                        Doble tortilla, salsas incluidas, limón y sal
                    </span>
                </p>
            </div>
        `;
        
        html += `
            <div class="modal-group">
                <label>🥤 Bebida incluida:</label>
                <select id="bebida" class="modal-select">
                    <option value="jamaica">🟣 Jamaica Natural</option>
                    <option value="horchata">🤍 Horchata Casera</option>
                    <option value="limonada">🟡 Limonada Fresca</option>
                    <option value="cocacola">🔴 Coca Cola</option>
                    <option value="sprite">🟢 Sprite</option>
                    <option value="fanta">🟠 Fanta Naranja</option>
                    <option value="agua">💧 Agua Pura</option>
                </select>
            </div>
        `;
    }
    // Combos de dobladas
    else {
        for (let i = 0; i < combo.numDobladas; i++) {
            html += `
                <div class="modal-group">
                    <label>🥙 Doblada ${i + 1}:</label>
                    <select id="doblada${i}" class="modal-select">
                        <option value="res">🥩 Doblada de Res</option>
                        <option value="pollo">🍗 Doblada de Pollo</option>
                        <option value="cerdo">🐷 Doblada de Cerdo</option>
                        <option value="chile">🌶️ Doblada de Chile Relleno</option>
                        <option value="queso">🧀 Doblada de Queso</option>
                        <option value="queso-jalapeno">🌶️🧀 Doblada de Queso Jalapeño</option>
                        <option value="queso-loroco">🌿🧀 Doblada de Queso Loroco</option>
                    </select>
                </div>
            `;
        }

        // Bebidas (single o multiple)
        if (combo.includeDrinks) {
            for (let i = 0; i < combo.includeDrinks; i++) {
                html += `
                    <div class="modal-group">
                        <label>🥤 Bebida ${i + 1}:</label>
                        <select id="bebida${i}" class="modal-select">
                            <option value="jamaica">🟣 Jamaica Natural</option>
                            <option value="horchata">🤍 Horchata Casera</option>
                            <option value="limonada">🟡 Limonada Fresca</option>
                            <option value="cocacola">🔴 Coca Cola</option>
                            <option value="sprite">🟢 Sprite</option>
                            <option value="fanta">🟠 Fanta Naranja</option>
                            <option value="agua">💧 Agua Pura</option>
                        </select>
                    </div>
                `;
            }
        } else if (combo.includeDrink) {
            html += `
                <div class="modal-group">
                    <label>🥤 Bebida incluida:</label>
                    <select id="bebida" class="modal-select">
                        <option value="jamaica">🟣 Jamaica Natural</option>
                        <option value="horchata">🤍 Horchata Casera</option>
                        <option value="limonada">🟡 Limonada Fresca</option>
                        <option value="cocacola">🔴 Coca Cola</option>
                        <option value="sprite">🟢 Sprite</option>
                        <option value="fanta">🟠 Fanta Naranja</option>
                        <option value="agua">💧 Agua Pura</option>
                    </select>
                </div>
            `;
        }
    }

    // Extras opcionales
    if (combo.includeExtras) {
        html += `
            <div class="extras-group">
                <label style="margin-bottom: 15px; font-weight: 600; color: var(--gray-800);">
                    ✨ Extras opcionales:
                </label>
        `;

        extrasOptions.extras.forEach(extra => {
            html += `
                <div class="extra-option">
                    <input type="checkbox" id="${extra.id}" value="${extra.price}" class="extra-check">
                    <label for="${extra.id}" style="margin: 0; cursor: pointer;">
                        ${extra.name} - <strong>Q${extra.price}</strong>
                    </label>
                </div>
            `;
        });

        html += `</div>`;
    }

    document.getElementById('comboConfig').innerHTML = html;
    document.getElementById('comboModal').style.display = 'block';
}

// Guardar combo
function saveCombo() {
    if (!window.currentCombo) return;

    const combo = window.currentCombo;
    let comboData = {
        id: Date.now(),
        type: 'combo',
        comboId: combo.id,
        name: combo.name,
        price: combo.price,
        originalPrice: combo.price
    };

    // El Taquero - 3 porciones
    if (combo.type === 'tacos-multiple') {
        comboData.porciones = [];
        for (let i = 0; i < combo.numPorciones; i++) {
            const select = document.getElementById(`porcion${i}`);
            if (select) comboData.porciones.push(select.value);
        }
        
        comboData.bebidas = [];
        for (let i = 0; i < combo.includeDrinks; i++) {
            const bebidaSelect = document.getElementById(`bebida${i}`);
            if (bebidaSelect) comboData.bebidas.push(bebidaSelect.value);
        }
    }
    // Tacos simples
    else if (combo.type === 'tacos') {
        comboData.tacos = {
            type: combo.meatType,
            quantity: combo.numTacos
        };
        
        const bebidaSelect = document.getElementById('bebida');
        if (bebidaSelect) {
            comboData.bebida = bebidaSelect.value;
        }
    }
    // Dobladas
    else {
        comboData.dobladas = [];
        for (let i = 0; i < combo.numDobladas; i++) {
            const select = document.getElementById(`doblada${i}`);
            if (select) comboData.dobladas.push(select.value);
        }

        // Bebidas múltiples o única
        if (combo.includeDrinks) {
            comboData.bebidas = [];
            for (let i = 0; i < combo.includeDrinks; i++) {
                const bebidaSelect = document.getElementById(`bebida${i}`);
                if (bebidaSelect) comboData.bebidas.push(bebidaSelect.value);
            }
        } else if (combo.includeDrink) {
            const bebidaSelect = document.getElementById('bebida');
            if (bebidaSelect) {
                comboData.bebida = bebidaSelect.value;
            }
        }
    }

    // Extras
    comboData.extras = [];
    let extraPrice = 0;
    document.querySelectorAll('.extra-check:checked').forEach(checkbox => {
        const extraInfo = extrasOptions.extras.find(e => e.id === checkbox.id);
        if (extraInfo) {
            comboData.extras.push(extraInfo.name);
            extraPrice += extraInfo.price;
        }
    });

    comboData.extraPrice = extraPrice;
    comboData.price = combo.price + extraPrice;

    // Agregar al carrito
    window.order.push(comboData);
    closeModal();
    updateCart();
    showToast('🎉 ¡Combo agregado exitosamente!', 'success');
}

// Cerrar modal
function closeModal() {
    document.getElementById('comboModal').style.display = 'none';
    window.currentCombo = null;
}

// Inicializar menú al cargar
document.addEventListener('DOMContentLoaded', function() {
    renderMenu();
});

// Exportar funciones globales
window.products = products;
window.combos = combos;
window.extrasOptions = extrasOptions;
window.openComboModal = openComboModal;
window.saveCombo = saveCombo;
window.closeModal = closeModal;
