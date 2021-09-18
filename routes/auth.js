const express = require( 'express' );
const authController = require( '../controllers/auth' );
const router = express.Router();

router.get( '/register', authController.getRegister );
router.get( '/login', authController.getLogIn );
module.exports = router;