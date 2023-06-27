const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
const { CreateUser } = require('./UserControllers')
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const SALT_ROUNDS = process.env.SALT_ROUNDS
const salt = bcrypt.genSaltSync(Number(SALT_ROUNDS));
const { ErrorHandler } = require('../utils/errorHandler');

const login = async (req, res, next) => {
  try {

    const {email, password} = req.body

    const user = await User.findOne({
      where: {email: email},
      raw: true
    })

    if (user && await bcrypt.compare(password, user.password, function (err, result) {
      let payload = {
        id: user.id,
        email: user.email,
        name: user.name
      }

      let token = jwt.sign(payload, SECRET_KEY)
      return res.send({ user: payload, token})
    }))
    res.status(401).send({ status: 'Error', message: 'Incorrect Password'})
  } catch (error) {
    res.status(500).json(error)
  }
};

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorHandler(422, 'Validation error', errors.array());
    }

    const { email, password, name } = req.body;

    // Check if user with provided email exists
    const existingUser = await User.findOne({ where:{ email: email} });
    if (existingUser) {
      throw new ErrorHandler(409, 'Email is already taken');
    }

    // Hash password
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, salt, null, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });

    // Create new user
    const newUser = await CreateUser({ email, hashedPassword, name });

    res.status(201).json({ 
      message: 'User created',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        boards: newUser.boards,
      },
    });

    return newUser
    
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorHandler(422, 'Validation error', errors.array());
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.params.userId;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ErrorHandler(404, 'User not found');
    }

    // Check if current password is correct
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      throw new ErrorHandler(401, 'Invalid password');
    }

    // Hash password
    const hashedNewPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(newPassword, salt, null, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });

    // Update user's password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated' });
  } catch (error) {
    next(error);
  }
};

const checkSession = (req, res) => {
  res.status(200).json({ message: 'Session is valid' });
};

module.exports = { login, register, updatePassword, checkSession };
