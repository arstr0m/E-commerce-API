
const app = document.getElementById('app')

const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
        return str.slice(0, maxLength) + '...'
    }
    return str
}

const getProducts = async () => {
    try {
        const response = await fetch('http://localhost:3000/products')
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        const products = await response.json()
        if (products.length === 0) {
            app.innerHTML = '<p>No products found. Please try again later.</p>'
        } else {
            displayProducts(products)
        }
    } catch (error) {
        console.error('Error fetching products:', error)
        app.innerHTML = `<p>Failed to load products. Please try again later.${error}</p>`
    }
}


const displayProducts = (products) => {
    app.innerHTML = ''

    products.forEach(product => {

        const card = document.createElement('div')
        card.className = 'card'
        card.innerHTML = `
            <a href="product.html?id=${product.id}" class="inner-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${truncateString(product.description, 50)}</p>
            <p>Price: $${product.price}</p>
            </a>
            <button class="addToCartBtn" data-id="${product.id}">Add to Cart</button>
        
        `

        app.appendChild(card)
    })
}

document.addEventListener('DOMContentLoaded', () => {

    const loginBtn = document.getElementById('loginBtn');
    const cartBtn = document.getElementById('cartBtn');
    const registerBtn = document.getElementById('registerBtn');
    const cartClose = document.getElementById('cartClose');
    const loginClose = document.getElementById('loginClose');
    const registerClose = document.getElementById('registerClose');
    const loginModal = document.getElementById('loginModal');
    const cartModal = document.getElementById('cartModal');
    const registerModal = document.getElementById('registerModal');
    getProducts().then(r => console.log(r));

    if (loginBtn) {
        loginBtn.onclick = function() {
            loginModal.style.display = 'block';
        }
    }

    if (cartBtn) {
        cartBtn.onclick = function() {
            cartModal.style.display = 'block';
        }
    }

    if (registerBtn) {
        registerBtn.onclick = function() {
            registerModal.style.display = 'block';
        }
    }

    if (cartClose) {
        cartClose.onclick = function() {
            cartModal.style.display = 'none';
        }
    }

    if (loginClose) {
        loginClose.onclick = function() {
            loginModal.style.display = 'none';
        }
    }

    if (registerClose) {
        registerClose.onclick = function() {
            registerModal.style.display = 'none';
        }
    }

    window.onclick = function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target === registerModal) {
            registerModal.style.display = 'none';
        }
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm')

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault()

        const email = document.getElementById('registerEmail').value
        const password = document.getElementById('registerPassword').value

        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })

            if (response.ok) {
                const data = await response.json()
                if (data !== null) {
                    alert('Registration successful!')
                }


            } else {
                const errorData = await response.json()
                alert('Registration failed: ' + errorData.message)

            }
        } catch (error) {
            console.error('Error:', error)
            alert('An error occurred. Please try again later.')
        }
    })
})

document.addEventListener('DOMContentLoaded', () => {
    const logout = document.getElementById('logoutBtn')

    logout.addEventListener('click', async (event) => {
        try {
            const response = await fetchWithAuth('http://localhost:3000/auth/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            if (response) {
                localStorage.removeItem('authToken')
                window.location.href = 'http://localhost:3000/'

            } else {
                const errorData = await response.json()
                alert('Logout failed: ' + errorData.message)

            }
        } catch (error) {
            console.error('Error:', error)
            alert('An error occurred. Please try again later.')
        }
    })
})
document.addEventListener('DOMContentLoaded', () => {
    const cartBtn = document.getElementById('cartBtn');

    if (cartBtn) {
        cartBtn.addEventListener('click', async () => {
            try {
                alert("190")
                const response = await fetchWithAuth('http://localhost:3000/c/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const { id } = await response
                alert("id: " + id);
                if (!isNaN(id)) {
                    await getCartItems(id);
                    alert("199");
                } else {
                    const createResponse = await fetchWithAuth('http://localhost:3000/c/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!createResponse.ok) {
                        alert('Failed to create cart.');
                        return;
                    }

                    const { id } = await createResponse.json();
                    alert("id: " + id);
                    await getCartItems(id);
                    alert("214");
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    } else {
        console.error('Cart button not found');
    }
});


function displayCart(response){
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    const total = document.getElementById('purchase-total')
    let totalAmount = 0
    if (response === null) {
        return;
    }
    alert("236")
    response.forEach((item) => {
        const row = document.createElement('tr');
        alert("242")
        const nameCell = document.createElement('td');
        nameCell.innerText = item.product.name;
        row.appendChild(nameCell);

        const priceCell = document.createElement('td');
        priceCell.innerText = `${item.price}`;
        row.appendChild(priceCell);

        const quantityCell = document.createElement('td');
        quantityCell.innerText = item.quantity;
        row.appendChild(quantityCell);

        const totalCell = document.createElement('td');
        totalCell.innerText = `${(item.price * item.quantity)}`;
        row.appendChild(totalCell);

        cartItems.appendChild(row);

        totalAmount += item.price * item.quantity;
    });
    total.innerText = "total is: " + totalAmount
}
async function getCartItems(cartId) {
    try {
        const response = await fetchWithAuth(`http://localhost:3000/c/items/${cartId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response !== null) {
            displayCart(response);
        } else {
            alert('Login failed: ');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (!loginForm) {
        alert("Form Not found in DOM");
        return;
    }
    loginForm.addEventListener('submit', async (event) => {

        event.preventDefault();
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');

        if (!emailInput || !passwordInput) {
            alert('Email or Password input not found');
            return;
        }

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });


            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                localStorage.setItem('authToken', token);
                alert('Login successful!');
                window.location.href = 'http://localhost:3000/';
            } else {
                const errorData = await response.json();
                alert('Login failed: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });

});



document.addEventListener('DOMContentLoaded', async () => {
    const cart = document.getElementById('cart')
    const login = document.getElementById('loginBtn')
    const register = document.getElementById('registerBtn')
    try {
        const response = await fetchWithAuth('http://localhost:3000/auth/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        /* TODO logout */
        if (response && Object.keys(response).length > 0) {
            cart.style.display = 'block'
            login.style.display = 'none'
            register.style.display = 'none'
        }
    } catch (error) {
    }
})

const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('authToken')
    const headers = new Headers(options.headers || {})

    if (token) {
        headers.append('Authorization', `Bearer ${token}`)
    }

    const config = {
        ...options,
        headers: headers
    }

    try {
        const response = await fetch(url, config)
        const result = await response.json()
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        return result
    } catch (error) {
        console.error('Error fetching data:', error)
        throw error
    }
}
