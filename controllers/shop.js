Bahan = require( '../models/bahan' )
exports.postAddCart = ( req, res ) =>
{
    const bahanId = req.body.bahanId
    Bahan.findById( bahanId )
        .then( bahan =>
        {
            return req.user.addToCart( bahan )
        } )
        .then( result =>
        {
            console.log( result )
            res.redirect( '/' )

        } )
        .catch(
            err =>
            {
                console.log( err )
                res.redirect( '/500' )
            }
        )
}