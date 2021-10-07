const path = require( 'path' )
const Event = require( '../models/event' )
const Resep = require( '../models/resep' )
const User = require( '../models/user' )
const fileHelper = require( '../util/file' )

exports.postUpdateProfil = ( req, res ) =>
{
    const fname = req.body.fname
    const lname = req.body.lname
    const email = req.body.email
    const imagePicture = req.file.path.replace( "\\", "/" )
    console.log( fname, lname, email )
    User.findById( req.user._id ).then( user =>
    {
        user.name.fname = fname
        user.name.lname = lname
        // user.email = user.email
        user.event = user.event
        user.resep = user.resep
        console.log( email )
        if ( user.googleId === null || user.googleId === '' ) {
            user.email = email
        }
        else if ( user.googleId != null && user.googleId != '' ) {
            user.email = user.email
        }

        if ( imagePicture ) {
            fileHelper.deleteFile( user.picture )
            user.picture = imagePicture.replace( '\\', '/' )
        }
        return user.save()
            .then( result =>
            {
                console.log( 'be save' )
                res.redirect( '/profil' )
            } ).catch( err =>
            {
                console.log( err )
                res.redirect( '/500' )
            } )
    } )

}
exports.getProfile = ( req, res, next ) =>
{
    let id = req.user._id
    let user = req.user
    Event.find( { userId: id } ).sort( { createByDate: -1 } ).exec( function ( err, event )
    {
        Resep.find( { userId: id } ).sort( { createByDate: -1 } ).exec( function ( err, reseps )
        {
            if ( !err ) {
                res.render( 'profil', {
                    path: '/profil',
                    pageTitle: 'Profil',
                    user: user,
                    events: event,
                    reseps: reseps
                } )
            } else {
                console.log( err )
                res.redirect( '/500' )

            }
        } )
    } )


}
