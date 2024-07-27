const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.send(products);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getProductsById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id, 10) }
        });

        res.send(product);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.createProduct = async (req, res) => {
    const { name, description, price, stock, image } = req.body;
    try {
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                stock,
                image
            }
        });
        res.status(201).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getStock = async (req, res) => {
    const { id } = req.params;
    try{
        const product = await prisma.product.findFirst({
            where: { id: parseInt(id, 10) }
        });

        if (!product) {

            return res.status(404).send('Product not found');
        }
        const { stock } = product;
        return res.status(200).send({ stock });
    }catch(error){
        res.status(500).send(error);
    }
}

exports.updateStock = async (req, res) => {
    const { id } = req.params;
    const {stock} = req.body
    try{
        const product = await prisma.product.update({ data:{
            stock: parseInt(stock, 10)
            },
            where: { id: parseInt(id, 10) }
        });

        if (!product) {
            return res.status(404).send('Product not found');
        }
        return res.status(200).send({ stock });
    }catch(error){
        res.status(500).send(error);
    }
}

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const product = await prisma.product.update({
            where: { id: parseInt(id, 10) },
            data: updates
        });
        res.send(product);
    } catch (error) {
        if (error.code === 'P2025') {
            res.status(404).send({ message: 'Product not found' });
        } else {
            res.status(400).send(error);
        }
    }
};
