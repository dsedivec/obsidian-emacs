import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { highlightWhitespace } from '@codemirror/view';

interface ShowWhiteSpaceSettings {
    showWhiteSpace: boolean;
}

const DEFAULT_SETTINGS: ShowWhiteSpaceSettings = {
    showWhiteSpace: true,
}

export default class ShowWhiteSpace extends Plugin {
    settings: ShowWhiteSpaceSettings;
    editorExtensions: Array;

    async onSettingsChanged() {
        const extensionRegistered = (this.editorExtensions.length > 0);
        if (this.settings.showWhiteSpace != extensionRegistered) {
            if (this.settings.showWhiteSpace) {
                this.editorExtensions.push(highlightWhitespace());
            } else {
                this.editorExtensions.splice(0, this.editorExtensions.length);
            }
            this.app.workspace.updateOptions();
        }
    }

    async onload() {
	await this.loadSettings();
        this.editorExtensions = [];
        this.registerEditorExtension(this.editorExtensions);
        await this.onSettingsChanged();
	this.addSettingTab(new ShowWhiteSpaceSettingsTab(this.app, this));
    }

    async onunload() {
        // I don't actually think this is necessary, but just in case...
        this.editorExtensions.splice(0, this.editorExtensions.length);
    }

    async loadSettings() {
	this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData(),
        );
    }

    async saveSettings() {
	await this.saveData(this.settings);
        await this.onSettingsChanged();
    }
}

class ShowWhiteSpaceSettingsTab extends PluginSettingTab {
    plugin: ShowWhiteSpace;

    constructor(app: App, plugin: ShowWhiteSpace) {
	super(app, plugin);
	this.plugin = plugin;
    }

    display(): void {
	const {containerEl} = this;

	containerEl.empty();

	new Setting(containerEl)
	    .setName('Show white space in editor')
	    .setDesc('Visualize spaces and tabs in the editor.')
            .addToggle(
                toggle => toggle
                    .setValue(this.plugin.settings.showWhiteSpace)
                    .onChange(async (value) => {
		        this.plugin.settings.showWhiteSpace = value;
		        await this.plugin.saveSettings();
	            })
            );
    }
}
