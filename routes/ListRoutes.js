const Router = require('express').Router();
const controller = require('../controllers/ListControllers')
const middleware = require('../middleware')

Router.get('/', controller.getLists)
Router.post('/', controller.createList)
Router.get('/:listId', controller.getListByPk)
Router.put('/edit/:listId', middleware.stripToken, middleware.verifyToken, controller.updateList)
Router.delete('/:listId', controller.deleteList)

module.exports = Router