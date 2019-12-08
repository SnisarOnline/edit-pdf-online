import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json' })
};

@Injectable()
export class PdfHttpService {

  constructor(private httpClient: HttpClient) {}

  private superHandleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error('Full description of the BUG: ', error);

      this.log(`${operation} ERROR : ${error.message}`);

      return of(result as T);
    };
  }
  private log(message) {
    console.info(`PdfHttpService: ${message}`);
  }

  create(data: any): Observable<any> {

    return this.httpClient.post<any> ('', data, httpOptions)
      .pipe(
        tap(() => this.log('CREATE')),
        catchError(this.superHandleError('create'))
      );
  }

  sent(htmlString: {html: string}): Observable<any> {
    console.log('sent()', htmlString);
    // return from backend
    // return this.httpClient.post( environment.baseUrl + '/api/getPdf', htmlString, httpOptions)
    //   .pipe(
    //     tap( () => this.log('sent(): return')),
    //     catchError(this.superHandleError('sent()'))
    //   );

    return new Observable((observer) => {
      observer.next(htmlString);
      observer.complete();
    });
  }
}
