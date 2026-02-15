import { Lesson, Question, Option, QuestionType } from './types';
import { generateId } from './api';

export class QuizManager {
    private currentLesson: Lesson | null = null;
    private questionsContainer: HTMLElement;
    private quizTitleInput: HTMLInputElement;

    constructor(container: HTMLElement, titleInput: HTMLInputElement) {
        this.questionsContainer = container;
        this.quizTitleInput = titleInput;
    }

    public loadQuiz(lesson: Lesson): void {
        this.currentLesson = lesson;
        if (!lesson.quiz) {
            lesson.quiz = { title: 'Новый тест', questions: [] };
        }
        this.quizTitleInput.value = lesson.quiz.title;
        this.renderQuestions();
    }

    private renderQuestions(): void {
        const quiz = this.currentLesson?.quiz;
        if (!quiz || quiz.questions.length === 0) {
            this.questionsContainer.innerHTML = '<p class="empty-list">Вопросов пока нет. Добавьте первый вопрос.</p>';
            return;
        }

        let html = '';
        quiz.questions.forEach((q, index) => {
            html += `
                <div class="question-card" data-question-id="${q.id}">
                    <div class="question-header">
                        <input type="text" class="form-control question-text" value="${this.escapeHtml(q.text)}" placeholder="Вопрос ${index+1}">
                        <span class="question-type">${q.type === 'single' ? 'Один ответ' : 'Несколько ответов'}</span>
                        <button class="btn-icon remove-question" title="Удалить вопрос"><i class="fas fa-trash"></i></button>
                    </div>
                    <div class="options-list">
                        ${this.renderOptions(q)}
                    </div>
                    <button class="btn btn-sm btn-outline add-option" data-question-id="${q.id}"><i class="fas fa-plus"></i> Добавить вариант</button>
                </div>
            `;
        });
        this.questionsContainer.innerHTML = html;

        // Привязываем события
        this.questionsContainer.querySelectorAll('.question-text').forEach((input, idx) => {
            input.addEventListener('change', (e: Event) => {
                if (this.currentLesson?.quiz) {
                    this.currentLesson.quiz.questions[idx].text = (e.target as HTMLInputElement).value;
                }
            });
        });

        this.questionsContainer.querySelectorAll('.remove-question').forEach((btn, idx) => {
            btn.addEventListener('click', () => {
                this.currentLesson?.quiz?.questions.splice(idx, 1);
                this.renderQuestions();
            });
        });

        this.questionsContainer.querySelectorAll('.add-option').forEach(btn => {
            btn.addEventListener('click', (e: Event) => {
                const target = e.currentTarget as HTMLElement;
                const qId = target.dataset.questionId;
                if (!qId) return;
                const question = this.currentLesson?.quiz?.questions.find(q => q.id === qId);
                if (question) {
                    question.options.push({
                        id: generateId(),
                        text: 'Новый вариант',
                        correct: false
                    });
                    this.renderQuestions();
                }
            });
        });

        // Обработка изменения текста варианта
        this.questionsContainer.querySelectorAll('input[type="text"][data-option-id]').forEach(input => {
            input.addEventListener('change', (e: Event) => {
                const target = e.target as HTMLInputElement;
                const optionId = target.dataset.optionId;
                if (!optionId || !this.currentLesson?.quiz) return;
                this.currentLesson.quiz.questions.forEach(q => {
                    const opt = q.options.find(o => o.id === optionId);
                    if (opt) opt.text = target.value;
                });
            });
        });

        // Обработка чекбоксов/радио
        this.questionsContainer.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
            input.addEventListener('change', (e: Event) => {
                const target = e.target as HTMLInputElement;
                const optionId = target.dataset.optionId;
                const qId = target.dataset.questionId;
                if (!optionId || !qId || !this.currentLesson?.quiz) return;
                const question = this.currentLesson.quiz.questions.find(q => q.id === qId);
                if (!question) return;

                if (question.type === 'single') {
                    // Снять выделение со всех остальных
                    question.options.forEach(opt => opt.correct = false);
                    const opt = question.options.find(o => o.id === optionId);
                    if (opt) opt.correct = true;
                } else {
                    const opt = question.options.find(o => o.id === optionId);
                    if (opt) opt.correct = target.checked;
                }
            });
        });
    }

    private renderOptions(question: Question): string {
        const inputType = question.type === 'single' ? 'radio' : 'checkbox';
        return question.options.map(opt => `
            <div class="option-item">
                <input type="${inputType}" name="q_${question.id}" data-question-id="${question.id}" data-option-id="${opt.id}" ${opt.correct ? 'checked' : ''}>
                <input type="text" class="form-control option-text" data-option-id="${opt.id}" value="${this.escapeHtml(opt.text)}" placeholder="Вариант ответа">
                <button class="btn-icon remove-option" data-option-id="${opt.id}"><i class="fas fa-times"></i></button>
            </div>
        `).join('');
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    public addQuestion(type: QuestionType): void {
        if (!this.currentLesson) return;
        const newQuestion: Question = {
            id: generateId(),
            type: type,
            text: 'Новый вопрос',
            options: [
                { id: generateId(), text: 'Вариант 1', correct: false },
                { id: generateId(), text: 'Вариант 2', correct: true }
            ]
        };
        if (!this.currentLesson.quiz) {
            this.currentLesson.quiz = { title: 'Тест', questions: [] };
        }
        this.currentLesson.quiz.questions.push(newQuestion);
        this.renderQuestions();
    }

    public saveQuizTitle(): void {
        if (this.currentLesson && this.currentLesson.quiz) {
            this.currentLesson.quiz.title = this.quizTitleInput.value;
        }
    }

    public renderPreview(): string {
        if (!this.currentLesson || !this.currentLesson.quiz) return '<p>Тест не создан</p>';
        const quiz = this.currentLesson.quiz;
        let html = `<h3>${quiz.title}</h3>`;
        quiz.questions.forEach((q, idx) => {
            html += `<div class="preview-question"><strong>${idx+1}. ${q.text}</strong><br>`;
            q.options.forEach(opt => {
                html += `<label style="display:block"><input type="${q.type === 'single' ? 'radio' : 'checkbox'}" disabled> ${opt.text}</label>`;
            });
            html += '</div>';
        });
        return html;
    }

    public renderTest(): string {
        if (!this.currentLesson || !this.currentLesson.quiz) return '<p>Тест не создан</p>';
        const quiz = this.currentLesson.quiz;
        let html = `<h3>${quiz.title}</h3><form id="testForm">`;
        quiz.questions.forEach((q, idx) => {
            html += `<div class="test-question" data-qid="${q.id}"><strong>${idx+1}. ${q.text}</strong><br>`;
            const name = q.type === 'single' ? `q_${q.id}` : `q_${q.id}[]`;
            q.options.forEach(opt => {
                html += `<label style="display:block"><input type="${q.type === 'single' ? 'radio' : 'checkbox'}" name="${name}" value="${opt.id}"> ${opt.text}</label>`;
            });
            html += '</div>';
        });
        html += '<button type="button" id="submitTest" class="btn btn-success">Завершить тест</button></form>';
        html += '<div id="testResult"></div>';
        return html;
    }

    public checkTest(): void {
        const form = document.getElementById('testForm') as HTMLFormElement | null;
        if (!form || !this.currentLesson?.quiz) return;
        const quiz = this.currentLesson.quiz;
        let correctCount = 0;
        const totalCount = quiz.questions.length;

        quiz.questions.forEach(q => {
            const correctOptions = q.options.filter(opt => opt.correct).map(opt => opt.id);
            let userAnswers: string[] = [];
            if (q.type === 'single') {
                const radio = form.querySelector(`input[name="q_${q.id}"]:checked`) as HTMLInputElement | null;
                if (radio) userAnswers = [radio.value];
            } else {
                const checkboxes = form.querySelectorAll(`input[name="q_${q.id}[]"]:checked`);
                userAnswers = Array.from(checkboxes).map(cb => (cb as HTMLInputElement).value);
            }
            // Сравнение массивов (порядок не важен)
            if (JSON.stringify(userAnswers.sort()) === JSON.stringify(correctOptions.sort())) {
                correctCount++;
            }
        });

        const resultDiv = document.getElementById('testResult');
        if (resultDiv) {
            resultDiv.innerHTML = `<p class="result">Вы ответили правильно на ${correctCount} из ${totalCount} вопросов.</p>`;
        }
    }
}