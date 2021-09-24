const express = require( 'express' );
const { check, body } = require( 'express-validator' )
const authController = require( '../controllers/auth' );
const User = require( '../models/user' );
const router = express.Router();


router.get( '/register', authController.getRegister );
router.get( '/login', authController.getLogIn );
router.get( '/logout', authController.getLogOut );
// router post
router.post( '/register', [
    check( 'email' )
        .isEmail()
        .withMessage( 'Please enter a valid email' )
        .custom( ( value, { req } ) =>
        {
            return User.findOne( { email: value } )
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
        'password minimal 5 karakter'
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
router.post( '/login', [
    body( 'email' )
        .isEmail()
        .withMessage( 'email tidak valid' )
        .normalizeEmail(),
    body( 'password', 'password tidak valid.' )
        .isLength( { min: 5 } )
        .isAlphanumeric()
], authController.postLogIn )
module.exports = router;