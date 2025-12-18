import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { InstructorDto, InstructorApiResponse } from '../../interfaces/instructor.interface';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Use api/users with role filter as requested
  getInstructors(params?: {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    role?: string;
  }): Observable<{ data: InstructorDto[]; totalRecords: number }> {
    let httpParams = new HttpParams();
    
    // Default to Instructor role if not specified
    httpParams = httpParams.set('role', params?.role || 'Instructor');

    if (params?.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params?.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<any>(`http://mahd3.runasp.net/api/users`, { params: httpParams }).pipe(
      map(response => ({
        data: response.data.map((item: any) => this.mapToInstructorDto(item)),
        totalRecords: response.totalRecords
      }))
    );
  }

  getPublicInstructor(id: string): Observable<InstructorDto> {
    return this.http.get<InstructorDto>(`http://mahd3.runasp.net/api/instructors/${id}`);
  }

  getTopInstructors(count: number = 4): Observable<InstructorDto[]> {
    return this.getInstructors({ pageSize: 50 }).pipe(
      map(result => result.data
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, count)
      )
    );
  }

  private mapToInstructorDto(item: any): InstructorDto {
    if (item.user) {
       // Handle nested api/users response if that's what returns
       return {
        instructorId: item.user.userId,
        userId: item.user.userId,
        fullName: item.user.fullName,
        email: item.user.email,
        photoUrl: item.user.photoUrl,
        bio: item.instructor?.bio,
        coursesCount: item.instructor?.coursesCount || 0,
        averageRating: item.instructor?.averageRating || 0,
       };
    }
    
    // Handle flat api/instructors response
    return {
      instructorId: item.instructorId || item.id || item.userId,
      userId: item.userId || item.instructorId,
      fullName: item.fullName,
      email: item.email,
      photoUrl: item.photoUrl,
      bio: item.bio,
      coursesCount: item.coursesCount || 0,
      averageRating: item.averageRating || 0,
    };
  }
}
