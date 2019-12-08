import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class InterceptService implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer authTokenKey`,
        'Access-Control-Allow-Origin': '*'
      }
    });

    return next.handle(request).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
            // console.log('all looks good');
            // console.log('http response status code', event.status);
          }
        },
        error => {
          console.warn(error.status);
          console.warn(error.message);
        }
      )
    );
  }
}
