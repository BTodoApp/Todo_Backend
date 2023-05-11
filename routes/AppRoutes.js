const Router = require('express').Router()

const userRouter = require('./UserRoutes')
const boardRouter = require('./BoardRoutes')
const cardRouter = require('./CardRoutes')
const listRouter = require('./ListRoutes')

Router.use('/users', userRouter)
Router.use('/boards', boardRouter)
Router.use('/lists', listRouter)
Router.use('/cards', cardRouter)

module.exports = Router
