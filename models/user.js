const mongoose = require( 'mongoose' );

const Schema = mongoose.Schema;
const userSchema = new Schema( {
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
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    event: [ {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'event',
        },
    } ]
} )

module.exports = mongoose.model( 'User', userSchema );