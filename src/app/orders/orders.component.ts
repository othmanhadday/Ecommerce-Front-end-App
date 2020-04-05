import { Component, OnInit } from '@angular/core';
import {OrderService} from '../services/order.service';
import {OrderModel} from '../model/Order.model';
import {AuthenticationService} from '../services/authentication.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders:Array<OrderModel>=[];
  active=false;
  idActve=0;
  constructor(
    public authenticationService:AuthenticationService,
    private orderService:OrderService
  ) { }

  ngOnInit(): void {
    this.orders=[]
    if(this.authenticationService.isAdmin()){
      this.orders = this.orderService.allOrders();
    }else {
      this.orders = this.orderService.ordersOfClent();
    }
  }

  public AffichelistProduct(c){
    this.idActve==c?this.idActve=undefined:this.idActve=c;
  }
}
