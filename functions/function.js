const Like = require( '../models/like' )
const Event = require( '../models/event' )
const Resep = require( '../models/resep' )
const User = require( '../models/user' )
// const 
const DeletePostLike = ( eventorresep, postid, postID ) =>
{
    Like.find( { postid: postID } ).then( likes =>
    {
        var likelength = likes.length - 1
        for ( likelength; likelength >= 0; likelength-- ) {
            let id = eventorresep.like[ likelength ]
            Like.findByIdAndDelete( id, ( err, docs ) =>
            {
                if ( err ) {
                    console.log( err )
                }
            } )
        }
    } )
}

const UpdateEventComment = ( databaseId, arrayidupdate ) =>
{
    Event.findOneAndUpdate( { _id: databaseId }, { $push: { commentId: arrayidupdate } },
        ( err, sucess ) =>
        {
            if ( err ) {
                console.log( err )
            }
        }
    )
}
const UpdateResepComment = ( databaseId, arrayidupdate ) =>
{
    Resep.findOneAndUpdate( { _id: databaseId }, { $push: { comment: arrayidupdate } },
        ( err, sucess ) =>
        {
            if ( err ) {
                console.log( err )
            }
        }
    )
}
const UpdateArrayPost = ( database, databaseId, databaseObject, arrayidupdate ) =>
{
    database.findOneAndUpdate( { _id: databaseId }, { $push: { databaseObject: arrayidupdate } },
        ( err, sucess ) =>
        {
            if ( err ) {
                console.log( err )
            }
            
            else {
                console.log( 'cant found id' )
            }
        }
    )
}
const UpdateEventLike = ( databaseId, arrayidupdate ) =>
{
    Event.findOneAndUpdate( { _id: databaseId }, { $push: { like: arrayidupdate } },
        ( err, sucess ) =>
        {
            if ( err ) {
                console.log( err )
            }
        }
    )
}
const UpdateResepLike = ( databaseId, arrayidupdate ) =>
{
    Resep.findOneAndUpdate( { _id: databaseId }, { $push: { like: arrayidupdate } },
        ( err, sucess ) =>
        {
            if ( err ) {
                console.log( err )
            }
        }
    )
}
function DeleteArrayPost ( database, databaseId, object, arrayidupdate ) 
{
    var x = database.object
    database.findOneAndUpdate( { _id: databaseId }, { $pull: { object: arrayidupdate } },
        ( err, sucess ) =>
        {
            if ( err ) {
                console.log( err )
            }
            
            else {
                console.log( "not defined" )
            }
        }
    )
}
const DeleteEventComment = ( databaseId, arrayidupdate ) =>
{
    Event.findOneAndUpdate( { _id: databaseId }, { $pull: { commentId: arrayidupdate } },
        ( err, sucess ) =>
        {
            if ( err ) {
                console.log( err )
            }
            
            else {
                console.log( 'cant found id' )
            }
        }
    )
}
const DeleteResepComment = ( databaseId, arrayidupdate ) =>
{
    Resep.findOneAndUpdate( { _id: databaseId }, { $pull: { comment: arrayidupdate } },
        ( err, sucess ) =>
        {
            if ( err ) {
                console.log( err )
            }
        }
    )
}
const DeleteEventLike = ( databaseId, arrayidupdate ) =>
{
    Event.findOneAndUpdate( { _id: databaseId }, { $pull: { like: arrayidupdate } },
        ( err, sucess ) =>
        {
            if ( err ) {
                console.log( err )
            }
        }
    )
}
const DeleteResepLike = ( databaseId, arrayidupdate ) =>
{
    Resep.findOneAndUpdate( { _id: databaseId }, { $pull: { like: arrayidupdate } },
        ( err, sucess ) =>
        {
            if ( err ) {
                console.log( err )
            }
        }
    )
}
const PullArrayUserResep = ( databaseId, arrayidupdate ) =>
{
    User.findOneAndUpdate( { _id: databaseId }, { $pull: { resepId: arrayidupdate } },
        ( err, sucess ) =>
        {
            if ( err ) {
                console.log( err )
                res.redirect( '/500' )
            }
        } )
}
const PullArrayUserEvent = ( databaseId, arrayidupdate ) =>
{
    User.findOneAndUpdate( { _id: databaseId }, { $pull: { eventId: arrayidupdate } },
        ( err, sucess ) =>
        {
            if ( err ) {
                console.log( err )
                res.redirect( '/500' )
            }
        } )
}
const PushArrayUserEvent = ( databaseId, arrayidupdate ) =>
{
    User.findOneAndUpdate( { _id: databaseId }, { $push: { eventId: arrayidupdate } },
        ( err, sucess ) =>
        {
            if ( err ) {
                console.log( err )
                res.redirect( '/500' )
            }
        } )
}
const PushArrayUserResep = ( databaseId, arrayidupdate ) =>
{
    User.findOneAndUpdate( { _id: databaseId }, { $push: { resepId: arrayidupdate } },
        ( err, sucess ) =>
        {
            if ( err ) {
                console.log( err )
                res.redirect( '/500' )
            }
        } )
}
module.exports = {
    PullArrayUserResep,
    PullArrayUserEvent,
    PushArrayUserEvent,
    PushArrayUserResep,
    UpdateResepLike,
    DeleteResepLike,
    DeleteEventLike,
    UpdateEventLike,
    DeleteResepComment,
    DeletePostLike,
    UpdateArrayPost,
    UpdateResepComment,
    DeleteEventComment,
    UpdateEventComment,
    DeleteArrayPost
}