import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProjectRequest {
  name: string;
  description: string;
  category: string;
  fundingGoal: number;
  useOfFunds: string;
  startDate: string;
  endDate: string;
}

export interface ProjectResponse extends ProjectRequest {
  id: number;
  founderId: number;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  reviewedByRole: string | null;
  reviewedByUserId: number | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  founderName: string;
  founderCompany: string;
  founderProfilePicture: string | null;
}

export interface DraftLiveProject {
  id: number;
  name: string;
  status: string;
  fundingGoal: number;
}

export interface DraftResponse {
  id: number;
  projectId: number;
  founderId: number;
  name: string;
  status: string;
  createdAt: string;
  rejectionReason: string | null;
  reviewedByRole: string | null;
  liveProject: DraftLiveProject;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  // ── Live Projects State ──
  private projectsSubject = new BehaviorSubject<ProjectResponse[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  // ── Drafts State ──
  private draftsSubject = new BehaviorSubject<DraftResponse[]>([]);
  public drafts$ = this.draftsSubject.asObservable();

  constructor() {
    this.refreshProjects();
  }

  // ── Live Project CRUD ──

  createProject(projectData: ProjectRequest): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(`${this.baseUrl}/api/founder/projects`, projectData).pipe(
      tap((newProject) => {
        const currentProjects = this.projectsSubject.value;
        this.projectsSubject.next([...currentProjects, newProject]);
        this.refreshProjects();
      })
    );
  }

  refreshProjects(): void {
    this.http.get<ProjectResponse[]>(`${this.baseUrl}/api/founder/projects`).subscribe({
      next: (projects) => this.projectsSubject.next(projects),
      error: (error) => {
        console.error('Error fetching projects:', error);
        this.projectsSubject.next([]);
      }
    });
  }

  getProjects(): Observable<ProjectResponse[]> {
    return this.projects$;
  }

  getProjectById(id: number): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(`${this.baseUrl}/api/founder/projects/${id}`);
  }

  /**
   * Editing a project sends it to Drafts (Pending Review).
   * The project is removed from the live list and appears in drafts.
   */
  updateProject(id: number, projectData: ProjectRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/founder/projects/${id}`, projectData).pipe(
      tap(() => {
        // Remove from live projects list immediately
        const currentProjects = this.projectsSubject.value;
        this.projectsSubject.next(currentProjects.filter(p => p.id !== id));
        // Refresh both lists in the background
        this.refreshProjects();
        this.refreshDrafts();
      })
    );
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/founder/projects/${id}`).pipe(
      tap(() => {
        const currentProjects = this.projectsSubject.value;
        this.projectsSubject.next(currentProjects.filter(p => p.id !== id));
        this.refreshProjects();
      })
    );
  }

  // ── Drafts ──

  refreshDrafts(): void {
    this.http.get<DraftResponse[]>(`${this.baseUrl}/api/founder/projects/drafts/pending`).subscribe({
      next: (drafts) => this.draftsSubject.next(drafts),
      error: (error) => {
        console.error('Error fetching drafts:', error);
        this.draftsSubject.next([]);
      }
    });
  }

  getDrafts(): Observable<DraftResponse[]> {
    return this.drafts$;
  }
}

