import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService, DraftResponse } from '../../../services/project.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-drafts',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
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
