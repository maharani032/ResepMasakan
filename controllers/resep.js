const path = require( 'path' )
const Event = require( '../models/event' )
exports.getHome = ( req, res, next ) =>
{

    Event.find( {} ).sort( { createByDate: -1 } ).exec( function ( err, events )
    {
        res.render(
            'home',
            {
                pageTitle: 'CookBook | Beranda',
                path: '/',
                user: user,
                events: events
            }
        )
    } )
    const user = req.user

}