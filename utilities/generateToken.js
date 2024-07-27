const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

const generateToken = (user) =>  {
    return jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1d' })
}
module.exports = generateToken;