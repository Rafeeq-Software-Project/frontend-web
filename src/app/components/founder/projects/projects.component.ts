import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService, ProjectResponse } from '../../../services/project.service';
import { Subscription } from 'rxjs';

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
  imports: [CommonModule, RouterModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  private projectService = inject(ProjectService);
  private projectsSub!: Subscription;

  projects: ProjectDisplay[] = [];
  isLoading = true;

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
      title: p.name,
      category: p.category,
      categoryClass: this.getCategoryClass(p.category),
      description: p.description,
      status: p.status.toLowerCase(),
      statusLabel: p.status.toUpperCase(),
      raised: 0,
      goal: p.fundingGoal,
      progress: 0,
      headerClass: this.getHeaderClass(p.category)
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

