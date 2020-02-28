const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users')
const auth = require('../auth/jwtAuth')

/* GET users listing. */
router.get('/', auth, usersController.allUsers);
router.get('/:id', auth, usersController.byID);

/* POST users listing */
router.post('/', usersController.registerUser)
router.post('/login', usersController.loginUser)
router.post('/token', usersController.tokenRefresh)

/*DELETE users listing*/
router.delete('/logout', usersController.logOut)

module.exports = router;
