import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const expectedRole = next.data['expectedRole'];

    return this.authService.getUserRole().pipe(
      map(currentRole => {
        if (currentRole !== expectedRole) {
          alert('Anda tidak memiliki akses ke halaman ini!');
          
          // Arahkan ke halaman lain, misalnya dashboard atau home
          this.router.navigate(['/dashboard']); // atau sesuaikan dengan rute yang tepat
          return false;
        }
        return true;
      }),
      catchError(() => {
        alert('Terjadi kesalahan! Anda tidak dapat mengakses halaman ini.');
        
        // Arahkan ke halaman lain, misalnya dashboard atau home
        this.router.navigate(['/dashboard']); // atau sesuaikan dengan rute yang tepat
        return of(false);
      })
    );
  }
}
