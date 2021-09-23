const user = require( '../models/user' );
const Event = require( '../models/event' )
const { validationResult } = require( 'express-validator' );
exports.getPostEvent = ( req, res, next ) =>
{
    User = req.user
    res.render(
        'event/postEvent',
        {
            pageTitle: 'add event',
            path: '/add-event',
            user: User
        }
    )
}

exports.postPostEvent = ( req, res, next ) =>
{
    const nameEvent = req.body.nameEvent
    const pictureEvent = req.file
    const Ondate = req.body.OnDate
    const LinkMeet = req.body.LinkMeet
    const deskripsi = req.body.deskripsi
    const User = req.user

    const errors = validationResult( req )

    if ( !errors.isEmpty() ) {
        console.log( errors.array() );
        return res.render( 'event/postEvent', {
            pageTitle: 'add event',
            path: '/add-event',
            user: User,
            event: {
                nameEvent: nameEvent,

                Ondate: Ondate,
                LinkMeet: LinkMeet,
                deskripsi: deskripsi
            }
        } )
    }
    const ImageEvent = pictureEvent.path
    const event = new Event( {
        userId: req.user._id,
        nameEvent: nameEvent,
        ImageEvent: ImageEvent,
        Ondate: Ondate,
        LinkMeet: LinkMeet,
        deskripsi: deskripsi
    } );
    event.save().then( result =>
    {
        console.log( 'create event' );
        res.redirect(
            '/'
        )
    } ).catch( err =>
    {
        console.log( err )
    } )
}