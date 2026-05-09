import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService, ProjectResponse } from '../../../services/project.service';
import { Subscription } from 'rxjs';
import { ProjectDetailsComponent } from '../project-details/project-details.component';

interface ProjectDisplay extends Partial<ProjectResponse> {
  id: number;
  title: string;
  category: string;
  categoryClass: string;
  description: string;
  status: string;
  statusLabel: string;
  raised: number;
  goal: number;
  progress: number;
  headerClass: string;
  isNew?: boolean;
}

@Component({
  selector: 'app-founder-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectDetailsComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  private projectService = inject(ProjectService);
  private projectsSub!: Subscription;

  projects: ProjectDisplay[] = [];
  isLoading = true;
  selectedProjectId: number | null = null;
  currentFilter: 'all' | 'pending' | 'approved' = 'all';

  get filteredProjects(): ProjectDisplay[] {
    if (this.currentFilter === 'all') {
      return this.projects;
    }
    // Filter projects by status, but always keep the 'New Project' card at the end
    const filtered = this.projects.filter(p => !p.isNew && p.status === this.currentFilter);
    const newProjectCard = this.projects.find(p => p.isNew);
    if (newProjectCard) {
      filtered.push(newProjectCard);
    }
    return filtered;
  }

  setFilter(filter: 'all' | 'pending' | 'approved'): void {
    this.currentFilter = filter;
  }

  getProjectCount(status: string): number {
    if (status === 'all') return this.projects.filter(p => !p.isNew).length;
    return this.projects.filter(p => !p.isNew && p.status === status).length;
  }



  openProjectDetails(id: number): void {
    if (id > 0) {
      this.selectedProjectId = id;
    }
  }

  closeProjectDetails(): void {
    this.selectedProjectId = null;
  }

  ngOnInit(): void {
    this.projectService.refreshProjects();
    this.projectsSub = this.projectService.projects$.subscribe(apiProjects => {
      this.isLoading = false;
      this.projects = this.mapProjects(apiProjects);
    });
  }

  ngOnDestroy(): void {
    if (this.projectsSub) {
      this.projectsSub.unsubscribe();
    }
  }

  private mapProjects(apiProjects: ProjectResponse[]): ProjectDisplay[] {
    const mapped: ProjectDisplay[] = apiProjects.map(p => ({
      ...p,
      title: p.name || 'Untitled Project',
      category: p.category || 'Uncategorized',
      categoryClass: this.getCategoryClass(p.category || ''),
      description: p.description || '',
      status: (p.status || 'pending').toLowerCase(),
      statusLabel: (p.status || 'pending').toUpperCase(),
      raised: 0,
      goal: p.fundingGoal || 0,
      progress: 0,
      headerClass: this.getHeaderClass(p.category || '')
    }));

    mapped.push({
      id: 0,
      title: 'New Project',
      category: '',
      categoryClass: '',
      description: 'Start a new initiative and find Investors',
      status: 'draft',
      statusLabel: '',
      raised: 0,
      goal: 0,
      progress: 0,
      headerClass: '',
      isNew: true
    });

    return mapped;
  }

  private getCategoryClass(category: string): string {
    const cat = category.toLowerCase();
    if (cat.includes('tech')) return 'clean-tech';
    if (cat.includes('edu')) return 'education';
    if (cat.includes('social')) return 'social-impact';
    if (cat.includes('health')) return 'healthy-care';
    if (cat.includes('fashion')) return 'fashion';
    return 'other';
  }

  private getHeaderClass(category: string): string {
    const cat = category.toLowerCase();
    if (cat.includes('tech')) return 'bg-blue-gradient';
    if (cat.includes('edu')) return 'bg-gray-gradient';
    if (cat.includes('social')) return 'bg-purple-gradient';
    if (cat.includes('health')) return 'bg-green-gradient';
    if (cat.includes('fashion')) return 'bg-orange-gradient';
    return 'bg-blue-gradient';
  }
}

