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
    var resep = $( '#resep' )
    var event = $( '#event' )
    event.hide()
    // resepbtn.css( 'background-color', 'rgb(77, 153, 179)' )
    if ( event == event.hide() ) {
        resep.show()
    }
    eventbtn.click( function ()
    {
        // if ( eventbtn === eventbtn.css( 'background-color', 'rgb(77, 153, 179)' ) ) {
        // eventbtn.css( 'background-color', 'transparent' )
        event.show()
        resep.hide()
        // }
        // else if ( eventbtn === eventbtn.css( 'background-color', 'transparent' ) ) {
        //     event.show()
        //     resep.hide()
        //     // eventbtn.css( 'background-color', 'rgb(77, 153, 179)' )
        //     // resepbtn.css( 'background-color', 'transparent' )
        // }



    } )
    resepbtn.click( function ()
    {
        event.hide()
        resep.show()
        // eventbtn.css( 'background-color', 'rgb(77, 153, 179)' )
        // resepbtn.css( 'background-color', 'transparent' )
    } )
} )

