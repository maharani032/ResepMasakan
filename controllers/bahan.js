const User = require( '../models/user' )
const Bahan = require( '../models/bahan' )
const fileHelper = require( '../util/file' )
const Resep = require( '../models/resep' )
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
        Resep.findOneAndUpdate( { bahanid: bahanid }, { $pull: { bahanId: bahanid } },
            ( err, sucess ) =>
            {
                if ( err ) {
                    console.log( err )
                }
            } )
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
exports.EditProduct = ( req, res ) =>
{
    const editMode = req.query.edit
    if ( !editMode ) {
        return res.redirect( '/profil' )
    }
    const bahanId = req.params.bahanId
    Bahan.findById( bahanId ).then( bahan =>
    {
        if ( !bahan ) {
            return res.redirect( '/profil' )
        } res.render(
            'product/post-bahan',
            {
                pageTitle: 'add Product',
                path: '/add-product',
                user: req.user,
                editMode: true,
                bahanId: bahanId,
                bahan: bahan
            }
        )
    } )

}
exports.postEditProduct = ( req, res ) =>
{
    const bahanId = req.params.bahanId
    const namaBahan = req.body.namaBahan
    const harga = req.body.hargaBahan
    const file = req.file
    const image = file.path.replace( '\\', '/' )
    const deskripsi = req.body.deskripsiBahan
    // console.log( bahanId, namaBahan, harga, deskripsi )
    Bahan.findById( bahanId ).then( bahan =>
    {
        bahan.namaBahan = namaBahan
        bahan.harga = harga
        bahan.Deskripsi = deskripsi
        if ( image ) {
            fileHelper.deleteFile( bahan.image )
            bahan.image = image.replace( '\\', '/' )
        }
        return bahan.save()
            .then( res.redirect( '/profil' ) )
            .catch( err =>
            {
                console.log( err )
                res.redirect( '/profil' )
            } )
    } ).catch( err =>
    {
        console.log( err )
        res.redirect( '/500' )
    } )
}