import {Component, OnInit} from '@angular/core';
import {CatalogueService} from '../services/catalogue.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {HttpEventType, HttpRequest, HttpResponse} from '@angular/common/http';
import {AuthenticationService} from '../services/authentication.service';
import {ProductModel} from '../model/product.model';
import {CaddyService} from '../services/caddy.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  public products;
  public editPhoto: boolean;
  public currentProduct;
  private selectedFiles;
  public progress;
  private currentFileUpload;
  public title;
  public timestamp:number=0;


  constructor(
    public catService: CatalogueService,
    private route: ActivatedRoute,
    private router: Router,
    public authService:AuthenticationService,
    public caddyService:CaddyService
  ) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        let url = val.url;
        this.ProductsTypeRouter();
      }
    });
   this.ProductsTypeRouter();
  }

  public ProductsTypeRouter(){
    let p1 = this.route.snapshot.params.p1;
    if (p1 == 1) {
      this.title="Sélection";
      this.getProducts('/products/search/selectedProducts');
    } else if (p1 == 2) {
      let idCat = this.route.snapshot.params.p2;
      this.title="Produits de la categorie "+idCat;
      this.getProducts('/categories/' + idCat + '/products');
    }else if (p1 == 3) {
      this.title="Produits en promotion";
      this.getProducts('/products/search/promoProducts');
    }else if (p1 == 4) {
      this.title="Produits Disponible";
      this.getProducts('/products/search/dispoProducts');
    }else if (p1 == 5) {
      this.title="Recherche ...";
      this.getProducts('/products/search/dispoProducts');
    }
  }


  private getProducts(url) {
    this.catService.getResource(url)
      .subscribe(data => {
        this.products = data;
      }, err => {
        console.log(err);
      });
  }

  onEditPhoto(p) {
    this.currentProduct = p;
    this.editPhoto = true;
  }

  onSelectedFile(event) {
    this.selectedFiles = event.target.files;
  }

  uploadPhoto() {
    this.progress = 0;
    this.currentFileUpload = this.selectedFiles.item(0);
    this.catService.uploadPhotoProduct(this.currentFileUpload, this.currentProduct.id).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round(100 * event.loaded / event.total);
        console.log(this.progress);
      } else if (event instanceof HttpResponse) {
        this.timestamp=Date.now();
      }
    }, err => {
      alert('Problem de chargement !!!!');
    });
    this.selectedFiles=undefined;
  }

  getTs() {
    return this.timestamp;
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  onAddProductToCaddy(p: ProductModel) {
    if(this.authService.isAuthenticated()) {
      this.caddyService.addProductToCaddy(p,this.authService.userAuthenticated.username);
    }else {
      this.router.navigateByUrl("/login");
    }
  }

  onProductDetails(p: ProductModel) {
    let url = btoa(p._links.product.href);
    this.router.navigateByUrl("product-detail/"+url)
  }
}
