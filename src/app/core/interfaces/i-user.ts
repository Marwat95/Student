// User Interfaces based on Backend DTOs

export interface UserDto {
  userId: string;
  name?: string;
  fullName: string;
  email: string;
  role: number;
  isEmailVerified: boolean;
  createdAt: string;
  cover?: string;
}

export interface UserUpdateDto {
  fullName?: string;
  email?: string;
  phoneNumber?: string; // Added for profile update
  city?: string;
  country?: string;
  birthDate?: string;
}

export interface PhoneDetail {
  phoneNumber: string;
  isPrimary: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface UserDetail {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  photoUrl: string;
  city: string;
  country: string;
  birthDate: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentDetail {
  educationLevel: string;
  enrolledCoursesCount: number;
  createdAt: string;
}

export interface InstructorDetail {
  bio: string;
  specialization: string;
  publicLandingPageSlug: string;
  coursesCount: number;
  averageRating: number;
  createdAt: string;
  socialLinks: any[];
  images: any[];
}

export interface UserProfileResponse {
  user: UserDetail;
  student?: StudentDetail;
  instructor?: InstructorDetail;
  admin?: any;
  phones: PhoneDetail[];
}
