const restWorker = require('../_rest')
const { appAuth, userAuth } = require('../controllers/auth')

const router = new restWorker()

// manages authentication of a specific user
router.post('/user', userAuth)

// manages authentication of the app
// returns a JWT if the APP is authenticated
router.post('/app', appAuth)

module.exports = router