// order.js - Sistema de Pedidos y WhatsApp

const WHATSAPP_NUMBER = '50234827948';

// Revisar orden antes de enviar
function reviewOrder() {
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const zone = document.getElementById('customerZone').value;
    const address = document.getElementById('customerAddress').value.trim();
    const paymentMethod = document.getElementById('paymentMethod').value;
    const deliveryTime = document.getElementById('deliveryTime').value;
    
    // Validaciones
    if (!name) {
        showToast('❌ Por favor completa tu nombre', 'error');
        document.getElementById('customerName').focus();
        return;
    }
    
    if (!phone) {
        showToast('❌ Por favor completa tu teléfono', 'error');
        document.getElementById('customerPhone').focus();
        return;
    }
    
    if (phone.length !== 8) {
        showToast('❌ El teléfono debe tener 8 dígitos', 'error');
        document.getElementById('customerPhone').focus();
        return;
    }
    
    if (!zone) {
        showToast('❌ Por favor selecciona tu zona', 'error');
        document.getElementById('customerZone').focus();
        return;
    }
    
    if (!address) {
        showToast('❌ Por favor completa tu dirección', 'error');
        document.getElementById('customerAddress').focus();
        return;
    }
    
    if (!paymentMethod) {
        showToast('❌ Por favor selecciona un método de pago', 'error');
        document.getElementById('paymentMethod').focus();
        return;
    }
    
    if (!deliveryTime) {
        showToast('❌ Por favor selecciona tiempo de entrega', 'error');
        document.getElementById('deliveryTime').focus();
        return;
    }
    
    // Validar hora si es necesario
    if (deliveryTime === 'mañana') {
        const deliveryHour = document.getElementById('deliveryHour').value;
        if (!deliveryHour) {
            showToast('❌ Por favor selecciona la hora para mañana', 'error');
            document.getElementById('deliveryHour').focus();
            return;
        }
    }
    
    if (deliveryTime === 'hoy-hora') {
        const deliveryHourToday = document.getElementById('deliveryHourToday').value;
        if (!deliveryHourToday) {
            showToast('❌ Por favor selecciona la hora para hoy', 'error');
            document.getElementById('deliveryHourToday').focus();
            return;
        }
    }
    
    if (window.order.length === 0) {
        showToast('🛒 No has agregado nada al carrito', 'error');
        return;
    }
    
    // Cerrar checkout y mostrar modal de revisión
    closeCheckout();
    showOrderReview();
}

