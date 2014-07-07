chrome.extension.onConnect.addListener(function(port) {
  console.log(port);
  console.assert(port.name == "respoke-port");

  port.onMessage.addListener(function(msg) {
    if (msg == "respoke-available") {
      port.postMessage({available: true});
    }
  });
});