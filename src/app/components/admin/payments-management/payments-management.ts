import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/AdminService/admin-service';
import { CourseRevenueDto } from '../../../core/interfaces/payment.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-payments-management',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './payments-management.html',
  styleUrls: ['./payments-management.scss']
})
export class PaymentsManagement implements OnInit {
  private adminService = inject(AdminService);

  courseRevenues = signal<CourseRevenueDto[]>([]);
  monthlyRevenue = signal<number>(0);
  loading = signal<boolean>(false);

  // Dummy data for initial dev/testing if backend is empty
  // Remove or comment out when backend is fully ready
  // isDevMode = true; 

  constructor() { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);

    // ForkJoin could be used here, but simple sequential calls are fine for now
    this.adminService.getCourseRevenueStats().subscribe({
      next: (data: CourseRevenueDto[]) => {
        console.log('Course Revenue Data:', data);
        this.courseRevenues.set(data);
      },
      error: (err: any) => {
        // console.warn('Payment API not available, using dummy data.');
        this.setDummyData();
      }
    });

    this.adminService.getMonthlyRevenue().subscribe({
      next: (data: { totalRevenue: number }) => {
        console.log('Monthly Revenue Data:', data);
        this.monthlyRevenue.set(data.totalRevenue);
        this.loading.set(false);
      },
      error: (err: any) => {
        // console.warn('Monthly revenue API not available.');
        this.loading.set(false);
        // Fallback is handled in setDummyData for monthly revenue too if needed
      }
    });
  }

  private setDummyData() {
    this.courseRevenues.set([
      { courseId: '1', courseTitle: 'Angular Masterclass', instructorName: 'John Doe', totalRevenue: 1500, totalSales: 30 },
      { courseId: '2', courseTitle: 'React for Beginners', instructorName: 'Jane Smith', totalRevenue: 1200, totalSales: 25 },
      { courseId: '3', courseTitle: 'Node.js Advanced', instructorName: 'Bob Wilson', totalRevenue: 2000, totalSales: 40 },
    ]);
    this.monthlyRevenue.set(4700);
  }
}
