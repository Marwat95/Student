import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  SubscriptionPackageDto,
  InstructorSubscriptionDto,
  SubscribeDto,
  PagedResult,
} from '../../interfaces/subscription.interface';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAllPackages(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<SubscriptionPackageDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<SubscriptionPackageDto>>(`${environment.apiUrl}/subscriptions/packages`, { params });
  }

  getPackageById(id: string): Observable<SubscriptionPackageDto> {
    return this.http.get<SubscriptionPackageDto>(`${environment.apiUrl}/subscriptions/packages/${id}`);
  }

  createPackage(data: SubscriptionPackageDto): Observable<SubscriptionPackageDto> {
    return this.http.post<SubscriptionPackageDto>(`${environment.apiUrl}/subscriptions/packages`, data);
  }

  updatePackage(id: string, data: SubscriptionPackageDto): Observable<SubscriptionPackageDto> {
    return this.http.put<SubscriptionPackageDto>(`${environment.apiUrl}/subscriptions/packages/${id}`, data);
  }

  deletePackage(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/subscriptions/packages/${id}`);
  }

  subscribe(data: SubscribeDto): Observable<InstructorSubscriptionDto> {
    return this.http.post<InstructorSubscriptionDto>(`${environment.apiUrl}/subscriptions/subscribe`, data);
  }

  getInstructorSubscription(instructorId: string): Observable<InstructorSubscriptionDto> {
    return this.http.get<InstructorSubscriptionDto>(`${environment.apiUrl}/subscriptions/instructor/${instructorId}`);
  }

  cancelSubscription(subscriptionId: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/subscriptions/cancel/${subscriptionId}`, {});
  }

  renewSubscription(subscriptionId: string): Observable<InstructorSubscriptionDto> {
    return this.http.post<InstructorSubscriptionDto>(`${environment.apiUrl}/subscriptions/renew/${subscriptionId}`, {});
  }

  // Promo Code Methods
  getAllPromoCodes(pageNumber: number = 1, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${environment.apiUrl}/promo-codes`, { params });
  }

  getPromoCodeById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/promo-codes/${id}`);
  }

  createPromoCode(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/promo-codes`, data);
  }

  updatePromoCode(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/promo-codes/${id}`, data);
  }

  deletePromoCode(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/promo-codes/${id}`);
  }

  validatePromoCode(code: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/promo-codes/validate`, { code });
  }

  // Package Image Methods
  uploadPackageImage(packageId: string, imageFile: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.http.post<{ imageUrl: string }>(`${environment.apiUrl}/subscriptions/packages/${packageId}/image`, formData);
  }

  deletePackageImage(packageId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/subscriptions/packages/${packageId}/image`);
  }
}

