const bcrypt = require( 'bcryptjs' );

const { validationResult } = require( 'express-validator' );
const User = require( '../models/user' );

exports.getHome = ( req, res, next ) =>
{
    let guest = 2;
    res.render(
        'home',
        {
            pageTitle: 'CookBook | Beranda',
            path: '/',
            guest: guest
        }
    )
};
exports.getRegister = ( req, res, next ) =>
{
    let message = '';
    if ( message.length > 0 ) {
        message = message[ 0 ];
    } else {
        message = null;
    }
    res.render(
        'auth/register',
        {
            path: '/register',
            pageTitle: 'Register',
            errorMessage: message,
            inputPage: {
                name: {
                    fname: '',
                    lname: '',
                },
                email: '',
                password: '',
                confirmPassword: ''
            },
            validErrors: []
        } );
};
exports.getLogIn = ( req, res, next ) =>
{
    res.render(
        'auth/login',
        {
            pageTitle: 'Log In',
            path: '/login'
        } );
};
//post
exports.postRegister = ( req, res, next ) =>
{
    const fname = req.body.fname;
    const email = req.body.email;
    const lname = req.body.lname;
    const password = req.body.password;

    const errors = validationResult( req );
    if ( !errors.isEmpty() ) {
        return res.render( 'auth/register', {
            path: '/register',
            pageTitle: 'Register',
            errorMessage: errors.array()[ 0 ].msg,
            inputPage: {
                name: {
                    fname: fname,
                    lname: lname,
                },
                email: email,
                password: password,
                confirmPassword: req.body.ConfirmPassword
            },
            validErrors: errors.array()
        } );
    }
    bcrypt
        .hash( password, 12 )
        .then( hashPassword =>
        {
            const user = new User( {
                name: {
                    fname: fname,
                    lname: lname,
                },
                email: email,
                password: hashPassword,
            } );
            return user.save();
        } )
        .then( result =>
        {
            res.redirect( '/' )
        } ).catch( err =>
        {
            const error = new Error( err );
            error.httpStatusCode = 500;
        } );

}
