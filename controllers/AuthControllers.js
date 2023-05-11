const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validationResult } = require('express-validator');
const { ErrorHandler } = require('../middleware/error');
const { SALT_ROUNDS, APP_SECRET } = process.env;
require('dotenv').config();

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorHandler(422, 'Validation error', errors.array());
    }

    const { email, password } = req.body;

    // Check if user with provided email exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new ErrorHandler(401, 'Invalid email or password');
    }

    // Check if password is correct
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new ErrorHandler(401, 'Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, APP_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorHandler(422, 'Validation error', errors.array());
    }

    const { email, password, username } = req.body;

    // Check if user with provided email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ErrorHandler(409, 'Email is already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create new user
    const newUser = new User({ email, password: hashedPassword, username });
    await newUser.save();

    res.status(201).json({ message: 'User created' });
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
    const userId = req.user.userId;

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

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

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
