const path = require( 'path' );
const models = require( '../models/models' )

exports.getProfile = ( req, res, next ) =>
{
    let id = req.user._id
    let user = req.user
    models.Event.find( { userId: id }, ( err, event ) =>
    {
        if ( !err ) {
            res.render( 'profil', {
                path: '/profil',
                pageTitle: 'Profil',
                user: user,
                events: event

            } )
        } else {

        }
    } )


}