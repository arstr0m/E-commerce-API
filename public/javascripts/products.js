
const getProductById = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/products/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const product = await response.json();
        displayProduct(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        document.getElementById('app').innerHTML = '<p>Failed to load product. Please try again later.</p>';
    }
};

const displayProduct = (product) => {
    const container = document.getElementById('app');
    document.title = product.name;
    container.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="productData">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>Stock: ${product.stock}</p>
        <p><strong>$${product.price}</strong></p>   
        <button id="goBack" onclick="redirectToStore()">Go back to store</button>
        </div>
     
    `;
};

function redirectToStore() {
    window.location.href = 'http://localhost:3000/';
}
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        getProductById(productId);
    } else {
        document.getElementById('app').innerHTML = '<p>No product ID specified.</p>';
    }
});
