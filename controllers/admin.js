const user = require( '../models/user' );
exports.getPostEvent = ( req, res, next ) =>
{
    if ( req.session.isLoggedIn === true ) {
        if ( req.user.admin === true ) {
            res.render(
                'event/postEvent',
                {
                    pageTitle: 'add event',
                    path: '/add-event',
                    user: req.user
                }
            )
        } else {
            res.redirect( '/404' );
        }
    } else {
        res.redirect( '/login' )
    }

};

