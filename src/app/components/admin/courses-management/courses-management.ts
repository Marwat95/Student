import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../../core/services/DashboardService/dashboard-admin';
import { AdminService } from '../../../core/services/AdminService/admin-service';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal';
import { EditCourseModalComponent } from '../shared/edit-course-modal/edit-course-modal';

@Component({
  selector: 'app-courses-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent, EditCourseModalComponent],
  templateUrl: './courses-management.html',
  styleUrls: ['./courses-management.scss']
})
export class CoursesManagement {
  courses: any[] = [];
  loading = true;

  // Search
  searchTerm: string = '';

  // Modal
  showModal = false;
  modalTitle = 'Delete Course';
  modalMessage = 'Are you sure you want to delete this course?';
  selectedId: string | null = null;

  // Edit Modal
  showEditModal = false;
  editingCourseId: string | null = null;

  constructor(
    private dashboardService: DashboardService,
    private adminService: AdminService,
    private router: Router
  ) { }

  ngOnInit() {
    this.calculateCourses();
  }

  get filteredCourses() {
    if (!this.searchTerm) return this.courses;
    const lowerTerm = this.searchTerm.toLowerCase();
    return this.courses.filter(course =>
      (course.title && course.title.toLowerCase().includes(lowerTerm)) ||
      (course.instructorName && course.instructorName.toLowerCase().includes(lowerTerm)) ||
      (course.category && course.category.toLowerCase().includes(lowerTerm))
    );
  }

  calculateCourses() {
    this.dashboardService.getCourses().subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.courses = res;
        } else if (res && Array.isArray(res.data)) {
          this.courses = res.data;
        } else if (res && Array.isArray(res.courses)) {
          this.courses = res.courses;
        } else {
          this.courses = [];
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  onAddCourse() {
    // Navigate to instructor create course page
    this.router.navigate(['/instructor/courses/create']);
  }

  onEdit(id: string) {
    if (!id) {
      console.error('Course ID is missing');
      return;
    }
    this.editingCourseId = id;
    this.showEditModal = true;
  }

  onEditModalClose() {
    this.showEditModal = false;
    this.editingCourseId = null;
  }

  onCourseUpdated() {
    this.calculateCourses(); // Refresh list
    this.onEditModalClose();
  }

  onDelete(id: string) {
    this.selectedId = id;
    this.showModal = true;
  }

  confirmDelete() {
    if (this.selectedId) {
      this.adminService.deleteCourse(this.selectedId).subscribe({
        next: () => {
          console.log('Course deleted successfully');
          this.courses = this.courses.filter(c =>
            (c.id || c._id || c.courseId) !== this.selectedId
          );
          this.showModal = false;
          this.selectedId = null;
        },
        error: (err) => {
          console.error('Failed to delete course', err);
          alert('Failed to delete course: ' + (err.error?.message || err.message));
          this.showModal = false;
        }
      });
    }
  }

  getCourseImageUrl(course: any): string | null {
    if (!course) return null;
    const url = course.thumbnailUrl || course.cover || course.imagePath;
    if (!url) return null;

    if (url.startsWith('http') || url.startsWith('data:')) {
      return url;
    }

    // Clean path and prepend base URL
    const cleanPath = url.startsWith('/') ? url.substring(1) : url;
    return `http://mahdlms.runasp.net/${cleanPath}`;
  }

  cancelDelete() {
    this.showModal = false;
    this.selectedId = null;
  }
}
