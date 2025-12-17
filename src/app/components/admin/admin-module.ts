import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// استيراد كل الكومبوننتات Standalone
import { LayoutComponent } from './layout/layout/layout';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';
import { UsersManagement } from './users-management/users-management';
import { CoursesManagement } from './courses-management/courses-management';
import { PaymentsManagement } from './payments-management/payments-management';
import { Reports } from './reports/reports';
import { SubscriptionsManagement } from './subscriptions-management/subscriptions-management';
import { PromoCodesManagement } from './promo-codes-management/promo-codes-management';

@NgModule({
  imports: [
    CommonModule,
    LayoutComponent,
    AdminDashboardComponent,
    UsersManagement,
    CoursesManagement,
    PaymentsManagement,
    Reports,
    SubscriptionsManagement,
    PromoCodesManagement
  ]
})
export class AdminModule {}
