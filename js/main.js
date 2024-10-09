// Variables globales
let productos = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Elementos del DOM
const productsContainer = document.getElementById('products');
const cartItemsContainer = document.getElementById('cart-items');
const totalContainer = document.getElementById('total');
const checkoutButton = document.getElementById('checkout');
const cartButton = document.getElementById('cart-button');
const cartCount = document.getElementById('cart-count');

// Cargar productos usando Fetch
async function cargarProductos() {
    try {
        const response = await fetch('./productos.json'); 
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        productos = await response.json(); 
        console.log("Productos cargados correctamente:", productos); 
        mostrarProductos(); 
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Mostrar productos en el DOM
function mostrarProductos() {
    
    if (productos.length === 0) {
        console.error("No se encontraron productos para mostrar.");
        return;
    }

    
    productsContainer.innerHTML = '';

    // Recorrer cada producto y agregarlo al contenedor
    productos.forEach(producto => {
        const productCard = document.createElement('div');
        productCard.classList.add('col-md-4', 'mb-3'); 
        productCard.innerHTML = `
            <div class="card h-100">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">$${producto.precio}</p>
                    <button class="btn btn-primary" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
                </div>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
}

// Agregar producto al carrito
function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    if (producto) {
        carrito.push(producto);
        actualizarCarrito();
        guardarCarrito();

        // Mensaje de confirmación utilizando SweetAlert
        Swal.fire({
            title: 'Producto agregado',
            text: `${producto.nombre} ha sido agregado al carrito.`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
    } else {
        console.error(`Producto con ID ${idProducto} no encontrado.`);
    }
}

// Eliminar producto del carrito
function eliminarUnaInstanciaDelCarrito(idProducto) {
    const index = carrito.findIndex(producto => producto.id === idProducto);
    if (index !== -1) {
        carrito.splice(index, 1);
        actualizarCarrito();
        guardarCarrito();
    }
}

// Actualizar carrito y calcular total
function actualizarCarrito() {
    cartItemsContainer.innerHTML = ''; 
    let total = 0;

    const carritoAgrupado = carrito.reduce((acc, producto) => {
        const existe = acc.find(item => item.id === producto.id);
        if (existe) {
            existe.cantidad++;
        } else {
            acc.push({ ...producto, cantidad: 1 });
        }
        return acc;
    }, []);

    // Mostrar cada producto del carrito
    carritoAgrupado.forEach(producto => {
        const cartItem = document.createElement('li');
        cartItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        // Crear estructura del producto en el carrito
        cartItem.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="img-thumbnail me-2" style="width: 50px; height: 50px;">
                <span>${producto.nombre} - $${producto.precio} (x${producto.cantidad})</span>
            </div>
            <button class="btn btn-danger btn-sm" onclick="eliminarUnaInstanciaDelCarrito(${producto.id})">Eliminar</button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
        total += producto.precio * producto.cantidad;
    });

    // Actualizar total y contador
    totalContainer.innerText = total;
    cartCount.innerText = carrito.length;
}

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para manejar el proceso de pago
function procesarPago() {
    if (carrito.length === 0) {
        
        Swal.fire({
            title: 'Carrito vacío',
            text: 'Por favor, agrega productos al carrito antes de proceder al pago.',
            icon: 'error',
            timer: 1500,
            showConfirmButton: false
        });
        return;
    }

    // Mostrar mensaje de éxito y vaciar el carrito
    Swal.fire({
        title: '¡Compra realizada!',
        text: 'Tu compra se ha realizado con éxito.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
    });

    // Vaciar el carrito y actualizar la visualización
    carrito = [];
    actualizarCarrito();
    guardarCarrito();
}

// Asignar el evento de click al botón de pagar
checkoutButton.addEventListener('click', procesarPago);

// Inicializar
function inicializar() {
    cargarProductos(); 
    actualizarCarrito(); 
}


window.onload = inicializar;



















