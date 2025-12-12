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
