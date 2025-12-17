// Payment interfaces based on backend DTOs

export interface PaymentDto {
  paymentId: string;
  studentId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: string;
  paymentIntentId?: string | null;
  createdAt: string; // ISO date string
}

export interface PaymentCreateDto {
  studentId: string;
  courseId: string;
  amount: number;
  currency?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface PaymentStatisticsDto {
  totalPayments: number;
  totalRevenue: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  revenueByMonth?: { month: string; revenue: number }[];
}

export interface CourseRevenueDto {
  courseId: string;
  courseTitle: string;
  instructorName: string;
  totalRevenue: number;
  totalSales: number;
}

// ============= Paymob Payment Interfaces =============

export interface PaymobCoursePaymentRequest {
  enrollmentId: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
}

export interface PaymobSubscriptionPaymentRequest {
  subscriptionId: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
}

export interface PaymentInitializationResponse {
  paymentId: string;
  paymobPaymentUrl: string;
  paymentToken: string;
  orderId: string;
  amount: number;
  currency: string;
}

export interface PaymentVerificationResponse {
  paymentId: string;
  status: string;
  isSuccess: boolean;
  transactionId?: string;
  amount: number;
  currency: string;
  paidAt?: string;
  cardType?: string;
  maskedCard?: string;
  errorMessage?: string;
}

export type PaymentType = 'course' | 'subscription';

export interface PaymentModalData {
  type: PaymentType;
  itemName: string;
  itemDescription?: string;
  amount: number;
  currency: string;
  enrollmentId?: string;
  subscriptionId?: string;
  customerEmail: string;
  customerFirstName?: string;
  customerLastName?: string;
  customerPhone?: string;
}