// Mostrar revisión de orden
function showOrderReview() {
    const reviewDiv = document.getElementById('orderReview');
    const totalSpan = document.getElementById('reviewTotal');
    
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
    
    // Calcular envío
    const customerZone = document.getElementById('customerZone').value;
    let costoEnvio = 0;
    
    if (customerZone) {
        if (customerZone === 'Zona 15') costoEnvio = 20;
        else if (customerZone === 'Zona 16') costoEnvio = 15;
        else costoEnvio = 25;
    }
    
    const totalFinal = total + costoEnvio;
    
    // Mostrar items individuales
    Object.values(groupedItems).forEach(group => {
        html += `<div class="order-item-review">`;
        if (group.count > 1) {
            html += `<strong>🍴 ${group.name} x${group.count}</strong> - <span class="price-highlight">Q${group.price * group.count}</span>`;
        } else {
            html += `<strong>🍴 ${group.name}</strong> - <span class="price-highlight">Q${group.price}</span>`;
        }
        html += '</div>';
    });
    
    // Mostrar combos
    combos.forEach((combo, index) => {
        html += `<div class="order-item-review combo-review">`;
        html += `<strong>🍽️ ${combo.name}</strong> - <span class="price-highlight">Q${combo.price}</span>`;
        html += '<div class="order-item-details">';
        
        // El Taquero
        if (combo.porciones) {
            const porcionNames = {
                'res': '🥩 Res',
                'pollo': '🍗 Pollo',
                'cerdo': '🐷 Cerdo'
            };
            
            const porcionCount = {};
            combo.porciones.forEach(p => {
                porcionCount[p] = (porcionCount[p] || 0) + 1;
            });
            
            html += `&nbsp;&nbsp;🌮 <strong>9 Tacos (3 porciones):</strong><br>`;
            Object.entries(porcionCount).forEach(([tipo, count]) => {
                html += `&nbsp;&nbsp;• ${porcionNames[tipo]}${count > 1 ? ` x${count} porciones` : ' x1 porción'} (${count * 3} tacos)<br>`;
            });
            
            if (combo.bebidas && combo.bebidas.length > 0) {
                html += `&nbsp;&nbsp;🥤 <strong>Bebidas:</strong><br>`;
                combo.bebidas.forEach((beb, i) => {
                    const bebidaNames = {
                        'jamaica': 'Jamaica', 'horchata': 'Horchata',
                        'limonada': 'Limonada', 'cocacola': 'Coca Cola',
                        'sprite': 'Sprite', 'fanta': 'Fanta', 'agua': 'Agua'
                    };
                    html += `&nbsp;&nbsp;• ${bebidaNames[beb]}<br>`;
                });
            }
        }
        // Combos de dobladas
        else if (combo.dobladas) {
            const dobladaNames = {
                'res': '🥩 Res',
                'pollo': '🍗 Pollo',
                'cerdo': '🐷 Cerdo',
                'chile': '🌶️ Chile Relleno',
                'queso': '🧀 Queso',
                'queso-jalapeno': '🌶️🧀 Queso Jalapeño',
                'queso-loroco': '🌿🧀 Queso Loroco'
            };
            
            const dobladaCount = {};
            combo.dobladas.forEach(d => {
                dobladaCount[d] = (dobladaCount[d] || 0) + 1;
            });
            
            Object.entries(dobladaCount).forEach(([tipo, count]) => {
                html += `&nbsp;&nbsp;• ${dobladaNames[tipo]}${count > 1 ? ` x${count}` : ''}<br>`;
            });
            
            // Bebidas múltiples
            if (combo.bebidas && combo.bebidas.length > 0) {
                html += `&nbsp;&nbsp;🥤 <strong>Bebidas:</strong><br>`;
                combo.bebidas.forEach(beb => {
                    const bebidaNames = {
                        'jamaica': 'Jamaica', 'horchata': 'Horchata',
                        'limonada': 'Limonada', 'cocacola': 'Coca Cola',
                        'sprite': 'Sprite', 'fanta': 'Fanta', 'agua': 'Agua'
                    };
                    html += `&nbsp;&nbsp;• ${bebidaNames[beb]}<br>`;
                });
            }
        }
        // Tacos simples
        else if (combo.tacos) {
            html += `&nbsp;&nbsp;• 🌮 ${combo.tacos.quantity} Tacos de ${combo.tacos.type.toUpperCase()}<br>`;
            html += `&nbsp;&nbsp;• Doble tortilla + salsas + limón y sal<br>`;
        }
        
        // Bebida única
        if (combo.bebida) {
            const bebidaNames = {
                'jamaica': '🟣 Jamaica Natural',
                'horchata': '🤍 Horchata Casera',
                'limonada': '🟡 Limonada Fresca',
                'cocacola': '🔴 Coca Cola',
                'sprite': '🟢 Sprite',
                'fanta': '🟠 Fanta Naranja',
                'agua': '💧 Agua Pura'
            };
            html += `&nbsp;&nbsp;• ${bebidaNames[combo.bebida]}<br>`;
        }
        
        // Extras
        if (combo.extras && combo.extras.length > 0) {
            html += `&nbsp;&nbsp;• ✨ ${combo.extras.join(', ')}<br>`;
        }
        
        html += '</div></div>';
    });
    
    // Línea de envío
    if (customerZone && costoEnvio > 0) {
        html += `<div class="order-item-review delivery-line">`;
        html += `<strong>🚚 Envío (${customerZone})</strong> - <span class="price-highlight">Q${costoEnvio}</span>`;
        html += '</div>';
    }
    
    reviewDiv.innerHTML = html || '<div class="empty-cart">🛒 Tu carrito está vacío</div>';
    
    // Mostrar total
    if (customerZone && costoEnvio > 0) {
        totalSpan.innerHTML = `
            <div style="font-size: 0.9rem; color: var(--gray-600); margin-bottom: 5px;">
                Productos: Q${total}<br>
                Envío: Q${costoEnvio}
            </div>
            <div style="font-weight: 800;">Q${totalFinal}</div>
        `;
    } else {
        totalSpan.textContent = `Q${total}`;
    }
    
    document.getElementById('reviewModal').style.display = 'block';
}

