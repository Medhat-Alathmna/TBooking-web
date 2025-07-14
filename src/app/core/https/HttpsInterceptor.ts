import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, from } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

@Injectable()
export class ErrorBlobInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (
          err.error instanceof Blob &&
          err.error.type === 'application/json'
        ) {
          return from(err.error.text()).pipe(
            mergeMap((text) => {
              let jsonError;
              try {
                jsonError = JSON.parse(text);
              } catch (e) {
                jsonError = { message: 'Unknown error occurred' };
              }

              return throwError(() =>
                new HttpErrorResponse({
                  error: jsonError,
                  headers: err.headers,
                  status: err.status,
                  statusText: err.statusText,
                  url: err.url ?? undefined,
                })
              );
            })
          );
        }

        return throwError(() => err);
      })
    );
  }
}
