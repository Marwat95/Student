import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  // Footer sections
  secondaryStages = [
    { label: 'الأول الثانوي', url: '#' },
    { label: 'الثاني الثانوي', url: '#' },
    { label: 'الثالث الثانوي', url: '#' }
  ];

  designDev = [
    { label: 'اصطيليا A+', url: '#' }
  ];

  // Social links
  socialLinks = [
    { icon: '☎️', label: 'Phone', url: 'tel:+201556751595' },
    { icon: '💬', label: 'WhatsApp', url: 'https://wa.me/201556751595' },
    { icon: '👍', label: 'Facebook', url: 'https://facebook.com' }
  ];

  socialLinksRight = [
    { icon: '☎️', label: 'Phone', url: 'tel:+201556751595' },
    { icon: '💬', label: 'WhatsApp', url: 'https://wa.me/201556751595' },
    { icon: '▶️', label: 'YouTube', url: 'https://youtube.com' },
    { icon: '👍', label: 'Facebook', url: 'https://facebook.com' }
  ];

  phone = '01556751595';
  currentYear = new Date().getFullYear();
}
