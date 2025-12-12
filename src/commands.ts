import { App, normalizePath, Notice, TFile, moment } from "obsidian";
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
                        this.createJekyllDraft(title, plugin.settings.draftsFolder).then(() => {
                            new Notice(`Draft "${title}" created`);
                        }).catch((error) => {
                            new Notice(`Error creating draft: ${error.message}`);
                        });
                    }
                ).open();
            },
        });

        plugin.addCommand({
            id: "create-jekyll-post",
            name: "Create post",
            callback: () => {
                new UserInputModal(
                    plugin.app,
                    "Enter title",
                    "Title cannot be empty",
                    (title: string) => {
                        this.createJekyllPost(title, plugin.settings.postsFolder).then(() => {
                            new Notice(`Post "${title}" created`);
                        }).catch((error) => {
                            new Notice(`Error creating post: ${error.message}`);
                        });
                    }
                ).open();
            },
        });
    }

    private async createJekyllDraft(title: string, folder: string): Promise<void> {
        const file = await this.createJekyllFile(title, folder);
    }

    private async createJekyllPost(title: string, folder: string): Promise<void> {
        const file = await this.createJekyllFile(title, folder);
        file.basename = moment().format("YYYY-MM-DD") + `-${file.name}`;
        this.app.fileManager.renameFile(file, `${folder}/${file.basename}`);
    }

    private async createJekyllFile(title: string, folder: string): Promise<TFile> {
        const formattedTitle = changeCase.kebabCase(title.trim());
        const folderPath = normalizePath(folder);
        const filepath = normalizePath(`${folderPath}/${formattedTitle}.md`);

        await this.ensureFolderExists(folderPath);

        if (await this.app.vault.adapter.exists(filepath)) {
            throw new Error(`"${formattedTitle}" already exists`);
        }
        // For later render template of the file for the front matter
        const file = await this.app.vault.create(filepath, "");
        await this.app.workspace.getLeaf(false).openFile(file);
        return file;
    }

    private async ensureFolderExists(path: string) {
        const normalizedPath = normalizePath(path);
        const exists = await this.app.vault.adapter.exists(normalizedPath);

        if (!exists) {
            await this.app.vault.createFolder(normalizedPath);
        }
    }
}
