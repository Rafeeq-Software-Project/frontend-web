import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FounderService, FounderProfile } from '../../../services/founder.service';
import { ProjectService, ProjectResponse } from '../../../services/project.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-founder-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  profile: FounderProfile | null = null;
  projects: ProjectResponse[] = [];
  activeProjectsCount = 0;
  fundingRaised = 0;
  totalInvestors = 0;
  isLoading = true;

  private projectsSub!: Subscription;

  constructor(
    private founderService: FounderService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadProjects();
  }

  ngOnDestroy(): void {
    if (this.projectsSub) {
      this.projectsSub.unsubscribe();
    }
  }

  loadProfile(): void {
    this.isLoading = true;
    this.founderService.getCurrentProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading profile', err);
        this.isLoading = false;
      }
    });
  }

  loadProjects(): void {
    this.projectsSub = this.projectService.projects$.subscribe({
      next: (data) => {
        this.projects = data;
        this.activeProjectsCount = this.projects.filter(p => 
          p.status.toLowerCase() !== 'draft' && p.status.toLowerCase() !== 'archived'
        ).length;
        
        // Calculate total funding raised/goal (dummy calculation for now if raised doesn't exist)
        // Assume fundingGoal is what's displayed or sum of all approved projects
        this.fundingRaised = this.projects
          .filter(p => p.status.toLowerCase() === 'approved')
          .reduce((sum, p) => sum + (p.fundingGoal || 0), 0);
          
        this.totalInvestors = 0;
      },
      error: (err) => {
        console.error('Error loading projects', err);
      }
    });
  }
}
