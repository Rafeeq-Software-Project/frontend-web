import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-verify-code',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './verify-code.component.html',
    styleUrl: './verify-code.component.css'
})
export class VerifyCodeComponent implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    userEmail = '';
    isLoading = false;
    isResending = false;
    errorMessage = '';
    successMessage = '';
    resendCooldown = 0;
    private cooldownTimer: any;

    codeForm = this.fb.group({
        code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]]
    });

    ngOnInit() {
        const email = sessionStorage.getItem('resetEmail');
        if (!email) {
            // No email in session, redirect back
            this.router.navigate(['/forgot-password']);
            return;
        }
        this.userEmail = email;
    }

    onSubmit() {
        if (this.codeForm.invalid) {
            this.codeForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        const code = this.codeForm.value.code!;

        this.authService.verifyCode(this.userEmail, code).subscribe({
            next: () => {
                this.isLoading = false;
                // Store token/email for reset password page
                sessionStorage.setItem('resetCode', code);
                this.router.navigate(['/reset-password']);
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage =
                    err?.error?.message ||
                    'Invalid or expired verification code. Please try again.';
            }
        });
    }

    onResend() {
        if (this.resendCooldown > 0 || this.isResending) return;

        this.isResending = true;
        this.errorMessage = '';
        this.successMessage = '';

        this.authService.forgotPassword(this.userEmail).subscribe({
            next: () => {
                this.isResending = false;
                this.successMessage = 'A new code has been sent to your email.';
                this.startCooldown(60);
            },
            error: (err) => {
                this.isResending = false;
                this.errorMessage =
                    err?.error?.message || 'Failed to resend code. Please try again.';
            }
        });
    }

    private startCooldown(seconds: number) {
        this.resendCooldown = seconds;
        this.cooldownTimer = setInterval(() => {
            this.resendCooldown--;
            if (this.resendCooldown <= 0) {
                clearInterval(this.cooldownTimer);
            }
        }, 1000);
    }

    maskEmail(email: string): string {
        const [user, domain] = email.split('@');
        const masked = user.slice(0, 2) + '***' + user.slice(-1);
        return `${masked}@${domain}`;
    }

    goBack() {
        this.router.navigate(['/forgot-password']);
    }
}
