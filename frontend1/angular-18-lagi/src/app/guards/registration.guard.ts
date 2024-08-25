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
        if (isRegistered && next.routeConfig?.path === 'user-data') {
          // Jika user sudah mendaftar dan mencoba mengakses halaman 'user-data', biarkan
          return true;
        } else if (isRegistered) {
          // Jika user sudah mendaftar tapi mencoba mengakses halaman pendaftaran, arahkan ke halaman 'user-data'
          alert('Anda sudah mendaftar!');
          this.router.navigate(['user-data']);
          return false;
        } else if (!isRegistered && next.routeConfig?.path === 'user-data') {
          // Jika user belum mendaftar dan mencoba mengakses halaman 'user-data', arahkan ke halaman pendaftaran
          alert('Anda belum mendaftar! Silakan daftar terlebih dahulu.');
          this.router.navigate(['templateFormValidation']);
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
