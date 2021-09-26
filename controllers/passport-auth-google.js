const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy
const User = require( '../models/user' )
module.exports = ( passport ) =>
{
    passport.use( new GoogleStrategy( {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/webmasakan",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
        async ( accessToken, refreshToken, profile, done ) =>
        {
            const newUser = {
                googleId: profile.id,
                name: {
                    fname: profile.name.givenName,
                    lname: profile.name.familyName,
                },
                email: profile.emails[ 0 ].value,
                picture: profile.photos[ 0 ].value,
            }
            try {
                let user = await User.findOne( { googleId: profile.id } )

                if ( user ) {
                    done( null, user )
                    console.log( 'user ada' );
                } else {
                    user = await User.create( newUser )
                    console.log( 'create user' )
                    done( null, user )
                }
            } catch ( err ) {
                console.error( err )
            }
        }
    )
    )

    passport.serializeUser( ( user, done ) =>
    {
        done( null, user.id )
    } )

    passport.deserializeUser( ( id, done ) =>
    {
        User.findById( id, ( err, user ) => done( err, user ) )
    } )
}