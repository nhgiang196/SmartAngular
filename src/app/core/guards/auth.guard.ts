import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    // canActivate(
    //     next: ActivatedRouteSnapshot,
    //     state: RouterStateSnapshot): boolean {
    //     let url: string = state.url;
    //         debugger
    //     return this.checkLogin(url);
    // }
    // canActivateChild(
    //     route: ActivatedRouteSnapshot,
    //     state: RouterStateSnapshot): boolean {
    //     return this.canActivate(route, state);
    // }
    // checkLogin(url: string): boolean {
    //     if (this.authService.isLoggedIn()) { return true; }
    //     debugger;
    //     // Store the attempted URL for redirecting
    //     this.authService.redirectUrl = url;

    //     // Navigate to the login page with extras
    //     this.router.navigate(['login']);
    //     return false;
        
    // }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.isLoggedIn()) {
          return true;
        } else {
          this.router.navigate(['/auth'], {
            queryParams: {
              returnUrl: state.url
            }
          });
          return false;
        }
     }

}