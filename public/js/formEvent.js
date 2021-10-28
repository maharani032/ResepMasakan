$( document ).ready( function ()
{



    var harga = $( '#harga' )
    var free = $( '#free' )
    var berbayar = $( '#berbayar' )
    free.prop( 'checked', true )
    if ( free.is( ':checked' ) ) {
        harga.val( 0 )
        harga.prop( "disabled", true );
    }
    berbayar.click( function ()
    {
        harga.prop( "disabled", false );
    } )
    free.click( function ()
    {
        harga.val( 0 )
        harga.prop( "disabled", true );
    } )
} )