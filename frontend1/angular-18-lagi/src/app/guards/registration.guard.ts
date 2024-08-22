import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.getUserRegistrationStatus().pipe(
      map(isRegistered => {
        if (isRegistered) {
          // Jika user sudah mendaftar, arahkan ke halaman dashboard
          alert('Anda sudah mendaftar!');
          this.router.navigate(['user-data']);
          return false;
        }
        return true;
      }),
      catchError(() => {
        // Jika terjadi error, arahkan ke halaman login
        this.router.navigate(['login']);
        return of(false);
      })
    );
  }
}
