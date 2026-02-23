import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (this.authService.isLoggedIn()) {
            const userRoleId = this.authService.getRoleId();
            const expectedRoles = route.data['roles'] as Array<number>;

            if (expectedRoles && expectedRoles.length > 0) {
                if (userRoleId !== null && expectedRoles.includes(userRoleId)) {
                    return true;
                } else {
                    // If role doesn't match, redirect to unauthorized or home
                    this.router.navigate(['/']);
                    return false;
                }
            }
            return true;
        }

        // Not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
