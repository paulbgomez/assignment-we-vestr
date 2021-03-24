import {Component, OnInit} from '@angular/core';
import {ShareholdersService} from '../../services/shareholders.service';
import {Enterprise, ShareHolder, Stock, StockComplete} from '../../interfaces/interfaces';
import {EnterprisesService} from '../../services/enterprises.service';
import {StocksService} from '../../services/stocks.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // tslint:disable-next-line:max-line-length
  constructor(public dialog: MatDialog, private shareHoldersService: ShareholdersService, private enterprisesService: EnterprisesService, private stocksService: StocksService) { }

  shareHolders: ShareHolder[] = [];
  panelOpenState = false;
  enterprises: Enterprise[] = [];
  inputField = false;


  ngOnInit(): void {
    this.getAllInfo();
  }

  /*
  GET
   */

  getAllInfo(): void{
    this.getShareHoldersWithStocks();
    this.getEnterprises();
  }

  getShareHoldersWithStocks(): void {
    this.shareHoldersService.getShareHolders().subscribe(shareHoldersArray => {
      shareHoldersArray.forEach(sh => {
        this.stocksService.getStocksFilteredByShareHolderId(sh.id).subscribe(stocks => {
          stocks.forEach(stock => {
            this.enterprisesService.getEnterpriseName(stock.enterpriseId).subscribe(name => {
              stock.enterpriseName = name;
              this.stocksService.editStock(stock).subscribe();
            });
            this.enterprisesService.getEnterpriseTotalStock(stock.enterpriseId).subscribe(amount => {
              stock.totalAmountStock = amount;
              this.stocksService.editStock(stock).subscribe();
            });
          });
          sh.stocks = stocks;
        });
      });
      this.shareHolders = shareHoldersArray;
    });
  }

  getEnterprises(): void{
    this.enterprisesService.getEnterprises().subscribe(enterprisesArray => this.enterprises = enterprisesArray);
  }

  /*
  DELETE
   */

  deleteStock(stock: Stock): void{
    this.stocksService.deleteStock(stock).subscribe();
  }

  deleteShareHolder(shareHolder: ShareHolder): void {
    this.stocksService.getStocksFilteredByShareHolderId(shareHolder.id).subscribe(stocks => {
      stocks.forEach(s => {
        this.stocksService.deleteStock(s).subscribe();
      });
    });
    this.shareHolders = this.shareHolders.filter(s => s !== shareHolder);
    this.shareHoldersService.deleteShareHolders(shareHolder).subscribe();
  }

  /*
  PUT
   */

  editShareHolder(shareHolder: ShareHolder): void{
    this.shareHoldersService.editShareHolder(shareHolder).subscribe();
  }

  buyActives(bought: number, i: number, j: number): void{
    const shareholder = this.shareHolders[i];
    const { stocks } = shareholder;
    if (stocks) {
      const stock = stocks[j];
      this.enterprisesService.getEnterpriseTotalStock(stock.enterpriseId).subscribe(enterpriseTotalStock => {
        this.stocksService.getStocksFilteredByEnterpriseId(stock.enterpriseId).subscribe(stocksForEnterprise => {
          let totalStocksBoughtByShareHolders = 0;
          stocksForEnterprise.forEach(selectedStock => totalStocksBoughtByShareHolders += selectedStock.amount);
          const stockLeft = enterpriseTotalStock - totalStocksBoughtByShareHolders;
          if (bought <= stockLeft){
            stock.amount = bought;
            this.shareHoldersService.editShareHolder(shareholder).subscribe(() => alert('stock updated properly'));
            this.stocksService.editStock(stock).subscribe();
          } else {
            alert(`Only ${stockLeft} positions available.`);
          }
        });
      });
    }
  }

  addNewEnterpriseToMyStocks(value: number, i: number): void {
    const shareholder = this.shareHolders[i];
    console.log(shareholder.name);
    const idEnterprises: number[] = [];
    shareholder.stocks?.forEach(stockPresent => idEnterprises.push(stockPresent.enterpriseId));
    if (!idEnterprises.includes(value)) {
      this.enterprisesService.getEnterprise(value).subscribe(enterprise => {
        const stock: StockComplete = {
          id: Math.floor(Math.random() * 1000) + 100,
          amount: 0,
          enterpriseId: value,
          shareHolderId: i + 1,
          totalAmountStock: enterprise.totalAmountStock,
          enterpriseName: enterprise.name
        };
        this.stocksService.createStock(stock).subscribe();
        shareholder.stocks?.push(stock);
        this.shareHoldersService.editShareHolder(shareholder).subscribe(() => {
          shareholder.stocks?.forEach(s => {
            console.log(s.enterpriseName + ' ' + s.totalAmountStock);
          });
        });
      });
    } else {
      alert('you already have positions with this company');
    }
  }

  /*
  POST
   */

  addShareHolder(name: string): void{
    this.shareHoldersService.createShareHolder({name} as ShareHolder).subscribe();
    this.getAllInfo();
    this.inputField = false;
  }

  /*
  OTHERS
   */

  convertStringToNumber(input: string): number {
    if (!input) { return NaN; }
    if (input.trim().length === 0) {
      return NaN;
    }
    return Number(input);
  }

  openDialog(): void {
    this.inputField = true;
  }

}
