import {Component, OnInit} from '@angular/core';
import {CatalogueService} from './services/catalogue.service';
import {Router} from '@angular/router';
import {AuthenticationService} from './services/authentication.service';
import {CaddyService} from './services/caddy.service';
import {CaddyModel} from './model/Caddy.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public categories;
  public currentCat;

  constructor(
    private catalogueService:CatalogueService,
    private router:Router,
    public authService:AuthenticationService,
    public  caddyService:CaddyService
  ) {
  }

  ngOnInit(): void {
    this.authService.loadAutheticatedUserFromLocalStorage();
    this.getCategories();
  }

  private getCategories() {
    this.catalogueService.getResource("/categories")
      .subscribe(data=>{
        this.categories=data;
      },err=>{
        console.log(err)
      });
  }

  getProductByCat(c) {
    this.currentCat=c;
    this.router.navigateByUrl("/products/2/"+c.id);
  }

  onSelectedProduct() {
    this.router.navigateByUrl("/products/1/0");
    this.currentCat=undefined;
  }

  onProductsPromo() {
    this.router.navigateByUrl("/products/3/0");
    this.currentCat=undefined;
  }

  onProductsDispo() {
    this.router.navigateByUrl("/products/4/0");
    this.currentCat=undefined;
  }

  onLogout() {
    this.authService.removeTokenFromLocalStorage();
    this.caddyService.caddy=new CaddyModel();
    this.router.navigateByUrl("/login");
  }
}
