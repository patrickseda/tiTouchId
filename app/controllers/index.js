var tryingColor = '#444';
var successColor = '#0b0';
var failColor = '#d00';

// Set up the UI.
$.authorizeButton.addEventListener('click', function(e) {
    $.statusLabel.applyProperties({
    	text : 'AUTHORIZING ...',
    	color : tryingColor,
    });
	startAuth();
});
$.mainWindow.open();


// Attempt to authorize using Touch ID.
function startAuth() {
	var tiTouchIdHandler = require('tiTouchIdHandler');
	tiTouchIdHandler.start({
		reasonMessage : 'Authorize using your fingerprint!',
	    successfulAuthCB : successfulAuthCB,
	    failedAuthCB : failedAuthCB,
	    userCancelCB : userCancelAuthCB,
	    userFallbackCB : userFallbackAuthCB,
	    notAvailableCB : notAvailableCB
	});
}


// Define callbacks to be used by tiTouchIdHandler.
function successfulAuthCB() {
    $.statusLabel.applyProperties({
    	text : 'FINGERPRINT AUTHORIZED!',
    	color : successColor
    });
}
function failedAuthCB() {
    $.statusLabel.applyProperties({
    	text : 'Authorization: FAILED',
    	color : failColor
    });
}
function userCancelAuthCB() {
    $.statusLabel.applyProperties({
    	text : 'Authorization: USER CANCELED',
    	color : failColor
    });
}
function userFallbackAuthCB() {
    $.statusLabel.applyProperties({
    	text : 'Authorization: USER FALLBACK',
    	color : failColor
    });
}
function notAvailableCB() {
    $.statusLabel.applyProperties({
    	text : 'Authorization: NOT AVAILABLE',
    	color : failColor
    });
}
