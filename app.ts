import { Lesson } from './types';
import { getLessons, saveLessons, generateId, exportData, importData } from './api';
import { Editor } from './editor';
import { QuizManager } from './quiz';

document.addEventListener('DOMContentLoaded', () => {
    // Элементы DOM с проверкой на null
    const lessonsListEl = document.getElementById('lessonsList') as HTMLElement | null;
    const lessonTitleInput = document.getElementById('lessonTitle') as HTMLInputElement | null;
    const contentEditor = document.getElementById('contentEditor') as HTMLElement | null;
    const toolbar = document.getElementById('toolbar') as HTMLElement | null;
    const editorSection = document.getElementById('editorSection') as HTMLElement | null;
    const quizSection = document.getElementById('quizSection') as HTMLElement | null;
    const previewSection = document.getElementById('previewSection') as HTMLElement | null;
    const testSection = document.getElementById('testSection') as HTMLElement | null;
    const previewContent = document.getElementById('previewContent') as HTMLElement | null;
    const testContainer = document.getElementById('testContainer') as HTMLElement | null;
    const toggleModeBtn = document.getElementById('toggleMode') as HTMLButtonElement | null;
    const saveAllBtn = document.getElementById('saveAll') as HTMLButtonElement | null;
    const newLessonBtn = document.getElementById('newLesson') as HTMLButtonElement | null;
    const addQuizBtn = document.getElementById('addQuiz') as HTMLButtonElement | null;
    const backToEditorBtn = document.getElementById('backToEditor') as HTMLButtonElement | null;
    const previewLessonBtn = document.getElementById('previewLesson') as HTMLButtonElement | null;
    const closePreviewBtn = document.getElementById('closePreview') as HTMLButtonElement | null;
    const passTestBtn = document.getElementById('passTestBtn') as HTMLButtonElement | null;
    const closeTestBtn = document.getElementById('closeTest') as HTMLButtonElement | null;
    const addQuestionBtn = document.getElementById('addQuestion') as HTMLButtonElement | null;
    const quizTitleInput = document.getElementById('quizTitle') as HTMLInputElement | null;
    const questionsList = document.getElementById('questionsList') as HTMLElement | null;
    const lessonsCountSpan = document.getElementById('lessonsCount') as HTMLElement | null;
    const quizzesCountSpan = document.getElementById('quizzesCount') as HTMLElement | null;
    const exportBtn = document.getElementById('exportBtn') as HTMLAnchorElement | null;
    const importBtn = document.getElementById('importBtn') as HTMLAnchorElement | null;

    // Проверка наличия необходимых элементов
    if (!lessonsListEl || !lessonTitleInput || !contentEditor || !toolbar || !editorSection || !quizSection ||
        !previewSection || !testSection || !previewContent || !testContainer || !toggleModeBtn || !saveAllBtn ||
        !newLessonBtn || !addQuizBtn || !backToEditorBtn || !previewLessonBtn || !closePreviewBtn || !passTestBtn ||
        !closeTestBtn || !addQuestionBtn || !quizTitleInput || !questionsList || !lessonsCountSpan || !quizzesCountSpan ||
        !exportBtn || !importBtn) {
        console.error('Не все элементы DOM найдены');
        return;
    }

    // Состояние
    let lessons: Lesson[] = getLessons();
    let currentLessonId: string | null = lessons[0]?.id || null;
    let isAdminMode: boolean = true;

    // Инициализация редактора
    const editor = new Editor(contentEditor, toolbar);

    // Инициализация менеджера тестов
    const quizManager = new QuizManager(questionsList, quizTitleInput);

    // Функции
    function renderLessonsList(): void {
        lessonsListEl.innerHTML = '';
        lessons.forEach(lesson => {
            const lessonItem = document.createElement('div');
            lessonItem.className = `lesson-item ${lesson.id === currentLessonId ? 'active' : ''}`;
            lessonItem.dataset.id = lesson.id;
            lessonItem.innerHTML = `
                <i class="fas fa-file-alt"></i>
                <span>${lesson.title || 'Без названия'}</span>
                <button class="delete-lesson" data-id="${lesson.id}"><i class="fas fa-trash"></i></button>
            `;
            lessonItem.addEventListener('click', (e) => {
                if ((e.target as HTMLElement).closest('.delete-lesson')) return;
                loadLesson(lesson.id);
            });
            lessonsListEl.appendChild(lessonItem);
        });

        // Кнопки удаления
        document.querySelectorAll('.delete-lesson').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = (btn as HTMLElement).dataset.id;
                if (id) deleteLesson(id);
            });
        });

        // Обновление статистики
        lessonsCountSpan.textContent = `${lessons.length} уроков`;
        const totalQuizzes = lessons.filter(l => l.quiz && l.quiz.questions.length > 0).length;
        quizzesCountSpan.textContent = `${totalQuizzes} тестов`;
    }

    function loadLesson(id: string): void {
        currentLessonId = id;
        const lesson = lessons.find(l => l.id === id);
        if (!lesson) return;

        lessonTitleInput.value = lesson.title || '';
        editor.setContent(lesson.content || '');

        showSection('editor');
        renderLessonsList();

        passTestBtn.style.display = (lesson.quiz && lesson.quiz.questions.length > 0) ? 'inline-block' : 'none';
    }

    function saveCurrentLesson(): void {
        const lesson = lessons.find(l => l.id === currentLessonId);
        if (lesson) {
            lesson.title = lessonTitleInput.value;
            lesson.content = editor.getContent();
        }
        saveLessons(lessons);
    }

    function createNewLesson(): void {
        const newLesson: Lesson = {
            id: generateId(),
            title: 'Новый урок',
            content: '<p>Начните редактировать...</p>',
            quiz: null
        };
        lessons.push(newLesson);
        saveLessons(lessons);
        loadLesson(newLesson.id);
    }

    function deleteLesson(id: string): void {
        if (lessons.length === 1) {
            alert('Нельзя удалить последний урок');
            return;
        }
        lessons = lessons.filter(l => l.id !== id);
        saveLessons(lessons);
        if (currentLessonId === id) {
            loadLesson(lessons[0].id);
        } else {
            renderLessonsList();
        }
    }

    function showSection(section: 'editor' | 'quiz' | 'preview' | 'test'): void {
        editorSection.classList.remove('active');
        quizSection.classList.remove('active');
        previewSection.classList.remove('active');
        testSection.classList.remove('active');

        if (section === 'editor') {
            editorSection.classList.add('active');
        } else if (section === 'quiz') {
            quizSection.classList.add('active');
            const lesson = lessons.find(l => l.id === currentLessonId);
            if (lesson) quizManager.loadQuiz(lesson);
        } else if (section === 'preview') {
            previewSection.classList.add('active');
            const lesson = lessons.find(l => l.id === currentLessonId);
            previewContent.innerHTML = lesson?.content || '';
        } else if (section === 'test') {
            testSection.classList.add('active');
            const lesson = lessons.find(l => l.id === currentLessonId);
            if (lesson?.quiz && lesson.quiz.questions.length) {
                testContainer.innerHTML = quizManager.renderTest();
                document.getElementById('submitTest')?.addEventListener('click', () => quizManager.checkTest());
            } else {
                testContainer.innerHTML = '<p>Тест не создан</p>';
            }
        }
    }

    function toggleMode(): void {
        isAdminMode = !isAdminMode;
        document.body.classList.toggle('user-mode', !isAdminMode);
        toggleModeBtn.innerHTML = isAdminMode ? '<i class="fas fa-edit"></i> Режим редактора' : '<i class="fas fa-eye"></i> Режим просмотра';
        // Скрыть элементы редактирования в пользовательском режиме
        const adminElements = document.querySelectorAll('.admin-only, .toolbar, .sidebar-header button, .section-actions .btn-primary, .add-question-section, .delete-lesson');
        adminElements.forEach(el => (el as HTMLElement).style.display = isAdminMode ? '' : 'none');
        toolbar.style.display = isAdminMode ? 'flex' : 'none';
    }

    // Обработчики
    newLessonBtn.addEventListener('click', createNewLesson);

    saveAllBtn.addEventListener('click', () => {
        saveCurrentLesson();
        quizManager.saveQuizTitle();
        saveLessons(lessons);
        alert('Сохранено');
    });

    addQuizBtn.addEventListener('click', () => {
        const lesson = lessons.find(l => l.id === currentLessonId);
        if (lesson && !lesson.quiz) {
            lesson.quiz = { title: 'Новый тест', questions: [] };
        }
        showSection('quiz');
    });

    backToEditorBtn.addEventListener('click', () => {
        quizManager.saveQuizTitle();
        saveLessons(lessons);
        showSection('editor');
    });

    previewLessonBtn.addEventListener('click', () => {
        saveCurrentLesson();
        showSection('preview');
    });

    closePreviewBtn.addEventListener('click', () => showSection('editor'));

    passTestBtn.addEventListener('click', () => {
        saveCurrentLesson();
        showSection('test');
    });

    closeTestBtn.addEventListener('click', () => showSection('editor'));

    addQuestionBtn.addEventListener('click', () => {
        const typeRadio = document.querySelector('input[name="questionType"]:checked') as HTMLInputElement | null;
        const type = typeRadio?.value as 'single' | 'multiple' || 'single';
        quizManager.addQuestion(type);
    });

    toggleModeBtn.addEventListener('click', toggleMode);

    exportBtn.addEventListener('click', (e) => {
        e.preventDefault();
        exportData();
    });

    importBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            importData(file, (err, newLessons) => {
                if (err) {
                    alert('Ошибка импорта');
                } else if (newLessons) {
                    lessons = newLessons;
                    saveLessons(lessons);
                    loadLesson(lessons[0].id);
                    renderLessonsList();
                    alert('Импорт выполнен');
                }
            });
        };
        input.click();
    });

    // Автосохранение заголовка
    lessonTitleInput.addEventListener('input', () => {
        const lesson = lessons.find(l => l.id === currentLessonId);
        if (lesson) lesson.title = lessonTitleInput.value;
    });

    // Инициализация
    renderLessonsList();
    if (currentLessonId) {
        loadLesson(currentLessonId);
    } else {
        createNewLesson();
    }
});