const mongoose = require( 'mongoose' )

const Schema = mongoose.Schema
const eventSchema = new Schema( {
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createByDate: {
        type: Date,
        default: Date.now(),
        required: true
    },
    tempat: String,
    ImageEvent: { type: String, required: true },
    nameEvent: { type: String, required: true },
    Deskripsi: { type: String, required: true },
    Ondate: {
        type: Date,
        required: true
    },
    like: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    } ]
} )

module.exports = mongoose.model( 'Event', eventSchema )