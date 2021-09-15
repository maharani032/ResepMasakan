require( "dotenv" ).config();
const { MongoClient } = require( 'mongodb' );
let _db;

const mongoConnect = ( callback ) =>
{
    MongoClient.connect( process.env.DB )
        .then( client =>
        {
            console.log( 'connection to database' );
            _db = client.db();
            callback( client );
        } )
        .catch( err =>
        {
            console.log( err );
        } )
}
const getDb = () =>
{
    if ( _db ) {
        return _db;
    }
    throw 'No database found';
}
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;