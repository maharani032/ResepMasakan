const mongoose = require( 'mongoose' );

const Schema = mongoose.Schema;
const postSchema = new Schema( {
    judul: {
        type: String,
        required: true
    },
    createByDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    createByTime: {
        type: Number,

    }
} )