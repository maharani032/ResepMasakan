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
    link: String,
    Image: String,
    nameEvent: String,
    Deskripsi: String,
    Ondate: {
        type: Date,
        required: true
    }
} );
module.exports = mongoose.model( events, eventSchema );