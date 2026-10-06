class Store {
    constructor() {
        this.products = [];
    }

    addProduct(name, price, qty) {
        const product = {
            id: Date.now(),
            name: name,
            price: price,
            qty: qty
        };

        this.products.push(product);
    }

    removeProduct(id) {
        this.products = this.products.filter(product => product.id !== id);
    }

    updateQuantity(id, change) {
        const product = this.products.find(product => product.id === id);

        if (!product) {
            return;
        }

        product.qty += change;

        if (product.qty <= 0) {
            this.removeProduct(id);
        }
    }

    getTotal() {
        return this.products.reduce(
            (total, product) => total + product.price * product.qty,
            0
        );
    }
}


const store = new Store();

const productForm = document.getElementById("productForm");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const qtyInput = document.getElementById("qty");

const nameError = document.getElementById("nameError");
const priceError = document.getElementById("priceError");
const qtyError = document.getElementById("qtyError");

const productList = document.getElementById("productList");
const totalElement = document.getElementById("total");


function renderProducts() {

    productList.innerHTML = "";

    store.products.forEach(product => {

        const productElement = document.createElement("div");

        productElement.className = "product";

        productElement.dataset.id = product.id;

        productElement.innerHTML = `
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                    $${product.price.toFixed(2)}
                </div>
            </div>

            <div class="product-actions">

                <button data-action="decrease">-</button>

                <span class="quantity">
                    ${product.qty}
                </span>

                <button data-action="increase">+</button>

                <button class="delete" data-action="delete">
                    Delete
                </button>

            </div>
        `;

        productList.appendChild(productElement);
    });

    updateTotal();
}


function updateTotal() {
    totalElement.textContent = store.getTotal().toFixed(2);
}


productForm.addEventListener("submit", function(event) {

    event.preventDefault();

    nameError.textContent = "";
    priceError.textContent = "";
    qtyError.textContent = "";

    const name = nameInput.value.trim();
    const price = Number(priceInput.value);
    const qty = Number(qtyInput.value);

    let isValid = true;


    if (name === "") {
        nameError.textContent = "Product name is required.";
        isValid = false;
    }


    if (priceInput.value === "" || price <= 0) {
        priceError.textContent = "Price must be greater than 0.";
        isValid = false;
    }


    if (qtyInput.value === "" || !Number.isFinite(qty) || qty <= 0) {
        qtyError.textContent = "Quantity must be a positive number.";
        isValid = false;
    }


    if (!isValid) {
        return;
    }


    store.addProduct(name, price, qty);

    productForm.reset();

    renderProducts();
});


productList.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const productElement = button.closest(".product");

    const productId = Number(productElement.dataset.id);

    const action = button.dataset.action;


    if (action === "delete") {

        store.removeProduct(productId);

    } else if (action === "increase") {

        store.updateQuantity(productId, 1);

    } else if (action === "decrease") {

        store.updateQuantity(productId, -1);

    }


    renderProducts();
});


store.addProduct("Apple", 500, 2);
store.addProduct("Bread", 300, 3);

renderProducts();