const path = require( 'path' )
const Event = require( '../models/event' )
const Resep = require( '../models/resep' )
const User = require( '../models/user' )
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
    const resepPicture = req.file
    const ImageResep = resepPicture.path.replace( '\\', '/' )
    const resep = new Resep( {
        userId: req.user._id,
        namaResep: namaResep,
        deskripsi: deskripsi,
        html: '',
        ImageResep: ImageResep,
        like: []
    } )
    resep.save().then( resep =>
    {
        User.findOneAndUpdate( { _id: req.user.id }, { $push: { resep: { resepId: resep._id } } },
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