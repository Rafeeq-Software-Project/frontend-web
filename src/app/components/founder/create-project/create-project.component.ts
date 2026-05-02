import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectService, ProjectRequest } from '../../../services/project.service';
import { AuthService } from '../../../services/auth.service';
import { animate, style, transition, trigger, query, group } from '@angular/animations';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
  providers: [DatePipe],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, scale: 0.9 }),
        animate('300ms ease-out', style({ opacity: 1, scale: 1 }))
      ])
    ]),
    trigger('stepAnimation', [
      transition(':increment', [
        group([
          query(':enter', [
            style({ opacity: 0, transform: 'translateX(50px)' }),
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ], { optional: true }),
          query(':leave', [
            animate('400ms ease-in', style({ opacity: 0, transform: 'translateX(-50px)' }))
          ], { optional: true })
        ])
      ]),
      transition(':decrement', [
        group([
          query(':enter', [
            style({ opacity: 0, transform: 'translateX(-50px)' }),
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ], { optional: true }),
          query(':leave', [
            animate('400ms ease-in', style({ opacity: 0, transform: 'translateX(50px)' }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class CreateProjectComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private datePipe = inject(DatePipe);

  projectForm!: FormGroup;
  isLoading = false;
  isInitialLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentStep = 1;
  totalSteps = 3;

  isEditMode = false;
  projectId: number | null = null;

  categories = [
    'Technology', 'Energy', 'Education', 'Healthcare',
    'Social Impact', 'Environment', 'Fintech', 'Agrotech'
  ];

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.initForm();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.projectId = parseInt(idParam, 10);
      this.loadProjectDetails();
    }
  }

  private initForm(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      category: ['', [Validators.required]],
      fundingGoal: [null, [Validators.required, Validators.min(1)]],
      useOfFunds: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    }, { validators: this.dateRangeValidator });
  }

  private loadProjectDetails(): void {
    if (!this.projectId) return;
    this.isInitialLoading = true;
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (project) => {
        this.isInitialLoading = false;
        this.projectForm.patchValue({
          name: project.name,
          description: project.description,
          category: project.category,
          fundingGoal: project.fundingGoal,
          useOfFunds: project.useOfFunds,
          startDate: this.datePipe.transform(project.startDate, 'yyyy-MM-dd'),
          endDate: this.datePipe.transform(project.endDate, 'yyyy-MM-dd')
        });
      },
      error: (err) => {
        this.isInitialLoading = false;
        this.errorMessage = 'Failed to load project details.';
        console.error(err);
      }
    });
  }

  private dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const start = control.get('startDate')?.value;
    const end = control.get('endDate')?.value;

    if (start && end && new Date(end) <= new Date(start)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps && this.isStepValid(this.currentStep)) {
      this.currentStep++;
    } else {
      this.markStepAsTouched(this.currentStep);
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!(this.projectForm.get('name')!.valid &&
          this.projectForm.get('category')!.valid &&
          this.projectForm.get('description')!.valid);
      case 2:
        return !!(this.projectForm.get('fundingGoal')!.valid &&
          this.projectForm.get('useOfFunds')!.valid);
      case 3:
        return !!(this.projectForm.get('startDate')!.valid &&
          this.projectForm.get('endDate')!.valid &&
          !this.projectForm.errors?.['dateRangeInvalid']);
      default:
        return false;
    }
  }

  private markStepAsTouched(step: number): void {
    switch (step) {
      case 1:
        this.projectForm.get('name')?.markAsTouched();
        this.projectForm.get('category')?.markAsTouched();
        this.projectForm.get('description')?.markAsTouched();
        break;
      case 2:
        this.projectForm.get('fundingGoal')?.markAsTouched();
        this.projectForm.get('useOfFunds')?.markAsTouched();
        break;
      case 3:
        this.projectForm.get('startDate')?.markAsTouched();
        this.projectForm.get('endDate')?.markAsTouched();
        break;
    }
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formValue = this.projectForm.value;

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toISOString().split('.')[0] + 'Z';
    };

    const request: ProjectRequest = {
      ...formValue,
      startDate: formatDate(formValue.startDate),
      endDate: formatDate(formValue.endDate)
    };

    const operation = this.isEditMode && this.projectId
      ? this.projectService.updateProject(this.projectId, request)
      : this.projectService.createProject(request);

    operation.subscribe({
      next: (response) => {
        this.isLoading = false;
        if (this.isEditMode) {
          this.successMessage = 'Project sent for review! Redirecting to drafts...';
          setTimeout(() => {
            this.router.navigate(['/founder/drafts']);
          }, 2000);
        } else {
          this.successMessage = 'Project created successfully! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/founder/projects']);
          }, 2000);
        }
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 401) {
          this.errorMessage = 'Session expired. Please login again.';
          setTimeout(() => this.authService.logout(), 2000);
        } else {
          this.errorMessage = error.error?.message || `Failed to ${this.isEditMode ? 'update' : 'create'} project. Please try again.`;
        }
        console.error(`Error ${this.isEditMode ? 'updating' : 'creating'} project:`, error);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.projectForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}

