import { Plugin } from "obsidian";
import { JekyllComposeSettings, JekyllComposeSettingTab, DEFAULT_SETTINGS } from "./settings";
import { UserInputModal } from "./modals";

export default class JekyllComposePlugin extends Plugin {
    settings: JekyllComposeSettings;

    async onload() {
        await this.loadSettings();

        this.addCommand({
            id: "open-sample-modal-simple",
            name: "Open sample modal (simple)",
            callback: () => {
                new UserInputModal(
                    this.app,
                    "Enter title",
                    "Title cannot be empty",
                    (title: string) => {
                        console.log(title);
                    }
                ).open();
            },
        });

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
