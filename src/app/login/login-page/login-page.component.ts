import { Router } from '@angular/router';
import { LoginServiceService } from './../../service/login-service/login-service.service';
import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog'
import { User } from 'src/app/model/user';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.styl']
})
export class LoginPageComponent implements OnInit {

  showSpinner = false;
  username: string;
  password: string;
  constructor(private loginService: LoginServiceService,private router: Router) { }

  ngOnInit() {
  }
  login() {
    if (!this.username || !this.password) {
      alert("Empty Username or Password");
      return;
    }
    if (this.username.length < 3 || this.password.length < 3) {
      alert("Username or Password to short");
      return;
    }
    this.showSpinner = true;
    this.loginService.login(new User(this.username,this.password))
    .then((res) => {
      if (res){
        this.router.navigate([""]);
      } else {
        alert("Wrong Username or Password");
      }
    })
    .catch((err) => {
      console.log("Error while login: " + JSON.stringify(err));
      alert("Wrong Username or Password");
    }).finally(() => {
      this.showSpinner = false;
    });
  }

}
