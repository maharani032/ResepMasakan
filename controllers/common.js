const Event = require( '../models/event' )
const Comment = require( '../models/comment' )
const Resep = require( '../models/resep' )
const Like = require( '../models/like' )
const Bahan = require( '../models/bahan' )

const { UpdateEventComment,
    UpdateResepComment,
    DeleteEventComment,
    DeleteResepComment,
    DeleteEventLike,
    UpdateEventLike,
    UpdateResepLike,
    DeleteResepLike } = require( '../functions/function' )

exports.getEvent = ( req, res ) =>
{
    const EventId = req.params.eventId
    Event.findById( EventId )
        .then( event =>
        {
            Like.find( { eventId: EventId }, ( err, likes ) =>
            {
                Comment.find( { eventId: EventId }, ( err, comments ) =>
                {
                    res.render( 'event/event', {
                        pageTitle: event.nameEvent,
                        path: '/event/:eventId',
                        user: req.user,
                        event: event,
                        comments: comments,
                        likes: likes,
                        modeEventorResep: true,
                        //if true== comment.event,false==comment.resep
                    } )
                } )
            } )


        } ).catch( ( err ) =>
        {
            console.log( err )
            res.redirect( '/' )
        } )
}
exports.getResep = ( req, res ) =>
{
    const resepId = req.params.resepId
    const bahanId = []
    Resep.findById( resepId ).then( resep =>
    {
        Like.find( { resepId: resepId }, ( err, likes ) =>
        {
            Comment.find( { resepId: resepId }, ( err, comments ) =>
            {
                Bahan.find( {}, ( err, bahans ) =>
                {
                    bahans.forEach( bahan =>
                    {
                        let x = bahan._id
                        bahanId.push( x )
                    } )
                    res.render( 'resep/resep', {
                        pageTitle: resep.namaResep,
                        path: '/resep/:resepId',
                        user: req.user,
                        resep: resep,
                        likes: likes,
                        comments: comments,
                        modeEventorResep: false,
                        bahans: bahans,
                        bahanId: bahanId
                    } )
                } )

            } )
        } )

    } )
}
exports.getReseps = ( req, res ) =>
{
    const ITEM_PER_PAGE = 3;
    const page = + req.query.page || 1;
    let totalItems;
    Resep.find()
        .countDocuments()
        .then( numReseps =>
        {
            totalItems = numReseps
            return Resep.find()
                .skip( ( page - 1 ) * ITEM_PER_PAGE )
                .limit( ITEM_PER_PAGE )
        } ).then( reseps =>
        {
            res.render( 'resep/reseps', {
                reseps: reseps,
                pageTitle: 'Reseps',
                path: '/reseps',
                user: req.user,
                currentPage: page,
                hasNextPage: ITEM_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil( totalItems / ITEM_PER_PAGE )
            } )
        } ).catch( err =>
        {
            console.log( err )
            res.redirect( '/500' )
        } )
}
exports.getEvents = ( req, res ) =>
{
    const ITEM_PER_PAGE = 3;
    const page = + req.query.page || 1;
    let totalItems;
    Event.find()
        .countDocuments()
        .then( numReseps =>
        {
            totalItems = numReseps
            return Event.find()
                .skip( ( page - 1 ) * ITEM_PER_PAGE )
                .limit( ITEM_PER_PAGE )
        } ).then( events =>
        {
            res.render( 'event/events', {
                events: events,
                pageTitle: 'Event',
                path: '/events',
                user: req.user,
                currentPage: page,
                hasNextPage: ITEM_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil( totalItems / ITEM_PER_PAGE )
            } )
        } ).catch( err =>
        {
            console.log( err )
            res.redirect( '/500' )
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
        eventId: eventId,
        resepId: null
    } )
    comment.save().then( comment =>
    {
        console.log( comment )
        { UpdateEventComment( eventId, comment._id ) }

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
    Comment.findById( commentId ).then( ( comment ) =>
    {
        console.log( comment )
        let eventId = comment.eventId
        let resepId = comment.resepId

        if ( resepId == null ) {
            { DeleteEventComment( eventId, commentId ) }
        } else {
            { DeleteResepComment( resepId, commentId ) }
        }
        Comment.findByIdAndDelete( commentId, function ( err, docs )
        {
            if ( err ) {
                console.log( err )
            }
            res.redirect( '/' )
        } )
    } )
}
exports.postCommentResep = ( req, res ) =>
{
    const resepId = req.params.resepId
    const komentar = req.body.Komentar
    const fname = req.user.name.fname
    const lname = req.user.name.lname
    let id = req.user._id
    const comment = new Comment( {
        userId: id,
        resepId: resepId,
        name: {
            fname: fname,
            lname: lname
        },
        komentar: komentar,

    } )
    comment.save().then( comment =>
    {
        { UpdateResepComment( resepId, comment._id ) }
        res.redirect( '/resep/' + resepId )
    } ).catch( err =>
    {
        console.log( err )
        res.redirect( '/500' )
    } )
}
exports.postLikeEvent = ( req, res, next ) =>
{
    const eventId = req.params.eventId
    const id = req.user._id
    Like.find( { eventId: eventId, userId: req.user._id } ).then( like =>
    {
        console.log( like.length )
        if ( like.length == 0 ) {
            console.log( '' )
            const fname = req.user.name.fname
            const lname = req.user.name.lname
            const like = new Like( {
                userId: id,
                eventId: eventId,
                name: {
                    fname: fname,
                    lname: lname
                }
            } )
            like.save()
                .then( like =>
                {
                    { UpdateEventLike( eventId, like._id ) }
                    // { UpdateArrayPost( Event, eventId, like, like._id ) }


                    res.redirect( '/event/' + eventId )
                } ).catch( err =>
                {
                    console.log( err )
                    res.redirect( '/500' )
                } )
        }
        else {

            res.redirect( '/event/' + eventId )
        }
    } )
}
exports.deleteLikeEvent = ( req, res ) =>
{
    const likeId = req.params.likeId
    const eventId = req.params.eventId
    const id = req.user._id
    Like.findByIdAndDelete( likeId ).then( ( like ) =>
    {
        { DeleteEventLike( eventId, likeId ) }
        res.redirect( '/event/' + eventId )
    } ).catch( err =>
    {
        console.log( err )
    } )
}
exports.postlikeResep = ( req, res, next ) =>
{
    const resepId = req.params.resepId
    const id = req.user._id
    console.log( resepId )
    Like.find( { resepId: resepId, userId: id } ).then( like =>
    {
        console.log( like.length )
        if ( like.length == 0 ) {
            console.log( '' )
            const fname = req.user.name.fname
            const lname = req.user.name.lname
            const like = new Like( {
                userId: id,
                resepId: resepId,
                name: {
                    fname: fname,
                    lname: lname
                }
            } )
            like.save()
                .then( like =>
                {
                    { UpdateResepLike( resepId, like._id ) }
                    res.redirect( '/resep/' + resepId )
                } ).catch( err =>
                {
                    console.log( err )
                    res.redirect( '/500' )
                } )
        }
        else {
            res.redirect( '/resep/' + resepId )
        }
    } )
}
exports.deleteLikeResep = ( req, res, next ) =>
{
    const likeId = req.params.likeId
    const resepId = req.params.resepId
    const id = req.user._id
    Like.findByIdAndDelete( likeId ).then( ( like ) =>
    {
        { DeleteResepLike( resepId, likeId ) }
        res.redirect( '/resep/' + resepId )
    } ).catch( err =>
    {
        console.log( err )
    } )
}
exports.getResepsCategory = ( req, res ) =>
{
    const category = req.params.kategori
    console.log( category )
    const ITEM_PER_PAGE = 3;
    const page = + req.query.page || 1;
    let totalItems;
    Resep.find( { selectionOption: category } )
        .then( numReseps =>
        {
            const count = numReseps.length
            totalItems = count
            return Resep.find( { selectionOption: category } )
                .skip( ( page - 1 ) * ITEM_PER_PAGE )
                .limit( ITEM_PER_PAGE )
        } ).then( resepskategori =>
        {
            console.log( resepskategori.length )
            res.render( 'resep/reseps', {
                modeSort: true,
                pageTitle: 'Reseps',
                path: '/reseps/' + category,
                user: req.user,
                currentPage: page,
                hasNextPage: ITEM_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil( totalItems / ITEM_PER_PAGE ),
                reseps: resepskategori,
            } )
        } ).catch( err =>
        {
            console.log( err )
            res.redirect( '/500' )
        } )
}