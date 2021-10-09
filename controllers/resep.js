const path = require( 'path' )

const Comment = require( '../models/comment' )
const Event = require( '../models/event' )
const Resep = require( '../models/resep' )
const User = require( '../models/user' )
const fileHelper = require( '../util/file' )
const { UpdateArrayPost, DeleteArrayPost, PullArrayUserResep, PushArrayUserResep } = require( '../functions/function' )
const Bahan = require( '../models/bahan' )
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
    Bahan.find( {}, ( err, bahans ) =>
    {
        res.render( 'resep/post-resep', {
            user: req.user,
            path: '/add-resep',
            pageTitle: 'Add Resep',
            editMode: editMode,
            bahans: bahans
        } )
    } )
}


exports.postAddResep = ( req, res, next ) =>
{
    const id = req.user._id
    const namaResep = req.body.namaResep
    const deskripsi = req.body.deskripsi
    const selectionOption = req.body.selectionOption
    const resepPicture = req.file
    const ImageResep = resepPicture.path.replace( '\\', '/' )
    const bahan = req.body.bahan
    const bahanId = []

    bahan.forEach( id =>
    {
        let x = id.split( '-' )[ 0 ]
        bahanId.push( x )
    } );

    const resep = new Resep( {
        userId: req.user._id,
        namaResep: namaResep,
        deskripsi: deskripsi,
        html: "",
        ImageResep: ImageResep.replace( '\\', '/' ),
        selectionOption: selectionOption,
        like: [],
        comment: [],
        bahanId: bahanId,
    } )
    resep.save().then( resep =>
    {
        { PushArrayUserResep( id, resep._id ) }
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
    let id = req.user._id
    let resepID = req.user.resepId
    Resep.findById( resepId )
        .then( resep =>
        {
            if ( !resep ) {
                return next()
            }
            { PullArrayUserResep( id, resepId ) }
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
            }
            Bahan.find( {}, ( err, bahans ) =>
            {
                res.render( 'resep/post-resep', {
                    pageTitle: 'Edit Resep',
                    path: 'edit-resep',
                    resep: resep,
                    user: user,
                    editMode: true,
                    bahans: bahans
                } )
            } )

        } )
}
exports.postEditResep = ( req, res ) =>
{
    const updatenamaResep = req.body.namaResep
    const pictureResep = req.file.path.replace( '\\', '/' )
    const updatedeskripsi = req.body.deskripsi
    const resepId = req.params.resepId
    const bahan = req.body.bahan
    const updatebahanId = []

    bahan.forEach( id =>
    {
        let x = id.split( '-' )[ 0 ]
        updatebahanId.push( x )
    } );
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
        if ( updatebahanId ) {
            resep.bahanId = updatebahanId
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