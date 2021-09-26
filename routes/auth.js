const express = require( 'express' );
const { check, body } = require( 'express-validator' )
const authController = require( '../controllers/auth' );
const user = require( '../models/user' );
const router = express.Router();
const passport = require( 'passport' );
router.get( '/auth/google', passport.authenticate( 'google',
    {
        scope: [ 'profile', 'email' ],
        prompt: 'select_account',
    } ) )
router.get( '/auth/google/webmasakan', passport.authenticate( 'google', { failureRedirect: '/login' } ), ( req, res ) =>
{
    req.session.isLoggedIn = true;
    req.session.user = user;
    return req.session.save( err =>
    {
        console.log( err );
        res.redirect( '/' )
    } )
} )
router.get( '/register', authController.getRegister );
router.get( '/login', authController.getLogIn );
router.get( '/logout', ( req, res, next ) =>
{

    req.session.destroy( function ( e )
    {
        req.logout();
        res.redirect( '/' );
    } );
} );
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