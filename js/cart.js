// cart.js - Sistema de Carrito de Compras Mejorado

window.order = [];
window.itemQuantities = {};

function initializeQuantities() {
    Object.keys(window.products).forEach(id => {
        window.itemQuantities[id] = 0;
    });
}

function changeQuantity(productId, change) {
    const currentQty = window.itemQuantities[productId] || 0;
    const newQty = Math.max(0, currentQty + change);
    
    window.itemQuantities[productId] = newQty;
    updateOrderFromQuantities();
    updateUI();
    
    // Animación del carrito
    if (change > 0) {
        const cartSummary = document.querySelector('.cart-summary');
        cartSummary?.classList.add('pulse-animation');
        setTimeout(() => cartSummary?.classList.remove('pulse-animation'), 400);
    }
}

function clearItem(productId) {
    window.itemQuantities[productId] = 0;
    updateOrderFromQuantities();
    updateUI();
}

function updateOrderFromQuantities() {
    window.order = window.order.filter(item => item.type === 'combo');
    
    Object.keys(window.itemQuantities).forEach(productId => {
        const qty = window.itemQuantities[productId];
        if (qty > 0) {
            const product = window.products[productId];
            for (let i = 0; i < qty; i++) {
                window.order.push({
                    id: productId + '_' + Date.now() + '_' + i,
                    type: 'item',
                    productId: productId,
                    name: product.name,
                    price: product.price,
                    quantity: 1
                });
            }
        }
    });
}

function updateUI() {
    Object.keys(window.products).forEach(productId => {
        const qty = window.itemQuantities[productId];
        const qtyDisplay = document.getElementById(`qty-${productId}`);
        const controls = document.getElementById(`controls-${productId}`);
        const menuItem = document.getElementById(`item-${productId}`);
        
        if (qtyDisplay && controls && menuItem) {
            qtyDisplay.textContent = qty;
            
            if (qty > 0) {
                controls.style.display = 'flex';
                menuItem.classList.add('selected');
            } else {
                controls.style.display = 'none';
                menuItem.classList.remove('selected');
            }
        }
    });
    
    updateCart();
}

function handleMenuItemClick(productId) {
    const currentQty = window.itemQuantities[productId] || 0;
    if (currentQty === 0) {
        changeQuantity(productId, 1);
    }
}

function updateCart() {
    const itemsCount = document.getElementById('cartItemsCount');
    const totalSpan = document.getElementById('cartTotal');
    const whatsappBtn = document.getElementById('whatsappBtn');
    
    const totalItems = window.order.length;
    const subtotalProductos = window.order.reduce((sum, item) => sum + item.price, 0);
    
    if (totalItems === 0) {
        itemsCount.textContent = '🛒 Tu carrito está vacío';
        whatsappBtn.disabled = true;
        totalSpan.textContent = 'Q0';
    } else {
        itemsCount.textContent = totalItems === 1 
            ? '🎉 1 delicioso item agregado' 
            : `🎉 ${totalItems} deliciosos items agregados`;
        
        whatsappBtn.disabled = false;
        totalSpan.textContent = `Q${subtotalProductos}`;
    }
    
    updateComboLists();
}

function updateComboLists() {
    const combosByType = {};
    
    window.order.forEach(item => {
        if (item.type === 'combo') {
            if (!combosByType[item.comboId]) {
                combosByType[item.comboId] = [];
            }
            combosByType[item.comboId].push(item);
        }
    });
    
    Object.keys(window.combos).forEach(comboId => {
        const listElement = document.getElementById(`${comboId}-combos-list`);
        if (listElement) {
            listElement.innerHTML = '';
            const combosOfType = combosByType[comboId] || [];
            
            combosOfType.forEach((combo, index) => {
                const comboDiv = document.createElement('div');
                comboDiv.className = 'combo-added-item';
                comboDiv.innerHTML = `
                    <span>✅ Combo #${index + 1} - Q${combo.price}</span>
                    <button class="remove-combo-btn" onclick="removeCombo(${combo.id})">✖️ Quitar</button>
                `;
                listElement.appendChild(comboDiv);
            });
        }
    });
}

function removeCombo(comboId) {
    window.order = window.order.filter(item => item.id !== comboId);
    updateCart();
    
    // Actualizar el resumen del checkout si está abierto
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal && checkoutModal.style.display === 'block') {
        updateCheckoutSummary();
    }
}

function clearOrder() {
    if (confirm('🗑️ ¿Estás seguro de que quieres vaciar todo el carrito?')) {
        window.order = [];
        Object.keys(window.products).forEach(id => {
            window.itemQuantities[id] = 0;
        });
        updateUI();
        closeCheckout();
        showToast('🗑️ Carrito vaciado completamente', 'info');
    }
}

// Nueva función para abrir el checkout
function openCheckout() {
    if (window.order.length === 0) {
        showToast('🛒 Tu carrito está vacío', 'error');
        return;
    }
    
    // Mostrar resumen en el checkout
    updateCheckoutSummary();
    document.getElementById('checkoutModal').style.display = 'block';
}

// Nueva función para cerrar el checkout
function closeCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
}

