import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Intercepting request to:', req.url);

    // Clone the request and add withCredentials to ensure cookies are sent
    const authReq = req.clone({ withCredentials: true });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Request error:', error);
        if (error.status === 401 && !authReq.url.includes('/login')) {
          console.warn('Unauthorized request detected. Handling 401 error.');
          return this.handle401Error(authReq, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      console.log('Refreshing token...');
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.accessToken); // Notify other requests
          return next.handle(req.clone({ withCredentials: true })); // Retry the original request
        }),
        catchError((err) => {
          this.isRefreshing = false;
          console.error('Error during token refresh:', err);
          this.authService.logout().subscribe(); // Logout on refresh token failure
          return throwError(() => err);
        })
      );
    } else {
      console.log('Waiting for token refresh to complete');
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(() => next.handle(req.clone({ withCredentials: true }))) // Retry the original request
      );
    }
  }
}
