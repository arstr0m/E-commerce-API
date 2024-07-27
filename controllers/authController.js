
const bcrypt = require('bcryptjs');
const generateToken = require('../utilities/generateToken');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.register = async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });
        res.status(201).send({ message: 'User created', user });
    } catch (error) {
        res.status(400).send(error);
    }
};
exports.me = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send("User not authenticated");
        }

        const { id, email } = req.user;
        if (!id || !email) {
            return res.status(404).send("Couldn't verify credentials");
        }

        return res.status(200).json({ email, id });
    } catch (error) {
        console.error("Error in me endpoint:", error);
        return res.status(500).send("Internal Server Error");
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && await bcrypt.compare(password, user.password)) {
        let token;
        token = generateToken(user);
        res.send({ token });
    } else {
        res.status(401).send({ message: 'Invalid credentials' });
    }
};
/* TODO LOGOUT */
exports.logout = (req, res) => {

    const {id} = req.user
    alert(id)
    delete req.user
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }

    res.send({ message: 'Logout successful' });
};