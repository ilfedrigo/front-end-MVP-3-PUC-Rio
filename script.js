document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;

    if (currentPage === '/index.html') {
        // Lógica para a página index.html
        // Carregar produtos da API e adicionar itens ao carrinho

        // Seleciona a div que conterá os produtos
        let products = document.querySelector('.products');
        // Array para armazenar os itens do carrinho
        let cart = [];

        // Função assíncrona para buscar os produtos da API
        async function fetchProducts(url) {
            try {
                let data = await fetch(url);
                let response = await data.json();

                // Itera sobre os produtos da API
                for (let i = 0; i < response.length; i++) {
                    let category = response[i].category.toLowerCase();
                    // Verifica se a categoria do produto é 'men's clothing' ou 'women's clothing'
                    if (category === "men's clothing" || category === "women's clothing") {
                        let title = response[i].title;
                        let price = response[i].price;
                        let itemId = response[i].id;

                        // Adiciona o HTML do produto à div de produtos
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

                // Seleciona todos os botões 'add-to-cart' e adiciona um evento de clique a cada um
                let addToCartButtons = document.querySelectorAll('.add-to-cart');
                addToCartButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        // Obtém o ID do produto a partir do atributo data-productId
                        let productId = button.getAttribute('data-productId');
                        // Encontra o produto correspondente no array de resposta
                        let product = response.find(item => item.id === parseInt(productId));
                        // Adiciona o produto ao carrinho
                        cart.push(product);
                        // Armazena o carrinho no localStorage
                        localStorage.setItem('cart', JSON.stringify(cart));
                        // Exibe um alerta informando que o item foi adicionado ao carrinho
                        alert("Item added to cart!");
                    });
                });
            } catch (err) {
                console.log(err);
            }
        }

        // Chama a função fetchProducts com a URL da API
        fetchProducts('https://fakestoreapi.com/products');
    } else if (currentPage === '/cart.html') {
        // Lógica para a página cart.html
        // Exibir os itens do carrinho e processar o checkout

        // Seleciona o elemento tbody com a classe 'cart-items-list'
        let cartItemsList = document.querySelector('.cart-items-list');

        // Função para renderizar os itens do carrinho na tabela
        function renderCartItems() {
            // Obtém os itens do carrinho armazenados no localStorage
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            // Limpa o conteúdo atual da lista de itens do carrinho
            const cartItemsList = document.querySelector('.cart-items-list');
            cartItemsList.innerHTML = "";

            let total = 0; // Nova variável para armazenar o total

            // Cria a estrutura da tabela
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

            // Itera sobre os itens do carrinho
            cart.forEach((item) => {
                // Adiciona uma linha para cada item na tabela
                tableHTML += `
                    <tr>
                        <td>${item.title}</td>  
                        <td>$${item.price}</td>
                    </tr>
                `;

                total += item.price; // Adiciona o preço de cada item ao total
            });

            // Adiciona o total ao final da tabela
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

            // Adiciona o HTML da tabela à lista de itens do carrinho
            cartItemsList.innerHTML = tableHTML;

            // Seleciona o botão de checkout
            const checkoutButton = document.querySelector('.botao');
            const url = 'http://127.0.0.1:5000/checkout'
            // Adiciona um evento de clique ao botão de checkout
            checkoutButton.addEventListener('click', () => {
                // Obtém o carrinho do localStorage
                let cartStorage = JSON.parse(localStorage.getItem('cart')) || [];
                let cart = cartStorage.map(item => ({ item: item.title, price: item.price }));
                // Envia os dados do carrinho para o backend
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ cart: cart })
                })
                .then(response => {
                    // Verifica se a resposta foi bem-sucedida
                    if (!response.ok) {
                        throw new Error('Failed to checkout items');
                    }
                    // Retorna a resposta como JSON
                    return response.json();
                })
                .then(data => {
                    // Exibe uma mensagem de sucesso
                    alert(data.message);
                    // Remove o carrinho do localStorage após o checkout
                    localStorage.removeItem('cart');
                    // Redireciona para a página inicial após o checkout
                    window.location.href = '/index.html';
                })
                .catch(error => {
                    // Exibe um alerta se houver um erro ao fazer o checkout
                    console.error('Error:', error);
                    alert(error.message);
                });
            });
        }

        // Chama a função renderCartItems para exibir os itens do carrinho na página
        renderCartItems();

    } else if (currentPage === '/admin.html') {
        // Função para renderizar as orders na tabela
        function renderOrders(orders) {
            const ordersList = document.querySelector('.orders-list');
            ordersList.innerHTML = ""; // Limpa o conteúdo atual da lista de orders

            // Cria a estrutura da tabela
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

            // Itera sobre as orders e adiciona uma linha para cada order na tabela
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

            // Fecha a tabela
            tableHTML += `
                    </tbody>
                </table>
            `;

            // Adiciona o HTML da tabela à lista de orders
            ordersList.innerHTML = tableHTML;

            // Adiciona event listener para os botões de deletar e editar
            ordersList.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const orderId = button.getAttribute('data-order-id');
                    deleteOrder(orderId);
                });
            });

            ordersList.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const orderId = button.getAttribute('data-order-id');
                    // Implemente a lógica de edição aqui
                });
            });
        }

        // Função para buscar e renderizar as orders
        async function fetchAndRenderOrders() {
            try {
                const response = await fetch('http://127.0.0.1:5000/orders');
                const orders = await response.json();
                renderOrders(orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        }

        // Chama a função para buscar e renderizar as orders ao carregar a página
        fetchAndRenderOrders();
    
    // Função para deletar um pedido
        async function deleteOrder(orderId) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/orders/${orderId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                // Atualiza a lista de pedidos após a exclusão bem-sucedida
                fetchAndRenderOrders();
            } else {
                console.error('Failed to delete order');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
        }
                // Lógica para outras páginas (se necessário)
        }
    };
});

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const url = 'http://127.0.0.1:5000/login';
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
    const url = 'http://127.0.0.1:5000/signup';
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
            // Redirecionar para a página de login após o cadastro bem-sucedido
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