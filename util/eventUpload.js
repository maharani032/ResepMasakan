require( 'dotenv' ).config()
const aws = require( 'aws-sdk' )
const multer = require( 'multer' )
const multerS3 = require( 'multer-s3' )
const path = require( 'path' )
const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const { v4: uuidv4 } = require( 'uuid' );
const s3 = new aws.S3( {
    accessKeyId,
    secretAccessKey,
    region,
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

const imageEventStorage = multerS3( {
    s3,
    bucket: bucketName,
    metadata: ( req, file, cb ) =>
    {
        cb( null, { fieldName: file.fieldname } )
    },
    key: ( req, file, cb ) =>
    {

        cb( null, 'event-picture' + '/' + 'upload' + " - " + 'imageEvent' + ' - ' + uuidv4() + file.originalname )
    }
} )
const imageResepStorage = multerS3( {
    s3,
    bucket: bucketName,
    metadata: ( req, file, cb ) =>
    {
        cb( null, { fieldName: file.fieldname } )
    },
    key: ( req, file, cb ) =>
    {

        cb( null, 'resep-picture' + '/' + 'upload' + " - " + 'imageResep' + ' - ' + uuidv4() + file.originalname )
    }
} )

const profilStorage = multerS3( {
    s3,
    bucket: bucketName,
    metadata: ( req, file, cb ) =>
    {
        cb( null, { fieldName: file.fieldname } )
    },
    key: ( req, file, cb ) =>
    {

        cb( null, 'profil-picture' + '/' + 'upload' + " - " + 'profil' + ' - ' + uuidv4() + file.originalname )
    }
} )



const productStorage = multerS3( {
    s3,
    bucket: bucketName,
    metadata: ( req, file, cb ) =>
    {
        cb( null, { fieldName: file.fieldname } )
    },
    key: ( req, file, cb ) =>
    {

        cb( null, 'product-picture' + '/' + 'upload' + " - " + 'bahan' + ' - ' + uuidv4() + file.originalname )
    }
} )
const deletefile = ( filekey ) =>
{
    console.log( 'in here' )
    s3.deleteObject( {
        Bucket: bucketName,
        Key: filekey
    }, function ( err, data )
    {
        if ( err ) {

            console.log( err )
        }
        else {
            console.log( "harus delete" )
        }
    } )
}
const Eventupload = multer( { storage: imageEventStorage, fileFilter: ImageFilter } );
const Resepupload = multer( { storage: imageResepStorage, fileFilter: ImageFilter } )
const Bahanupload = multer( { storage: productStorage, fileFilter: ImageFilter } )
const Profilupload = multer( { storage: profilStorage, fileFilter: ImageFilter } )
module.exports = { Eventupload, deletefile, Resepupload, Profilupload, Bahanupload }

