const express = require('express');
const router = express.Router();
const handler = require('../handlers/users')
const auth = require('../auth/jwtAuth')

/* GET users listing. */
router.get('/', auth, handler.users);

/* POST users listing */
router.post('/', handler.registerUser)
router.post('/login', handler.loginUser)

/*DELETE users listing*/
router.delete('/logout', handler.logOut)

module.exports = router;
