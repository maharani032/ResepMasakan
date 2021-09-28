const path = require( 'path' )
const Event = require( '../models/event' )
exports.getProfile = ( req, res, next ) =>
{
    let id = req.user._id
    let user = req.user
    Event.find( { userId: id } ).sort( { createByDate: -1 } ).exec( function ( err, event )
    {
        if ( !err ) {
            console.log( event )
            res.render( 'profil', {
                path: '/profil',
                pageTitle: 'Profil',
                user: user,
                events: event

            } )
        } else {
            console.log( err )
            res.redirect( '/505' )

        }
    } )


}