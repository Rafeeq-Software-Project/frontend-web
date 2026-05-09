import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService, DraftResponse } from '../../../services/project.service';
import { Subscription } from 'rxjs';
import { ProjectDetailsComponent } from '../project-details/project-details.component';

@Component({
  selector: 'app-drafts',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectDetailsComponent],
  providers: [DatePipe],
  templateUrl: './drafts.component.html',
  styleUrls: ['./drafts.component.css']
})
export class DraftsComponent implements OnInit, OnDestroy {
  private projectService = inject(ProjectService);
  private datePipe = inject(DatePipe);
  private draftsSub!: Subscription;

  drafts: DraftResponse[] = [];
  isLoading = true;
  selectedProjectId: number | null = null;

  openProjectDetails(projectId: number): void {
    if (projectId > 0) {
      this.selectedProjectId = projectId;
    }
  }

  closeProjectDetails(): void {
    this.selectedProjectId = null;
  }

  ngOnInit(): void {
    this.projectService.refreshDrafts();
    this.draftsSub = this.projectService.drafts$.subscribe(drafts => {
      this.isLoading = false;
      this.drafts = drafts;
    });
  }

  ngOnDestroy(): void {
    if (this.draftsSub) {
      this.draftsSub.unsubscribe();
    }
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MMM dd, yyyy · h:mm a') || '—';
  }

  formatCurrency(amount: number): string {
    return '$' + amount.toLocaleString();
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'pending';
      case 'approved': return 'approved';
      case 'rejected': return 'rejected';
      case 'draft': return 'draft';
      default: return 'pending';
    }
  }

  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'fas fa-clock';
      case 'approved': return 'fas fa-check-circle';
      case 'rejected': return 'fas fa-times-circle';
      default: return 'fas fa-clock';
    }
  }
}
