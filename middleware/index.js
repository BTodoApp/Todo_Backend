const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.SECRET_KEY;
const saltRounds = process.env.SALT_ROUNDS

const hashPassword = async (password) => {
    let hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
}

const comparePassword = async (storedPassword, password) => {
    let passwordMatch = await bcrypt.compare(password, storedPassword)
    return passwordMatch
}

const createToken = (payload) => {
    let token = jwt.sign(payload, secretKey)
    return token
}

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return res.status(401).send({ status: 'Error', msg: 'Unauthorized' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const payload = jwt.verify(token, secretKey);
      res.locals.payload = payload;
      next();
    } catch (err) {
      return res.status(401).send({ status: 'Error', msg: 'Unauthorized' });
    }
  };
  

  const stripToken = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).send({ status: 'Error', msg: 'Unauthorized' });
    }
    
    res.locals.token = token.split(' ')[1];
    next();
  };
  
  


module.exports = {
    stripToken,
    verifyToken,
    createToken,
    comparePassword,
    hashPassword
  }