import { App, PluginSettingTab } from "obsidian";
import JekyllComposePlugin from "./main";

export interface JekyllComposeSettings {
    postsFolder: string;
    draftsFolder: string;
    defaultTemplateFilepath: string;
}

export const DEFAULT_SETTINGS: JekyllComposeSettings = {
    postsFolder: "_posts",
    draftsFolder: "_drafts",
    defaultTemplateFilepath: ""
};

export class JekyllComposeSettingTab extends PluginSettingTab {
    plugin: JekyllComposePlugin;

    constructor(app: App, plugin: JekyllComposePlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
    }
}
