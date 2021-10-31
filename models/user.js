const mongoose = require( 'mongoose' )
const Schema = mongoose.Schema
const userSchema = new Schema( {
    googleId: String,
    name: {
        fname: {
            type: String,
            required: true,
        },
        lname: {
            type: String,
            required: true,
        }
    },
    pictureKey: {
        type: String,
        // required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,

    },
    admin: {
        type: Boolean,
        default: false
    },
    picture: String,

    eventId: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
    } ],

    resepId: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resep'
    } ],
    cart: {
        items: [
            {
                eventId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Event',

                },
                bahanId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Bahan',

                },
                quantity: { type: Number, required: true }
            }
        ]
    }
} )
userSchema.methods.addToCart = function ( bahan, event )
{
    const cartProductIndex = this.cart.items.findIndex( cp =>
    {
        if ( bahan != '' ) {
            if ( cp.bahanId != null ) {
                return cp.bahanId.toString() == bahan._id.toString()
            }


        }
        else if ( event != '' ) {
            if ( cp.eventId != null ) {
                return cp.eventId.toString() == event._id.toString()
            }

        }

    } )
    let newQuantity = 1;
    const updatedCartItems = [ ...this.cart.items ];

    if ( cartProductIndex >= 0 ) {
        newQuantity = this.cart.items[ cartProductIndex ].quantity + 1;
        updatedCartItems[ cartProductIndex ].quantity = newQuantity;
    } else {
        if ( event == '' ) {
            updatedCartItems.push( {
                // eventId: 0,
                bahanId: bahan._id,
                quantity: newQuantity
            } );
        }
        else if ( bahan == '' ) {
            console.log( event )
            console.log( 'coba update event' )
            updatedCartItems.push( {
                // bahanId: 0,
                eventId: event._id,
                quantity: newQuantity
            } );
        }

    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeFromCart = function ( bahanId )
{
    const updatedCartItems = this.cart.items.filter( item =>
    {
        return item.bahanId.toString() !== bahanId.toString()
    } )
    this.cart.items = updatedCartItems;
    return this.save()
}
userSchema.methods.clearCart = function ()
{
    this.cart = { items: [] };
    return this.save();
};
module.exports = mongoose.model( 'User', userSchema )