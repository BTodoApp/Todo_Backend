const { db, DataTypes } = require('../db')

const Board = db.define(
  'Board',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);

module.exports = Board;
