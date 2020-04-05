import { Component, OnInit } from '@angular/core';
import {CompteModel} from '../model/compte.model';
import {AuthenticationService} from '../services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  pwdError: any;
  authError: any;

  constructor(
    private authenticationService:AuthenticationService,
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  createUser(compte) {
    if(compte.name && compte.username && compte.email &&compte.password && compte.confirmPassword){
      if(compte.password.length<6){
        this.pwdError="your password must have more than 6 lettres"
      }else {
        this.pwdError="";
        if(compte.password == compte.confirmPassword){
          this.authenticationService.registerNewCompte(compte)
            .subscribe(data=>{
              this.router.navigateByUrl('/login');
              console.log(data);
            },error => {
              this.authError="UserName or Email are already saved!! Change email or username";
            })
        }else {
          this.pwdError="Password not Compatible";
        }
      }
    }else {
      this.authError="Fill all your information"
    }


  }
}
