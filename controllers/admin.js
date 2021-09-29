const path = require( 'path' )
const User = require( '../models/user' )
const Event = require( '../models/event' )

const fileHelper = require( '../util/file' )
const { validationResult } = require( 'express-validator' )
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
    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        console.log( errors.array() )
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
    const ImageEvent = pictureEvent.path.replace( '\\', '/' )
    const event = new Event( {
        userId: req.user._id,
        nameEvent: nameEvent,
        ImageEvent: ImageEvent,
        tempat: tempat,
        Ondate: Ondate,
        Deskripsi: deskripsi,
        html: "",
        like: []
    } )

    event.save().then( event =>
    {
        User.findOneAndUpdate( { _id: req.user.id }, { $push: { event: { eventId: event._id } } },
            ( err, sucess ) =>
            {
                if ( err ) {
                    console.log( err )
                }
            } )
        res.redirect( '/' )
    } ).catch( err =>
    {
        console.log( err )
        res.redirect( '/505' )
    } )
}
exports.getEditEvent = ( req, res, next ) =>
{

    const editMode = req.query.edit
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
    let eventId = req.params.eventId
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
                        console.log( err )
                    }
                } )
            fileHelper.deleteFile( event.ImageEvent )
            return Event.deleteOne( { _id: eventId, userId: req.user._id } )

        } )
        .then( () =>
        {

            // console.log( 'sucess delete event' )
            res.redirect( '/profil' )
        }
        ).catch( err =>
        {
            console.log( err )
            res.redirect( '/505' )
        } )

}
exports.postEditEvent = ( req, res, next ) =>
{
    // console.log( req.body.eventId )
    const UpdatenameEvent = req.body.nameEvent
    const pictureEvent = req.file
    const UpdateOndate = req.body.OnDate
    const Updatedeskripsi = req.body.deskripsi
    const Updatetempat = req.body.tempat
    const eventId = req.body.eventId
    Event.findById( eventId ).then( event =>
    {
        event.nameEvent = UpdatenameEvent
        event.OnDate = UpdateOndate
        event.tempat = Updatetempat
        event.html = ''
        event.Deskripsi = Updatedeskripsi
        if ( pictureEvent ) {
            fileHelper.deleteFile( event.ImageEvent )
            event.ImageEvent = pictureEvent.path.replace( '\\', '/' )
        }
        return event.save().then( result =>
        {
            res.redirect( '/profil' )
        } ).catch( err =>
        {
            console.log( err )
            res.redirect( '/505' )
        } )

    } )
}