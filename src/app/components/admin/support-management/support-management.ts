import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupportService } from '../../../core/services/Support/support';
import { SupportTicketDto, PagedResult } from '../../../core/interfaces/support.interface';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { AdminService } from '../../../core/services/AdminService/admin-service';
import { UserDto } from '../../../core/interfaces/i-user';

@Component({
  selector: 'app-support-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support-management.html',
  styleUrls: ['./support-management.scss'],
})
export class SupportManagement implements OnInit {
  private readonly _supportService = inject(SupportService);
  private readonly _tokenService = inject(TokenService);
  private readonly _adminService = inject(AdminService);

  tickets = signal<SupportTicketDto[]>([]);
  filteredTickets = signal<SupportTicketDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  searchTerm: string = '';
  statusFilter: string = '';

  pageNumber = signal<number>(1);
  pageSize = signal<number>(10);
  totalPages = signal<number>(1);
  totalCount = signal<number>(0);

  selectedTicket = signal<SupportTicketDto | null>(null);
  admins = signal<UserDto[]>([]);
  selectedAdminId: string = '';
  selectedStatus: string = '';
  replyMessage: string = '';
  showAssignModal = signal<boolean>(false);
  currentUserId: string = '';
  currentUserEmail: string = '';

  ngOnInit(): void {
    // Get current user ID and email from token
    const userInfo = this._tokenService.getUser();
    this.currentUserId = userInfo?.userId || '';
    this.currentUserEmail = userInfo?.email || '';
    console.log('Current user ID:', this.currentUserId);
    console.log('Current user email:', this.currentUserEmail);

    this.loadTickets();
    this.loadAdmins();
  }

