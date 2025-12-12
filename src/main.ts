import { Notice, Plugin } from "obsidian";
import { JekyllComposeSettings, JekyllComposeSettingTab, DEFAULT_SETTINGS } from "./settings";
import { UserInputModal } from "./modals";
import { JekyllComposeCommands } from "./commands";

export default class JekyllComposePlugin extends Plugin {
    settings: JekyllComposeSettings;
    commands: JekyllComposeCommands;

    async onload() {
        await this.loadSettings();

        this.commands = new JekyllComposeCommands(this.app);
        this.commands.addCommands(this);

        this.addSettingTab(new JekyllComposeSettingTab(this.app, this));
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData()
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
