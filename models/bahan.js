const mongoose = require( 'mongoose' )
const Schema = mongoose.Schema
const bahanSchema = new Schema( {
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    namaBahan: {
        type: String,
        required: true,
    },
    harga: {
        type: Number,
        required: true
    },
    Deskripsi: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
} )
module.exports = mongoose.model( 'Bahan', bahanSchema )