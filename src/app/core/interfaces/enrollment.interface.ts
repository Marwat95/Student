// Enrollment Interfaces based on Backend DTOs

export interface EnrollmentDto {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  courseName?: string;
  courseTitle?: string; // Alternative property name
  progressPercentage: number;
  progress?: number; // Alternative property name
  enrollmentDate: string; // ISO date string
  completedAt?: string; // ISO date string
  isCompleted: boolean;
  status?: string; // Enrollment status (e.g., 'In Progress', 'Completed')
  courseThumbnail?: string; // Course thumbnail URL
  thumbnailUrl?: string; // Alternative property name for thumbnail
}

export interface EnrollmentCreateDto {
  studentId: string;
  courseId: string;
}

// Generic paged result used by enrollment endpoints
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

