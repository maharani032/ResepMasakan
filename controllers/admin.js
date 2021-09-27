const path = require( 'path' );
const User = require( '../models/user' );
const Event = require( '../models/event' )
const fileHelper = require( '../util/file' )
const { validationResult } = require( 'express-validator' );
const models = require( '../models/models' );
exports.getPostEvent = ( req, res, next ) =>
{
    // let user = req.user
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
    let id = req.user._id
    // let user = req.user
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
        userId: id,
        nameEvent: nameEvent,
        ImageEvent: ImageEvent,
        Ondate: Ondate,
        LinkMeet: LinkMeet,
        deskripsi: deskripsi
    } );

    event.save().then( event =>
    {
        User.findOneAndUpdate( { _id: req.user.id }, { $push: { event: { eventId: event._id } } },
            ( err, sucess ) =>
            {
                if ( err ) {
                    console.log( err );
                }
                else {
                    console.log( 'sucess' );
                }
            } )
        console.log( 'create event' );
        res.redirect(
            '/'
        )
    } ).catch( err =>
    {
        console.log( err )
    } )
}
exports.getEditEvent = ( req, res, next ) =>
{

    const editMode = req.query.edit;
    console.log( editMode )
    if ( !editMode ) {
        return res.redirect( '/profil' )
    }
    let user = req.user
    let eventId = req.params.eventId
    Event.findById( eventId )
        .then( event =>
        {
            if ( !event ) {
                return res.redirect( '/profil' )
            }
            res.render( 'event/postEvent', {
                pageTitle: 'Edit Event',
                path: 'edit-event',
                event: event,
                user: user,
                errorMessage: null,
            } )
        } )
}
exports.deleteEvent = ( req, res, next ) =>
{
    let eventId = req.params.eventId;
    Event.findById( eventId )
        .then( event =>
        {
            if ( !event ) {
                return next()
            }
            User.findOneAndUpdate( { _id: req.user._id }, { $pull: { event: { eventId: event._id } } },
                ( err, sucess ) =>
                {
                    if ( err ) {
                        console.log( err );
                    }
                    else {
                        console.log( 'sucess delete' );
                    }
                } )
            fileHelper.deleteFile( event.ImageEvent )
            return Event.deleteOne( { _id: eventId, userId: req.user._id } )
        } )
        .then( () =>
        {

            console.log( 'sucess delete event' )
            res.redirect( '/profil' )
        }
        ).catch( err =>
        {
            console.log( err )
        } )

}