const mongoose = require( 'mongoose' )
const marked = require( 'marked' )
const createDomPurify = require( 'dompurify' )
const { JSDOM } = require( 'jsdom' )
const dompurify = createDomPurify( new JSDOM().window )
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
    Kapasitas: { type: Number, required: true },
    imageKey:{type:String,required:true},
    Harga: { type: Number, required: true },
    ImageEvent: { type: String, required: true },
    nameEvent: { type: String, required: true },
    Deskripsi: { type: String, required: true },

    html: {
        type: String,
        required: true,
    },
    Ondate: {
        type: Date,
        required: true
    },
    like: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
    } ],
    commentId: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    } ]
} )
eventSchema.pre( "validate", function ( next ) 
{
    if ( this.Deskripsi ) {
        this.html = dompurify.sanitize( marked( this.Deskripsi ) )
    }

    next()
} );
module.exports = mongoose.model( 'Event', eventSchema )