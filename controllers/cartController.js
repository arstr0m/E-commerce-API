const { PrismaClient } = require('@prisma/client');
const res = require("express/lib/response");
const prisma = new PrismaClient();


exports.getCarts = async (req, res) => {
    try {
        const carts = await prisma.cart.findMany()
        res.send(carts)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.getUserCar  = async (req,res) =>{

    const userId = req.user?.id
    if (!userId) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const cart = await prisma.cart.findFirst({
            where: {
                userId: userId
            }
        });
        if (cart == null) {
            return res.status(404).send('Cart not found');
        }
        return res.send(cart);
    } catch (error) {
        console.error('Error retrieving cart:', error);
        return res.status(500).send({ message: 'Internal server error' });
    }
}
exports.getCartsById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    try {
        const cart = await prisma.cart.findFirst({
            where: {
                AND: [
                    { id: parseInt(id, 10) },
                    { userId: userId }
                ]
            }
        });

        if (cart == null) {
            return res.status(404).send('Cart not found');
        }

        return res.send(cart);
    } catch (error) {
        console.error('Error retrieving cart:', error);
        return res.status(500).send({ message: 'Internal server error' });
    }


}
exports.doCartExists = async (id) => {
    if (id == null) {
        throw new Error('Parameters are not complete');
    }
    try {
        const exists = await prisma.cart.findFirst({
            where: { userId: parseInt(id, 10) }
        });
        return exists !== null;
    } catch (error) {
        console.error('Error checking if cart exists:', error);
        throw error;
    }
};

exports.createCart = async (req, res) => {
    const userId  = req.user?.id
    try {
        if (!await doCartExists(userId)){
            const cart = await prisma.cart.create({
                data: {
                    userId
                }
            })
            res.status(201).send(cart)
        }
        return res.status(400).send("A cart already exists")
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.deleteCart = async (req, res) => {
    const { id } = req.params
    try {
        await prisma.cart.delete({
            where: {
                id: parseInt(id, 10),
            },
        });
        res.status(200).json("Cart was deleted")
    } catch (error) {
        res.status(400).send(error)
    }
}