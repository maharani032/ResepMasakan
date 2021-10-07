const multer = require( 'multer' )
const path = require( 'path' )

const { v4: uuidv4 } = require( 'uuid' );

const imageEventStorage = multer.diskStorage( {
    destination: ( req, file, cb ) =>
    {
        cb( null, 'images/event' )
    },
    filename: ( req, file, cb ) =>
    {

        cb( null, 'upload' + " - " + 'imageEvent' + ' - ' + uuidv4() + file.originalname )
    }
} )
const ImageFilter = ( req, file, cb ) =>
{
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb( null, true )
    }
    else {
        cb( null, false )

    }
}
const imageResepStorage = multer.diskStorage( {
    destination: ( req, file, cb ) =>
    {
        cb( null, 'images/resep' )
    },
    filename: ( req, file, cb ) =>
    {

        cb( null, 'upload' + " - " + 'imageResep' + ' - ' + uuidv4() + file.originalname )
    }
} )
const profilStorage = multer.diskStorage( {
    destination: ( req, file, cb ) =>
    {
        cb( null, 'images/profil' )
    },
    filename: ( req, file, cb ) =>
    {

        cb( null, 'upload' + " - " + 'profil' + ' - ' + uuidv4() + file.originalname )
    }
} )
const Eventupload = multer( { storage: imageEventStorage, fileFilter: ImageFilter } );
const Resepupload = multer( { storage: imageResepStorage, fileFilter: ImageFilter } )
const Profilupload = multer( { storage: profilStorage, fileFilter: ImageFilter } )
module.exports = { Eventupload, Resepupload, Profilupload }