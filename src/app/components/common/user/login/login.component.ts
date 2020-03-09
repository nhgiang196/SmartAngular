import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'node_modules/ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User, Login } from 'src/app/models/user';
import { EngineService } from 'src/app/services/engine.service';
import { LanguageService } from 'src/app/services/language.services';
declare let $: any;
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
    $('.modal').modal('hide');
  }
  loginUser() {
    this.laddaSubmitLoading = true;
    this.authService.login().toPromise().then(res=> {
      if (res["Token"] != null) {
        this.authService.currentUser.Token = res["Token"];
        localStorage.setItem('currentUser', JSON.stringify(this.authService.currentUser));
        localStorage.setItem('userToken', JSON.stringify(res["Token"]));
        this.authService.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.router.navigateByUrl(localStorage.getItem('rememberLastUrl') ||  'mainView');
        localStorage.removeItem('rememberLastUrl');
        this.laddaSubmitLoading = false;
      }
      else {
        //this.toastr.warning('Incorrect password or username', 'Login failed!');
        this.laddaSubmitLoading = false;
        this.toastr.warning(this.translate.instant("messg.login.failed"),this.translate.instant("messg.login.caption"))
        // console.log(res["Errors"]);
        // this.router.navigate(['/register']);
      }
    }).catch(err=>{
      this.toastr.error(err.message,err.statusText+': '+err.status);
      this.laddaSubmitLoading = false;
    });
    ;
  }


}
