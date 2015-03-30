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

/*
 * The below section is added so that the extension starts working after installation/reloading of the extension
 * For this section to work, you must add the "tabs" permission in the manifest
 */

chrome.manifest = chrome.app.getDetails();

var injectIntoTab = function (tab) {
    var scripts = chrome.manifest.content_scripts[0].js;
    scripts.forEach(function(script){
        // this script is going to throw an exception in the console for the extension
        // it'll throw the exception if you inject into a tab it's not allowed access to
        // you can't catch that exception with a try/catch
        // it doesn't stop anything from working and doesn't show up in the tab's console either
        chrome.tabs.executeScript(tab.id, {
            file: script
        });
    });
}

chrome.windows.getAll({
    populate: true
}, function (windows) {
    windows.forEach(function(currentWindow){
        currentWindow.tabs.forEach(function(currentTab){
            // Skip chrome:// and http:// (except localhost) pages
            // if you have a very specific domain(s) that you're running the extension on, you could change
            // this if statement to match those domains to save on extra work and injecting into tabs that you have
            // no rights to
            if( ! currentTab.url.match(/(chrome|http):\/\//gi) || currentTab.url.match(/http:\/\/localhost/gi)) {
                injectIntoTab(currentTab);
            }
        })
    });
});
