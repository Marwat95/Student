import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../../core/services/AdminService/admin-service';

@Component({
    selector: 'app-edit-course-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './edit-course-modal.html',
    styleUrls: ['./edit-course-modal.scss']
})
export class EditCourseModalComponent implements OnChanges {
    @Input() isOpen = false;
    @Input() courseId: string | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() courseUpdated = new EventEmitter<any>();

    private fb = inject(FormBuilder);
    private adminService = inject(AdminService);

    course: any = null;
    loading = signal<boolean>(false);
    saving = signal<boolean>(false);
    selectedFile: File | null = null;
    imagePreview: string | null = null;

    courseForm: FormGroup = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(3)]],
        description: ['', [Validators.required]],
        price: [0, [Validators.required, Validators.min(0)]],
        category: [''],
        instructorName: [{ value: '', disabled: true }]
    });

    get titleControl() { return this.courseForm.get('title'); }
    get descriptionControl() { return this.courseForm.get('description'); }
    get priceControl() { return this.courseForm.get('price'); }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['isOpen'] && this.isOpen && this.courseId) {
            this.loadCourse(this.courseId);
        }
    }

    onClose() {
        this.close.emit();
        this.selectedFile = null;
        this.imagePreview = null;
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    loadCourse(id: string) {
        this.loading.set(true);

        // Use AdminService to get course by ID
        this.adminService.getCourseById(id).subscribe({
            next: (course: any) => {
                this.course = course;
                this.imagePreview = course.thumbnailUrl || null;

                this.courseForm.patchValue({
                    title: course.title || '',
                    description: course.description || '',
                    price: course.price || 0,
                    category: course.category || '',
                    instructorName: course.instructorName || 'Unknown'
                });

                this.loading.set(false);
            },
            error: (err) => {
                console.error('Failed to load course', err);
                alert('Failed to load course details');
                this.loading.set(false);
                this.onClose();
            }
        });
    }

    saveChanges() {
        if (this.courseForm.invalid) {
            alert('Please fill all required fields correctly');
            return;
        }

        // Get the actual course ID from the loaded course object
        const actualCourseId = this.course?.courseId || this.course?.id || this.course?._id || this.courseId;

        if (!actualCourseId) {
            alert('Course ID is missing');
            return;
        }

        this.saving.set(true);

        // If there's a selected file, convert to base64
        if (this.selectedFile) {
            console.log('Converting course image to base64...');
            const reader = new FileReader();
            reader.onload = () => {
                const base64Image = reader.result as string;
                this.updateCourseData(actualCourseId, base64Image);
            };
            reader.onerror = () => {
                alert('Failed to read image file');
                this.saving.set(false);
            };
            reader.readAsDataURL(this.selectedFile);
        } else {
            // No new image, call update without image
            this.updateCourseData(actualCourseId);
        }
    }

    private updateCourseData(courseId: string, thumbnailBase64?: string) {
        const updateData: any = {
            title: this.courseForm.get('title')?.value,
            description: this.courseForm.get('description')?.value,
            price: Number(this.courseForm.get('price')?.value),
            category: this.courseForm.get('category')?.value || ''
        };

        // Add base64 image if provided
        if (thumbnailBase64) {
            updateData.thumbnailUrl = thumbnailBase64;
        }

        console.log('Sending Course Update...', { hasImage: !!thumbnailBase64 });

        this.adminService.updateCourse(courseId, updateData).subscribe({
            next: (updatedCourse) => {
                console.log('✅ Course updated successfully');
                this.saving.set(false);
                alert('Course updated successfully!');
                this.courseUpdated.emit(updatedCourse);
                this.onClose();
            },
            error: (err) => {
                console.error('❌ Course Update Failed:', err);
                this.saving.set(false);
                alert('Failed to update course: ' + (err.error?.message || err.message || 'Unknown error'));
            }
        });
    }
}
