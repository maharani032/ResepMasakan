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
    // disableform( 'profil' )
    var update = $( '#update' )
    var save = $( '#save' )
    save.hide()
    // alert( save.hide() )
    if ( save === save.hide() ) {
        disableform( 'profil' )
    }
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
        // disableform( 'profil' )
    } )
    var resepbtn = $( '#resep-button' )
    var eventbtn = $( '#event-button' )
    var bahanbtn = $( '#bahan-button' )
    var resep = $( '#resep' )
    var event = $( '#event' )
    var bahan = $( '#bahan' )
    event.hide()
    if ( event == event.hide() ) {
        resep.show()
        bahan.hide()
    }
    eventbtn.click( function ()
    {
        event.show()
        resep.hide()
        bahan.hide()
    } )
    resepbtn.click( function ()
    {
        event.hide()
        resep.show()
        bahan.hide()
    } )
    bahanbtn.click( function ()
    {
        bahan.show()
        resep.hide()
        event.hide()
    } )
} )

