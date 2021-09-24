const mongoose = require( 'mongoose' );

const Schema = mongoose.Schema;
const eventSchema = new Schema( {
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    createByDate: {
        type: Date,
        default: Date.now
    },
    tempat: String,
    ImageEvent: { type: String, required: true },
    nameEvent: String,
    Deskripsi: String,
    Ondate: {
        type: Date,
        required: true
    },
    like: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    } ]
} );
module.exports = mongoose.model( 'Event', eventSchema );