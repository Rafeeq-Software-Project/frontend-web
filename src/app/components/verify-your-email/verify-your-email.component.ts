import { Component, inject, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-your-email',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './verify-your-email.component.html',
  styleUrl: './verify-your-email.component.css'
})
export class VerifyYourEmailComponent {
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  
  userEmail: string = 'user@example.com';
  isResending = false;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        this.userEmail = JSON.parse(userData).email;
      }
    }
  }

  onResendEmail() {
    this.isResending = true;
    console.log('Resending verification email to:', this.userEmail);
    // Mocking API call
    setTimeout(() => {
      this.isResending = false;
      alert('Verification email has been resent!');
    }, 2000);
  }
}
