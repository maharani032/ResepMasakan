const mongoose = require( 'mongoose' )
const Schema = mongoose.Schema
const commentSchema = new Schema( {
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        fname: {
            type: String,
            required: true
        },
        lname: {
            type: String,
            required: true
        }
    },
    komentar: {
        type: String,
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
    },
    resepId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'resep',
    }

} )
module.exports = mongoose.model( 'Comment', commentSchema )