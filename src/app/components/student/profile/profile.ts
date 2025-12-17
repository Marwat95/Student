import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/UserService/user-service';
import { AuthService } from '../../../core/services/auth/auth-service';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { ChangePasswordDto } from '../../../core/interfaces/auth.interface';
import { UserProfileResponse } from '../../../core/interfaces/i-user';
import { BackButton } from '../../shared/back-button/back-button';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButton],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class StudentProfile implements OnInit {
  private readonly _userService = inject(UserService);
  private readonly _authService = inject(AuthService);
  private readonly _tokenService = inject(TokenService);

  profile = signal<UserProfileResponse | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  saving = signal<boolean>(false);

  // Editable fields
  editModel = {
    fullName: '',
    email: '',
    phoneNumber: ''
  };

  // Simple change password form
  changePasswordModel: ChangePasswordDto = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  changingPassword = signal<boolean>(false);

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const user = this._tokenService.getUser();
    if (!user || !user.userId) {
      this.error.set('User not found. Please login again.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this._userService.getUserById(user.userId).subscribe({
      next: (data) => {
        this.profile.set(data);
        // Initialize edit model
        this.editModel = {
          fullName: data.user.fullName,
          email: data.user.email,
          phoneNumber: data.phones && data.phones.length > 0 ? data.phones[0].phoneNumber : ''
        };
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.error.set(err.message || 'Failed to load profile');
        this.loading.set(false);
      },
    });
  }

  saveProfile(): void {
    const current = this.profile();
    if (!current) return;

    this.saving.set(true);
    this.error.set(null);

    const updateData = {
      fullName: this.editModel.fullName,
      email: this.editModel.email,
      // phoneNumber: this.editModel.phoneNumber // Add if backend supports it
    };

    // Note: Backend might not support phone update via this endpoint yet, 
    // but the UI requires the field.
    
    this._userService.updateUser(current.user.userId, updateData).subscribe({
      next: () => {
        this.saving.set(false);
        alert('Profile updated successfully'); // Simple feedback
      },
      error: (err) => {
        console.error('Error saving profile:', err);
        this.error.set(err.message || 'Failed to save profile');
        this.saving.set(false);
      },
    });
  }

  submitChangePassword(): void {
    this.changingPassword.set(true);
    this.error.set(null);

    this._authService.changePassword(this.changePasswordModel).subscribe({
      next: () => {
        this.changingPassword.set(false);
        this.changePasswordModel = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        };
      },
      error: (err) => {
        console.error('Error changing password:', err);
        this.error.set(err.message || 'Failed to change password');
        this.changingPassword.set(false);
      },
    });
  }
}