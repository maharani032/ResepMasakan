const Event = require( '../models/event' )
const Comment = require( '../models/comment' )
const Resep = require( '../models/resep' )
exports.getEvent = ( req, res ) =>
{
    const EventId = req.params.eventId
    console.log( EventId )
    Event.findById( EventId )
        .then( event =>
        {
            Comment.find( { eventId: EventId }, ( err, comments ) =>
            {
                res.render( 'event/event', {
                    pageTitle: event.nameEvent,
                    path: '/event/:eventId',
                    user: req.user,
                    event: event,
                    comments: comments,
                    modeEventorResep: true,
                    //if true== comment.event,false==comment.resep
                } )
            } )

        } )
}
exports.postComment = ( req, res ) =>
{
    const eventId = req.params.eventId
    const komentar = req.body.Komentar
    const fname = req.user.name.fname
    const lname = req.user.name.lname
    const comment = new Comment( {
        userId: req.user._id,
        name: {
            fname: fname,
            lname: lname
        },
        komentar: komentar,
        eventId: eventId
    } )
    comment.save().then( result =>
    {
        res.redirect( '/event/' + eventId )
    } ).catch( err =>
    {
        console.log( err )
        res.redirect( '/500' )
    } )
}

exports.deleteComment = ( req, res, next ) =>
{
    let commentId = req.params.commentId
    Comment.findByIdAndDelete( commentId ).then( () =>
    {
        res.redirect( '/' )
    } )
}
exports.getResep = ( req, res ) =>
{
    const resepId = req.params.resepId

    Resep.findById( resepId ).then( resep =>
    {
        Comment.find( { resepId: resepId }, ( err, comments ) =>
        {

            res.render( 'resep/resep', {
                pageTitle: resep.namaResep,
                path: '/resep/:resepId',
                user: req.user,
                resep: resep,
                comments: comments,
                modeEventorResep: false,
            } )
        } )
    } )
}
exports.postCommentResep = ( req, res ) =>
{
    const resepId = req.params.resepId
    const komentar = req.body.Komentar
    const fname = req.user.name.fname
    const lname = req.user.name.lname
    const comment = new Comment( {
        userId: req.user._id,
        name: {
            fname: fname,
            lname: lname
        },
        komentar: komentar,
        resepId: resepId
    } )
    comment.save().then( result =>
    {
        res.redirect( '/resep/' + resepId )
    } ).catch( err =>
    {
        console.log( err )
        res.redirect( '/500' )
    } )
}