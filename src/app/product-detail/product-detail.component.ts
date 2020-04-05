import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLinkActive} from '@angular/router';
import {CatalogueService} from '../services/catalogue.service';
import {ProductModel} from '../model/product.model';
import {AuthenticationService} from '../services/authentication.service';
import {HttpEventType, HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  public mode=0;
  public currentProduct: ProductModel;
  public editPhoto: boolean=false;
  private selectedFiles: any;
  private progress: any;
  private currentFileUpload: any;
  private timestamp: number;
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    public catalogueService:CatalogueService,
    private authService:AuthenticationService
  ) { }

  ngOnInit(): void {
    let url=atob(this.route.snapshot.params.url);
    this.catalogueService.getProduct(url).subscribe(data=>{
      this.currentProduct=data;
    },err=>{
      console.log(err);
    });
  }


  onAddProductToCaddy(currentProduct: ProductModel) {

  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  onUpdateProduct(value: FormData) {
    let url=this.currentProduct._links.self.href;
    this.catalogueService.patchResource(url,value)
      .subscribe(data=>{
        this.currentProduct=<ProductModel>data;
        this.mode=0;
      },err=>{
        console.log(err);
      });
  }

  onEditPhoto(currentProduct: ProductModel) {
    this.editPhoto == false ? this.editPhoto=true : this.editPhoto=false;
  }

  onSelectedFile(event) {
    this.selectedFiles = event.target.files;
  }

  uploadPhoto() {
    this.progress = 0;
    this.currentFileUpload = this.selectedFiles.item(0);
    this.catalogueService.uploadPhotoProduct(this.currentFileUpload, this.currentProduct.id).subscribe(event => {
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
}
