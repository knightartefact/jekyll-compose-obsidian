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
                    async (title: string) => {
                        await this.createJekyllDraft(
                            title,
                            plugin.settings.draftsFolder,
                            plugin.settings.templateFile
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
                    async (title: string) => {
                        await this.createJekyllPost(
                            title,
                            plugin.settings.postsFolder,
                            plugin.settings.templateFile
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
        folder: string,
        templatePath?: string
    ): Promise<void> {
        try {
            await this.createJekyllFile(title, folder, undefined, templatePath);
            new Notice(`Draft "${title}" created`);
        } catch (error) {
            new Notice(`Error creating draft: ${error.message}`);
        }
    }

    private async createJekyllPost(
        title: string,
        folder: string,
        templatePath?: string
    ): Promise<void> {
        try {
            const date = moment().format("YYYY-MM-DD");
            await this.createJekyllFile(title, folder, date, templatePath);
            new Notice(`Post "${title}" created`);
        } catch (error) {
            new Notice(`Error creating post: ${error.message}`);
        }
    }

    private async createJekyllFile(
        title: string,
        folder: string,
        date?: string,
        templatePath?: string
    ): Promise<TFile> {
        let formattedTitle = changeCase.kebabCase(title.trim());
        if (date) {
            formattedTitle = `${date}-${formattedTitle}`;
        }
        const folderPath = normalizePath(folder);
        const filepath = normalizePath(`${folderPath}/${formattedTitle}.md`);

        await this.ensureFolderExists(folderPath);

        if (await this.app.vault.adapter.exists(filepath)) {
            throw new Error(`"${formattedTitle}" already exists`);
        }
        let initialContent = "";
        if (templatePath) {
            const templateFile = this.app.vault.getAbstractFileByPath(normalizePath(templatePath));
            if (templateFile instanceof TFile) {
                initialContent = await this.app.vault.read(templateFile);
            } else {
                new Notice(`Template file not found: ${templatePath}`);
            }
        }

        const file = await this.app.vault.create(filepath, initialContent);
        await this.app.fileManager.processFrontMatter(file, (frontMatter) => {
            if (!templatePath) {
                const defaultFrontMatter = generateDefaultFrontMatter();
                Object.assign(frontMatter, defaultFrontMatter);
            }
            frontMatter.title = title.trim();
        });
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
        await this.app.fileManager.processFrontMatter(file, (frontMatter) => {
            frontMatter.date = moment().format("YYYY-MM-DD HH:mm ZZ");
        });
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
