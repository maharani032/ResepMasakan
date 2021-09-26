const path = require( 'path' );
const user = require( '../models/user' )
const Event = require( '../models/event' )
exports.getProfile = ( req, res, next ) =>
{
    let id = req.user._id
    let user = req.user
    Event.find( { userId: id }, ( err, event ) =>
    {
        res.render( 'profil', {
            path: '/profil',
            pageTitle: 'Profil',
            user: user,
            events: event

        } )
    } )


}