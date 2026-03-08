import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    isLoading = false;
    errorMessage = '';

    emailForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
    });

    onSubmit() {
        if (this.emailForm.invalid) {
            this.emailForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        const email = this.emailForm.value.email!;

        this.authService.forgotPassword(email).subscribe({
            next: () => {
                this.isLoading = false;
                // Store email so verify-code page can display it
                sessionStorage.setItem('resetEmail', email);
                this.router.navigate(['/verify-code']);
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage =
                    err?.error?.message ||
                    'No account found with this email. Please try again.';
            }
        });
    }
}