// Nueva función para actualizar el resumen del checkout
function updateCheckoutSummary() {
    const summaryDiv = document.getElementById('checkoutOrderSummary');
    const totalSpan = document.getElementById('checkoutTotal');
    
    if (!summaryDiv || !totalSpan) return;
    
    let html = '';
    let total = 0;
    
    // Agrupar items individuales
    const groupedItems = {};
    const combos = [];
    
    window.order.forEach(item => {
        total += item.price;
        
        if (item.type === 'combo') {
            combos.push(item);
        } else {
            const productId = item.productId;
            if (!groupedItems[productId]) {
                groupedItems[productId] = {
                    name: item.name,
                    price: item.price,
                    count: 0
                };
            }
            groupedItems[productId].count++;
        }
    });
    
    // Mostrar items individuales
    Object.values(groupedItems).forEach(group => {
        html += `<div class="checkout-order-item">`;
        if (group.count > 1) {
            html += `<span>${group.name} x${group.count}</span>`;
            html += `<span>Q${group.price * group.count}</span>`;
        } else {
            html += `<span>${group.name}</span>`;
            html += `<span>Q${group.price}</span>`;
        }
        html += '</div>';
    });
    
    // Mostrar combos
    combos.forEach((combo, index) => {
        html += `<div class="checkout-order-item">`;
        html += `<span>${combo.name}</span>`;
        html += `<span>Q${combo.price}</span>`;
        html += '</div>';
    });
    
    summaryDiv.innerHTML = html || '<div style="text-align: center; color: var(--gray-500);">Sin items</div>';
    totalSpan.textContent = `Q${total}`;
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const colors = {
        success: 'var(--success)',
        error: 'var(--danger)',
        info: 'var(--primary-red)',
        warning: 'var(--primary-yellow)'
    };
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        font-weight: 500;
        z-index: 2000;
        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        max-width: 300px;
        font-size: 0.9rem;
        animation: slideInRight 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', function() {
    initializeQuantities();
    updateUI();
    
    // Validar teléfono
    const phoneInput = document.getElementById('customerPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
        });
        
        phoneInput.addEventListener('paste', function(e) {
            e.preventDefault();
            let paste = (e.clipboardData || window.clipboardData).getData('text');
            e.target.value = paste.replace(/[^0-9]/g, '').slice(0, 8);
        });
    }
    
    // Validar NIT
    const nitInput = document.getElementById('customerNit');
    if (nitInput) {
        nitInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 9);
        });
        
        nitInput.addEventListener('paste', function(e) {
            e.preventDefault();
            let paste = (e.clipboardData || window.clipboardData).getData('text');
            e.target.value = paste.replace(/[^0-9]/g, '').slice(0, 9);
        });
    }
    
    // Actualizar carrito cuando cambie zona
    const zoneSelect = document.getElementById('customerZone');
    if (zoneSelect) {
        zoneSelect.addEventListener('change', updateCheckoutSummary);
    }
    
    // Manejar cambio de tiempo de entrega
    const deliveryTimeSelect = document.getElementById('deliveryTime');
    if (deliveryTimeSelect) {
        deliveryTimeSelect.addEventListener('change', function() {
            const value = this.value;
            const horarioMañana = document.getElementById('horarioMañana');
            const horarioHoy = document.getElementById('horarioHoy');
            
            if (value === 'mañana') {
                horarioMañana.style.display = 'block';
                horarioHoy.style.display = 'none';
            } else if (value === 'hoy-hora') {
                horarioHoy.style.display = 'block';
                horarioMañana.style.display = 'none';
            } else {
                horarioHoy.style.display = 'none';
                horarioMañana.style.display = 'none';
            }
        });
    }
    
    // Manejar factura
    const facturaOption = document.getElementById('facturaOption');
    if (facturaOption) {
        facturaOption.addEventListener('change', function() {
            const nitField = document.getElementById('nitField');
            if (this.value === 'nit') {
                nitField.style.display = 'block';
            } else {
                nitField.style.display = 'none';
            }
        });
    }
});

// Toggle de factura
function toggleFactura() {
    const section = document.getElementById('facturaSection');
    const arrow = document.getElementById('facturaArrow');
    
    if (section.style.display === 'none' || !section.style.display) {
        section.style.display = 'block';
        arrow.textContent = '▲';
    } else {
        section.style.display = 'none';
        arrow.textContent = '▼';
    }
}

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        if (event.target.id === 'comboModal') {
            closeModal();
        } else if (event.target.id === 'reviewModal') {
            closeReviewModal();
        } else if (event.target.id === 'checkoutModal') {
            // No cerrar el checkout al hacer clic fuera para evitar pérdida de datos
        }
    }
}

// Exportar funciones globales
window.changeQuantity = changeQuantity;
window.clearItem = clearItem;
window.handleMenuItemClick = handleMenuItemClick;
window.removeCombo = removeCombo;
window.clearOrder = clearOrder;
window.showToast = showToast;
window.toggleFactura = toggleFactura;
window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;
window.updateCheckoutSummary = updateCheckoutSummary;