import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop fade show" *ngIf="isOpen"></div>
    <div class="modal fade show d-block" tabindex="-1" *ngIf="isOpen" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content shadow-lg border-0">
          <div class="modal-header border-bottom-0">
            <h5 class="modal-title fw-bold text-danger"><i class="bi bi-exclamation-circle-fill me-2"></i>{{ title }}</h5>
            <button type="button" class="btn-close" (click)="onCancel()"></button>
          </div>
          <div class="modal-body py-4">
            <p class="mb-0 fs-5 text-secondary">{{ message }}</p>
          </div>
          <div class="modal-footer border-top-0 bg-light rounded-bottom">
            <button type="button" class="btn btn-outline-secondary px-4 fw-semibold" (click)="onCancel()">Cancel</button>
            <button type="button" class="btn btn-danger px-4 fw-semibold" (click)="onConfirm()">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop { opacity: 0.5; background-color: #000; }
    .modal { background: rgba(0,0,0,0.1); }
  `]
})
export class ConfirmModalComponent {
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() isOpen: boolean = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
