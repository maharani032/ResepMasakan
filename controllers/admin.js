const path = require( 'path' )
const User = require( '../models/user' )
const Event = require( '../models/event' )
const fileHelper = require( '../util/file' )
const { validationResult } = require( 'express-validator' )
const Comment = require( '../models/comment' )
const Like = require( '../models/like' )
const { DeletePostLike, PushArrayUserEvent, PullArrayUserEvent } = require( '../functions/function' )
const { DeletePostComment } = require( '../functions/function' )
exports.getPostEvent = ( req, res, next ) =>
{
    let message = ''
    if ( message.length > 0 ) {
        message = message[ 0 ]
    } else {
        message = null
    }
    res.render(
        'event/postEvent',
        {
            pageTitle: 'add event',
            path: '/admin/add-event',
            user: req.user,
            editMode: false,
            errorMessage: message,
            validErrors: []
        }
    )
}

exports.postPostEvent = ( req, res, next ) =>
{
    const nameEvent = req.body.nameEvent
    const Ondate = req.body.OnDate
    const deskripsi = req.body.deskripsi
    const tempat = req.body.tempat
    const id = req.user._id
    let harga = req.body.harga
    const kapasitas = req.body.Kapasitas
    console.log( req.body.Category )
    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        return res.render( 'event/postEvent', {
            pageTitle: 'add event',
            path: '/admin/add-event',
            user: req.user,
            editMode: false,
            errorMessage: errors.array()[ 0 ].msg,
            validErrors: errors.array()
        } )
    }
    else {
        if ( req.body.Category == 'free' ) {
            console.log( 'set value harga =0' )
            harga = 0
        }
        const pictureEvent = req.file.path.replace( '\\', '/' )
        const event = new Event( {
            userId: req.user._id,
            nameEvent: nameEvent,
            ImageEvent: pictureEvent,
            tempat: tempat,
            Ondate: Ondate,
            Deskripsi: deskripsi,
            html: "",
            // like: ,
            comment: [],
            Harga: harga,
            Kapasitas: kapasitas
        } )
        event.save().then( event =>
        {
            { PushArrayUserEvent( id, event._id ) }
            res.redirect( '/' )
        } ).catch( err =>
        {
            console.log( err )
            res.redirect( '/500' )
        } )
    }



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
            let message = ''
            if ( message.length > 0 ) {
                message = message[ 0 ]
            } else {
                message = null
            }
            res.render( 'event/postEvent', {
                pageTitle: 'Edit Event',
                path: 'edit-event/:eventId',
                event: event,
                user: user,
                editMode: true, errorMessage: message,
                validErrors: []
            } )
        } )
}
exports.deleteEvent = ( req, res, next ) =>
{
    let eventId = req.params.eventId
    let userId = req.user._id
    const EventID = req.user.eventId
    Event.findById( eventId )
        .then( event =>
        {
            if ( !event ) {
                return next()
            }
            { PullArrayUserEvent( userId, eventId ) }
            if ( event.like.length != 0 ) {
                { DeletePostLike( event, eventId, eventId ) }
            }
            if ( event.commentId.length != 0 ) {

                { DeletePostComment( event, eventId, eventId ) }
            }
            fileHelper.deleteFile( event.ImageEvent )
            return Event.deleteOne( { _id: eventId, userId: req.user._id } )

        } )
        .then( () =>
        {

            res.redirect( '/profil' )
        }
        ).catch( err =>
        {
            console.log( err )
            res.redirect( '/500' )
        } )

}
exports.postEditEvent = ( req, res ) =>
{
    let eventId = req.params.eventId
    const UpdatenameEvent = req.body.nameEvent
    const pictureEvent = req.file
    const UpdateOndate = req.body.OnDate
    const Updatedeskripsi = req.body.deskripsi
    const Updatetempat = req.body.tempat
    let Updateharga = req.body.harga
    const Updatekapasitas = req.body.Kapasitas
    Event.findById( eventId ).then( event =>
    {
        const errors = validationResult( req )
        if ( !errors.isEmpty() ) {
            return res.render( 'event/postEvent', {
                pageTitle: 'Edit Event',
                path: 'edit-event/:eventId',
                user: req.user,
                editMode: false,
                errorMessage: errors.array()[ 0 ].msg,
                validErrors: errors.array()
            } )
        }
        else {
            if ( req.body.Category == 'free' ) {
                console.log( 'set value harga =0' )
                Updateharga = 0
            }
            event.Harga = Updateharga
            event.Kapasitas = Updatekapasitas
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
                res.redirect( '/500' )
            } )
                // } )
                .catch( err =>
                {
                    console.log( err )
                    res.redirect( '/500' )
                } )
        }
    } )
}
