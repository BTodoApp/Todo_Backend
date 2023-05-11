const path = require('path');
const { Sequelize, DataTypes } = require('sequelize')

//create an instance of the database call it db
const db = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'db.sqlite'),
    logging: false
});

//export
module.exports = { db, DataTypes }