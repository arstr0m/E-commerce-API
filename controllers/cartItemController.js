const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



exports.getCartProducts = async (req, res) => {
    const { cartId}  = req.params
    const userId = req.user.id
    try {
        const cart = await prisma.cart.findFirst({
            where: {
                AND: [
                    { id: parseInt(cartId, 10) },
                    { userId: userId }
                ]
            }
        })
        if(cart == null){
            return res.status(404).send('No cart found')
        }
        const cartItems = await prisma.cartItem.findMany({
            where: { cartId: parseInt(cartId, 10) },
            include: {
            product: {
                select: {
                    name: true,
                        description: true,
                        image: true
                }
            }
        }
        });
        if (cartItems == null || cartItems.length === 0) {
            return res.status(404).send('No products found')
        }
        res.send(cartItems)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.getCartItemsById = async (req, res) => {
    const { cartId, productId } = req.params;
    try {

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                AND: [
                    { cartId: parseInt(cartId, 10) },
                    { productId: parseInt(productId,10) }
                ]
            }
        });
        if (!cartItem) {
            return res.status(404).send('Product not found in the cart');
        }
        res.send(cartItem);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.createCartItem = async (req, res) => {
    const { quantity, price, productId } = req.body
    const id = parseInt(req.params.cartId, 10)
    console.log(`id is ${id}` )
    const userId = req.user?.id

    if (!id || !userId) {
        throw new Error('Invalid cartId or userId');
    }

    try {
        const cartExists = await prisma.cart.findFirst({
            where: {
                AND: [
                    { id: id },
                    { userId: parseInt(userId, 10) }
                ]
            }
        });


        if (!cartExists) {
            return res.status(400).send("Cart does not exist or does not belong to the user")
        }

        const cartItem = await prisma.cartItem.create({
            data: {
                quantity: quantity,
                productId: productId,
                price: price,
                cartId: id
            }
        })

        res.status(201).send(cartItem)
    } catch (error) {
        console.error('Error creating cart item:', error)
        res.status(500).send("Error creating cart item")
    }

}

exports.updateCartItem = async (req, res) => {
    const { quantity, price, productId } = req.body
    const cartId = parseInt(req.params.cartId, 10)
    const userId = req.user?.id
    console.log(`id is ${userId} ${cartId}` )

    try {
        const cartExists = await prisma.cart.findFirst({
            where: {
                id: cartId,
                userId: parseInt(userId,10)
            }
        })

        if (!cartExists) {
            return res.status(400).send("Cart does not exist or does not belong to the user")
        }

        const cartItem = await prisma.cartItem.update({
            data: {
                quantity: quantity,
                price: price,
            },
            where: {
                cartId_productId: {
                    cartId: cartId,
                    productId: productId
                }
            }
        })

        res.status(204).send(cartItem)
    } catch (error) {
        console.error('Error updating cart item:', error)
        res.status(500).send("Error updating cart item")
    }

}

exports.deleteCartItem = async (req, res) => {
    const {  cartId, productId } = req.params;

    try {
        await prisma.cartItem.delete({
            where: {
                cartId_productId: {
                    cartId: parseInt(cartId,10),
                    productId: parseInt(productId,10)
                }
            },
        });
        res.status(200).send('Cart item deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
}