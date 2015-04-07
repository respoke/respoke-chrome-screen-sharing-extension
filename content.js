/*
 * Copyright 2014, Digium, Inc.
 * All rights reserved.
 *
 * This source code is licensed under The MIT License found in the
 * LICENSE file in the root directory of this source tree.
 *
 * For all details and documentation:  https://www.respoke.io
 */

/*
 * This script communicates with the Chrome extension and overloads `respoke` (the Respoke client library)
 * to include APIs to access Chrome's screen-sharing functionality.
 */

// connection to background script
var port = chrome.runtime.connect({ name: 'respoke-port' });

/*
 * Listen to backgrounds script and pass anything we get onto the Respoke library.
 */
port.onMessage.addListener(function (data) {
    data.type = data.type.replace("ct-", "");
    document.dispatchEvent((function () {
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(data.type, true, true, data);
        return evt;
    })());
});

/*
 * Listen to Respoke Client Library and pass it on to background scripts.
 */
document.addEventListener('ct-respoke-source-id', function (evt) {
    port.postMessage({
      event: 'bg-respoke-source-id',
      data: evt.detail
    });
});

/*
 * Ask the Chrome extension if it's available. It's response will be forwarded to the Respoke
 * Client library via the above event listener.
 */
port.postMessage({
  event: "bg-respoke-chrome-screen-sharing-available"
});
