import { moment } from "obsidian";

export function generateDefaultFrontMatter(): Record<string, any> {
    return {
        layout: "post",
        title: "",
        date: moment().format("YYYY-MM-DD HH:mm ZZ"),
        categories: [],
        tags: [],
    };
}
