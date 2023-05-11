const { db, DataTypes } = require('../db')

const Card = db.define('Card', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Card;
