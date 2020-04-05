import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProductsComponent} from './products/products.component';
import {LoginComponent} from './login/login.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {CaddiesComponent} from './caddies/caddies.component';
import {ClientComponent} from './client/client.component';
import {PaymentComponent} from './payment/payment.component';
import {RegisterComponent} from './register/register.component';
import {OrderModel} from './model/Order.model';
import {OrdersComponent} from './orders/orders.component';


const routes: Routes = [
  {path:"products/:p1/:p2",component:ProductsComponent},
  {path:"login",component:LoginComponent},
  {path:"register",component:RegisterComponent},
  {path:"product-detail/:url",component:ProductDetailComponent},
  {path:"caddies",component:CaddiesComponent},
  {path:"client",component:ClientComponent},
  {path:"orders",component:OrdersComponent},
  {path:"payment/:orderId",component:PaymentComponent},
  {path:"",redirectTo:'products/1/0',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
