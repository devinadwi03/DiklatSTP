import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Intercepting request to:', req.url);

    const accessToken = this.authService.getToken();
    
    // Tambahkan header untuk setiap request
    let authReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (accessToken) {
      console.log('Access Token found:', accessToken);
    } else {
      console.warn('No Access Token found, sending request without Authorization header');
    }

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

  private addToken(req: HttpRequest<any>, token: string) {
    console.log('Adding Authorization header:', `Bearer ${token}`);
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      console.log('Refreshing token...');
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          const newToken = this.authService.getToken();
          if (newToken) {
            console.log('Token refresh successful, new token:', newToken);
            this.refreshTokenSubject.next(newToken);
            return next.handle(this.addToken(req, newToken));
          } else {
            console.error('Token refresh failed, no new token received');
            return throwError(() => new Error('Failed to get new token'));
          }
        }),
        catchError((err) => {
          this.isRefreshing = false;
          console.error('Error during token refresh:', err);
          this.authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      console.log('Waiting for token refresh to complete');
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(this.addToken(req, token!)))
      );
    }
  }
}
