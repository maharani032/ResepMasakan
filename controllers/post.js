const path = require( 'path' );
const model = require( '../models/models' )
exports.getHome = ( req, res, next ) =>
{
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