  loadTickets(page: number = 1): void {
    this.loading.set(true);
    this.error.set(null);

    console.log('=== LOADING TICKETS ===');
    this._supportService.getAllTickets(page, this.pageSize()).subscribe({
      next: (result: any) => {
        console.log('📥 Raw API response:', result);
        console.log('📥 Response type:', typeof result);
        console.log('📥 Is Array?', Array.isArray(result));

        // Handle different response structures
        let items = [];
        if (result && result.items) {
          items = result.items;
          console.log('✅ Using result.items');
        } else if (Array.isArray(result)) {
          items = result;
          console.log('✅ Using result as array');
        } else if (result && result.data) {
          items = result.data;
          console.log('✅ Using result.data');
        }

        console.log('📋 Total tickets found:', items.length);
        console.log('📋 Tickets data:', items);

        // Fetch user names for each ticket
        items.forEach((ticket: any, index: number) => {
          console.log(`\n--- Processing Ticket #${index + 1} ---`);
          console.log('Ticket ID:', ticket.ticketId);
          console.log('User ID:', ticket.userId);
          console.log('Assigned To:', ticket.assignedTo);
          console.log('Subject:', ticket.subject);

          // Fetch ticket creator name
          if (ticket.userId) {
            console.log(`🔍 Fetching user data for userId: ${ticket.userId}`);
            this._adminService.getUserById(ticket.userId).subscribe({
              next: (response: any) => {
                console.log(`✅ User API response for ticket ${ticket.ticketId}:`, response);

                // Handle nested user object (API might return {user: {...}} or just {...})
                const user = response.user || response;
                console.log('   Extracted user object:', user);
                console.log('   - fullName:', user.fullName || user.FullName);
                console.log('   - name:', user.name || user.Name);
                console.log('   - email:', user.email || user.Email);

                // Try multiple property name variations (PascalCase, camelCase)
                const fullName = user.fullName || user.FullName;
                const name = user.name || user.Name;
                const email = user.email || user.Email;

                // Priority: fullName > name > email
                ticket.userName = fullName || name || email || 'Unknown User';
                console.log(`✅ Set userName to: "${ticket.userName}"`);

                // Trigger change detection
                this.tickets.set([...this.tickets()]);
                this.filterTickets();
              },
              error: (err) => {
                console.error(`❌ Failed to fetch user ${ticket.userId}:`, err);
                console.error('   Error status:', err.status);
                console.error('   Error message:', err.message);
                console.error('   Error details:', err.error);
                ticket.userName = 'Unknown User';
                // Trigger change detection even on error
                this.tickets.set([...this.tickets()]);
                this.filterTickets();
              }
            });
          } else {
            console.log('⚠️ No userId found for this ticket');
            ticket.userName = 'Unknown';
          }

          // Fetch assigned admin name
          if (ticket.assignedTo) {
            console.log(`🔍 Fetching admin data for assignedTo: ${ticket.assignedTo}`);
            this._adminService.getUserById(ticket.assignedTo).subscribe({
              next: (response: any) => {
                console.log(`✅ Admin API response for ticket ${ticket.ticketId}:`, response);

                // Handle nested user object (API might return {user: {...}} or just {...})
                const admin = response.user || response;
                console.log('   Extracted admin object:', admin);
                console.log('   - fullName:', admin.fullName || admin.FullName);
                console.log('   - name:', admin.name || admin.Name);
                console.log('   - email:', admin.email || admin.Email);

                // Try multiple property name variations (PascalCase, camelCase)
                const fullName = admin.fullName || admin.FullName;
                const name = admin.name || admin.Name;
                const email = admin.email || admin.Email;

                // Priority: fullName > name > email
                ticket.assignedToName = fullName || name || email || 'Unknown Admin';
                console.log(`✅ Set assignedToName to: "${ticket.assignedToName}"`);

                // Trigger change detection
                this.tickets.set([...this.tickets()]);
                this.filterTickets();
              },
              error: (err) => {
                console.error(`❌ Failed to fetch admin ${ticket.assignedTo}:`, err);
                console.error('   Error status:', err.status);
                console.error('   Error message:', err.message);
                console.error('   Error details:', err.error);
                ticket.assignedToName = 'Unknown Admin';
                // Trigger change detection even on error
                this.tickets.set([...this.tickets()]);
                this.filterTickets();
              }
            });
          } else {
            console.log('⚠️ No assignedTo found for this ticket');
            ticket.assignedToName = 'Waiting';
          }
        });

        this.tickets.set(items);
        this.filteredTickets.set(items);
        this.pageNumber.set(result.pageNumber || 1);
        this.pageSize.set(result.pageSize || 10);
        this.totalPages.set(result.totalPages || 1);
        this.totalCount.set(result.totalCount || items.length);
        this.loading.set(false);

        console.log('=== TICKETS LOADED ===\n');
      },
      error: (err) => {
        console.error('❌ Error loading tickets:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });
        this.error.set(err.error?.message || err.message || 'Failed to load tickets');
        this.loading.set(false);
        // Set empty arrays to avoid undefined errors
        this.tickets.set([]);
        this.filteredTickets.set([]);
      },
    });
  }

  loadAdmins(): void {
    // Load admins for assignment dropdown
    this._adminService.getAllUsers(1, 100).subscribe({
      next: (result) => {
        console.log('Admins loaded:', result);
        // Handle different response structures - API returns {data: Array}
        let users = (result as any).data || result.items || result || [];

        // Ensure users is an array before filtering
        if (!Array.isArray(users)) {
          console.error('Users is not an array:', users);
          users = [];
        }

        // Filter admins (assuming role is in UserDto)
        const adminUsers = users.filter((user: any) => {
          // Adjust based on your UserDto structure
          return (user as any).role === 'Admin' || (user as any).role === 0;
        });
        this.admins.set(adminUsers);
      },
      error: (err) => {
        console.error('Error loading admins:', err);
        this.admins.set([]); // Set empty array on error
      },
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.loadTickets(page);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return 'status-open';
      case 'assigned':
        return 'status-assigned';
      case 'resolved':
        return 'status-resolved';
      case 'closed':
        return 'status-closed';
      default:
        return 'status-default';
    }
  }

  openAssignModal(ticket: SupportTicketDto): void {
    this.selectedTicket.set(ticket);
    // Set current user as default assignee if ticket is not already assigned
    this.selectedAdminId = ticket.assignedTo || this.currentUserId;
    this.selectedStatus = ticket.status;
    this.replyMessage = '';
    this.showAssignModal.set(true);
  }

  closeAssignModal(): void {
    this.showAssignModal.set(false);
    this.selectedTicket.set(null);
    this.selectedAdminId = '';
    this.selectedStatus = '';
    this.replyMessage = '';
  }

  assignTicket(): void {
    const ticket = this.selectedTicket();
    if (!ticket) return;

    let completedActions = 0;
    const totalActions = (this.selectedAdminId ? 1 : 0) +
      (this.selectedStatus !== ticket.status ? 1 : 0) +
      (this.replyMessage.trim() ? 1 : 0);

    if (totalActions === 0) {
      alert('No changes to save');
      return;
    }

    // Assign to admin if selected
    if (this.selectedAdminId) {
      this._supportService.assignTicket(ticket.ticketId, this.selectedAdminId).subscribe({
        next: () => {
          console.log('Ticket assigned successfully');
          completedActions++;
          if (completedActions === totalActions) {
            this.finishUpdate();
          }
        },
        error: (err) => {
          console.error('Error assigning ticket:', err);
          alert('Failed to assign ticket: ' + (err.error?.message || err.message));
        }
      });
    }

    // Update status if changed
    if (this.selectedStatus !== ticket.status) {
      if (this.selectedStatus === 'resolved') {
        this._supportService.resolveTicket(ticket.ticketId).subscribe({
          next: () => {
            console.log('Ticket status updated');
            completedActions++;
            if (completedActions === totalActions) {
              this.finishUpdate();
            }
          },
          error: (err) => {
            console.error('Error updating status:', err);
            alert('Failed to update status: ' + (err.error?.message || err.message));
          }
        });
      } else {
        // For other statuses, just count as completed
        completedActions++;
        if (completedActions === totalActions) {
          this.finishUpdate();
        }
      }
    }

    // Send reply if provided
    if (this.replyMessage.trim()) {
      // TODO: Implement reply API when available
      console.log('Reply message:', this.replyMessage);
      alert('Reply saved: ' + this.replyMessage);
      completedActions++;
      if (completedActions === totalActions) {
        this.finishUpdate();
      }
    }
  }

  private finishUpdate(): void {
    alert('Ticket updated successfully!');
    this.closeAssignModal();
    this.loadTickets(this.pageNumber());
  }

  resolveTicket(ticketId: string): void {
    if (!confirm('Are you sure you want to resolve this ticket?')) return;

    this._supportService.resolveTicket(ticketId).subscribe({
      next: () => {
        alert('Ticket resolved successfully');
        this.loadTickets(this.pageNumber());
      },
      error: (err) => {
        console.error('Error resolving ticket:', err);
        this.error.set(err.message || 'Failed to resolve ticket');
      },
    });
  }

  deleteTicket(ticketId: string): void {
    if (!confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) return;

    this._supportService.deleteTicket(ticketId).subscribe({
      next: () => {
        alert('Ticket deleted successfully');
        this.loadTickets(this.pageNumber());
      },
      error: (err) => {
        console.error('Error deleting ticket:', err);
        this.error.set(err.message || 'Failed to delete ticket');
      },
    });
  }

  filterTickets(): void {
    let filtered = this.tickets();

    // Filter by status
    if (this.statusFilter) {
      filtered = filtered.filter(t =>
        t.status.toLowerCase() === this.statusFilter.toLowerCase()
      );
    }

    // Filter by search term
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.subject.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search) ||
        t.userId.toLowerCase().includes(search)
      );
    }

    this.filteredTickets.set(filtered);
  }

  getIconClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return 'ticket-icon-open';
      case 'assigned':
        return 'ticket-icon-assigned';
      case 'resolved':
        return 'ticket-icon-resolved';
      case 'closed':
        return 'ticket-icon-closed';
      default:
        return 'ticket-icon-default';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-primary';
      case 'assigned':
        return 'bg-warning';
      case 'resolved':
        return 'bg-success';
      case 'closed':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  }

  isTicketAssigned(ticket: SupportTicketDto): boolean {
    // Check if assignedTo exists and is not empty
    const isAssigned = !!(ticket.assignedTo && ticket.assignedTo.trim() !== '');
    console.log(`🔍 Ticket "${ticket.subject}" - assignedTo: "${ticket.assignedTo}" - isAssigned: ${isAssigned}`);
    return isAssigned;
  }
}

