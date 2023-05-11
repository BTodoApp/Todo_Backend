const router = require('express').Router()
const controller = require('../controllers/AuthControllers')
const middleware = require('../middleware/index')

router.post('/login', controller.login)
router.post('/register', controller.register)
router.post(
  '/update',
  middleware.stripToken,
  middleware.verifyToken,
  controller.updatePassword
)
router.get(
  '/session',
  middleware.stripToken,
  middleware.verifyToken,
  controller.checkSession
)

module.exports = router