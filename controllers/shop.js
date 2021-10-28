require( "dotenv" ).config()
const Bahan = require( '../models/bahan' )
const Event = require( '../models/event' )
const User = require( '../models/user' )
const Order = require( '../models/order' );
const stripe = require( 'stripe' )( process.env.API_KEY_STRIPE_SECRET )
exports.postAddCart = ( req, res ) =>
{
    const bahanId = req.body.bahanId
    const eventId = req.body.eventId
    if ( bahanId == null ) {
        Event.findById( eventId ).then( event =>
        {
            return req.user.addToCart( "", event )
        } ).then( result =>
        {
            console.log( result )
            res.redirect( '/' )
        } ).catch(
            err =>
            {
                console.log( err )
                res.redirect( '/500' )
            }
        )
    }
    else if ( eventId == null ) {
        Bahan.findById( bahanId )
            .then( bahan =>
            {
                return req.user.addToCart( bahan, "" )
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

}
exports.getCart = ( req, res, next ) =>
{
    // console.log( req.user )
    User.findById( req.user._id )
        .populate( 'cart.items.bahanId' )
        .populate( 'cart.items.eventId' )
        .then( user =>
        {
            let sum = 0
            const item = user.cart.items

            res.render( 'product/cart', {
                path: '/cart',
                pageTitle: 'Cart',
                items: item,
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
    let item
    let total = 0
    User.findById( req.user._id )
        .populate( 'cart.items.bahanId' )
        .populate( 'cart.items.eventId' )
        .then( user =>
        {
            total = 0
            item = user.cart.items
            item.forEach( b =>
            {
                if ( b.bahanId ) {
                    total = total + ( b.quantity * b.bahanId.harga )
                }
                else if ( b.eventId ) {
                    total = total + ( b.quantity * b.eventId.Harga )
                }
                // console.log( 'disini' + b.bahanId )

                // total = total + ( b.quantity * b.eventId.Harga ) + ( b.quantity * b.bahanId.harga )

                console.log( total )

            } )
            return stripe.checkout.sessions.create( {
                payment_method_types: [ 'card' ],
                line_items: item.map( b =>
                {
                    if ( b.bahanId ) {
                        return {
                            name: b.bahanId.namaBahan,
                            amount: Math.round( b.bahanId.harga / 15000 * 100 ),
                            currency: 'usd',
                            quantity: b.quantity
                        };
                    }
                    if ( b.eventId ) {
                        return {
                            name: b.eventId.nameEvent,
                            amount: Math.round( b.eventId.Harga / 15000 * 100 ),
                            currency: 'usd',
                            quantity: b.quantity
                        };
                    }
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
                items: item,
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
        .populate( 'cart.items.eventId' )
        .then( user =>
        {
            const item = user.cart.items.map( i =>
            {
                if ( i.bahanId ) {
                    console.log( i )
                    return { quantity: i.quantity, item: { ...i.bahanId._doc } }
                }
                else if ( i.eventId ) {
                    console.log( i )
                    return { quantity: i.quantity, item: { ...i.eventId._doc } }
                }
            } )
            // const bahan = ser.cart.items.map( i =>
            // {


            // } )
            const order = new Order( {
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                item: item

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
            // res.redirect( '/500' )
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
exports.getOrder = ( req, res ) =>
{
    Order.find( { 'user.userId': req.user._id } )
        .then( orders =>
        {

            res.render( 'product/order', {
                path: '/order',
                pageTitle: 'Your Order',
                orders: orders,
                user: req.user
            } )
        } ).catch( err =>
        {
            console.log( err )
        } )
}