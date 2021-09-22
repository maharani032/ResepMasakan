const user = require( "../models/user" );

exports.get404 = ( req, res, next ) =>
{
    res.status( 404 ).render(
        '404/404',
        {
            pageTitle: 'Page Not Found',
            path: '/404',
            user: req.user
        } );
}