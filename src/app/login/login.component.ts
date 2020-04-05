import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {Router} from '@angular/router';
import {CaddyService} from '../services/caddy.service';
import {CaddyModel} from '../model/Caddy.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginError=""
  constructor(
    public authService:AuthenticationService,
    public router:Router,
    public caddyService:CaddyService) { }

  ngOnInit(): void {
  }

  onLogin(formData:any) {
    this.authService.login(formData.username,formData.password);
    if(this.authService.authenticated==false){
      this.loginError="Username or password incorrect";
    } else {
      this.authService.saveAuthenticatedUser();
      this.caddyService.caddy=this.caddyService.onLoadCaddyFromLocalStrorage(formData.username);
      if (!this.caddyService.caddy){
        this.caddyService.caddy=new CaddyModel();
      }
      this.router.navigateByUrl('');
    }
  }
}
