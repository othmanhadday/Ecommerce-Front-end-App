import {Injectable, OnInit} from '@angular/core';
import {CaddyModel} from '../model/Caddy.model';
import {AuthenticationService} from './authentication.service';
import {ProductModel} from '../model/product.model';
import {ProductItem} from '../model/ProductItem';
import {ClientsModel} from '../model/Clients.Model';


@Injectable({
  providedIn: 'root'
})
export class CaddyService {
  public caddy;
  constructor(public authService: AuthenticationService) {
    authService.loadAutheticatedUserFromLocalStorage();
    if (this.authService.isAuthenticated()){
      if(this.onLoadCaddyFromLocalStrorage( this.authService.userAuthenticated.username)){
        this.caddy=this.onLoadCaddyFromLocalStrorage( this.authService.userAuthenticated.username);
      }else {
        this.caddy = new CaddyModel();
      }
    }else {
      this.caddy = new CaddyModel();
    }
  }

  public addProductToCaddy(p: ProductModel,name) {
    let productItem = this.caddy.items.get(p.id);
    if (productItem) {
      productItem.quantity += p.quantity;
    } else {
      productItem = new ProductItem();
      productItem.id = p.id;
      productItem.name = p.name;
      productItem.quantity = p.quantity;
      productItem.price = p.currentPrice;
      this.caddy.items.set(p.id, productItem);
    }
    this.saveCaddyToLocalStorage(name);
  }

  public saveCaddyToLocalStorage(name) {
    function replacer(key, value) {
      const originalObject = this[key];
      if (originalObject instanceof Map) {
        return {
          dataType: 'Map',
          value: Array.from(originalObject.entries()), // or with spread: value: [...originalObject]
        };
      } else {
        return value;
      }
    }

    localStorage.setItem('Caddy_' +name,
      JSON.stringify(this.caddy, replacer));
  }

  public onLoadCaddyFromLocalStrorage(name):CaddyModel{
    function reviver(key, value) {
      if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
          return new Map(value.value);
        }
      }
      return value;
    }

    let caddy = localStorage.getItem('Caddy_' + name);
    return JSON.parse(caddy, reviver);
  }

  public getCaddy() {
    return this.caddy;
  }

  public getSize() {
    let size = this.caddy.items.size;
    return size;
  }

  public totalPrices() {
    let total = 0;
    for (let item of this.getCaddy().items.values()) {
      total += item.price * item.quantity;
    }
    return total;
  }

  RemoveProductFromCaddy(id) {
    this.caddy.items.delete(id);
    this.saveCaddyToLocalStorage(this.authService.userAuthenticated.username);
  }

  setClient(client: ClientsModel) {
    this.caddy.client=client;
    this.saveCaddyToLocalStorage(this.authService.userAuthenticated.username);
  }
}
