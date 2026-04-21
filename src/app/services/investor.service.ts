import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface InvestorProfile {
    firstName: string;
    lastName: string;
    investorType: string;
    location: string;
    minInvestment: number;
    maxInvestment: number;
    stage: string;
    investmentInterests: string;
    bio: string;
    experienceYears: number;
    profilePictureUrl?: string;
}

@Injectable({
    providedIn: 'root'
})
export class InvestorService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiBaseUrl;

    getMyInvestorProfile(): Observable<any> {
        return this.http.get(`${this.baseUrl}/api/investors/me`);
    }

    createInvestorProfile(profileData: InvestorProfile): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseUrl}/api/investors/me`, profileData, { headers });
    }

    updateInvestorProfile(profileData: InvestorProfile): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put(`${this.baseUrl}/api/investors/me`, profileData, { headers });
    }

    getInvestorById(id: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}/api/investors/${id}`);
    }

    getInvestorByUserId(userId: number | string): Observable<any> {
        return this.http.get(`${this.baseUrl}/api/investors/user/${userId}`);
    }

    uploadProfilePicture(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.baseUrl}/api/users/me/profile-picture`, formData);
    }

    deleteProfilePicture(): Observable<any> {
        return this.http.delete(`${this.baseUrl}/api/users/me/profile-picture`);
    }
}
