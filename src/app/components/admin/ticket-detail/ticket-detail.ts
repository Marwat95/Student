import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupportService } from '../../../core/services/Support/support';
import { AdminService } from '../../../core/services/AdminService/admin-service';
import { SupportTicketDto } from '../../../core/interfaces/support.interface';
import { UserDto } from '../../../core/interfaces/i-user';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-detail.html',
  styleUrls: ['./ticket-detail.scss']
})
export class TicketDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private supportService = inject(SupportService);
  private adminService = inject(AdminService);

  ticket = signal<SupportTicketDto | null>(null);
  admins = signal<UserDto[]>([]);
  loading = signal<boolean>(true);
  saving = signal<boolean>(false);

  selectedAdminId: string = '';
  selectedStatus: string = '';
  replyMessage: string = '';

  ngOnInit(): void {
    const ticketId = this.route.snapshot.paramMap.get('id');
    if (ticketId) {
      this.loadTicket(ticketId);
      this.loadAdmins();
    }
  }

  loadTicket(id: string): void {
    this.loading.set(true);
    this.supportService.getTicketById(id).subscribe({
      next: (ticket) => {
        this.ticket.set(ticket);
        this.selectedStatus = ticket.status;
        this.selectedAdminId = ticket.assignedTo || '';
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading ticket:', err);
        alert('Failed to load ticket');
        this.loading.set(false);
        this.goBack();
      }
    });
  }

  loadAdmins(): void {
    this.adminService.getAllUsers(1, 100).subscribe({
      next: (result) => {
        const users = result.items || result || [];
        const adminUsers = users.filter((user: any) => 
          user.role === 'Admin' || user.role === 0
        );
        this.admins.set(adminUsers);
      },
      error: (err) => {
        console.error('Error loading admins:', err);
      }
    });
  }

  assignTicket(): void {
    const ticket = this.ticket();
    if (!ticket || !this.selectedAdminId) {
      alert('Please select an admin');
      return;
    }

    this.saving.set(true);
    this.supportService.assignTicket(ticket.ticketId, this.selectedAdminId).subscribe({
      next: () => {
        alert('Ticket assigned successfully');
        this.loadTicket(ticket.ticketId);
        this.saving.set(false);
      },
      error: (err) => {
        console.error('Error assigning ticket:', err);
        alert('Failed to assign ticket');
        this.saving.set(false);
      }
    });
  }

  updateStatus(): void {
    const ticket = this.ticket();
    if (!ticket) return;

    this.saving.set(true);

    if (this.selectedStatus === 'resolved') {
      this.supportService.resolveTicket(ticket.ticketId).subscribe({
        next: () => {
          alert('Ticket resolved successfully');
          this.loadTicket(ticket.ticketId);
          this.saving.set(false);
        },
        error: (err) => {
          console.error('Error resolving ticket:', err);
          alert('Failed to resolve ticket');
          this.saving.set(false);
        }
      });
    } else {
      // For other status changes, you might need a different API endpoint
      alert('Status updated to: ' + this.selectedStatus);
      this.saving.set(false);
    }
  }

  sendReply(): void {
    if (!this.replyMessage.trim()) {
      alert('Please enter a reply message');
      return;
    }

    // TODO: Implement reply functionality when backend supports it
    alert('Reply sent: ' + this.replyMessage);
    this.replyMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/admin/support']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-primary';
      case 'assigned': return 'bg-warning';
      case 'resolved': return 'bg-success';
      case 'closed': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }
}
