const path = require( 'path' );
const User = require( '../models/user' );
const Event = require( '../models/event' )
const fileHelper = require( '../util/file' )
const { validationResult } = require( 'express-validator' );
exports.getPostEvent = ( req, res, next ) =>
{
    res.render(
        'event/postEvent',
        {
            pageTitle: 'add event',
            path: '/admin/add-event',
            user: req.user,
            editMode: false,
        }
    )
}

exports.postPostEvent = ( req, res, next ) =>
{
    const nameEvent = req.body.nameEvent
    const pictureEvent = req.file
    const Ondate = req.body.OnDate
    const deskripsi = req.body.deskripsi
    const tempat = req.body.tempat
    let id = req.user._id
    const errors = validationResult( req )

    if ( !errors.isEmpty() ) {
        console.log( errors.array() );
        return res.render( 'event/postEvent', {
            pageTitle: 'add event',
            path: '/add-event',
            user: req.user,
            event: {
                nameEvent: nameEvent,
                tempat: tempat,
                Ondate: Ondate,
                deskripsi: deskripsi
            }
        } )
    }
    const ImageEvent = pictureEvent.path
    const event = new Event( {
        userId: id,
        nameEvent: nameEvent,
        ImageEvent: ImageEvent,
        tempat: tempat,
        Ondate: Ondate,
        Deskripsi: deskripsi,
        like: []
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
                editMode: true,
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
exports.postEditEvent = ( req, res, next ) =>
{
    console.log( req.body.eventId )
    const UpdatenameEvent = req.body.nameEvent
    const pictureEvent = req.file
    const UpdateOndate = req.body.OnDate
    const Updatedeskripsi = req.body.deskripsi
    const Updatetempat = req.body.tempat
    const eventId = req.body.eventId
    let id = req.user._id
    Event.findById( eventId ).then( event =>
    {
        event.nameEvent = UpdatenameEvent
        event.OnDate = UpdateOndate
        event.tempat = Updatetempat
        event.Deskripsi = Updatedeskripsi
        if ( pictureEvent ) {
            fileHelper.deleteFile( event.ImageEvent )
            event.ImageEvent = pictureEvent.path
        }
        return event.save().then( result =>
        {
            console.log( 'update event' )
            res.redirect( '/profil' )
        } ).catch( err =>
        {

            res.redirect( '/505' )
        } )
        // event.
    } )
}