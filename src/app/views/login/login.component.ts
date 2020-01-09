import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'node_modules/ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User, Login } from 'src/app/models/user';
import { EngineService } from 'src/app/services/engine.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private engineApi:EngineService
  ) { }
  ngOnInit() {
    this.resetForm();
  }
  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
  }
  loginUser() {
    this.authService.login().subscribe(res=> {
      debugger;
      if (res["token"] != null) {
        localStorage.setItem('currentUser', JSON.stringify(this.authService.currentUser));
        localStorage.setItem('userToken', JSON.stringify(res["token"]));
        this.authService.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.router.navigateByUrl('mainView');
      }
      else {
        this.toastr.warning('Incorrect password or username', 'Login failed!');
        console.log(res["errors"]);
      }
    });
  }
}
