export class Editor {
    private editorElement: HTMLElement;
    private toolbar: HTMLElement;

    constructor(editorEl: HTMLElement, toolbarEl: HTMLElement) {
        this.editorElement = editorEl;
        this.toolbar = toolbarEl;
        this.bindToolbarEvents();
        this.bindEditorEvents();
    }

    private bindToolbarEvents(): void {
        // Кнопки с data-command
        this.toolbar.querySelectorAll('[data-command]').forEach(btn => {
            btn.addEventListener('click', (e: Event) => {
                e.preventDefault();
                const command = (btn as HTMLElement).dataset.command;
                const value = (btn as HTMLElement).dataset.value || null;
                if (command) {
                    document.execCommand(command, false, value);
                    this.editorElement.focus();
                }
            });
        });

        // Шрифт
        const fontFamilySelect = document.getElementById('fontFamily') as HTMLSelectElement | null;
        fontFamilySelect?.addEventListener('change', (e: Event) => {
            const target = e.target as HTMLSelectElement;
            document.execCommand('fontName', false, target.value);
        });

        // Размер шрифта
        const fontSizeSelect = document.getElementById('fontSize') as HTMLSelectElement | null;
        fontSizeSelect?.addEventListener('change', (e: Event) => {
            const target = e.target as HTMLSelectElement;
            document.execCommand('styleWithCSS', false, 'true');
            document.execCommand('fontSize', false, target.value.replace('px', ''));
        });

        // Цвет текста
        const textColorPicker = document.getElementById('textColorPicker');
        const textColorInput = document.getElementById('textColor') as HTMLInputElement | null;
        textColorPicker?.addEventListener('click', () => textColorInput?.click());
        textColorInput?.addEventListener('change', (e: Event) => {
            const target = e.target as HTMLInputElement;
            document.execCommand('foreColor', false, target.value);
        });

        // Цвет фона
        const bgColorPicker = document.getElementById('bgColorPicker');
        const bgColorInput = document.getElementById('bgColor') as HTMLInputElement | null;
        bgColorPicker?.addEventListener('click', () => bgColorInput?.click());
        bgColorInput?.addEventListener('change', (e: Event) => {
            const target = e.target as HTMLInputElement;
            document.execCommand('hiliteColor', false, target.value);
        });

        // Вставка медиа
        document.getElementById('insertImage')?.addEventListener('click', () => this.promptForMedia('image'));
        document.getElementById('insertVideo')?.addEventListener('click', () => this.promptForMedia('video'));
        document.getElementById('insertAudio')?.addEventListener('click', () => this.promptForMedia('audio'));
    }

    private bindEditorEvents(): void {
        this.editorElement.addEventListener('input', () => {
            document.dispatchEvent(new CustomEvent('editor-content-changed'));
        });
    }

    private promptForMedia(type: 'image' | 'video' | 'audio'): void {
        const url = prompt(`Введите URL ${type === 'image' ? 'изображения' : type === 'video' ? 'видео' : 'аудио'}:`);
        if (!url) return;

        let html = '';
        if (type === 'image') {
            html = `<img src="${url}" alt="Изображение" style="max-width:100%">`;
        } else if (type === 'video') {
            if (url.includes('youtube.com/watch?v=')) {
                try {
                    const videoId = new URL(url).searchParams.get('v');
                    html = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
                } catch {
                    html = `<video src="${url}" controls style="max-width:100%"></video>`;
                }
            } else {
                html = `<video src="${url}" controls style="max-width:100%"></video>`;
            }
        } else if (type === 'audio') {
            html = `<audio src="${url}" controls></audio>`;
        }

        if (html) {
            document.execCommand('insertHTML', false, html);
        }
    }

    public getContent(): string {
        return this.editorElement.innerHTML;
    }

    public setContent(html: string): void {
        this.editorElement.innerHTML = html || '<p>Начните вводить текст здесь...</p>';
    }

    public clear(): void {
        this.setContent('');
    }
}