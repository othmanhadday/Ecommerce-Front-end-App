import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProductModel} from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {
  public host:string="http://localhost:8080";

  constructor(public http:HttpClient){}

  public getResource(url){
    return this.http.get(this.host+url);
  }

  public getProduct(url):Observable<ProductModel>{
    return this.http.get<ProductModel>(url);
  }

  public uploadPhotoProduct(file:File,idProduct):Observable<HttpEvent<{}>>{
    let formData:FormData=new FormData();
    formData.append('file',file);
    const req = new HttpRequest('POST' , this.host+'/uploadPhoto/'+idProduct,formData,{
      reportProgress:true,
      responseType:'text'
    });
    return this.http.request(req);
  }

  patchResource(url: string, value: FormData) {
    return this.http.patch(url,value);
  }
}
