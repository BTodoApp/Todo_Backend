const Router = require('express').Router();
const controller = require('../controllers/CardControllers')
const middleware = require('../middleware')

Router.get('/', controller.getCards)
Router.post('/', controller.createCard)
Router.get('/:cardId', controller.getCardById)
Router.put('/edit/:cardId', middleware.stripToken, middleware.verifyToken, controller.updateCard)
Router.delete('/:cardId', controller.deleteCard)

module.exports = Router