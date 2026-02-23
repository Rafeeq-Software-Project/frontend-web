import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    profilePictureUrl: string;
    roleName: string;
    roleId: number;
    expiresAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loginUrl = `${environment.apiBaseUrl}/api/auth/login`;
    private registerUrl = `${environment.apiBaseUrl}/api/auth/register`;

    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        this.loadUserFromStorage();
    }

    public login(credentials: any): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(this.loginUrl, credentials).pipe(
            tap(response => this.handleAuthentication(response))
        );
    }

    public register(userData: any): Observable<any> {
        return this.http.post(this.registerUrl, userData);
    }

    private handleAuthentication(response: AuthResponse) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('userData', JSON.stringify(response));
        this.currentUserSubject.next(response);
    }

    private loadUserFromStorage() {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            if (this.isTokenExpired(user.expiresAt)) {
                this.logout();
            } else {
                this.currentUserSubject.next(user);
            }
        }
    }

    public logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    public isLoggedIn(): boolean {
        const userData = localStorage.getItem('userData');
        if (!userData) return false;

        const user = JSON.parse(userData);
        return !this.isTokenExpired(user.expiresAt);
    }

    private isTokenExpired(expiresAt: string): boolean {
        const expiryDate = new Date(expiresAt);
        return new Date() > expiryDate;
    }

    public getRole(): string | null {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return null;

        try {
            const decoded: any = jwtDecode(accessToken);
            return decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
        } catch (error) {
            return null;
        }
    }

    public getRoleId(): number | null {
        const userData = localStorage.getItem('userData');
        if (!userData) return null;
        return JSON.parse(userData).roleId;
    }
}
