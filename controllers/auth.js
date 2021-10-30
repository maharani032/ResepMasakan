const bcrypt = require( 'bcryptjs' )
const { validationResult } = require( 'express-validator' )
const User = require( '../models/user' )


exports.getRegister = ( req, res, next ) =>
{
    if ( req.session.isLoggedIn == true ) {
        res.redirect( '/' )
    }
    else {
        let message = ''
        if ( message.length > 0 ) {
            message = message[ 0 ]
        } else {
            message = null
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
                    confirmPassword: '',
                    picture: ''
                },
                validErrors: []
            } )
    }
}
exports.getLogIn = ( req, res, next ) =>
{
    if ( req.session.isLoggedIn == true ) {
        res.redirect( '/' )
    } else {
        let message = ''
        if ( message.length > 0 ) {
            message = message[ 0 ]
        } else {
            message = null
        }
        res.render(
            'auth/login',
            {
                errorMessage: message,
                pageTitle: 'Log In',
                path: '/login',
                inputPage: {
                    email: '',
                    password: ''
                }, validErrors: []
            } )
    }

}

//post
exports.postRegister = ( req, res, next ) =>
{
    const fname = req.body.fname
    const email = req.body.email
    const lname = req.body.lname
    const password = req.body.password
    const errors = validationResult( req )
    console.log( errors )
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
                picture: '',
                confirmPassword: req.body.ConfirmPassword
            },
            validErrors: errors.array()
        } )
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
                picture: 'https://cookbook-kel7.s3.ap-southeast-1.amazonaws.com/icon/icon_profil.png',
                pictureKey: 'icon/icon_profil.png',
                email: email,
                googleId: '',
                password: hashPassword,
                event: [],
                resep: [],
                cart: { items: [] }
            } )
            return user.save()
        } )
        .then( result =>
        {
            res.redirect( '/login' )
        } ).catch( err =>
        {
            const error = new Error( err )
            error.httpStatusCode = 500
        } )

}
exports.postLogIn = ( req, res, next ) =>
{
    const email = req.body.email
    const password = req.body.password
    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        return res.render( 'auth/login', {
            path: '/login',
            pageTitle: 'Log In',
            errorMessage: errors.array()[ 0 ].msg,
            inputPage: {
                email: email,
                password: password
            },
            validErrors: errors.array(),

        } )
    }
    User.findOne( { email: email } ).then( user =>
    {
        if ( !user ) {
            return res.render( 'auth/login', {
                path: '/login',
                pageTitle: 'Log In',
                errorMessage: 'salah email atau password',
                inputPage: {
                    email: email,
                    password: password
                },
                validErrors: []
            } )
        }
        bcrypt.compare( password, user.password )
            .then( domatch =>
            {
                if ( domatch ) {
                    req.session.isLoggedIn = true
                    req.session.user = user
                    return req.session.save( err =>
                    {
                        console.log( err )
                        res.redirect( '/' )
                    } )
                } return res.render( 'auth/login', {
                    path: '/login',
                    pageTitle: 'Log In',
                    errorMessage: 'salah email atau password',
                    inputPage: {
                        email: email,
                        password: password
                    },
                    validErrors: []
                } )

            } ).catch( err =>
            {
                console.log( err )
                res.redirect( '/login' )
            } )
    } ).catch( err =>
    {
        const error = new error( err )
        return next( error )
    } )
}
