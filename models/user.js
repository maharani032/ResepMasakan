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
        ref: 'resep'
    } ]


} )

module.exports = mongoose.model( 'User', userSchema )