const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { doCartExists } = require('./cartController');
const { PrismaClient } = require('@prisma/client');
const prisma =  new PrismaClient();

exports.checkout = async (req, res) => {
    const userId = req.user.id;

    if (isNaN(userId)) {
        return res.status(400).send('User not found');
    }

    try {
        const cart = await getCart(userId); // `doCartExists` ahora devuelve el carrito si existe
        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        const {id}  = cart;
        console.log(`id is ${id}`)
        const items = await prisma.cartItem.findMany({
            where: {
                cartId: parseInt(id, 10),
            }
        });

        if (items.length === 0) {
            return res.status(404).send('No items found in the cart');
        }

        const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        const { paymentMethodId } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: total * 100,
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
            },
            return_url: "http://localhost:3000/"
        });
        let create = items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        }))
        create = JSON.stringify(create)
        const order = await prisma.payments.create({
            data: {
                userId: parseInt(userId),
                description: create
            }
        });
        res.send({ success: true, paymentIntent, order });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(400).send({ error: error.message });
    }
}
const getCart = async (userId) => {
    try {

        const cart = await prisma.cart.findFirst({
            where: {
                AND: [
                    { userId: parseInt(userId, 10) }
                ]
            }
        });
        return cart;
    } catch (error) {
        console.error('Error checking if cart exists:', error);
        throw error;
    }
};