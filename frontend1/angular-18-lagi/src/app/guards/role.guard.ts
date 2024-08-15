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
          // Arahkan ke halaman unauthorized jika role tidak sesuai
          this.router.navigate(['unauthorized']);
          return false;
        }
        return true;
      }),
      catchError(() => {
        // Arahkan ke halaman unauthorized jika ada error
        this.router.navigate(['unauthorized']);
        return of(false);
      })
    );
  }
}
