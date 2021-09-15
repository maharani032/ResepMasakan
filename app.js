const path = require( 'path' );
const express = require( 'express' );
const errorPage = require( './controllers/error' );

const mongoConnect = require( './util/database' ).mongoConnect;
const app = express();




app.set( 'view engine', 'ejs' );
app.set( 'views', 'views' );
app.use( express.static( "public" ) );



app.use( errorPage.get404 );
mongoConnect( () =>
{
    console.log( '' );
    app.listen( 3000 );

} );
