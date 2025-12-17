import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-edit-instructor',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container p-4">
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-0 py-3">
           <h4 class="fw-bold m-0"><i class="bi bi-person-workspace me-2 text-purple" style="color: #6f42c1;"></i>Edit Instructor</h4>
        </div>
        <div class="card-body p-4">
           <p class="text-muted">Editing Instructor ID: <strong>{{ instructorId }}</strong></p>
           
           <div class="mb-3">
             <label class="form-label">Instructor Name</label>
             <input type="text" class="form-control" value="Alex Smith">
           </div>
           
           <div class="d-flex justify-content-end gap-2 mt-4">
             <button class="btn btn-light" (click)="goBack()">Cancel</button>
             <button class="btn btn-primary" style="background-color: #6f42c1; border-color: #6f42c1;" (click)="save()">Save Changes</button>
           </div>
        </div>
      </div>
    </div>
  `
})
export class EditInstructor implements OnInit {
    instructorId: string | null = '';

    constructor(private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.instructorId = this.route.snapshot.paramMap.get('id');
    }

    save() {
        alert('Instructor updated successfully!');
        this.goBack();
    }

    goBack() {
        this.router.navigate(['/admin/instructors']);
    }
}
