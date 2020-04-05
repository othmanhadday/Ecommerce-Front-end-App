import {Component, OnInit} from '@angular/core';
import {ClientsModel} from '../model/Clients.Model';
import {AuthenticationService} from '../services/authentication.service';
import {OrderService} from '../services/order.service';
import {CaddyService} from '../services/caddy.service';
import {OrderModel} from '../model/Order.model';
import {CaddyModel} from '../model/Caddy.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  public mode = 0;
  public order: OrderModel;
  public style = 'bg-default';

  constructor(
    private authService: AuthenticationService,
    public orderService: OrderService,
    public caddyService: CaddyService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    if (!this.caddyService.onLoadCaddyFromLocalStrorage(this.authService.userAuthenticated.username)) {
      this.router.navigateByUrl('');
    } else {
      this.order = this.orderService.order;
    }
  }

  onSaveClient(client: ClientsModel) {
    client.username = this.authService.userAuthenticated.username;
    this.orderService.setClient(client);
    this.caddyService.setClient(client);
    this.orderService.loadProductFromCaddy();
    this.mode = 1;
  }

  onOrder() {
    this.orderService.submitOrder().subscribe(data => {
      this.order.id = data['id'];
      this.order.date = data['date'];
      this.style = 'bg-success';
      localStorage.removeItem('Caddy_' + this.authService.userAuthenticated.username);
      this.caddyService.caddy = new CaddyModel();
      this.orderService.order=new OrderModel();
    }, err => {
      console.log(err);
    });
  }

  onPayOrder(id: number) {
    this.router.navigateByUrl('/payment/' + id);
  }
}
