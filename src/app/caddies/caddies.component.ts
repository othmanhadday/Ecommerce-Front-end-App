import {Component, OnInit} from '@angular/core';
import {CaddyService} from '../services/caddy.service';
import {CaddyModel} from '../model/Caddy.model';
import {AuthenticationService} from '../services/authentication.service';
import {Router} from '@angular/router';
import {ProductItem} from '../model/ProductItem';

@Component({
  selector: 'app-caddies',
  templateUrl: './caddies.component.html',
  styleUrls: ['./caddies.component.css']
})
export class CaddiesComponent implements OnInit {
  caddy:CaddyModel;
  public items;
  constructor(
    public caddyService: CaddyService,
    public authService: AuthenticationService,
    private router: Router
  ) {

  }

  ngOnInit() {
    if (this.authService.isAuthenticated()){
      this.caddy=this.caddyService.getCaddy();
      this.items= this.caddy.items;
    }else {
      this.router.navigateByUrl("/login");
    }
  }

  removeProductfromCaddy(value) {
    this.caddyService.RemoveProductFromCaddy(value.id);
  }

  onNewOreder() {
      this.router.navigateByUrl('/client');
  }
}
