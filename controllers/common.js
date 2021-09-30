const Event = require( '../models/event' )
const Comment = require( '../models/comment' )
exports.getEvent = ( req, res ) =>
{
    const EventId = req.params.eventId
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
                    comments: comments
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
    comment.save().then( comment =>
    {
        Event.findOneAndUpdate( { _id: eventId }, { $push: { comment: { commentId: comment._id } } },
            ( err, sucess ) =>
            {
                if ( err ) {
                    console.log( err )
                    res.redirect( '/500' )
                }
            } )
        res.redirect( '/event/' + eventId )
    } ).catch( err =>
    {
        console.log( err )
        res.redirect( '/event/' + eventId )
    } )
}