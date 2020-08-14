import { Register } from './../../model/user';
import { Router } from '@angular/router';
import { LoginServiceService } from './../../service/login-service/login-service.service';
import { Component, OnInit,HostListener } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormGroupName, FormBuilder} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export class MyPassErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted)) && control.parent.errors && control.parent.errors['notSame'];
  }
}

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.styl']
})
export class RegisterPageComponent implements OnInit {

  showSpinner = false;

  userNameContr = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.pattern('[a-zA-Z]*')
  ]);

  firstPassContr = new FormControl('', [
    Validators.required,
    Validators.minLength(7),
  ]);

  secPassContr = new FormControl('', [
    Validators.required,
    Validators.minLength(7),
  ]);

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  form = new FormGroup({});

  matcher = new MyErrorStateMatcher();
  passMatcher = new MyPassErrorStateMatcher();

  checkPasswords(group: FormGroup) {
    const firstPass = group.get('firstPass').value;
    const secPass = group.get('secPass').value;
    return firstPass === secPass ? null : { notSame: true };
  }

  constructor(
    private loginService: LoginServiceService,
    private router: Router,
    private fb: FormBuilder) {
      this.form = fb.group(
        {
          username: this.userNameContr,
          firstPass: this.firstPassContr,
          secPass: this.secPassContr,
          email: this.emailFormControl
        },
        {
          validators: this.checkPasswords
        });
    }

  ngOnInit() {}

  reset() {
    this.form.reset();
    this.router.navigate([""]);
  }

  register() {
    this.showSpinner = true;
    const newUser = new Register(this.form.get('username').value, this.form.get('firstPass').value, this.form.get('email').value);
    this.loginService.register(newUser)
    .then((res) => {
      if (res){
        this.router.navigate([""]);
      } else {
        alert("Something went wrong during register");
      }
    })
    .catch((err) => {
      alert("Wrong Username or Password or Mail");
    }).finally(() => {
      this.showSpinner = false;
    });
  }

}
