const path = require( 'path' );
require( "dotenv" ).config();
const express = require( 'express' );
const errorPage = require( './controllers/error' );
const mongoose = require( 'mongoose' )
const flash = require( 'connect-flash' );
const app = express();




app.set( 'view engine', 'ejs' );
app.set( 'views', 'views' );
app.use( express.urlencoded( { extended: false } ) );
app.use( express.static( "public" ) );

const authRoutes = require( './routes/auth' );
app.use( authRoutes );
app.use( flash() );
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