const { db, DataTypes } = require('../db')

const List = db.define('List', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = List;
