const path = require( 'path' )
require( "dotenv" ).config()
const express = require( 'express' )
const session = require( 'express-session' )
const MongoDBStore = require( 'connect-mongodb-session' )( session )
const errorPage = require( './controllers/error' )
const mongoose = require( 'mongoose' )
const authRoutes = require( './routes/auth' )
const postRoutes = require( './routes/post' )
const adminRoutes = require( './routes/admin' )
const commonRoutes = require( './routes/common' )
const shopRoutes = require( './routes/shop' )
const passport = require( 'passport' )
require( './controllers/passport-auth-google' )( passport )
const User = require( './models/user' )
const app = express()
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
    res.locals.isAuthenticated = req.session.isLoggedIn
    next()
} )
app.use( ( req, res, next ) =>
{
    if ( !req.session.user ) {
        return next()
    } User.findById( req.session.user._id ).then( user =>
    {
        if ( !user ) {
            return next()
        }
        req.user = user
        next()
    } ).catch( err =>
    {
        next( new error( err ) )
    } )
} )
//-- session done
app.use( passport.initialize() )
app.use( passport.session() )

app.set( 'view engine', 'ejs' )
app.set( 'views', 'views' )
app.use( express.json() )
app.use( express.urlencoded( { extended: true } ) )
app.use( '/images', express.static( path.join( __dirname, 'images' ) ) )
app.use( express.static( "public" ) )
app.use( postRoutes )
app.use( authRoutes )
app.use( adminRoutes )
app.use( commonRoutes )
app.use( shopRoutes )
app.get( '/500', errorPage.get500 )
app.use( errorPage.get404 )
mongoose
    .connect( process.env.DB,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,   
            autoIndex: true,
        } )
    .then( result => 
    {
        app.listen( 3000 )
        console.log( 'connection to database on port http://localhost:3000' )
    } ).catch( err =>
    {
        console.log( err )
    } )