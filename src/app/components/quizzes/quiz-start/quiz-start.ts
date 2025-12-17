import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../core/services/QuizService/quiz-service';
import {
  ExamDto,
  ExamQuestionDto,
  ExamAnswerDto,
  ExamAttemptDto,
} from '../../../core/interfaces/exam.interface';
import { TokenService } from '../../../core/services/TokenService/token-service';

@Component({
  selector: 'app-quiz-start',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-start.html',
  styleUrl: './quiz-start.scss',
})
export class QuizStart implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _examService = inject(ExamService);
  private readonly _tokenService = inject(TokenService);

  exam = signal<ExamDto | null>(null);
  questions = signal<ExamQuestionDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  submitting = signal<boolean>(false);

  // answers keyed by questionId
  answers = signal<Record<string, ExamAnswerDto>>({});

  ngOnInit(): void {
    const examId = this._route.snapshot.paramMap.get('examId');
    if (!examId) {
      this.error.set('Exam not found.');
      this.loading.set(false);
      return;
    }

    this.loadExam(examId);
  }

  private loadExam(examId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this._examService.getExamById(examId).subscribe({
      next: (exam) => {
        this.exam.set(exam);
        this._examService.getQuestionsByExamId(examId).subscribe({
          next: (questions) => {
            this.questions.set(questions);
            this.initialiseAnswers(questions);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error loading questions:', err);
            this.error.set(err.message || 'Failed to load exam questions');
            this.loading.set(false);
          },
        });
      },
      error: (err) => {
        console.error('Error loading exam:', err);
        this.error.set(err.message || 'Failed to load exam');
        this.loading.set(false);
      },
    });
  }

  private initialiseAnswers(questions: ExamQuestionDto[]): void {
    const map: Record<string, ExamAnswerDto> = {};
    questions.forEach((q) => {
      map[q.questionId] = {
        questionId: q.questionId,
        selectedOptionIds: [],
      };
    });
    this.answers.set(map);
  }

  toggleOption(questionId: string, optionId: string): void {
    const question = this.questions().find((q) => q.questionId === questionId);
    if (!question) return;

    const current = { ...this.answers()[questionId] };

    if (question.questionType === 'TrueFalse') {
      current.selectedOptionIds = [optionId];
    } else {
      const list = new Set(current.selectedOptionIds || []);
      if (list.has(optionId)) {
        list.delete(optionId);
      } else {
        list.add(optionId);
      }
      current.selectedOptionIds = Array.from(list);
    }

    this.answers.set({
      ...this.answers(),
      [questionId]: current,
    });
  }

  updateTextAnswer(questionId: string, text: string): void {
    const current = { ...(this.answers()[questionId] || { questionId }) };
    current.answerText = text;

    this.answers.set({
      ...this.answers(),
      [questionId]: current,
    });
  }

  submitExam(): void {
    const exam = this.exam();
    if (!exam) return;

    const user = this._tokenService.getUser();
    if (!user || !user.userId) {
      this.error.set('User not found. Please login again.');
      return;
    }

    const answersArray: ExamAnswerDto[] = Object.values(this.answers());

    this.submitting.set(true);
    this.error.set(null);

    this._examService
      .submitExamAttempt(exam.examId, {
        studentId: user.userId,
        examId: exam.examId,
        answers: answersArray,
      })
      .subscribe({
        next: (attempt: ExamAttemptDto) => {
          this.submitting.set(false);
          this._router.navigate(['/student/exams/attempts', attempt.attemptId]);
        },
        error: (err) => {
          console.error('Error submitting exam:', err);
          this.error.set(err.message || 'Failed to submit exam');
          this.submitting.set(false);
        },
      });
  }
}
