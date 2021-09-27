const path = require( 'path' );
// const Event = require( "../models/event" );
const model = require( '../models/models' )
exports.getHome = ( req, res, next ) =>
{
    console.log( req.user.event.eventId );
    model.Event.find( {}, ( err, events ) =>
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

};