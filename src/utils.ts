import { moment } from "obsidian";

export function generateDefaultFrontMatter(): Record<string, string | string[]> {
    return {
        layout: "post",
        title: "",
        date: moment().format("YYYY-MM-DD HH:mm ZZ"),
        categories: [],
        tags: [],
    };
}
