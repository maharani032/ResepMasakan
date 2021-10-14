const Bahan = require( '../models/bahan' )
const User = require( '../models/user' )
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
exports.getCart = ( req, res, next ) =>
{
    // console.log( req.user )
    User.findById( req.user._id )
        .populate( 'cart.items.bahanId' )
        .then( user =>
        {
            let sum = 0
            const bahans = user.cart.items
            console.log( bahans )
            res.render( 'product/cart', {
                path: '/cart',
                pageTitle: 'Cart',
                bahans: bahans,
                user: req.user,
                sum: sum
            } )
        } )
        .catch( err =>
        {
            console.log( err )
        } )
}
exports.postDeleteItemCart = ( req, res ) =>
{
    const bahanId = req.body.bahanId
    req.user
        .removeFromCart( bahanId )
        .then( result =>
        {
            res.redirect( '/cart' )
        } )
        .catch( err =>
        {
            console.log( err )
            res.redirect( '/500' )
        } )
}