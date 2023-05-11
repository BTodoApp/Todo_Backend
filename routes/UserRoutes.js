const Router = require('express').Router();
const controller = require('../controllers/UserControllers')
const middleware = require('../middleware')

Router.get('/', controller.GetUsers)
Router.post('/', controller.CreateUser)
Router.get('/:userId', controller.GetUserByPk)
Router.get('/data/all', controller.GetAllUserData)
Router.put('/edit/:userId', middleware.stripToken, middleware.verifyToken, controller.UpdateUser)
Router.delete('/:userId', controller.DestroyUser)

module.exports = Router