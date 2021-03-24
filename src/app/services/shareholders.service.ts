import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ShareHolder} from '../interfaces/interfaces';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StocksService} from './stocks.service';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShareholdersService {

  constructor(private http: HttpClient, private stocksService: StocksService) { }

  urlApi = 'api/shareHolders';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /*
  GET shareHolders
   */

  getShareHolders(): Observable<ShareHolder[]>{
    return this.http.get<ShareHolder[]>(this.urlApi).pipe(
      catchError(this.handleError<ShareHolder[]>('get all share holders', []))
    );
  }

  getShareholder(id: number): Observable<ShareHolder>{
    const url = `${this.urlApi}/${id}`;
    return this.http.get<ShareHolder>(url).pipe(
      catchError(this.handleError<ShareHolder>(`get shareholder for id ${id}`))
    );
  }

  /*
  DELETE shareholder
   */

  deleteShareHolders(shareHolder: ShareHolder | number): Observable<ShareHolder>{
    const id = typeof shareHolder === 'number' ? shareHolder : shareHolder.id;
    const url = `${this.urlApi}/${id}`;

    return this.http.delete<ShareHolder>(url, this.httpOptions).pipe(
      catchError(this.handleError<ShareHolder>('delete share holder'))
    );
  }

  /*
  POST shareholder
   */

  createShareHolder(shareholder: ShareHolder): Observable<ShareHolder>{
    return this.http.post<ShareHolder>(this.urlApi, shareholder, this.httpOptions)
      .pipe(
        catchError(this.handleError<ShareHolder>('create shareholder'))
      );
  }

  /*
  PUT shareholder
   */

  editShareHolder(shareholder: ShareHolder): Observable<ShareHolder>{
    return this.http.put<ShareHolder>(this.urlApi, shareholder, this.httpOptions)
      .pipe(
        catchError(this.handleError<ShareHolder>(`edit shareholder for id ${shareholder.id}`))
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
