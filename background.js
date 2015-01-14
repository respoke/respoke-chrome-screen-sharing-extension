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
 * Respoke Chrome Screen Sharing
 * This extension provides screen sharing functionality for the Respoke client library.
 */

var mediaSources = ["screen", "window"];

chrome.extension.onConnect.addListener(function (port) {
    console.assert(port.name === "respoke-port");

    port.onMessage.addListener(function (msg) {
        switch (msg) {
            case "bg-respoke-available":
                port.postMessage({type: "ct-respoke-available", available: true});
                break;
            case "bg-respoke-source-id":
                chrome.desktopCapture.chooseDesktopMedia(mediaSources, port.sender.tab, function (sourceId) {
                    if (!sourceId) {
                        port.postMessage({type: "ct-respoke-source-id", error: 'PermissionDeniedError'});
                        return;
                    }

                    port.postMessage({
                        type: "ct-respoke-source-id",
                        sourceId: sourceId
                    });
                });
                break;
        }
    });
});
