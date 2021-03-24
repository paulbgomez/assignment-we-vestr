import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Enterprise} from '../interfaces/interfaces';
import {catchError, map} from 'rxjs/operators';
import {StocksService} from './stocks.service';

@Injectable({
  providedIn: 'root'
})
export class EnterprisesService {

  constructor(private http: HttpClient, private stocksService: StocksService) { }

  urlApi = 'api/enterprises';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /*
  GET enterprises
   */

  getEnterprises(): Observable<Enterprise[]>{
    return this.http.get<Enterprise[]>(this.urlApi)
      .pipe(
        catchError(this.handleError<Enterprise[]>('get all enterprises', []))
      );
  }

  getEnterprise(id: number): Observable<Enterprise>{
    return this.http.get<Enterprise>(`${this.urlApi}/${id}`)
      .pipe(
        catchError(this.handleError<Enterprise>('get enterprise'))
      );
  }

  getEnterpriseName(id: number): Observable<string>{
    return this.http.get<Enterprise>(`${this.urlApi}/${id}`).pipe(
      map(items => items.name)
    );
  }

  getEnterpriseTotalStock(id: number): Observable<number>{
    return this.http.get<Enterprise>(`${this.urlApi}/${id}`).pipe(
      map(items => items.totalAmountStock)
    );
  }

  /*
  DELETE enterprises
   */

  deleteEnterprise(enterprise: Enterprise | number): Observable<Enterprise>{
    const id = typeof enterprise === 'number' ? enterprise : enterprise.id;
    const url = `${this.urlApi}/${id}`;
    return this.http.delete<Enterprise>(url, this.httpOptions)
      .pipe( catchError(this.handleError<Enterprise>('delete enterprise'))
    );
  }

  /*
  POST enterprises
   */

  createEnterprise(enterprise: Enterprise): Observable<Enterprise>{
    return this.http.post<Enterprise>(this.urlApi, enterprise, this.httpOptions).pipe(
      catchError(this.handleError<Enterprise>(`create new enterprise`))
    );
  }

  /*
  PUT enterprises
   */

  editEnterprise(enterprise: Enterprise): Observable<Enterprise>{
    return this.http.put<Enterprise>(this.urlApi, enterprise, this.httpOptions).pipe(
      catchError(this.handleError<Enterprise>(`edit new enterprise with id ${enterprise.id}`))
    );
  }

  // tslint:disable-next-line:typedef
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
