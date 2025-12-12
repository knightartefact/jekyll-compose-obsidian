import { App, Notice, SuggestModal } from "obsidian";

export class UserInputModal extends SuggestModal<string> {
    private onSubmit: (title: string) => void;
    private emptyText: string;

    constructor(
        app: App,
        placeholder: string,
        emptyText: string,
        onSubmit: (title: string) => void
    ) {
        super(app);
        this.setPlaceholder(placeholder);
        this.emptyText = emptyText;
        this.onSubmit = onSubmit;
        this.setInstructions([
            { command: "↵", purpose: "to create" },
            { command: "esc", purpose: "to dismiss" },
        ]);
    }

    getSuggestions(query: string): string[] {
        const trimmed = query.trim();
        if (trimmed) {
            return [trimmed];
        }
        return [];
    }

    renderSuggestion(value: string, el: HTMLElement): void {
        const container = el.createEl("div", { cls: "modal-suggestion-item" });
        container.createEl("div", { text: value });
        container.createEl("small", {
            text: "Enter to create",
            cls: "modal-suggestion-hotkey",
        });
    }

    onNoSuggestion(): void {
        this.resultContainerEl.empty();
    }

    onChooseSuggestion(item: string, _evt: MouseEvent | KeyboardEvent): void {
        if (!item.trim()) {
            new Notice("Please enter a title");
            return;
        }
        this.onSubmit(item.trim());
    }

    selectSuggestion(value: string, evt: MouseEvent | KeyboardEvent): void {
        const input = (this as any).inputEl?.value?.trim();
        if (!input) {
            new Notice("Please enter a title");
            this.close();
            return;
        }
        super.selectSuggestion(value, evt);
    }
}
