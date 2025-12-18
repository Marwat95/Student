import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserDto } from '../../interfaces/i-user';
import { CourseDto, PagedResult } from '../../interfaces/course.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Users
  getAllUsers(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<UserDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<UserDto>>(`${environment.apiUrl}/users`, { params });
  }

  getUserByEmail(email: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${environment.apiUrl}/users/email/${email}`);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }

  getUserById(id: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${environment.apiUrl}/users/${id}`);
  }

  // Get user with password (Admin only - for edit purposes)
  getUserWithPassword(id: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${environment.apiUrl}/admin/users/${id}/with-password`);
  }

  updateUser(id: string, userData: any): Observable<UserDto> {
    return this.http.put<UserDto>(`${environment.apiUrl}/users/${id}`, userData);
  }

  changeUserPassword(id: string, passwordData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/${id}/password`, passwordData);
  }

  // Update user role specifically
  updateUserRole(id: string, role: number): Observable<UserDto> {
    return this.http.put<UserDto>(`${environment.apiUrl}/users/${id}/role`, { role });
  }

  // Upload user photo
  uploadUserPhoto(id: string, photoFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', photoFile);
    return this.http.post(`${environment.apiUrl}/users/${id}/photo`, formData);
  }

  // Courses (for admin courses management)
  getAllCourses(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<CourseDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<CourseDto>>(`${environment.apiUrl}/courses`, { params });
  }

  getCourseById(id: string): Observable<CourseDto> {
    return this.http.get<CourseDto>(`${environment.apiUrl}/courses/${id}`);
  }

  updateCourse(id: string, courseData: any): Observable<CourseDto> {
    return this.http.put<CourseDto>(`${environment.apiUrl}/courses/${id}`, courseData);
  }

  // Update course with image file
  updateCourseWithImage(id: string, courseData: any, imageFile?: File): Observable<CourseDto> {
    const formData = new FormData();

    // Append course data fields
    if (courseData.title) formData.append('title', courseData.title);
    if (courseData.description) formData.append('description', courseData.description);
    if (courseData.price !== undefined) formData.append('price', courseData.price.toString());
    if (courseData.category) formData.append('category', courseData.category);

    // Append image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.put<CourseDto>(`${environment.apiUrl}/courses/${id}`, formData);
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/courses/${id}`);
  }

  // Payments & Revenue
  getCourseRevenueStats(): Observable<any[]> {
    // Expected to return array of: { courseId, courseTitle, instructorName, totalRevenue, totalSales }
    return this.http.get<any[]>(`${environment.apiUrl}/admin/payments/courses-revenue`);
  }

  getMonthlyRevenue(): Observable<{ totalRevenue: number }> {
    // Expected to return: { totalRevenue: number } for current month
    return this.http.get<{ totalRevenue: number }>(`${environment.apiUrl}/admin/payments/monthly-revenue`);
  }
}
