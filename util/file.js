const fs = require( 'fs' )
const deleteFile = ( filePath, next ) =>
{
    fs.unlink( filePath, ( err ) =>
    {
        if ( err ) {
            // throw ( err )
            next()
        }
    } )
}

exports.deleteFile = deleteFile