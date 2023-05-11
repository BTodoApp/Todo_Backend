// models/index.js
const { db, DataTypes } = require('../db');
const Board = require('./Board');
const List = require('./List');
const Card = require('./Card');
const User = require('./User');

// Define associations between models
Board.hasMany(List, {
  foreignKey: {
    name: 'boardId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

List.belongsTo(Board, {
  foreignKey: {
    name: 'boardId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

List.hasMany(Card, {
  foreignKey: {
    name: 'listId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

Card.belongsTo(List, {
  foreignKey: {
    name: 'listId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

User.hasMany(Board, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

Board.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

User.hasMany(Card, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

Card.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

// Export models
module.exports = {
  db,
  DataTypes,
  Board,
  List,
  Card,
  User
};
