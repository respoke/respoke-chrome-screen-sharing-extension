var port = chrome.runtime.connect({name: 'respoke-port'});

port.onMessage.addListener(function(msg) {
  if (msg.available == true) {
    console.log("The respoke extension is available");
  }
});

window.addEventListener("message", function(event) {
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "respoke-available")) {
    console.log("Content Script received a query for extension presence");
    port.postMessage("respoke-available");
  }
});