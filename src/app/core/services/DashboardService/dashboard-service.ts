import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  StudentDashboardDto,
  InstructorDashboardDto,
  AdminDashboardDto
} from '../../interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Get student dashboard data
   */
  getStudentDashboard(studentId: string): Observable<StudentDashboardDto> {
    return this.http.get<StudentDashboardDto>(
      `${environment.apiUrl}/dashboard/student/${studentId}`
    );
  }

  /**
   * Get instructor dashboard data
   */
  getInstructorDashboard(instructorId: string): Observable<InstructorDashboardDto> {
    const url = `${environment.apiUrl}/dashboard/instructor/${instructorId}`;
    console.log('📊 Dashboard Service:', {
      apiUrl: environment.apiUrl,
      fullUrl: url,
      instructorId
    });
    return this.http.get<InstructorDashboardDto>(url);
  }

  /**
   * Get admin dashboard data
   */
  getAdminDashboard(): Observable<AdminDashboardDto> {
    return this.http.get<AdminDashboardDto>(
      `${environment.apiUrl}/dashboard/admin`
    );
  }

  /**
   * Get dashboard data (generic - for backward compatibility)
   */
  getDashboardData(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/dashboard/admin`);
  }

  /**
   * Get users list (for admin dashboard)
   */
  getUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users`);
  }

  /**
   * Get courses list (for admin dashboard)
   */
  getCourses(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/courses`);
  }

  /**
   * Get instructors list (with fallback filtering)
   */
  getInstructors(): Observable<any> {
    // Failover: fetch users and filter by role since /instructors API might be missing
    return this.getUsers().pipe(
      map((response: any) => {
        let users = [];
        if (Array.isArray(response)) {
          users = response;
        } else if (response && Array.isArray(response.data)) {
          users = response.data;
        } else if (response && Array.isArray(response.items)) {
          users = response.items;
        } else if (response && Array.isArray(response.users)) {
          users = response.users;
        }

        // Filter for instructors (role 1 = Instructor)
        return users.filter((u: any) => {
          const r = u.role;
          return r === 1 || r === '1' ||
            (typeof r === 'string' && (r.toLowerCase().includes('instructor') || r.toLowerCase().includes('teacher')));
        });
      })
    );
  }
}

