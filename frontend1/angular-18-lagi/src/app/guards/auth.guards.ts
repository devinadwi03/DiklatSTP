import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, switchMap, filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn().pipe(
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return of(true);
        } else {
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }, replaceUrl: true });
          return of(false);
        }
      }),
      catchError(() => {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }, replaceUrl: true });
        return of(false);
      })
    );
  }
}
