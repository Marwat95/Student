// Support ticket interfaces based on backend DTOs

export interface SupportTicketDto {
  ticketId: string;
  userId: string;
  subject: string;
  description: string;
  status: string;
  assignedTo?: string | null;
  createdAt: string; // ISO date string
  closedAt?: string | null;
  response?: string; // Admin response to the ticket
  updatedAt?: string; // ISO date string - last update time
  // Optional fields for display purposes
  userName?: string; // Full name of the user who created the ticket
  assignedToName?: string; // Full name of the admin assigned to the ticket
}

export interface SupportTicketCreateDto {
  userId: string;
  subject: string;
  description: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface SupportApiResponse<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages?: number;
}


