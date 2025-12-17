import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // البيانات الأساسية للداشبورد
  getDashboardData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/admin`);
  }

  // قائمة المستخدمين
  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  // قائمة الكورسات
  getCourses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/courses`);
  }

  // قائمة المدربين
  getInstructors(): Observable<any> {
    // Failover: fetch users and filter by role since /instructors API is missing (404)
    return this.getUsers().pipe(
      map((response: any) => {
        let users = [];
        if (Array.isArray(response)) {
          users = response;
        } else if (response && Array.isArray(response.data)) {
          users = response.data;
        } else if (response && Array.isArray(response.users)) {
          users = response.users;
        } else if (response && Array.isArray(response.items)) {
          users = response.items;
        }

        // Filter for instructors (adjust 'Instructor' string based on actual DB role values)
        return users.filter((u: any) => {
          const core = u.user || u;
          const r = u.role !== undefined ? u.role : (core.role !== undefined ? core.role : u.Role);

          // Check for numeric role 1 (Instructor) or string variations
          return r === 1 || r === '1' ||
            (typeof r === 'string' && (r.toLowerCase().includes('instructor') || r.toLowerCase().includes('teacher')));
        });
      })
    );
  }
}
