const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy
const User = require( '../models/user' )
module.exports = ( passport ) =>
{
    passport.use( new GoogleStrategy( {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        // callbackURL: "https://cookbook-kel7.herokuapp.com/auth/google/webmasakan",
        callbackURL: 'http://localhost:3000/auth/google/webmasakan',
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
                picture: 'https://cookbook-kel7.s3.ap-southeast-1.amazonaws.com/icon/icon_profil.png',
                pictureKey: 'icon/icon_profil.png',
                resep: [],
                event: [],
                cart: { items: [] }
            }
            try {
                let user = await User.findOne( { googleId: profile.id } )

                if ( user ) {
                    done( null, user )
                } else {
                    user = await User.create( newUser )
                    done( null, user )
                }
            } catch ( err ) {
                console.log( err )
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
