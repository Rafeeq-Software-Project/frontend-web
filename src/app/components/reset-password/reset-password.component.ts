import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('newPassword');
  const confirm = control.get('confirmPassword');
  if (!password || !confirm) return null;
  return password.value === confirm.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  userEmail = '';
  resetCode = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showNewPassword = false;
  showConfirmPassword = false;
  resetComplete = false;

  resetForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatchValidator });

  ngOnInit() {
    const email = sessionStorage.getItem('resetEmail');
    const code = sessionStorage.getItem('resetCode');
    if (!email || !code) {
      this.router.navigate(['/forgot-password']);
      return;
    }
    this.userEmail = email;
    this.resetCode = code;
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      email: this.userEmail,
      code: this.resetCode,
      newPassword: this.resetForm.value.newPassword
    };

    this.authService.resetPassword(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.resetComplete = true;
        // Clear session data
        sessionStorage.removeItem('resetEmail');
        sessionStorage.removeItem('resetCode');
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err?.error?.message || 'Failed to reset password. Please start over.';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  getPasswordStrength(): { level: number; label: string; color: string } {
    const val = this.resetForm.get('newPassword')?.value || '';
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    if (score <= 1) return { level: 1, label: 'Weak', color: '#ef4444' };
    if (score === 2) return { level: 2, label: 'Fair', color: '#f59e0b' };
    if (score === 3) return { level: 3, label: 'Good', color: '#3b82f6' };
    return { level: 4, label: 'Strong', color: '#22c55e' };
  }

  hasUpperCase(value: string | null | undefined): boolean {
    return /[A-Z]/.test(value ?? '');
  }

  hasNumber(value: string | null | undefined): boolean {
    return /[0-9]/.test(value ?? '');
  }

  hasSpecialChar(value: string | null | undefined): boolean {
    return /[^A-Za-z0-9]/.test(value ?? '');
  }
}
