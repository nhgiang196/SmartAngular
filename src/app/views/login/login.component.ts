import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'node_modules/ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
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
     var objectUser = {
      Username: 'WHATEVER_USER',
      Password: 'WHATEVER_USER',
      Token: 'WHATEVER_USER',
      Email: 'WHATEVER_USER',
      Specification: 'WHATEVER_USER',
      Department : 'WHATEVER_USER',
      Position : 'WHATEVER_USER',
      Nickname : 'WHATEVER_USER'
    };
    localStorage.setItem('currentUser',JSON.stringify(objectUser)  );
    this.authService.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.router.navigateByUrl('mainView');


    // this.authService.login().subscribe((res: any) => {
    //   let current:User = res as User
    //   if (res.Username != null) {
    //     localStorage.setItem('currentUser', JSON.stringify(current));
    //     this.authService.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //     this.router.navigateByUrl('mainView');
    //   }
    //   else {
    //     this.toastr.warning('Incorrect password or username', 'Login failed!');
    //   }
    // });
  }
}
