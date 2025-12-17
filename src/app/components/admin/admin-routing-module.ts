import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout/layout';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';
import { UsersManagement } from './users-management/users-management';
import { CoursesManagement } from './courses-management/courses-management';
import { PaymentsManagement } from './payments-management/payments-management';
import { Reports } from './reports/reports';
import { InstructorsManagement } from './instructors-management/instructors-management';
import { SupportManagement } from './support-management/support-management';
import { EditUser } from './users-management/edit-user/edit-user';
import { SubscriptionsManagement } from './subscriptions-management/subscriptions-management';
import { PromoCodesManagement } from './promo-codes-management/promo-codes-management';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'users', component: UsersManagement },
      { path: 'users/edit/:id', component: EditUser },
      { path: 'instructors', component: InstructorsManagement },
      { path: 'courses', component: CoursesManagement },
      { path: 'support', component: SupportManagement },
      { path: 'payments', component: PaymentsManagement },
      { path: 'subscriptions', component: SubscriptionsManagement },
      { path: 'promo-codes', component: PromoCodesManagement },
      { path: 'reports', component: Reports }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
