import { Plugin } from 'obsidian';
import { Extension } from '@codemirror/state';
import { emacs } from "@replit/codemirror-emacs"

export default class ObsidianEmacsKeymap extends Plugin {
    // We use this to hold an array we *could* mutate to
    // activate/deactivate this extension.  That isn't used here right
    // now, but it could be.
    editorExtensions: Array<Extension>;

    async onload() {
        this.editorExtensions = [emacs()];
        this.registerEditorExtension(this.editorExtensions);
    }

    async onunload() {
        // I don't actually think this is necessary, but just in case...
        this.editorExtensions.splice(0, this.editorExtensions.length);
    }
}
