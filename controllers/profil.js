const path = require( 'path' )
const Event = require( '../models/event' )
const Resep = require( '../models/resep' )
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
exports.postUpdateProfil = ( req, res, next ) =>
{
    // const fname = req.body.fname
    // const lname = req.body.lname
    // const email = req.body.email
    console.log( req.body )
}