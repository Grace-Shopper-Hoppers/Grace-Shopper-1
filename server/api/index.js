const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/products', require('./products'))
router.use('/categories', require('./categories'))
router.use('/order', require('./order'))
router.use('/email', require('./email'))
router.use('/reviews', require('./reviews'))
router.use('/stripe', require('./checkout'))


router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})




