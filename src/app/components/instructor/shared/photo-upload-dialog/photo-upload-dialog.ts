import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/UserService/user-service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-photo-upload-dialog',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
    templateUrl: './photo-upload-dialog.html',
    styleUrl: './photo-upload-dialog.scss'
})
export class PhotoUploadDialogComponent {
    @Input() isOpen = false;
    @Input() userId: string | null = null;
    @Input() currentPhotoUrl: string | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() photoUpdated = new EventEmitter<string>(); // Returns new URL

    private userService = inject(UserService);

    selectedFile: File | null = null;
    previewUrl: string | null = null;
    uploading = signal<boolean>(false);
    error = signal<string | null>(null);

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            this.error.set(null);

            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                this.previewUrl = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    savePhoto(): void {
        if (!this.selectedFile || !this.userId) return;

        this.uploading.set(true);
        this.error.set(null);

        this.userService.uploadUserPhoto(this.userId, this.selectedFile).subscribe({
            next: (res: any) => {
                let newUrl = this.previewUrl; // Fallback to preview (local data URI) if backend doesn't return URL
                if (res && res.photoUrl) newUrl = res.photoUrl;
                else if (res && res.url) newUrl = res.url;

                this.photoUpdated.emit(newUrl as string);
                this.uploading.set(false);
                this.onClose();
            },
            error: (err: any) => {
                console.error('Upload failed', err);
                this.error.set('Failed to upload photo. Please try again.');
                this.uploading.set(false);
            }
        });

    }

    onClose(): void {
        this.selectedFile = null;
        this.previewUrl = null;
        this.error.set(null);
        this.close.emit();
    }
}
