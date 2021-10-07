const path = require( 'path' )

const Comment = require( '../models/comment' )
const Event = require( '../models/event' )
const Resep = require( '../models/resep' )
const User = require( '../models/user' )
const fileHelper = require( '../util/file' )

exports.getHome = ( req, res, next ) =>
{
    const user = req.user
    Event.find( {} ).sort( { createByDate: -1 } ).exec( function ( err, events )
    {
        Resep.find( {} ).sort( { createByDate: -1 } ).exec( function ( err, reseps )
        {
            res.render(
                'home',
                {
                    pageTitle: 'CookBook | Beranda',
                    path: '/',
                    user: user,
                    events: events,
                    reseps: reseps
                }
            )
        } )
    } )
}
exports.getAddResep = ( req, res, next ) =>
{
    var editMode = false
    res.render( 'resep/post-resep', {
        user: req.user,
        path: '/add-resep',
        pageTitle: 'Add Resep',
        editMode: editMode
    } )
}
exports.postAddResep = ( req, res, next ) =>
{
    const namaResep = req.body.namaResep
    const deskripsi = req.body.deskripsi
    const selectionOption = req.body.selectionOption
    const resepPicture = req.file
    const ImageResep = resepPicture.path.replace( '\\', '/' )
    const resep = new Resep( {
        userId: req.user._id,
        namaResep: namaResep,
        deskripsi: deskripsi,
        html: "",
        ImageResep: ImageResep.replace( '\\', '/' ),
        selectionOption: selectionOption,
        like: [],
        comment: []
    } )
    resep.save().then( resep =>
    {
        User.findOneAndUpdate( { _id: req.user.id }, { $push: { resepId: resep } },
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
        res.redirect( '/500' )

    } )
}
exports.postDeleteResep = ( req, res, next ) =>
{
    let resepId = req.params.resepId
    Resep.findById( resepId )
        .then( resep =>
        {
            if ( !resep ) {
                return next()
            }
            User.findOneAndUpdate( { _id: req.user._id }, { $pull: { resepId: resepId } },
                ( err, sucess ) =>
                {
                    if ( err ) {
                        console.log( err )
                        res.redirect( '/500' )
                    }
                } )
            Comment.find( { resepId: resepId } ).then( comments =>
            {
                var length = comments.length - 1;
                for ( length; length >= 0; length-- ) {
                    let id = resep.comment[ length ]
                    Comment.findByIdAndDelete( id, function ( err, docs )
                    {
                        if ( err ) {
                            console.log( err )
                        }
                        else {
                            console.log( 'deleted:', docs )
                        }
                    } )
                }
            } )
            fileHelper.deleteFile( resep.ImageResep )
            return Resep.deleteOne( { _id: resepId, userId: req.user._id } )
        } ).then( () =>
        {
            res.redirect( '/profil' )
        } ).catch( err =>
        {
            console.log( err )
            res.redirect( '/500' )
        } )
}
exports.getEditResep = ( req, res, next ) =>
{
    const editMode = req.query.edit
    if ( !editMode ) {
        return res.redirect( '/profil' )
    }
    let user = req.user
    let resepId = req.params.resepId
    Resep.findById( resepId )
        .then( resep =>
        {
            if ( !resep ) {
                return res.redirect( '/profil' )
            } res.render( 'resep/post-resep', {
                pageTitle: 'Edit Resep',
                path: 'edit-resep',
                resep: resep,
                user: user,
                editMode: true,
            } )
        } )
}
exports.postEditResep = ( req, res ) =>
{
    const updatenamaResep = req.body.namaResep
    const pictureResep = req.file.path.replace( '\\', '/' )
    const updatedeskripsi = req.body.deskripsi
    const resepId = req.params.resepId
    const updateSelectionOption = req.body.selectionOption
    Resep.findById( resepId ).then( resep =>
    {
        resep.namaResep = updatenamaResep
        resep.deskripsi = updatedeskripsi
        resep.selectionOption = updateSelectionOption
        if ( pictureResep ) {
            fileHelper.deleteFile( resep.ImageResep )
            resep.ImageResep = pictureResep.replace( '\\', '/' )
            // .replace( '\\', '/' )
        }
        return resep.save()
            .then( result =>
            {
                res.redirect( '/profil' )
            } ).catch( err =>
            {
                console.log( err )
                res.redirect( '/500' )
            } )
    } ).catch( err =>
    {
        console.log( err )
        res.redirect( '/500' )
    } )
}