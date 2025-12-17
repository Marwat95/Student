import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-edit-course',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container p-4">
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-0 py-3">
           <h4 class="fw-bold m-0"><i class="bi bi-journal-check me-2 text-success"></i>Edit Course</h4>
        </div>
        <div class="card-body p-4">
           <p class="text-muted">Editing Course ID: <strong>{{ courseId }}</strong></p>
           
           <div class="mb-3">
             <label class="form-label">Course Title</label>
             <input type="text" class="form-control" value="Introduction to Angular">
           </div>
           
           <div class="d-flex justify-content-end gap-2 mt-4">
             <button class="btn btn-light" (click)="goBack()">Cancel</button>
             <button class="btn btn-success" (click)="save()">Save Changes</button>
           </div>
        </div>
      </div>
    </div>
  `
})
export class EditCourse implements OnInit {
    courseId: string | null = '';

    constructor(private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.courseId = this.route.snapshot.paramMap.get('id');
    }

    save() {
        alert('Course updated successfully!');
        this.goBack();
    }

    goBack() {
        this.router.navigate(['/admin/courses']);
    }
}
