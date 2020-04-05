import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../services/order.service';
import {OrderModel} from '../model/Order.model';
import {PaymentModel} from '../model/payment.model';
import {HttpClient} from '@angular/common/http';
import {CatalogueService} from '../services/catalogue.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  public currentOrder:OrderModel;
  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private orderService:OrderService,
    private http:HttpClient,
    private catalogueService:CatalogueService
    ) { }

  ngOnInit(): void {
    let id = this.route.snapshot.params.orderId;
    this.orderService.getOrder(id).subscribe(data=>{
      this.currentOrder=data;
    },err=>{
      console.log(err);
    });
  }

  submitPayment(value) {
    let payment=new PaymentModel()
    payment.cardNumber=value.cardNumber;
    payment.cardType=value.type;
    payment.order=this.currentOrder;
    this.http.post(this.catalogueService.host+"/payment",payment)
      .subscribe(data=>{
        console.log("success")
        this.router.navigateByUrl("");
      },error => {
        console.log(error);
      });
   }
}
