# Respoke Sample Chrome Extension

This Chrome extension adds screen sharing capabilities for Chrome to the
[Respoke.js library](https://github.com/respoke/respoke) for [Respoke](https://www.respoke.io). Since this is a
Chrome extension, it must be modified to match your app's domain name and then published to the Chrome Web Store.

## Usage

[Fork this code](https://github.com/respoke/respoke-chrome-extension/fork) to your own repo and then make the
following changes.

1. Rename `manifest.json.sample` to `manifest.json`.
2. Open `manifest.json` and change the title to the name of your web app.
3. In the `permissions` list, list the domain names, ports and protocols that this extension should be enabled on. [Here is Google's documentation](https://developer.chrome.com/extensions/declare_permissions), but it should be as easy as adding one or more URLs with "https://", your domain name, and an optional path like "/mysubdir/\*" 

NOTE: You must use SSL for screen sharing in chrome, so HTTP URLs will not work. You may use a wildcard to specify multiple subdomains, like "https://\*.example.com."

```js
    "permissions": [
        "tabs",
        "desktopCapture",
        "https://localhost:8080/*",
        "https://*.example.com/*",
        "https://example.com/video/*"
    ],

```

The `tabs` permission allows you to load the extension after an inline installation.

4. Add these same entries in the `content_scripts` section inside the `matches` list.

```js
    "content_scripts": [{
        "matches": ["https://localhost:8080/*", "https://*.example.com/*", "https://example.com/video/*"],
        "js": ["content.js"],
        "run_at": "document_end"
    }]
```

That's all! Now just [publish your Chrome extension](https://developer.chrome.com/webstore/publish) and [prompt your users to install it](https://developer.chrome.com/webstore/inline_installation).

## Inline install

Inline installation can only occur due to a user action, such as a click on a button that you (as the developer) control.

```js
function clickExtension(e){
  e.preventDefault();
  chrome.webstore.install('https://chrome.google.com/webstore/detail/<chrome-extension-app-id>', function(){
      console.log('Successfully installed Chrome Extension');
  }, function(err){
      console.log('Error installing extension in chrome', err);
  });
}
```

To allow inline installation, a special `link` element must be present on the page.

```html
<link rel="chrome-webstore-item" href="'https://chrome.google.com/webstore/detail/<chrome-extension-app-id>'">
```

## When is the extension loaded?

Due to the nature of the extension extending the `respoke.js` library, it has to load after the library; at `document_end`. This means that it runs after all of your Javascript too.

That means that having a block of javascript, as below, won't tell you if the extension is installed/loaded.

```js
if (!respoke.needsChromeExtension || respoke.hasChromeExtension) {
    //remove our install button
}
```

This is because the `respoke.js` library loads, then your javascript runs and then the extension tells the `respoke.js` library that it's available.

To get around this, the `respoke.js` library fires an event when any respoke enabled extension loads.

```js
respoke.listen('extension-loaded', function(data){
    console.log('extension loaded', data);
    if (!respoke.needsChromeExtension || respoke.hasChromeExtension) {
        //remove an inline installation button
    }
});
```

The `extension-loaded` event will fire for any kind of respoke based extension, with data to tell you which extension. In this case, the data looks like this:

```js
{
    type: 'screen-sharing'
}

```

# License

Respoke Screen Sharing Chrome extension is licensed under the [MIT license](LICENSE).
