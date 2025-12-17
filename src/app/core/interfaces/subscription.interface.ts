// Subscription interfaces based on backend DTOs

export interface SubscriptionPackageDto {
  packageId: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  storageLimitMB: number;
  maxStudentsCapacity: number;
  commissionPercentage?: number | null;
  subscriberCount?: number;
  imageUrl?: string | null;
  createdAt: string; // ISO date string
}

export interface InstructorSubscriptionDto {
  subscriptionId: string;
  instructorId: string;
  packageId: string;
  packageName?: string | null;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  isActive: boolean;
  originalPrice: number;
  finalPrice: number;
  discountAmount: number;
  appliedPromoCode?: string | null;
}

export interface SubscribeDto {
  instructorId: string;
  packageId: string;
  promoCode?: string | null;
}

export interface PromoCodeDto {
  promoCodeId: string;
  code: string;
  description: string;
  discountPercentage: number;
  maxDiscountAmount?: number;
  maxUsageCount: number;
  currentUsageCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  isValid: boolean;
  isExpired: boolean;
  isExhausted: boolean;
}

export interface PromoCodeCreateDto {
  code: string;
  description: string;
  discountPercentage: number;
  maxDiscountAmount?: number;
  maxUsageCount: number;
  validFrom: string;
  validUntil: string;
}

export interface PagedResult<T> {
  Data: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
