import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of, timer } from 'rxjs';
import { map, catchError, switchMap, retryWhen } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Running in browser');
      return this.authService.isLoggedIn().pipe(
        map(isLoggedIn => {
          if (isLoggedIn) {
            console.log("User is authenticated:", isLoggedIn);
            return true; // Izinkan akses ke halaman yang diminta
          } else {
            console.log("User is not authenticated, redirecting to login.");
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false; // Redirect ke halaman login
          }
        }),
        catchError(() => {
          console.log("Error occurred during authentication check, redirecting to login.");
          this.router.navigate(['/login']);
          return of(false); // Redirect ke halaman login jika terjadi error
        })
      );
    } else {
      // Jika tidak di browser, anggap pengguna terautentikasi
      return of(true);
    }
  }
}