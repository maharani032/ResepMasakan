const mongoose = require( 'mongoose' )
const { stringify } = require( 'uuid' )
const Schema = mongoose.Schema
const commentSchema = new Schema( {
    userId: [ {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    } ],
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
    resep: [ {
        type: Schema.Types.ObjectId,
        ref: 'Resep',
        required: true
    } ]
} )
module.exports = mongoose.model( 'Comment', commentSchema )