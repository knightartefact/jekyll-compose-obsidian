import { AbstractInputSuggest, App, Notice, PluginSettingTab, Setting, TFile } from "obsidian";
import JekyllComposePlugin from "./main";

export interface JekyllComposeSettings {
    postsFolder: string;
    draftsFolder: string;
    defaultTemplateFilepath: string;
    defaultDateTimeFormat: string;
}

export const DEFAULT_SETTINGS: JekyllComposeSettings = {
    postsFolder: "_posts",
    draftsFolder: "_drafts",
    defaultTemplateFilepath: "",
    defaultDateTimeFormat: "YYYY-MM-DD HH:mm ZZ",
};

class FileInputSuggest extends AbstractInputSuggest<TFile> {
    private onSubmit: (file: TFile) => void;

    constructor(app: App, inputEl: HTMLInputElement, onsubmit: (file: TFile) => void) {
        super(app, inputEl);
        this.onSubmit = onsubmit;
    }

    getSuggestions(inputStr: string): TFile[] {
        return this.app.vault.getFiles();
    }

    renderSuggestion(file: TFile, el: HTMLElement): void {
        el.createEl("div", { text: file.name });
    }

    selectSuggestion(value: TFile, evt: MouseEvent | KeyboardEvent): void {
        new Notice(`Selected file: ${value.path}`);
        this.onSubmit(value);
        this.close();
    }
}

export class JekyllComposeSettingTab extends PluginSettingTab {
    plugin: JekyllComposePlugin;

    constructor(app: App, plugin: JekyllComposePlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl("h2", { text: "Jekyll Compose Settings" });
        new Setting(containerEl)
            .setName("Posts Folder")
            .setDesc("Folder where Jekyll posts will be created.")
            .addText((text) =>
                text.setPlaceholder(DEFAULT_SETTINGS.postsFolder)
                    .setValue(this.plugin.settings.postsFolder)
                    .onChange(async (value) => {
                        this.plugin.settings.postsFolder = value.trim();
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName("Drafts Folder")
            .setDesc("Folder where Jekyll drafts will be created.")
            .addText((text) =>
                text.setPlaceholder(DEFAULT_SETTINGS.draftsFolder)
                    .setValue(this.plugin.settings.draftsFolder)
                    .onChange(async (value) => {
                        this.plugin.settings.draftsFolder = value.trim();
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName("Default Template Filepath")
            .setDesc("Filepath to a markdown file to use as a template for new posts and drafts. Leave empty for no template.")
            .addText((text) => {
                text.setPlaceholder(DEFAULT_SETTINGS.defaultTemplateFilepath)
                    .setValue(this.plugin.settings.defaultTemplateFilepath)
                    .onChange(async (value) => {
                        this.plugin.settings.defaultTemplateFilepath = value.trim();
                        await this.plugin.saveSettings();
                    });
                    new FileInputSuggest(this.app, text.inputEl, (file: TFile) => {
                        text.setValue(file.path);
                        this.plugin.settings.defaultTemplateFilepath = file.path;
                    });
                }
            );

        new Setting(containerEl)
            .setName("Default Date-Time Format")
            .setDesc("Default format for date-time in Jekyll front matter.")
            .addText((text) => {
                text.setPlaceholder(DEFAULT_SETTINGS.defaultDateTimeFormat)
                    .setValue(this.plugin.settings.defaultDateTimeFormat)
                    .onChange(async (value) => {
                        this.plugin.settings.defaultDateTimeFormat = value.trim();
                        await this.plugin.saveSettings();
                    });
                }
            );
    }
}
