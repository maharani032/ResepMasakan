const user = require( "../models/user" )

exports.get404 = ( req, res, next ) =>
{
    res.status( 404 ).render(
        'err/404',
        {
            pageTitle: 'Page Not Found',
            path: '/404',
            user: req.user
        } )
}
exports.get500 = ( req, res, next ) =>
{
    res.status( 500 ).render(
        'err/500',
        {
            pageTitle: 'Perbaikan',
            path: '/505',
            user: req.user
        } )
}