import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FounderProfile {
  companyName: string;
  companyRegistrationNumber: string;
  industry: string;
  bio: string;
  websiteUrl: string;
  linkedInProfile: string;
  id?: string | number;
  userId?: string | number;
  profilePictureUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FounderService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  getCurrentProfile(): Observable<FounderProfile> {
    return this.http.get<FounderProfile>(`${this.baseUrl}/api/Founders/me`);
  }

  updateProfile(profileData: FounderProfile): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseUrl}/api/Founders/me`, profileData, { headers });
  }

  getFounderById(id: string | number): Observable<FounderProfile> {
    return this.http.get<FounderProfile>(`${this.baseUrl}/api/Founders/${id}`);
  }

  getFounderByUserId(userId: string | number): Observable<FounderProfile> {
    return this.http.get<FounderProfile>(`${this.baseUrl}/api/Founders/user/${userId}`);
  }
}
