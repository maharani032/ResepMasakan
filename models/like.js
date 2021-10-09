const mongoose = require( 'mongoose' );
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const likeSchema=new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        Unique:true,
        ref: 'User',
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
    eventId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
    } ,
    resepId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resep',
    } 
}) 
// likeSchema.pre('validate',function(){
//     if(this.userId)
// })
likeSchema.plugin(uniqueValidator);
module.exports = mongoose.model( 'Like', likeSchema )