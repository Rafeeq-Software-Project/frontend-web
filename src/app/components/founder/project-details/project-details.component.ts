import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService, ProjectResponse } from '../../../services/project.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [DatePipe, DecimalPipe],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(15px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('400ms 100ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class ProjectDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private datePipe = inject(DatePipe);
  private decimalPipe = inject(DecimalPipe);

  project: ProjectResponse | null = null;
  isLoading = true;
  isDeleting = false;
  errorMessage: string | null = null;
  showDeleteModal = false;
  notFound = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProject(parseInt(id, 10));
    } else {
      this.notFound = true;
      this.isLoading = false;
    }
  }

  private loadProject(id: number): void {
    this.isLoading = true;
    this.projectService.getProjectById(id).subscribe({
      next: (project) => {
        this.project = project;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.notFound = true;
        } else if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Failed to load project details. Please try again.';
        }
      }
    });
  }

  getStatusClass(): string {
    if (!this.project) return '';
    switch (this.project.status.toLowerCase()) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      case 'draft': return 'status-draft';
      default: return 'status-pending';
    }
  }

  getStatusIcon(): string {
    if (!this.project) return 'fas fa-circle';
    switch (this.project.status.toLowerCase()) {
      case 'approved': return 'fas fa-check-circle';
      case 'pending': return 'fas fa-clock';
      case 'rejected': return 'fas fa-times-circle';
      case 'draft': return 'fas fa-pencil-alt';
      default: return 'fas fa-circle';
    }
  }

  formatDate(date: string | null): string {
    if (!date) return '—';
    return this.datePipe.transform(date, 'MMM dd, yyyy') || '—';
  }

  formatCurrency(amount: number): string {
    return '$' + (this.decimalPipe.transform(amount, '1.0-0') || '0');
  }

  getCategoryIcon(): string {
    if (!this.project) return 'fas fa-folder';
    const cat = this.project.category.toLowerCase();
    if (cat.includes('tech')) return 'fas fa-microchip';
    if (cat.includes('energy')) return 'fas fa-solar-panel';
    if (cat.includes('edu')) return 'fas fa-graduation-cap';
    if (cat.includes('health')) return 'fas fa-heartbeat';
    if (cat.includes('social')) return 'fas fa-hands-helping';
    if (cat.includes('environment')) return 'fas fa-leaf';
    if (cat.includes('fintech')) return 'fas fa-coins';
    if (cat.includes('agro')) return 'fas fa-seedling';
    return 'fas fa-folder';
  }

  getDaysRemaining(): number {
    if (!this.project?.endDate) return 0;
    const end = new Date(this.project.endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  getTimelineProgress(): number {
    if (!this.project?.startDate || !this.project?.endDate) return 0;
    const start = new Date(this.project.startDate).getTime();
    const end = new Date(this.project.endDate).getTime();
    const now = new Date().getTime();
    if (now < start) return 0;
    if (now > end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
  }

  confirmDelete(): void {
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  deleteProject(): void {
    if (!this.project) return;
    this.isDeleting = true;
    this.projectService.deleteProject(this.project.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.router.navigate(['/founder/projects']);
      },
      error: (err) => {
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.errorMessage = 'Failed to delete project. Please try again.';
        console.error('Delete error:', err);
      }
    });
  }
}
