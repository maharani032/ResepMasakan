function disableform ( formId )
{
    var f = document.forms[ formId ].getElementsByTagName( 'input' );
    for ( var i = 0; i < f.length; i++ )
        f[ i ].disabled = true
}

function enableform ( formId )
{
    var f = document.forms[ formId ].getElementsByTagName( 'input' );
    for ( var i = 0; i < f.length; i++ )
        f[ i ].disabled = false
}
$( document ).ready( function ()
{
    $( '#profile-picture' ).click( function ()
    {
        $( '#input-gambar' ).click()
    } )
    disableform( 'profil' )
    var update = $( '#update' )
    var save = $( '#save' )
    save.hide()
    update.click( function ()
    {
        save.show()
        update.hide()
        enableform( 'profil' )
    } )
    save.click( function ()
    {
        save.hide()
        update.show()
        disableform( 'profil' )
    } )
} )

