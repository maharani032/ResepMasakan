exports.getRegister = ( req, res, next ) =>
{
    res.render(
        'auth/register',
        {
            pageTitle: 'Register',
            path: '/register'
        } );
};
exports.getLogIn = ( req, res, next ) =>
{
    res.render(
        'auth/login',
        {
            pageTitle: 'Log In',
            path: '/login'
        } );
};