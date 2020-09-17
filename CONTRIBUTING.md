# Contributing Guide

1. Setup the repo locally.

```bash
git clone https://github.com/jyash97/snippet-extension.git && cd snippet-extension
```

2. Install project dependencies from root

```bash
yarn
```

3. Build extension code in watch mode ( Updates bundles on file changes )

```bash
yarn start
```

4. Open `chrome://extensions` and toggle developer mode and click `Load unpacked` and select the `extension/` folder.

5. To check console messages, goto extensions and click on `background page` which should open the devtolls for extension. Check the image below:
   ![Background Page](https://i.imgur.com/91B9R6N.png[/img])

6. Try reloading extension if the extension is not updated.
