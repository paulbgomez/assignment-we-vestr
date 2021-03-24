import {Injectable} from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api';
import {Enterprise, ShareHolder, Stock} from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService{

  createDb(): any {
    const shareHolders = [
      { id: 1, name: 'Paul'},
      { id: 2, name: 'Benjamin'},
      { id: 3, name: 'Tykhon'}
    ];

    const enterprises = [
      { id: 1, name: 'Google', totalAmountStock: 1000},
      { id: 2, name: 'Apple', totalAmountStock: 5000},
      { id: 3, name: 'Twitter', totalAmountStock: 400},
      { id: 4, name: 'Riot', totalAmountStock: 900}
    ];

    const stocks = [
      { id: 1, enterpriseId: 1, shareHolderId: 1, amount: 500},
      { id: 2, enterpriseId: 4, shareHolderId: 1, amount: 50},
      { id: 3, enterpriseId: 1, shareHolderId: 2, amount: 500},
      { id: 4, enterpriseId: 3, shareHolderId: 2, amount: 100},
      { id: 5, enterpriseId: 2, shareHolderId: 3, amount: 80},
    ];

    return {shareHolders, enterprises, stocks};
  }

  genId<T extends ShareHolder | Enterprise | Stock>(myTable: T[]): number {
    return myTable.length > 0 ? Math.max(...myTable.map(t => t.id)) + 1 : 1;
  }
}
