document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;

    if (currentPage === '/index.html') {
        // Lógica para a página index.html
        // Carregar produtos da API e adicionar itens ao carrinho
        
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
        // Lógica para a página cart.html
        // Exibir os itens do carrinho e processar o checkout
        
        let cartItemsList = document.querySelector('.cart-items-list');

        function renderCartItems() {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const cartItemsList = document.querySelector('.cart-items-list'); // Selects tbody with class 'cart-items-list'
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
        }

        renderCartItems();
    } else {
        // Lógica para outras páginas (se necessário)
    }
});
