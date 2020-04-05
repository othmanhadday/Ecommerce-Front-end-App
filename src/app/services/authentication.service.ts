import {Injectable} from '@angular/core';
import {CaddyService} from './caddy.service';
import {HttpClient} from '@angular/common/http';
import {CompteModel} from '../model/compte.model';
import {CatalogueService} from './catalogue.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

   public users;
   authenticated: boolean;
   userAuthenticated;
   token:string;

  constructor(
    private catalogueService:CatalogueService,
    private http:HttpClient
  ) {
    // if(this.authenticated){
    //   this.loadAutheticatedUserFromLocalStorage();
    // }
    this.getAllUsers().subscribe(data=>{
      this.users=data;
    },err=>{
      console.log(err);
    });
  }

  public login(username: string, password: string) {
    let user:CompteModel;
    this.users._embedded.comptes.forEach(u => {
      if (u.username == username && u.password == password) {
        user = u;
        this.token=btoa(JSON.stringify(user));
      }
    });
    if (user) {
      this.authenticated = true;
      this.userAuthenticated = user;
    } else {
      this.authenticated = false;
      this.userAuthenticated = undefined;
    }
  }

  public isAdmin() {
    if (this.userAuthenticated) {
      if (this.userAuthenticated.admin == true) {
        return true;
      }
      return false;
    }
  }
  isAuthenticated():boolean{
    return this.authenticated;
  }

  public saveAuthenticatedUser() {
    if (this.userAuthenticated) {
      localStorage.setItem('authToken', this.token);
    }
  }

  public loadAutheticatedUserFromLocalStorage(){
    let t=localStorage.getItem("authToken");
    if (t){
      let user=JSON.parse(atob(t));
      this.userAuthenticated=user;
      this.authenticated=true;
    }
  }

  public removeTokenFromLocalStorage(){
    this.authenticated=false;
    this.token=undefined;
    this.userAuthenticated=undefined;
    localStorage.removeItem('authToken');
  }

  registerNewCompte(compte: CompteModel) {
    return this.http.post(this.catalogueService.host+"/comptes",compte);
  }
  getAllUsers(){
    return this.http.get(this.catalogueService.host+"/comptes");
  }
}
