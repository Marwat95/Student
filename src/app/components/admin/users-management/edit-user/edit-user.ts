import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { AdminService } from '../../../../core/services/AdminService/admin-service';
import { FileService } from '../../../../core/services/FileService/file-service';
import { UserRole } from '../../../../core/interfaces/auth.interface';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-user.html',
  styleUrls: ['./edit-user.scss']
})
export class EditUser implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);

  userId: string | null = null;
  user: any = null;
  loading = true;
  isSaving = false;
  isChangingPassword = false;

  // Forms
  activeForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    role: [0, [Validators.required]]
  });

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]], // Admin's password to authorize
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  get nameControl() { return this.activeForm.get('name'); }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.loadUser(this.userId);
    } else {
      this.router.navigate(['/admin/users']);
    }
  }

  loadUser(id: string) {
    this.adminService.getUserById(id).subscribe({
      next: (res: any) => {
        this.user = res;
        // Patch form values
        this.activeForm.patchValue({
          name: res.name || res.fullName,
          email: res.email,
          role: res.role
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load user', err);
        alert('User not found');
        this.router.navigate(['/admin/users']);
      }
    });
  }

  saveProfile() {
    if (this.activeForm.invalid || !this.userId) return;

    this.isSaving = true;
    const updateData = {
      name: this.activeForm.get('name')?.value,
      role: Number(this.activeForm.get('role')?.value)
    };

    this.adminService.updateUser(this.userId, updateData).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.user = { ...this.user, ...updateData };
        alert('Profile updated successfully!');
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Update failed', err);
        alert('Failed to update profile: ' + (err.error?.message || err.message));
      }
    });
  }

  changePassword() {
    if (this.passwordForm.invalid || !this.userId) return;

    this.isChangingPassword = true;
    const passwordData = {
      currentPassword: this.passwordForm.get('currentPassword')?.value,
      newPassword: this.passwordForm.get('newPassword')?.value
    };

    this.adminService.changeUserPassword(this.userId, passwordData).subscribe({
      next: () => {
        this.isChangingPassword = false;
        this.passwordForm.reset();
        alert('Password changed successfully!');
      },
      error: (err) => {
        this.isChangingPassword = false;
        console.error('Password change failed', err);
        alert('Failed to change password: ' + (err.error?.message || err.message));
      }
    });
  }

  passwordMatchValidator(g: AbstractControl) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  goBack() {
    this.router.navigate(['/admin/users']);
  }
}
