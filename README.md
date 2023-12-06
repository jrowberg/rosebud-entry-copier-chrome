# Rosebud Entry Copier extension for Chrome

This is a simple Chrome extension that places an entire [Rosebud AI](https://my.rosebud.app?r=W7RDK) journal entry on the system clipboard in HTML format. It could be more customizable and probably fails in corner cases, but it works the way I need it to so far. Contributions welcome!

# Installation

This isn't in the Chrome extension store right now, so you have to install it as an unpacked extension in developer mode. Just follow the instructions here:

https://bashvlas.com/blog/install-chrome-extension-in-developer-mode/

# Usage

Once you've installed the extension, the little Clipboard+Rosebud icon will be available in your browser toolbar. You may need to click on the puzzle icon (extension list view) and pin it if you want to be

# Customization

If you want to change the format of the simple template used to assemble the HTML, edit the `/scripts/contentscript.js` file's `templateMain` and `templateQA` variables. There's a comment block above them that describes the available template variables. Additional variables/formats can be introduced if needed by further modifying the code farther down in the file.

# Potential Future Development

Ideally, I'd like to make the templates directly editable in a popup from the extension icon, and I'd like to have the content script modify the actual page content so the "Copy" icon appears next to the "Share" icon that's already present when reviewing Rosebud journal entries. I can't promise when (or if) I'll get to this though.
