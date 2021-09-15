const path = require( 'path' );
const express = require( 'express' );
const mongoConnect = require( './util/database' ).mongoConnect;
const app = express();




app.set( 'view engine', 'ejs' );
app.set( 'views', 'views' );

mongoConnect( () =>
{
    console.log( '' );
    app.listen( 3000 );

} );
