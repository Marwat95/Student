import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  EnrollmentDto,
  EnrollmentCreateDto,
  PagedResult
} from '../../interfaces/enrollment.interface';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Get enrollments by student with pagination
   */
  getEnrollmentsByStudent(studentId: string, pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<EnrollmentDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<EnrollmentDto>>(
      `http://mahd3.runasp.net/api/enrollments/student/${studentId}`,
      { params }
    );
  }

  /**
   * Get enrollments by course with pagination (Instructor or Admin)
   */
  getEnrollmentsByCourse(courseId: string, pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<EnrollmentDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<EnrollmentDto>>(
      `http://mahd3.runasp.net/api/enrollments/course/${courseId}`,
      { params }
    );
  }

  /**
   * Enroll in course (Student or Admin)
   */
  enrollInCourse(data: EnrollmentCreateDto): Observable<EnrollmentDto> {
    return this.http.post<EnrollmentDto>(`http://mahd3.runasp.net/api/enrollments`, data);
  }

  /**
   * Cancel enrollment (Student own or Admin)
   */
  cancelEnrollment(id: string): Observable<any> {
    return this.http.delete(`http://mahd3.runasp.net/api/enrollments/${id}`);
  }

  /**
   * Get enrollment progress (Student own, Instructor, or Admin)
   */
  getEnrollmentProgress(id: string): Observable<EnrollmentDto> {
    return this.http.get<EnrollmentDto>(`http://mahd3.runasp.net/api/enrollments/${id}/progress`);
  }

  /**
   * Get course completion certificate (PDF)
   */
  getCertificate(id: string): Observable<Blob> {
    return this.http.get(`http://mahd3.runasp.net/api/enrollments/${id}/certificate`, {
      responseType: 'blob'
    });
  }

  /**
   * Update enrollment progress percentage (Student own or Admin)
   */
  updateProgress(id: string, progressPercentage: number): Observable<any> {
    return this.http.put(`http://mahd3.runasp.net/api/enrollments/${id}/progress`, progressPercentage);
  }
}
