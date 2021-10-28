const mongoose = require( 'mongoose' );

const Schema = mongoose.Schema;

const orderSchema = new Schema( {
    item: [
        {
            item: { type: Object, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    // item: [ {
    //     bahanId: {
    //         bahan: { type: Object },
    //         quantity: { type: Number, }
    //     },
    //     eventId: {
    //         event: { type: Object },
    //         quantity: { type: Number }
    //     }
    // } ],
    user: {
        email: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }
} );

module.exports = mongoose.model( 'Order', orderSchema );