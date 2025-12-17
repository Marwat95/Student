import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-settings',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="settings-container p-4">
      <h2>System Settings</h2>
      <p class="text-muted">Manage platform configurations here.</p>
      
      <div class="card p-3 shadow-sm border-0 mt-4">
        <h5>General Settings</h5>
        <div class="form-check form-switch mt-3">
            <input class="form-check-input" type="checkbox" id="maintenanceMode">
            <label class="form-check-label" for="maintenanceMode">Maintenance Mode</label>
        </div>
        <div class="form-check form-switch mt-3">
            <input class="form-check-input" type="checkbox" id="emailNotifs" checked>
            <label class="form-check-label" for="emailNotifs">Email Notifications</label>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .settings-container { background: #f8f9fa; min-height: 100%; }
  `]
})
export class AdminSettingsComponent { }
