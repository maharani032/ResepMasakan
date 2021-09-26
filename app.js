const path = require( 'path' );
require( "dotenv" ).config();
const express = require( 'express' );
const session = require( 'express-session' );
const MongoDBStore = require( 'connect-mongodb-session' )( session );
const errorPage = require( './controllers/error' );
const mongoose = require( 'mongoose' )
const authRoutes = require( './routes/auth' );
const postRoutes = require( './routes/post' );
const adminRoutes = require( './routes/admin' );
const passport = require( 'passport' )
require( './controllers/passport-auth-google' )( passport )

const User = require( './models/user' );
const app = express();
const multer = require( 'multer' );
//session
const store = new MongoDBStore( {
    uri: process.env.DB,
    collection: 'sessions'
} )
app.use( session( {
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    store: store
} ) )
app.use( ( req, res, next ) =>
{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
} )
app.use( ( req, res, next ) =>
{
    if ( !req.session.user ) {
        return next();
    } User.findById( req.session.user._id ).then( user =>
    {
        if ( !user ) {
            return next();
        }
        req.user = user;
        next();
    } ).catch( err =>
    {
        next( new error( err ) );
    } )
} )
//-- session done
app.use( passport.initialize() )
app.use( passport.session() )
const imageEventStorage = multer.diskStorage( {
    destination: ( req, file, cb ) =>
    {
        cb( null, 'images' );
    },
    filename: ( req, file, cb ) =>
    {

        cb( null, 'upload' + " - " + 'imageEvent' + ' - ' + file.originalname );
    }
} );
const ImageFilter = ( req, file, cb ) =>
{
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb( null, true );
    }
    else {
        cb( null, false );

    }
}
app.set( 'view engine', 'ejs' );
app.set( 'views', 'views' );
app.use( express.urlencoded( { extended: false } ) );
app.use( multer( {
    // dest: 'images',
    storage: imageEventStorage,
    fileFilter: ImageFilter
} ).single( 'ImageEvent' ) )
app.use( express.static( "public" ) );
app.use( '/images', express.static( path.join( __dirname, 'images' ) ) );
app.use( postRoutes );
app.use( authRoutes );
app.use( adminRoutes );

app.use( errorPage.get404 );
mongoose
    .connect( process.env.DB,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } )
    .then( result => 
    {
        app.listen( 3000 );
        console.log( 'connection to database on port 3000' );
    } ).catch( err =>
    {
        console.log( err );
    } )