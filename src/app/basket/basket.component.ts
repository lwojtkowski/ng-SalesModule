import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket.service';
import { ProductDetails } from './basket-products.model';
import { Subscription } from 'rxjs';
import { overrideComponentView } from '@angular/core/src/view';
import { TestBed } from '@angular/core/testing';
import { variable } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  userDummyData = { warehouseID: 2, user: '6400XX' };
  basketDummyData = [ 1092132, 1168804, 1148672];

  basketItems: ProductDetails[] = [];

  item: ProductDetails;

  summaryPrice: number;

  quantityModel = '';

  private productsSub: Subscription;
  private productSub: Subscription;

  private index: number;

  constructor(public basketService: BasketService) {}

  ngOnInit() {
    this.basketDummyData.forEach( item => {
      this.basketService.getProducts(this.userDummyData.warehouseID, item);
    });
    this.productsSub = this.basketService.getProductsListener()
      .subscribe((basketItems: ProductDetails[]) => {
        this.basketItems = basketItems;
        this.basketItems.forEach(prod => {
            prod.quantity = 1;
        });
      });
    /*this.productSub = this.basketService.getProductAviabilityListener()
      .subscribe((item: ProductDetails) => {
        this.item = item;
      });*/
  }

  deleteItem(productID){
    const index = this.basketItems.map(p => p.productID).indexOf(productID);
    this.basketItems.splice(index, 1);
  }

  refreshAviability(productID) {
    this.basketService.getProductAviability(this.userDummyData.warehouseID, productID);
    this.productSub = this.basketService.getProductAviabilityListener()
      .subscribe((item: ProductDetails) => {
        this.item = item;
      });

    const index = this.basketItems.map(p => p.productID).indexOf(productID);
    console.log(this.item);
    console.log(index);
  }

  replaceItem(productID) {
    const index = this.basketItems.map(p => p.productID).indexOf(productID);
    //this.basketItems.splice(index, 1);
    //console.log(this.Item);
    //this.basketItems.push(this.item);
  }

  SummaryPrice(): number {
    let sum = 0;
    this.basketItems.forEach(prod => {
      sum += prod.price * prod.quantity;
    });
    return sum;
  }

  quantityValue(productID, quantity, incType){
    this.basketItems.forEach(prod => {
      if(prod.productID === productID && incType === true && prod.quantity < 10)
      {
        prod.quantity += quantity;
      }
      if(prod.productID === productID && incType === false && prod.quantity > 1)
      {
        prod.quantity -= quantity;
      }
    });
    console.log(this.basketItems);
  }
}
