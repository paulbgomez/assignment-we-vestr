import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Stock, StockComplete} from '../interfaces/interfaces';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StocksService {

  constructor(private http: HttpClient) { }

  urlApi = 'api/stocks';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /*
  GET stocks
   */

  getStocks(): Observable<Stock[]>{
    return this.http.get<Stock[]>(this.urlApi)
      .pipe(
      catchError(this.handleError<Stock[]>('get all stocks', []))
    );
  }

  getStocksFilteredByShareHolderId(id: number): Observable<StockComplete[]>{
     return this.http.get<StockComplete[]>(this.urlApi).pipe(
      map(items => items.filter(stock => stock.shareHolderId === id))
   );
  }

  getStocksFilteredByEnterpriseId(id: number): Observable<StockComplete[]>{
     return this.http.get<StockComplete[]>(this.urlApi).pipe(
      map(items => items.filter(stock => stock.enterpriseId === id))
   );
  }

  getStock(id: number): Observable<Stock>{
    const url = `${this.urlApi}/${id}`;
    return this.http.get<Stock>(url).pipe(
      catchError(this.handleError<Stock>(`get stock with id ${id}`))
    );
  }

  /*
  DELETE stock
   */

  deleteStock(stock: Stock | number): Observable<Stock>{
    const id = typeof stock === 'number' ? stock : stock.id;
    const url = `${this.urlApi}/${id}`;
    return this.http.delete<Stock>(url, this.httpOptions).pipe(
      catchError(this.handleError<Stock>('delete stock'))
    );
  }

  /*
  POST stock
   */

  createStock(stock: StockComplete): Observable<Stock>{
    const { totalAmountStock, enterpriseName, ...stockToAdd } = stock;
    return this.http.post<Stock>(this.urlApi, stockToAdd, this.httpOptions).pipe(
      catchError(this.handleError<Stock>('add new stock'))
    );
  }

  /*
  PUT stock
   */

  editStock(stock: Stock): Observable<Stock>{
    return this.http.put<Stock>(this.urlApi, stock, this.httpOptions).pipe(
      catchError(this.handleError<Stock>(`edit stock with id ${stock.id}`))
    );
  }

  editCompleteStock(stock: StockComplete): Observable<StockComplete>{
    return this.http.put<StockComplete>(this.urlApi, stock, this.httpOptions).pipe(
      catchError(this.handleError<StockComplete>(`edit stock with id ${stock.id}`))
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
