import { App, normalizePath, Notice } from "obsidian";
import JekyllComposePlugin from "./main";
import { UserInputModal } from "./modals";
import * as changeCase from "change-case";

export class JekyllComposeCommands {
    constructor(private app: App) {}

    addCommands(plugin: JekyllComposePlugin) {
        plugin.addCommand({
            id: "create-jekyll-draft",
            name: "Create draft",
            callback: () => {
                new UserInputModal(
                    plugin.app,
                    "Enter title",
                    "Title cannot be empty",
                    (title: string) => {
                        this.createJekyllFile(title, plugin.settings.draftsFolder).then(() => {
                            new Notice(`Draft "${title}" created`);
                        });
                    }
                ).open();
            },
        });
    }

    private async createJekyllFile(title: string, folder: string): Promise<void> {
        const formattedTitle = changeCase.kebabCase(title.trim());
        const folderPath = normalizePath(folder);
        const filepath = normalizePath(`${folderPath}/${formattedTitle}.md`);

        await this.ensureFolderExists(folderPath);

        if (await this.app.vault.adapter.exists(filepath)) {
            new Notice(`File "${formattedTitle}" already exists`);
            return;
        }
        // For later render template of the file for the front matter

        try {
            const file = await this.app.vault.create(filepath, "");
            await this.app.workspace.getLeaf(false).openFile(file);
        } catch (error) {
            new Notice(`Error creating file: ${error}`);
        }
    }

    private async ensureFolderExists(path: string) {
        const normalizedPath = normalizePath(path);
        const exists = await this.app.vault.adapter.exists(normalizedPath);

        if (!exists) {
            await this.app.vault.createFolder(normalizedPath);
        }
    }
}