// Cerrar modal de revisión
function closeReviewModal() {
    document.getElementById('reviewModal').style.display = 'none';
    openCheckout();
}

// Enviar pedido por WhatsApp
function sendToWhatsApp() {
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const customerZone = document.getElementById('customerZone').value;
    const customerAddress = document.getElementById('customerAddress').value.trim();
    const paymentMethod = document.getElementById('paymentMethod').value;
    const comments = document.getElementById('orderComments').value.trim();
    const facturaOption = document.getElementById('facturaOption').value;
    const customerNit = document.getElementById('customerNit').value.trim();
    const deliveryTime = document.getElementById('deliveryTime').value;
    const deliveryHour = document.getElementById('deliveryHour').value;
    const deliveryHourToday = document.getElementById('deliveryHourToday').value;
    
    // Validación final
    if (!customerName || !customerPhone || !customerZone || !customerAddress || !paymentMethod || !deliveryTime) {
        showToast('❌ Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    if (deliveryTime === 'mañana' && !deliveryHour) {
        showToast('❌ Por favor selecciona la hora para mañana', 'error');
        return;
    }
    
    if (deliveryTime === 'hoy-hora' && !deliveryHourToday) {
        showToast('❌ Por favor selecciona la hora para hoy', 'error');
        return;
    }
    
    if (facturaOption === 'nit' && !customerNit) {
        showToast('❌ Por favor ingresa tu NIT para la factura', 'error');
        return;
    }
    
    // Generar mensaje
    const mensaje = generarMensajeWhatsApp({
        customerName,
        customerPhone,
        customerZone,
        customerAddress,
        paymentMethod,
        comments,
        facturaOption,
        customerNit,
        deliveryTime,
        deliveryHour,
        deliveryHourToday
    });
    
    // Enviar a WhatsApp
    enviarWhatsApp(mensaje);
}

// Generar mensaje de WhatsApp - FORMATO LIMPIO
function generarMensajeWhatsApp(data) {
    const now = new Date();
    const fecha = now.toLocaleDateString('es-GT');
    const hora = now.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });
    
    const initials = data.customerName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
    const uniqueCode = now.getTime().toString().slice(-4);
    const orderCode = `${initials}-${uniqueCode}`;
    
    const paymentNames = {
        'efectivo': '[EFECTIVO]',
        'tarjeta': '[TARJETA]',
        'transferencia': '[TRANSFERENCIA]'
    };
    
    let costoEnvio = 25;
    if (data.customerZone === 'Zona 15') costoEnvio = 20;
    else if (data.customerZone === 'Zona 16') costoEnvio = 15;
    
    // Calcular totales
    let subtotalProductos = 0;
    const groupedItems = {};
    const combos = [];
    
    window.order.forEach(item => {
        subtotalProductos += item.price;
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
    
    const totalFinal = subtotalProductos + costoEnvio;
    
    // Construir mensaje con formato limpio
    let message = `      NUEVO PEDIDO RECIBIDO\n`;
    message += `========================================\n`;
    message += `        EL SABOR DOBLA'O\n`;
    message += `   AUTENTICO SABOR GUATEMALTECO\n`;
    message += `========================================\n`;
    message += `Orden: #${orderCode}\n`;
    message += `Fecha: ${fecha} - ${hora}\n`;
    message += `----------------------------------------\n`;
    message += `Cliente: ${data.customerName}\n`;
    message += `Tel: ${data.customerPhone}\n`;
    message += `Zona: ${data.customerZone}\n`;
    message += `Direccion: ${data.customerAddress}\n`;
    message += `Pago: ${paymentNames[data.paymentMethod]}\n`;

    // Información de entrega
    if (data.deliveryTime === 'hoy') {
        message += `Entrega: HOY (30-45 min)\n`;
    } else if (data.deliveryTime === 'hoy-hora') {
        message += `Entrega: HOY a las ${data.deliveryHourToday}\n`;
    } else if (data.deliveryTime === 'mañana') {
        const mañana = new Date();
        mañana.setDate(mañana.getDate() + 1);
        const fechaMañana = mañana.toLocaleDateString('es-GT');
        message += `Entrega: MAÑANA ${fechaMañana}\n`;
        message += `Horario: ${data.deliveryHour}\n`;
    }

    // Factura
    if (data.facturaOption !== 'no') {
        if (data.facturaOption === 'cf') {
            message += `Factura: CONSUMIDOR FINAL\n`;
        } else if (data.facturaOption === 'nit' && data.customerNit) {
            message += `Factura: NIT ${data.customerNit}\n`;
        }
    }

    message += `----------------------------------------\n`;
    message += `DETALLE DEL PEDIDO:\n`;

    // Items individuales
    Object.entries(groupedItems).forEach(([productId, group]) => {
        for (let i = 0; i < group.count; i++) {
            const itemName = group.name;
            const itemPrice = `Q${group.price}`;
            const line = `${itemName}`.padEnd(28, ' ') + itemPrice;
            message += `${line}\n`;
        }
    });

    // Combos
    combos.forEach((combo, index) => {
        const comboName = `${combo.name} #${index + 1}`;
        const comboPrice = `Q${combo.price}`;
        const line = `${comboName}`.padEnd(28, ' ') + comboPrice;
        message += `${line}\n`;

        // El Taquero
        if (combo.porciones) {
            const porcionNames = {
                'res': 'Res',
                'pollo': 'Pollo',
                'cerdo': 'Cerdo'
            };
            message += `  PORCIONES (9 tacos totales):\n`;
            combo.porciones.forEach((tipo, i) => {
                message += `    Porcion ${i + 1}: ${porcionNames[tipo]} (3 tacos)\n`;
            });
            
            if (combo.bebidas && combo.bebidas.length > 0) {
                message += `  BEBIDAS:\n`;
                const bebidaNames = {
                    'jamaica': 'Jamaica Natural',
                    'horchata': 'Horchata Casera',
                    'limonada': 'Limonada Fresca',
                    'cocacola': 'Coca Cola',
                    'sprite': 'Sprite',
                    'fanta': 'Fanta Naranja',
                    'agua': 'Agua Pura'
                };
                combo.bebidas.forEach((beb, i) => {
                    message += `    ${i + 1}. ${bebidaNames[beb]}\n`;
                });
            }
        }
        // Combos de dobladas
        else if (combo.dobladas) {
            const dobladaNames = {
                'res': 'Res',
                'pollo': 'Pollo',
                'cerdo': 'Cerdo',
                'chile': 'Chile Relleno',
                'queso': 'Queso',
                'queso-jalapeno': 'Queso Jalapeno',
                'queso-loroco': 'Queso Loroco'
            };

            message += `  DOBLADAS DEL COMBO #${index + 1}:\n`;
            combo.dobladas.forEach(tipo => {
                message += `    - ${dobladaNames[tipo]}\n`;
            });

            // Bebidas múltiples
            if (combo.bebidas && combo.bebidas.length > 0) {
                message += `  BEBIDAS:\n`;
                const bebidaNames = {
                    'jamaica': 'Jamaica Natural',
                    'horchata': 'Horchata Casera',
                    'limonada': 'Limonada Fresca',
                    'cocacola': 'Coca Cola',
                    'sprite': 'Sprite',
                    'fanta': 'Fanta Naranja',
                    'agua': 'Agua Pura'
                };
                combo.bebidas.forEach((beb, i) => {
                    message += `    ${i + 1}. ${bebidaNames[beb]}\n`;
                });
            }
            // Bebida única
            else if (combo.bebida) {
                const bebidaNames = {
                    'jamaica': 'Jamaica Natural',
                    'horchata': 'Horchata Casera',
                    'limonada': 'Limonada Fresca',
                    'cocacola': 'Coca Cola',
                    'sprite': 'Sprite',
                    'fanta': 'Fanta Naranja',
                    'agua': 'Agua Pura'
                };
                message += `  BEBIDA: ${bebidaNames[combo.bebida]}\n`;
            }
        }
        // Tacos simples
        else if (combo.tacos) {
            message += `  ${combo.tacos.quantity} Tacos de ${combo.tacos.type.toUpperCase()}\n`;
            message += `  (Doble tortilla + salsas)\n`;
            
            if (combo.bebida) {
                const bebidaNames = {
                    'jamaica': 'Jamaica Natural',
                    'horchata': 'Horchata Casera',
                    'limonada': 'Limonada Fresca',
                    'cocacola': 'Coca Cola',
                    'sprite': 'Sprite',
                    'fanta': 'Fanta Naranja',
                    'agua': 'Agua Pura'
                };
                message += `  BEBIDA: ${bebidaNames[combo.bebida]}\n`;
            }
        }

        // Extras
        if (combo.extras && combo.extras.length > 0) {
            message += `  EXTRAS: ${combo.extras.join(', ')}\n`;
        }

        message += `\n`;
    });

    // Comentarios
    if (data.comments) {
        message += `COMENTARIOS ESPECIALES:\n${data.comments}\n`;
        message += `----------------------------------------\n`;
    }

    // Totales
    message += `SUBTOTAL PRODUCTOS: Q${subtotalProductos}\n`;
    message += `ENVIO (${data.customerZone}): Q${costoEnvio}\n`;
    message += `TOTAL A PAGAR: Q${totalFinal}\n`;

    message += `========================================\n`;
    message += `¡Gracias por tu pedido!\n`;
    if (data.deliveryTime === 'hoy') {
        message += `Tiempo estimado: 30-45 minutos\n`;
    } else if (data.deliveryTime === 'hoy-hora') {
        message += `Entrega programada para hoy\n`;
    } else {
        message += `Entrega programada para mañana\n`;
    }
    message += `Telefono: ${WHATSAPP_NUMBER}\n`;
    message += `========================================\n`;
    
    return message;
}

// Enviar mensaje a WhatsApp
function enviarWhatsApp(mensaje) {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let whatsappURL;
    
    if (isMobile) {
        whatsappURL = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(mensaje)}`;
    } else {
        whatsappURL = `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(mensaje)}`;
    }
    
    alert('⚠️ IMPORTANTE: Se abrirá WhatsApp.\n\n✅ NO modifiques el mensaje\n✅ Solo presiona el botón ENVIAR verde\n\n¡Gracias por tu pedido!');
    
    window.open(whatsappURL, '_blank');
    
    setTimeout(() => {
        limpiarFormulario();
        showSuccessMessage();
    }, 1000);
}

// Limpiar formulario
function limpiarFormulario() {
    window.order = [];
    Object.keys(window.products).forEach(id => {
        window.itemQuantities[id] = 0;
    });
    
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerZone').value = '';
    document.getElementById('customerAddress').value = '';
    document.getElementById('paymentMethod').value = '';
    document.getElementById('orderComments').value = '';
    document.getElementById('facturaOption').value = 'no';
    document.getElementById('customerNit').value = '';
    document.getElementById('deliveryTime').value = '';
    document.getElementById('deliveryHour').value = '';
    document.getElementById('deliveryHourToday').value = '';
    
    document.getElementById('facturaSection').style.display = 'none';
    document.getElementById('horarioMañana').style.display = 'none';
    document.getElementById('horarioHoy').style.display = 'none';
    document.getElementById('facturaArrow').textContent = '▼';
    
    updateUI();
    closeReviewModal();
    
    document.getElementById('reviewModal').style.display = 'none';
}

// Mostrar mensaje de éxito
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 15px;">🎉</div>
        <div style="font-size: 1.3rem; font-weight: 700;">¡Pedido enviado correctamente!</div>
        <div style="font-size: 1rem; margin-top: 10px; opacity: 0.95;">Te contactaremos pronto por WhatsApp</div>
    `;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 4000);
}

// Exportar funciones globales
window.reviewOrder = reviewOrder;
window.closeReviewModal = closeReviewModal;
window.sendToWhatsApp = sendToWhatsApp;