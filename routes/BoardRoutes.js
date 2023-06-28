const Router = require('express').Router();
const controller = require('../controllers/BoardControllers')
const middleware = require('../middleware')

Router.get('/', controller.getBoards)
Router.post('/', controller.createBoard)
Router.get('/:boardId/lists', controller.getBoardsLists)
Router.get('/:boardId', controller.getBoardById)
Router.get('/user/:userId', controller.getSpecificUserBoards)
Router.put('/edit/:boardId', middleware.stripToken, middleware.verifyToken, controller.updateBoard)
Router.delete('/:boardId', controller.deleteBoard)

module.exports = Router