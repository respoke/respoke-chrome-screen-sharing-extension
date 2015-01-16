# Respoke Sample Chrome Extension

This Chrome extension adds screen sharing capabilities for Chrome to the
[Respoke.js library](https://github.com/respoke/respoke) for [Respoke](https://www.respoke.io). Since this is a
Chrome extension, it must be modified to match your app's domain name and then published to the Chrome Web Store.

## Usage

[Fork this code](https://github.com/respoke/respoke-chrome-extension/fork) to your own repo and then make the
following changes.

1. Rename `manifest.json.sample` to `manifest.json`.
2. Open `manifest.json` and change the title to the name of your web app.
3. In the `permissions` list, list the domain names, ports and protocols that this extension should be enabled on. [Here is Google's documentation](https://developer.chrome.com/extensions/declare_permissions), but it should be as easy as adding one or more URLs with "https://", your domain name, and an optional path like "/mysubdir/\*" NOTE: You must use SSL for screen sharing in chrome, so HTTP URLs will not work. You may use a wildcard to specify multiple subdomains, like "https://\*.example.com."

```
    "permissions": [
        "storage",
        "tabs",
        "desktopCapture",
        "https://localhost:8080/*",
        "https://*.example.com/*",
        "https://example.com/video/*"
    ],

```

4. Add these same entries in the `content_scripts` section inside the `matches` list.

```
    "content_scripts": [{
        "matches": ["https://localhost:8080/*", "https://*.example.com/*", "https://example.com/video/*"],
        "js": ["content.js"],
        "run_at": "document_end"
    }]
```

That's all! Now just [publis your Chrome extension](https://developer.chrome.com/webstore/publish) and [prompt your users to install it](https://developer.chrome.com/webstore/inline_installation).

```
    if (respoke.needsChromeExtension && !respoke.hasChromeExtension) {
        chrome.webstore.install(myExtensionURL, onSuccess, onFailure);
    }
```

# License

Respoke Screen Sharing Chrome extension is licensed under the [MIT license](LICENSE).
