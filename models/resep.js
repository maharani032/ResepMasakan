const mongoose = require( 'mongoose' );
const marked = require( 'marked' )
const createDomPurify = require( 'dompurify' )
const { JSDOM } = require( 'jsdom' )
const dompurify = createDomPurify( new JSDOM().window )
const Schema = mongoose.Schema;
const resepSchema = new Schema( {
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    namaResep: {
        type: String,
        required: true
    },
    selectionOption: {
        type: String,
        required: true
    },
    createByDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    deskripsi: {
        type: String,
        required: true
    },
    ImageResep: {
        type: String,
        required: true
    },
    html: {
        type: String,
        required: true
    },
    like: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    } ]
} )
resepSchema.pre( "validate", function ( next ) 
{
    if ( this.deskripsi ) {
        this.html = dompurify.sanitize( marked( this.deskripsi ) )
    }
    next()
} );
module.exports = mongoose.model( 'Resep', resepSchema )