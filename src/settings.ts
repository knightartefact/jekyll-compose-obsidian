import {
    AbstractInputSuggest,
    App,
    normalizePath,
    Notice,
    PluginSettingTab,
    Setting,
    TFile,
    TFolder,
} from "obsidian";
import JekyllComposePlugin from "./main";

export interface JekyllComposeSettings {
    postsFolder: string;
    draftsFolder: string;
    templateFolder: string;
    templateFile: string;
    dateTimeFormat: string;
}

export const DEFAULT_SETTINGS: JekyllComposeSettings = {
    postsFolder: "_posts",
    draftsFolder: "_drafts",
    templateFolder: "",
    templateFile: "",
    dateTimeFormat: "YYYY-MM-DD HH:mm ZZ",
};

class FileInputSuggest extends AbstractInputSuggest<TFile> {
    private onSubmit: (file: TFile) => void;
    private targetFolderPath: string;

    constructor(
        app: App,
        inputEl: HTMLInputElement,
        targetFolderPath: string,
        onsubmit: (file: TFile) => void
    ) {
        super(app, inputEl);
        this.onSubmit = onsubmit;
        this.targetFolderPath = targetFolderPath;
    }

    getSuggestions(inputStr: string): TFile[] {
        const targetFolder = this.app.vault.getFolderByPath(normalizePath(this.targetFolderPath));
        if (!targetFolder) {
            return [];
        }
        return targetFolder.children.filter((file) => {
            return file.name.toLowerCase().includes(inputStr.toLowerCase());
        }) as TFile[];
    }

    renderSuggestion(file: TFile, el: HTMLElement): void {
        el.createEl("div", { text: file.name });
    }

    selectSuggestion(value: TFile, evt: MouseEvent | KeyboardEvent): void {
        this.onSubmit(value);
        new Notice(`Selected file: ${value.path}`);
        this.close();
    }
}

class FolderInputSuggest extends AbstractInputSuggest<TFolder> {
    private onSubmit: (folder: TFolder) => void;

    constructor(
        app: App,
        inputEl: HTMLInputElement,
        onsubmit: (folder: TFolder) => void
    ) {
        super(app, inputEl);
        this.onSubmit = onsubmit;
    }

    getSuggestions(inputStr: string): TFolder[] {
        return this.app.vault.getAllFolders().filter((folder) => folder.name.includes(inputStr));
    }

    renderSuggestion(folder: TFolder, el: HTMLElement): void {
        el.createEl("div", { text: folder.name });
    }

    selectSuggestion(value: TFolder, evt: MouseEvent | KeyboardEvent): void {
        new Notice(`Selected folder: ${value.path}`);
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
                text
                    .setPlaceholder(DEFAULT_SETTINGS.postsFolder)
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
                text
                    .setPlaceholder(DEFAULT_SETTINGS.draftsFolder)
                    .setValue(this.plugin.settings.draftsFolder)
                    .onChange(async (value) => {
                        this.plugin.settings.draftsFolder = value.trim();
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName("Default Template File")
            .setDesc(
                "Filepath to a markdown file to use as a template for new posts and drafts. Leave empty for no template."
            )
            .addText((text) => {
                text.setPlaceholder(DEFAULT_SETTINGS.templateFile)
                    .setValue(this.plugin.settings.templateFile)
                    .onChange(async (value) => {
                        this.plugin.settings.templateFile =
                            value.trim();
                        await this.plugin.saveSettings();
                    });
                new FileInputSuggest(this.app, text.inputEl, this.plugin.settings.templateFolder, (file: TFile) => {
                    text.setValue(file.path);
                    this.plugin.settings.templateFile = file.path;
                });
            });

        new Setting(containerEl)
            .setName("Default Template Folder")
            .setDesc(
                "Folder to select template files from when choosing a template for new posts and drafts."
            )
            .addText((text) => {
                text.setPlaceholder(DEFAULT_SETTINGS.templateFolder)
                    .setValue(this.plugin.settings.templateFolder)
                    .onChange(async (value) => {
                        this.plugin.settings.templateFolder =
                            value.trim();
                        await this.plugin.saveSettings();
                    });
                new FolderInputSuggest(this.app, text.inputEl, (folder: TFolder) => {
                    text.setValue(folder.path);
                    text.onChanged();
                    this.display();
                });
            });

        new Setting(containerEl)
            .setName("Default Date-Time Format")
            .setDesc("Default format for date-time in Jekyll front matter.")
            .addText((text) => {
                text.setPlaceholder(DEFAULT_SETTINGS.dateTimeFormat)
                    .setValue(this.plugin.settings.dateTimeFormat)
                    .onChange(async (value) => {
                        this.plugin.settings.dateTimeFormat =
                            value.trim();
                        await this.plugin.saveSettings();
                    });
            });
    }
}
