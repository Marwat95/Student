import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../../../core/services/GroupService/group-service';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { CreateGroupDto, UpdateGroupDto, GroupDto } from '../../../core/interfaces/group.interface';

@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-form.html',
  styleUrl: './group-form.scss',
})
export class GroupForm implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _groupService = inject(GroupService);
  private readonly _tokenService = inject(TokenService);

  groupId = signal<string | null>(null);
  isEditMode = signal<boolean>(false);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  error = signal<string | null>(null);

  // Form data
  groupData: CreateGroupDto | UpdateGroupDto = {
    name: '',
    description: ''
  };

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.groupId.set(id);
      this.isEditMode.set(true);
      this.loadGroup(id);
    } else {
      // Set instructor ID from current user
      const user = this._tokenService.getUser();
      if (user && user.userId) {
        (this.groupData as CreateGroupDto).instructorId = user.userId;
      }
    }
  }

  loadGroup(id: string): void {
    this.loading.set(true);
    this._groupService.getGroupById(id).subscribe({
      next: (group) => {
        this.groupData = {
          name: group.name,
          description: group.description
        };
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading group:', err);
        this.error.set(err.message || 'Failed to load group');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    if (this.isEditMode() && this.groupId()) {
      // Update group
      this._groupService.updateGroup(this.groupId()!, this.groupData as UpdateGroupDto).subscribe({
        next: (group) => {
          this.submitting.set(false);
          const isAdminRoute = this._router.url.includes('/admin');
          const basePath = isAdminRoute ? '/admin/groups' : '/instructor/groups';
          this._router.navigate([`${basePath}/${group.groupId}`]);
        },
        error: (err) => {
          console.error('Error updating group:', err);
          this.error.set(err.message || 'Failed to update group');
          this.submitting.set(false);
        }
      });
    } else {
      // Create group
      this._groupService.createGroup(this.groupData as CreateGroupDto).subscribe({
        next: (group) => {
          this.submitting.set(false);
          const isAdminRoute = this._router.url.includes('/admin');
          const basePath = isAdminRoute ? '/admin/groups' : '/instructor/groups';
          this._router.navigate([`${basePath}/${group.groupId}`]);
        },
        error: (err) => {
          console.error('Error creating group:', err);
          this.error.set(err.message || 'Failed to create group');
          this.submitting.set(false);
        }
      });
    }
  }

  private validateForm(): boolean {
    if (!this.groupData.name.trim()) {
      this.error.set('Group name is required');
      return false;
    }
    if (!this.groupData.description.trim()) {
      this.error.set('Group description is required');
      return false;
    }
    return true;
  }

  cancel(): void {
    const isAdminRoute = this._router.url.includes('/admin');
    const basePath = isAdminRoute ? '/admin/groups' : '/instructor/groups';
    this._router.navigate([basePath]);
  }
}
