## Titanium Touch ID Handler
This module provides a wrapper around the _Appcelerator Titanium_ TouchID authentication module and acts as a binding layer between the iOS TouchID events and application-defined callbacks.

By separating the OS-level events from the application behavior, we introduce good design and clean code with separation of concerns.

### Sample Usage
```
// Load the module from the application.
var tiTouchIdHandler = require('tiTouchIdHandler');

// Start authorization and provide callback bindings to the OS TouchID events.
tiTouchIdHandler.start({
    reasonMessage : 'Fingerprint Authorization',
    successfulAuthCB : successCB,
    failedAuthCB : failCB
});
```

### Available Callback Options
Any (or all) of the following callback hooks may be provided to the `start()` method.
If a TouchID event occurs which has not been given a specific handler callback, the default `failedAuthCB` will be used.
```
- successfulAuthCB
- failedAuthCB
- userCancelCB
- userFallbackCB
- notErolledCB
- notAvailableCB
- systemCancelCB
- passcodeNotSetCB
```
