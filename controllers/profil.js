const path = require( 'path' )
const { deletefile } = require( '../util/eventUpload' )
const Event = require( '../models/event' )
const Resep = require( '../models/resep' )
const User = require( '../models/user' )
const fileHelper = require( '../util/file' )
const Bahan = require( '../models/bahan' )
const e = require( 'connect-flash' )
exports.postUpdateProfil = ( req, res ) =>
{
    const fname = req.body.fname
    const lname = req.body.lname
    const email = req.body.email

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

        if ( user.picture != null ) {
            let imagePicture = req.file.location
            let pictureKey = req.file.key
            console.log( 'disini' )
            if ( user.pictureKey == '' ) {
                user.pictureKey = pictureKey
                user.picture = imagePicture
            } else {
                console.log( 'sss' )
                deletefile( user.pictureKey )
                user.pictureKey = pictureKey
                user.picture = imagePicture
            }

        }
        else if ( user.picture == null ) {
            console.log( 'disana' )
            let imagePicture = req.file.location
            let pictureKey = req.file.key
            user.picture = imagePicture
            user.pictureKey = pictureKey
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
            Bahan.find( { userId: id }, ( err, bahans ) =>
            {
                if ( !err ) {
                    res.render( 'profil', {
                        path: '/profil',
                        pageTitle: 'Profil',
                        user: user,
                        events: event,
                        reseps: reseps,
                        bahans: bahans
                    } )
                } else {
                    console.log( err )
                    res.redirect( '/500' )

                }
            } )

        } )
    } )


}
