import { App, normalizePath, Notice, TFile, moment } from "obsidian";
import JekyllComposePlugin from "./main";
import { FileSelectionModal, UserInputModal } from "./modals";
import * as changeCase from "change-case";
import { generateDefaultFrontMatter } from "./utils";

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
                        this.createJekyllDraft(
                            title,
                            plugin.settings.draftsFolder
                        );
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
                        this.createJekyllPost(
                            title,
                            plugin.settings.postsFolder
                        );
                    }
                ).open();
            },
        });

        plugin.addCommand({
            id: "publish-jekyll-draft",
            name: "Publish draft",
            callback: () => {
                new FileSelectionModal(
                    plugin.app,
                    plugin.settings.draftsFolder,
                    (file: TFile) => {
                        this.publishJekyllDraft(
                            file,
                            plugin.settings.postsFolder
                        )
                            .then(() => {
                                new Notice(
                                    `Draft "${file.basename}" has been published`
                                );
                            })
                            .catch((error) => {
                                new Notice(
                                    `Error publishing draft: ${error.message}`
                                );
                            });
                    }
                ).open();
            },
        });

        plugin.addCommand({
            id: "unpublish-jekyll-post",
            name: "Unpublish post",
            callback: () => {
                new FileSelectionModal(
                    plugin.app,
                    plugin.settings.postsFolder,
                    (file: TFile) => {
                        this.unpublishJekyllPost(
                            file,
                            plugin.settings.draftsFolder
                        )
                            .then(() => {
                                new Notice(
                                    `Post "${file.basename}" has been unpublished`
                                );
                            })
                            .catch((error) => {
                                new Notice(
                                    `Error unpublishing post: ${error.message}`
                                );
                            });
                    }
                ).open();
            },
        });
    }

    private async createJekyllDraft(
        title: string,
        folder: string
    ): Promise<void> {
        try {
            await this.createJekyllFile(title, folder);
            new Notice(`Draft "${title}" created`);
        } catch (error) {
            new Notice(`Error creating draft: ${error.message}`);
        }
    }

    private async createJekyllPost(
        title: string,
        folder: string
    ): Promise<void> {
        try {
            const date = moment().format("YYYY-MM-DD");
            title = `${date}-${title.trim()}`;
            await this.createJekyllFile(title, folder);
            new Notice(`Post "${title}" created`);
        } catch (error) {
            new Notice(`Error creating post: ${error.message}`);
        }
    }

    private async createJekyllFile(
        title: string,
        folder: string
    ): Promise<TFile> {
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
        await this.app.fileManager.processFrontMatter(file, (frontMatter) => {
            const defaultFrontMatter = generateDefaultFrontMatter();
            Object.assign(frontMatter, defaultFrontMatter);
            frontMatter.title = title.trim();
        });
        return file;
    }

    private async ensureFolderExists(path: string) {
        const normalizedPath = normalizePath(path);
        const exists = await this.app.vault.adapter.exists(normalizedPath);

        if (!exists) {
            await this.app.vault.createFolder(normalizedPath);
        }
    }

    private async publishJekyllDraft(
        file: TFile,
        folder: string
    ): Promise<void> {
        const folderPath = normalizePath(folder);

        await this.ensureFolderExists(folderPath);

        const postFileName = moment().format("YYYY-MM-DD") + `-${file.name}`;
        const postFilePath = normalizePath(`${folderPath}/${postFileName}`);
        if (await this.app.vault.adapter.exists(postFilePath)) {
            throw new Error(
                `A post with the name "${postFileName}" already exists`
            );
        }
        await this.app.vault.rename(file, postFilePath);
    }

    private async unpublishJekyllPost(
        file: TFile,
        folder: string
    ): Promise<void> {
        const folderPath = normalizePath(folder);

        await this.ensureFolderExists(folderPath);

        const draftFileName = file.name.replace(/^\d{4}-\d{2}-\d{2}-/, "");
        const draftFilePath = normalizePath(`${folderPath}/${draftFileName}`);

        if (await this.app.vault.adapter.exists(draftFilePath)) {
            throw new Error(`Draft "${draftFileName}" already exists`);
        }
        await this.app.vault.rename(file, draftFilePath);
    }
}
