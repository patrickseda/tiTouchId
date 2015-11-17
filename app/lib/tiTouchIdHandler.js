/**
 * Provides a wrapper around the Appcelerator Titanium TouchID authentication module and
 * acts as a binding layer between the OS events and application-defined callbacks.
 *
 * Sample usage:
 *     // Load the module.
 *     var tiTouchIdHandler = require('tiTouchIdHandler');
 *
 *     // Provide the app hooks and start the TouchID listening.
 *     tiTouchIdHandler.start({
 *         reasonMessage : 'Fingerprint Authorization',
 *         successfulAuthCB : successCB,
 *         failedAuthCB : failCB
 *     });
 *
 * NOTE:
 *     Any (or all) of the following callback hooks may be provided to the start() method:
 *     - successfulAuthCB
 *     - failedAuthCB
 *     - userCancelCB
 *     - userFallbackCB
 *     - notEnrolledCB
 *     - notAvailableCB
 *     - systemCancelCB
 *     - passcodeNotSetCB
 *
 * @author Patrick Seda - @pxtrick
 */
var tiTouchIdHandler = (function() {
	var tiTouchId = OS_IOS ? require('ti.touchid') : null;

	// Determine availability from a device persepective.
	function isTouchIdAvailable() {
		var canAuthenticate = false;
		if (tiTouchId) {
			var deviceCanAuthenticateResult = tiTouchId.deviceCanAuthenticate();
			canAuthenticate = deviceCanAuthenticateResult.canAuthenticate;
			if (!canAuthenticate) {
				console.error('[tiTouchIdHandler] - isTouchIdAvailable() - deviceCanAuthenticateResult=' + JSON.stringify(deviceCanAuthenticateResult));
			}
		}
		return canAuthenticate;
	}

	// Start the authentication listener, tell it how to react to the user (via callbacks).
	function start(config) {
		if (OS_IOS) {
			// Make sure we can receive events, and that we're configured.
			if (tiTouchId && config) {
				// Define default handlers in case some are not provided.
				var defaultFailedAuthCB = (typeof config.failedAuthCB === 'function') ? config.failedAuthCB : function() {
					console.error('[tiTouchIdHandler] - Authorization failed, however no behavior was defined to handle it.');
				};
				var successAuthCB = (typeof config.successfulAuthCB === 'function') ? config.successfulAuthCB : function() {
					console.error('[tiTouchIdHandler] - A successful authorization occurred, however no handler was defined. Thus treating it as a failure.');
					// Fail the authorization so the app can deal with it.
					defaultFailedAuthCB();
				};

				// Configure the callbacks, use the defaults if necessary.
				var callbacks = {
					successfulAuthCB : successAuthCB,
					failedAuthCB : config.failedAuthCB || defaultFailedAuthCB,
					userCancelCB : config.userCancelCB || defaultFailedAuthCB,
					userFallbackCB : config.userFallbackCB || defaultFailedAuthCB,
					notEnrolledCB : config.notEnrolledCB || defaultFailedAuthCB,
					notAvailableCB : config.notAvailableCB || defaultFailedAuthCB,
					systemCancelCB : config.systemCancelCB || defaultFailedAuthCB,
					passcodeNotSetCB : config.passcodeNotSetCB || defaultFailedAuthCB,
				};
				var reasonMessage = (typeof config.reasonMessage === 'string') ? config.reasonMessage : 'Fingerprint Authorization';

				if (isTouchIdAvailable()) {
					// Initiate the Touch ID authentication process.
					tiTouchId.authenticate({
						reason: reasonMessage,
						callback: function(e) {
							if (e.success) {
								callbacks.successfulAuthCB();
							} else {
								// Failed.
								// console.error('[tiTouchIdHandler] - authenticate() - e.error=' + e.error);
								// console.error('[tiTouchIdHandler] - authenticate() - e.code=' + e.code);
								switch (e.code) {
									case tiTouchId.ERROR_USER_CANCEL: // The user canceled authentication.
										callbacks.userCancelCB();
										break;
									case tiTouchId.ERROR_USER_FALLBACK: // The user tapped the fallback button to enter their passcode.
										callbacks.userFallbackCB();
										break;
									case tiTouchId.ERROR_TOUCH_ID_NOT_ENROLLED: // Touch ID does not have any enrolled fingerprints.
										callbacks.notEnrolledCB();
										break;
									case tiTouchId.ERROR_TOUCH_ID_NOT_AVAILABLE: // Touch ID is not available on the device.
										callbacks.notAvailableCB();
										break;
									case tiTouchId.ERROR_SYSTEM_CANCEL: // The OS (iOS) cancelled authentication.
										callbacks.systemCancelCB();
										break;
									case tiTouchId.ERROR_PASSCODE_NOT_SET: // The passcode is not set for the device.
										callbacks.passcodeNotSetCB();
										break;
									// Handle all other failures the same.
									case tiTouchId.ERROR_AUTHENTICATION_FAILED: // The authentication was not successful.
									default:
										callbacks.failedAuthCB();
										break;
								}
							}
						}
					});
				} else {
					console.error('[tiTouchIdHandler] - Device is not configured for Touch ID authentication.');
					callbacks.notAvailableCB();
				}
			} else {
				console.error('[tiTouchIdHandler] - Invalid input configuration, cannot start.');
			}
		} else {
			console.error('[tiTouchIdHandler] - Touch ID is not available for this OS.');
		}
	}

	// Public API.
	return {
		isTouchIdAvailable: isTouchIdAvailable,
		start: start
	}
})();

module.exports = tiTouchIdHandler;
