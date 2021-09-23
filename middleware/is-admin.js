module.exports = ( req, res, next ) =>
{
    if ( req.session.isLoggedIn == true ) {
        if ( !req.user.admin == true ) {
            return res.redirect( '/404' );
        } next();
    } else {
        return res.redirect( '/login' );
    }

}