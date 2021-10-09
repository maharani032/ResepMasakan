const User = require( '../models/user' )
const Bahan = require( '../models/bahan' )
const fileHelper = require( '../util/file' )

exports.getAddProduct = ( req, res ) =>
{
    res.render(
        'product/post-bahan',
        {
            pageTitle: 'add Product',
            path: '/add-product',
            user: req.user,
            editMode: false
        }
    )
}
exports.postAddProduct = ( req, res ) =>
{
    const namaBahan = req.body.namaBahan
    const harga = req.body.hargaBahan
    const file = req.file
    const image = file.path.replace( '\\', '/' )
    const deskripsi = req.body.deskripsiBahan
    const bahan = new Bahan( {
        userId: req.user._id,
        namaBahan: namaBahan,
        harga: harga,
        Deskripsi: deskripsi,
        image: image
    } )
    bahan.save().then( bahan =>
    {
        res.redirect( '/' )
    } ).catch( err =>
    {
        console.log( err )
        res.redirect( '/500' )
    } )
}
exports.DeleteProduct = ( req, res ) =>
{
    const bahanid = req.params.bahanId
    Bahan.findById( bahanid ).then( bahan =>
    {

        fileHelper.deleteFile( bahan.image )
        return Bahan.deleteOne( { _id: bahanid, userId: req.user._id } )

    } ).then( () =>
    {
        res.redirect( '/profil' )
    } ).catch( err =>
    {
        console.log( err )
        res.redirect( '/500' )
    } )
}