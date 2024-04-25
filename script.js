document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;

    if (currentPage === '/index.html') {

        let products = document.querySelector('.products');
        let cart = [];
        async function fetchProducts(url) {
            try {
                let data = await fetch(url);
                let response = await data.json();

                for (let i = 0; i < response.length; i++) {
                    let category = response[i].category.toLowerCase();
                    if (category === "men's clothing" || category === "women's clothing") {
                        let title = response[i].title;
                        let price = response[i].price;
                        let itemId = response[i].id;

                        products.innerHTML += `
                            <div class="product">
                                <img src="${response[i].image}" alt="${category}" class="product-img">
                                <div class="product-content">
                                    <h2 class="product-title">${title}</h2>
                                    <h4 class="product-category">${category}</h4>
                                    <div class="product-price-container">
                                        <h3 class="product-price">$${price}</h3>
                                        <a href="#!" data-productId="${itemId}" class="add-to-cart"><ion-icon name="cart-outline"></ion-icon></a>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                }

                let addToCartButtons = document.querySelectorAll('.add-to-cart');
                addToCartButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        let productId = button.getAttribute('data-productId');
                        let product = response.find(item => item.id === parseInt(productId));
                        cart.push(product);
                        localStorage.setItem('cart', JSON.stringify(cart));
                        alert("Item added to cart!");
                    });
                });
            } catch (err) {
                console.log(err);
            }
        }

        fetchProducts('https://fakestoreapi.com/products');
    } else if (currentPage === '/cart.html') {
    
        let cartItemsList = document.querySelector('.cart-items-list');

        function renderCartItems() {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const cartItemsList = document.querySelector('.cart-items-list');
            cartItemsList.innerHTML = "";

            let total = 0; 

            let tableHTML = `
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th style="width: 300px;">Item</th>
                            <th style="width: 60px;">Preço</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            cart.forEach((item) => {
                tableHTML += `
                    <tr>
                        <td>${item.title}</td>  
                        <td>$${item.price}</td>
                    </tr>
                `;

                total += item.price; 
            });

            tableHTML += `
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Total</th>
                            <td id="total-value">$${total}</td>
                        </tr>
                    </tfoot>
                </table>
            `;

            cartItemsList.innerHTML = tableHTML;

            const checkoutButton = document.querySelector('.botao');
            const url = 'http://127.0.0.1:5006/checkout'
            checkoutButton.addEventListener('click', () => {
                let cartStorage = JSON.parse(localStorage.getItem('cart')) || [];
                let cart = cartStorage.map(item => ({ item: item.title, price: item.price }));
        
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ cart: cart })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to checkout items');
                    }
                    return response.json();
                })
                .then(data => {
                    alert(data.message);
                    localStorage.removeItem('cart');
                    window.location.href = '/index.html';
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert(error.message);
                });
            });
        }

        renderCartItems();

    } else if (currentPage === '/admin.html') {
        function renderOrders(orders) {
            const ordersList = document.querySelector('.orders-list');
            ordersList.innerHTML = ""; 

            let tableHTML = `
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Item</th>
                            <th>Price</th>
                            <th>Actions</th> <!-- Coluna para os botões de ação -->
                        </tr>
                    </thead>
                    <tbody>
            `;

            orders.forEach(order => {
                tableHTML += `
                    <tr>
                        <td>${order.id}</td>
                        <td>${order.item}</td>
                        <td>$${order.price}</td>
                        <td>
                            <button class="btn btn-danger delete-btn" data-order-id="${order.id}">Delete</button>
                            <button class="btn btn-primary edit-btn" data-order-id="${order.id}">Edit</button>
                        </td>
                    </tr>
                `;
            });

            tableHTML += `
                    </tbody>
                </table>
            `;

            ordersList.innerHTML = tableHTML;
            ordersList.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const orderId = button.getAttribute('data-order-id');
                    deleteOrder(orderId);
                });
            });

            ordersList.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const orderId = button.getAttribute('data-order-id');
                });
            });
        }

        async function fetchAndRenderOrders() {
            try {
                const response = await fetch('http://127.0.0.1:5006/orders');
                const orders = await response.json();
                renderOrders(orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        }

        fetchAndRenderOrders();
    
        async function deleteOrder(orderId) {
        try {
            const response = await fetch(`http://127.0.0.1:5006/orders/${orderId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchAndRenderOrders();
            } else {
                console.error('Failed to delete order');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
        }
        }
    };
});

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const url = 'http://127.0.0.1:5006/login';
    const user = {
        'username': username,
        'password': password
    };
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to authenticate');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            window.location.href = data.redirect;
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to authenticate');
    });
}

function signup() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const url = 'http://127.0.0.1:5006/signup';
    const user = {
        'username': username,
        'password': password
    };
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create user');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert(data.message);
            window.location.href = 'login.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to create user');
    });
}