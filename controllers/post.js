const path = require( 'path' )
const Event = require( '../models/event' )
exports.getHome = ( req, res, next ) =>
{
    Event.find( {}, ( err, events ) =>
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