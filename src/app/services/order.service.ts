import {Injectable} from '@angular/core';
import {ClientsModel} from '../model/Clients.Model';
import {OrderModel} from '../model/Order.model';
import {CaddyService} from './caddy.service';
import {HttpClient} from '@angular/common/http';
import {CatalogueService} from './catalogue.service';
import {AuthenticationService} from './authentication.service';
import {Observable} from 'rxjs';
import {PaymentModel} from '../model/payment.model';
import {ProductItem} from '../model/ProductItem';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  ordersClient: Array<OrderModel>;
  public order;

  constructor(
    private caddyService: CaddyService,
    private authenticationService: AuthenticationService,
    private http: HttpClient,
    private catalogueService: CatalogueService
  ) {
    this.order = new OrderModel();
    this.ordersOfClent();
  }

  setClient(client: ClientsModel) {
    this.order.client = client;
  }

  loadProductFromCaddy() {
    this.order.products = [];
    for (let item of this.caddyService.getCaddy().items.values()) {
      this.order.products.push(item);
    }
  }

  totalCommande() {
    let total = 0;
    for (let item of this.order.products.values()) {
      total += item.price * item.quantity;
    }
    return total;
  }

  submitOrder() {
    return this.http.post<OrderModel>(this.catalogueService.host + '/orders', this.order);
  }

  public getOrder(id) {
    return this.http.get<OrderModel>(this.catalogueService.host + '/orders/' + id);
  }

  public ordersOfClent() {
    this.ordersClient = [];
    this.http.get(this.catalogueService.host +
      '/orders/search/orderOfClient?username=' + this.authenticationService.userAuthenticated.username)
      .subscribe(data => {
        // @ts-ignore
        for (let o of data._embedded.orders) {
          this.payment(o._links.payment.href).subscribe(data => {
            o.payment = data;
          }, error => {
            o.payment = undefined;
          });
          this.client(o._links.client.href).subscribe(data => {
            o.client = data;
          });
          this.http.get(o._links.orderItems.href).subscribe(data => {
            let tb: ProductItem[] = [];
            // @ts-ignore
            for (let oi of data._embedded.orderItems) {
              this.http.get(oi._links.product.href).subscribe(data => {
                let pi: ProductItem = new ProductItem();
                // @ts-ignore
                pi.id = data.id;
                // @ts-ignore
                pi.name = data.name;
                pi.quantity = oi.quantity;
                // @ts-ignore
                pi.price = data.currentPrice;
                if (pi != null) {
                  tb.push(pi);
                }
              });
              o.products = tb;
            }
          });
          this.ordersClient.push(o);
        }
      });
    return this.ordersClient;
  }

  public payment(url): Observable<PaymentModel> {
    return this.http.get<PaymentModel>(url);
  }

  public client(url): Observable<ClientsModel> {
    return this.http.get<ClientsModel>(url);
  }

  public allOrders() {
    this.ordersClient = [];
    this.http.get(this.catalogueService.host +
      '/orders/search/allOrders')
      .subscribe(data => {
        // @ts-ignore
        for (let o of data._embedded.orders) {
          this.payment(o._links.payment.href).subscribe(data => {
            o.payment = data;
          }, error => {
            o.payment = undefined;
          });
          this.client(o._links.client.href).subscribe(data => {
            o.client = data;
          });
          this.http.get(o._links.orderItems.href).subscribe(data => {
            let tb: ProductItem[] = [];
            // @ts-ignore
            for (let oi of data._embedded.orderItems) {
              this.http.get(oi._links.product.href).subscribe(data => {
                let pi: ProductItem = new ProductItem();
                // @ts-ignore
                pi.id = data.id;
                // @ts-ignore
                pi.name = data.name;
                pi.quantity = oi.quantity;
                // @ts-ignore
                pi.price = data.currentPrice;
                if (pi != null) {
                  tb.push(pi);
                }
              });
              o.products = tb;
            }
          });
          this.ordersClient.push(o);
        }
      });
    return this.ordersClient;
  }
}
