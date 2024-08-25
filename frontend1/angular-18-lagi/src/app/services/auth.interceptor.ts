import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take, finalize, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request and add withCredentials to ensure cookies are sent
    const authReq = req.clone({ withCredentials: true });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        const publicRoutes = ['/login', '/register', '/refresh-token', '/resend-verify-email', '/activation','/logout', '/forgot-pwd', '/change-pwd-forgot', '/reset-password'];
        // Check if the request URL is not a public route
        if (error.status === 401 && !publicRoutes.some(route => req.url.includes(route))) {
          // Handle unauthorized requests
          return this.handle401Error(req, next);
        } else {
          // Forward other errors or errors from public routes
          return throwError(() => error);
        }
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.accessToken); // Notify other requests
          return next.handle(req.clone({ withCredentials: true })); // Retry the original request
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('Error saat refresh token', err);
          this.isRefreshing = false;

          if (err.status === 401) {
            // Directly redirect to login on logout error
            console.log("Logout karena refresh-token");
            return this.authService.logout().pipe(
              tap(() => {
                // Navigate to login page
                this.router.navigate(['/login']).finally(() => {
                  console.log('Redirecting to login page');
                });
              }),
              catchError((logoutErr: any) => {
                console.error('Logout error:', logoutErr);
                // Navigate to login page even if logout fails
                this.router.navigate(['/login']).finally(() => {
                  console.log('Redirecting to login page after logout failure');
                });
                return throwError(() => new Error('Unauthorized access'));
              })
            );
          } else {
            // Handle non-401 errors during refresh token process
            console.error('Error during refresh token process:', err);
            alert('An unexpected error occurred. Please try again.'); // Replace with your preferred notification method
            return throwError(() => err); // Rethrow the error to be handled elsewhere
          }
        })
      );
    } else {
      // If a refresh is in progress, wait for it to complete
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(() => next.handle(req.clone({ withCredentials: true }))) // Retry the original request
      );
    }
  }
}