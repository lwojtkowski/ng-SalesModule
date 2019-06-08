import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductDetails } from './basket-products.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  private products: ProductDetails[] = [];
  private product: ProductDetails;
  private productsUpdated = new Subject<ProductDetails[]>();
  private productUpdate = new Subject<ProductDetails>();

  constructor(private http: HttpClient) { }

  getProducts(localWarehouseID, productID) {
    this.http.get<ProductDetails>('https://localhost:7001/api/Catalog/products/' + localWarehouseID + ',1,' + productID)
      .subscribe((productData) => {
        this.products.push(this.product = productData);
        this.productsUpdated.next([...this.products]);
      });
  }

  getProductAviability(localWarehouseID, productID) {
    this.http.get<ProductDetails>('https://localhost:7001/api/Catalog/products/' + localWarehouseID + ',1,' + productID)
      .subscribe((productData) => {
        this.product = productData;
        this.productUpdate.next(this.product);
        //console.log(this.product);
      });
  }

  getProductsListener() {
    return this.productsUpdated.asObservable();
  }

  getProductAviabilityListener() {
    return this.productUpdate.asObservable();
  }
}
