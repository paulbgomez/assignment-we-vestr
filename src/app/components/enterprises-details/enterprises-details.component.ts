import {Component, OnInit} from '@angular/core';
import {Enterprise, Stock} from '../../interfaces/interfaces';
import {EnterprisesService} from '../../services/enterprises.service';
import {StocksService} from '../../services/stocks.service';

@Component({
  selector: 'app-enterprises-details',
  templateUrl: './enterprises-details.component.html',
  styleUrls: ['./enterprises-details.component.scss']
})
export class EnterprisesDetailsComponent implements OnInit {

  enterprises: Enterprise[] = [];

  constructor(private enterprisesService: EnterprisesService, private stocksService: StocksService) { }

  ngOnInit(): void {
    this.getAllEnterprises();
  }

  /*
  GET
   */

  getAllEnterprises(): void{
    this.enterprisesService.getEnterprises().subscribe(array => {
      this.enterprises = array;
    });
  }

  /*
  POST
   */

  add(name: string, totalAmountStock: number): void{
    name = name.trim();
    if (!name || !totalAmountStock){ return; }
    this.enterprisesService.createEnterprise({name, totalAmountStock} as Enterprise).subscribe();
  }

    /*
  DELETE
   */

  deleteEnterprise(enterprise: Enterprise): void{
    this.enterprises = this.enterprises.filter(e => e !== enterprise);
    this.stocksService.getStocksFilteredByEnterpriseId(enterprise.id).subscribe(stocks => {
      stocks.forEach(stock => {
        this.deleteStock(stock);
      });
    });
    this.enterprisesService.deleteEnterprise(enterprise).subscribe();
  }

  deleteStock(stock: Stock): void{
    this.stocksService.deleteStock(stock).subscribe();
  }

  /*
  PUT
   */

  makeSplit(newAmount: number, enterpriseId: number): void{
    this.enterprisesService.getEnterprise(enterpriseId).subscribe(enterprise =>
      this.stocksService.getStocksFilteredByEnterpriseId(enterpriseId).subscribe(stocks => {
        this.enterprisesService.getEnterpriseTotalStock(enterpriseId).subscribe(totalStock => {
          stocks.forEach(stock => {
            const newValueAction = newAmount / totalStock;
            console.log(newValueAction);
            stock.amount = stock.amount * newValueAction;
            stock.totalAmountStock = newAmount;
            this.stocksService.editStock(stock).subscribe();
          });
          enterprise.totalAmountStock = newAmount;
          this.enterprisesService.editEnterprise(enterprise).subscribe();
        });
      })
    );
  }

}
