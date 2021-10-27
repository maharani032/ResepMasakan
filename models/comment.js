const mongoose = require( 'mongoose' )
const marked = require( 'marked' )
const createDomPurify = require( 'dompurify' )
const { JSDOM } = require( 'jsdom' )
const dompurify = createDomPurify( new JSDOM().window )

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
    eventId: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
    } ],
    resepId: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resep',
    } ]
    , html: {
        type: String,
        required: true,
    },
} )
commentSchema.pre( "validate", function ( next ) 
{
    if ( this.komentar ) {
        var mark = marked( this.komentar )
        this.html = dompurify.sanitize( mark )
        // this.html = dompurify.sanitize( this.komentar )
    }
    next()
} );
module.exports = mongoose.model( 'Comment', commentSchema )