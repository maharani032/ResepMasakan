require( "dotenv" ).config()
const Bahan = require( '../models/bahan' )
const User = require( '../models/user' )
const Order = require( '../models/order' );
const stripe = require( 'stripe' )( process.env.API_KEY_STRIPE_SECRET )
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
exports.getCheckOut = ( req, res ) =>
{
    let bahan
    let total = 0
    User.findById( req.user._id )
        .populate( 'cart.items.bahanId' )
        .then( user =>
        {
            total = 0
            bahan = user.cart.items
            bahan.forEach( b =>
            {
                total += b.quantity * b.bahanId.harga
            } )
            return stripe.checkout.sessions.create( {
                payment_method_types: [ 'card' ],
                line_items: bahan.map( b =>
                {
                    return {
                        name: b.bahanId.namaBahan,
                        amount: Math.round( b.bahanId.harga / 15000 * 100 ),
                        currency: 'usd',
                        quantity: b.quantity
                    };
                } ),
                success_url: req.protocol + '://' + req.get( 'host' ) + '/checkout/sucess',
                cancel_url: req.protocol + '://' + req.get( 'host' ) + '/checkout/cancel',
            } );
        } )
        .then( session =>
        {

            res.render( 'product/checkout', {
                path: '/checkout',
                pageTitle: 'checkout',
                bahans: bahan,
                user: req.user,
                totalSum: total,
                sessionId: session.id,
                API_KEY_STRIPE: process.env.API_KEY_STRIPE,
            } )
        } )
        .catch( err =>
        {
            console.log( err )
        } )
}
exports.getCheckOutSuccess = ( req, res ) =>
{
    User.findById( req.user._id )
        .populate( 'cart.items.bahanId' )
        .then( user =>
        {
            const bahans = user.cart.items.map( i =>
            {
                return { quantity: i.quantity, bahan: { ...i.bahanId._doc } }
            } )
            const order = new Order( {
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                bahans: bahans
            } )
            return order.save()
        } ).then( result =>
        {
            return req.user.clearCart()
        } )
        .then( () =>
        {
            res.redirect( '/' );
        } ).catch( err =>
        {
            console.log( err )
            res.redirect( '/500' )
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