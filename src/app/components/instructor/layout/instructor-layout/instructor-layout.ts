import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../../../core/services/TokenService/token-service';
import { AuthService } from '../../../../core/services/auth/auth-service';

@Component({
    selector: 'app-instructor-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './instructor-layout.html',
    styleUrl: './instructor-layout.scss',
})
export class InstructorLayout implements OnInit {
    private readonly _router = inject(Router);
    private readonly _tokenService = inject(TokenService);
    private readonly _authService = inject(AuthService);

    // Sidebar state
    isCollapsed = signal<boolean>(true);

    // User info for sidebar
    instructorId = signal<string | null>(null);
    instructorName = signal<string | null>(null);

    ngOnInit(): void {
        this.checkScreenSize();
        this.loadUserInfo();
    }

    loadUserInfo(): void {
        const user = this._tokenService.getUser();
        if (user) {
            this.instructorId.set(user.userId);
            this.instructorName.set(user.fullName);
        }
    }

    toggleSidebar(): void {
        this.isCollapsed.update(value => !value);
    }

    checkScreenSize(): void {
        if (typeof window !== 'undefined') {
            // Collapse sidebar on mobile by default
            if (window.innerWidth <= 768) {
                this.isCollapsed.set(true);
            }
        }
    }

    // Navigation methods
    navigateToDashboard(): void {
        this._router.navigate(['/instructor']);
    }

    navigateToCourses(): void {
        this._router.navigate(['/instructor/courses']);
    }

    navigateToExams(): void {
        this._router.navigate(['/instructor/exams']);
    }

    navigateToEarnings(): void {
        this._router.navigate(['/instructor/earnings']);
    }

    navigateToGroups(): void {
        this._router.navigate(['/instructor/groups']);
    }

    navigateToSubscription(): void {
        this._router.navigate(['/instructor/subscription']);
    }

    navigateToProfile(event?: Event): void {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        const id = this.instructorId();
        if (id) {
            this._router.navigate(['/instructor/profile/view', id]);
        }
    }

    handleSignOut(): void {
        this._authService.logout().subscribe({
            next: () => {
                this._router.navigate(['/login']);
            },
            error: () => {
                this._tokenService.clearAll();
                this._router.navigate(['/login']);
            },
        });
    }
}
