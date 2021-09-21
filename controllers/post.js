const user = require( "../models/user" );


exports.getHome = ( req, res, next ) =>
{
    res.render(
        'home',
        {
            pageTitle: 'CookBook | Beranda',
            path: '/',
            user: req.user
        }
    )
};