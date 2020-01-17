import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'node_modules/ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User, Login } from 'src/app/models/user';
import { EngineService } from 'src/app/services/engine.service';
import { LanguageService } from 'src/app/services/language.services';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private router: Router,
    public translate: TranslateService,
    private toastr: ToastrService,
    public languageService: LanguageService
    
  ) { }

  laddaSubmitLoading = false;
  ngOnInit() {
    this.resetForm();
  }
  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
  }
  loginUser() {
    this.laddaSubmitLoading = true;
    this.authService.login().toPromise().then(res=> {
      if (res["token"] != null) {
        this.authService.currentUser.Token = res["token"];
        localStorage.setItem('currentUser', JSON.stringify(this.authService.currentUser));
        localStorage.setItem('userToken', JSON.stringify(res["token"]));
        this.authService.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.router.navigateByUrl('mainView');
      }
      else {
        this.toastr.warning('Incorrect password or username', 'Login failed!');
        console.log(res["errors"]);
      }
      this.laddaSubmitLoading = false;
    }).catch(err=>{
      this.toastr.error(err.message,err.statusText+': '+err.status);
    });
    ;
  }




}
