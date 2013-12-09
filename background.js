// TODO: Wallet should be global?
var Wallet = SpareCoins.Wallet( SpareCoins.ChromeStorage )

var pushTransaction = function( tx_serialized, tx_hash, tx_value, callback ) {
	BitcoinNodeAPI.pushTx( tx_serialized, tx_hash, function( err, data ) {
		if ( err ) {
			console.log( err )
			throw new Error( "Transaction Failed" )
		}

		if ( data ) {
			beep()

			// Backup Wallet if high value
			var target = BigInteger.valueOf( 10000000 )
			if ( ( tx_value ).compareTo( target ) > 0 ) {
				backupPrivateKeys()
			}

			callback()
		}
	} );
}

var beep = function() {
	var file = "beep.wav"
	return ( new Audio( file ) ).play()
}

var backupPrivateKeys = function() {

	Wallet.loadData( function() {
		var timestamp = ( new Date() ).getTime()

		var addresses = Wallet.getAddresses()
		var anchor = document.createElement( 'a' );

		var encryptedKeysURL = "data:text/csv;charset=utf-8,"

		encryptedKeysURL += escape( "Encrypted Privated Keys (AES)" + "\n" )

		for ( var i = 0; i < addresses.length; i++ ) {
			encryptedKeysURL += escape( addresses[ i ].getfCryptPrivateKey() + "\n" )
		}

		window.open( encryptedKeysURL )

	} )

}
