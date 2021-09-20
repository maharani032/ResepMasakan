const express = require( 'express' );
const { check, body } = require( 'express-validator' )
const authController = require( '../controllers/auth' );
const user = require( '../models/user' );
const router = express.Router();

router.get( '/', authController.getHome );
router.get( '/register', authController.getRegister );
router.get( '/login', authController.getLogIn );
// router post
router.post( '/register', [
    check( 'email' )
        .isEmail()
        .withMessage( 'Please enter a valid email' )
        .custom( ( value, { req } ) =>
        {
            return user.findOne( { email: value } )
                .then( userDoc =>
                {
                    if ( userDoc ) {
                        return Promise.reject(
                            'Email sudah terpakai, Mohon diganti'
                        );
                    }
                } );
        } )
        .normalizeEmail(),
    body(
        'password',
        'Please enter a password with only numbers and text and at least 5 characters.'
    )
        .isLength( { min: 5 } )
        .isAlphanumeric(),
    body( 'ConfirmPassword' )
        .custom( ( value, { req } ) =>
        {
            if ( value !== req.body.password ) {
                throw new Error( 'confirmasi password berbeda' );
            }
            return true;
        } )

], authController.postRegister )
module.exports = router;