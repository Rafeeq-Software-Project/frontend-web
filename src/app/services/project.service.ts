import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  createProject(projectData: ProjectRequest): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(`${this.baseUrl}/api/founder/projects`, projectData);
  }

  getProjects(): Observable<ProjectResponse[]> {
    return this.http.get<ProjectResponse[]>(`${this.baseUrl}/api/founder/projects`);
  }
}
