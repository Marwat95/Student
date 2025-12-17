import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../core/services/CourseService/course-service';
import { EnrollmentService } from '../../../core/services/Enrollment/enrollment';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { CourseDto } from '../../../core/interfaces/course.interface';

@Component({
  selector: 'app-browse-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './browse-courses.html',
  styleUrl: './browse-courses.scss',
})
export class BrowseCourses implements OnInit {
  private readonly _router = inject(Router);
  private readonly _courseService = inject(CourseService);
  private readonly _enrollmentService = inject(EnrollmentService);
  private readonly _tokenService = inject(TokenService);

  // State
  courses = signal<CourseDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  searchQuery = signal<string>('');
  enrollingCourseId = signal<string | null>(null);

  // Pagination
  currentPage = signal<number>(1);
  pageSize = 10;
  totalPages = signal<number>(1);
  totalCourses = signal<number>(0);

  // Student summary stats
  stats = signal<{ totalEnrollments: number; completedCourses: number; averageProgress: number }>({
    totalEnrollments: 0,
    completedCourses: 0,
    averageProgress: 0,
  });
  ngOnInit(): void {
    this.loadCourses();
    this.loadStats();
  }
  loadCourses(): void {
    this.loading.set(true);
    this.error.set(null);

    const query = this.searchQuery();
    const page = this.currentPage();

    const request = query
      ? this._courseService.searchCourses(query, page, this.pageSize)
      : this._courseService.getAllCourses(page, this.pageSize);

    request.subscribe({
      next: (result) => {
        this.courses.set(result.items);
        this.totalPages.set(result.totalPages || 1);
        this.totalCourses.set(result.totalCount || 0);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.error.set(err.message || 'Failed to load courses');
        this.loading.set(false);
      },
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.currentPage.set(1);
    this.loadCourses();
  }

  enrollInCourse(courseId: string): void {
    const user = this._tokenService.getUser();
    if (!user || !user.userId) {
      this.error.set('Please login to enroll in courses');
      this._router.navigate(['/login']);
      return;
    }

    // Enroll directly without payment check as requested
    this.enrollingCourseId.set(courseId);

    this._enrollmentService
      .enrollInCourse({
        courseId: courseId,
        studentId: user.userId,
      })
      .subscribe({
        next: () => {
          this.enrollingCourseId.set(null);
          alert('✅ Successfully enrolled in course! Redirecting to dashboard...');
          // Navigate to dashboard with refresh parameter
          setTimeout(() => {
            this._router.navigate(['/student'], {
              queryParams: { refresh: Date.now() },
            });
          }, 1000);
        },
        error: (err) => {
          console.error('Error enrolling in course:', err);
          this.enrollingCourseId.set(null);
          this.error.set(err.error?.message || 'Failed to enroll in course');
        },
      });
  }

  viewCourseDetails(courseId: string): void {
    this._router.navigate(['/courses', courseId]);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
      this.loadCourses();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      this.loadCourses();
    }
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadCourses();
  }

  get paginationPages(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    // Show max 5 pages
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }

  private loadStats(): void {
    const user = this._tokenService.getUser();
    if (!user || !user.userId) {
      return;
    }

    this._enrollmentService.getEnrollmentsByStudent(user.userId, 1, 100).subscribe({
      next: (res: any) => {
        const items = res.items || res.data || [];
        const total = items.length;
        const completed = items.filter((e: any) => e.isCompleted).length;
        const avg = total
          ? Math.round(
            items.reduce(
              (sum: number, e: any) => sum + (e.progressPercentage ?? e.progress ?? 0),
              0
            ) / total
          )
          : 0;
        this.stats.set({
          totalEnrollments: total,
          completedCourses: completed,
          averageProgress: avg,
        });
      },
      error: () => {
        /* silent */
      },
    });
  }

  goToDashboard(): void {
    this._router.navigate(['/student/dashboard']);
  }
}
