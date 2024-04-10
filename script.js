document.addEventListener('DOMContentLoaded', function() {
    let products = document.querySelector('.products');

    async function fetchProducts(url) {
        try {
            let data = await fetch(url);
            let response = await data.json();

            for (let i = 0; i < response.length; i++) {
                let category = response[i].category.toLowerCase();
                if (category === "men's clothing" || category === "women's clothing") {
                    let title = response[i].title;
                    products.innerHTML += `
       <div class="product">
           <img src="${response[i].image}" alt="${category}" class="product-img">
           <div class="product-content">
           <h2 class="product-title">${title}</h2>
           <h4 class="product-category">${category}</h4>
           <div class="product-price-container">
               <h3 class="product-price">$${response[i].price}</h3>
               <a href="#!" data-productId="${
                 response[i].id
               }" class="add-to-cart"><ion-icon name="cart-outline"></ion-icon></a>
           </div>
           </div>
          
       </div>
       `;
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    fetchProducts('https://fakestoreapi.com/products');
});
