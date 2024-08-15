import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';


@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private AuthService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const expectedRole = next.data.expectedRole;
    const currentRole = this.AuthService.getRole();

    if (currentRole !== expectedRole) {
      this.router.navigate(['login']); // Arahkan ke halaman login jika tidak memiliki akses
      return false;
    }
    return true;
  }
}
