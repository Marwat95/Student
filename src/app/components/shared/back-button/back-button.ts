import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { UserRole } from '../../../core/interfaces/auth.interface';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      type="button" 
      class="back-button" 
      (click)="goBack()"
      [attr.aria-label]="ariaLabel || 'Go back to dashboard'">
      <span class="back-icon" aria-hidden="true">←</span>
      <span class="back-text">{{ text || 'Back to Dashboard' }}</span>
    </button>
  `,
  styleUrl: './back-button.scss'
})
export class BackButton {
  @Input() text?: string;
  @Input() ariaLabel?: string;

  constructor(
    private location: Location,
    private router: Router,
    private tokenService: TokenService
  ) {}

  goBack(): void {
    // Get user role from token service
    const user = this.tokenService.getUser();
    
    // Navigate to appropriate dashboard based on user role
    if (user && user.role !== undefined) {
      switch (user.role) {
        case UserRole.Admin:
          this.router.navigate(['/admin']);
          return;
        case UserRole.Instructor:
          this.router.navigate(['/instructor']);
          return;
        case UserRole.Student:
          this.router.navigate(['/student']);
          return;
        default:
          // Fallback to previous behavior for unknown roles
          this.location.back();
          return;
      }
    }
    
    // Fallback to previous behavior if no user or role
    this.location.back();
  }
}