import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import { ToastrService } from 'node_modules/ngx-toastr';
import { LanguageService } from 'src/app/core/services/language.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  laddaSubmitLoading = false;
  rememberMe = false;
  constructor(public authService: AuthService,
    private router: Router,
    private routeActive: ActivatedRoute,
    public translate: TranslateService,
    private toastr: ToastrService,
    public languageService: LanguageService) {
     }

  ngOnInit() {
    this.resetForm();
  }
  resetForm(form?: NgForm) {
    let rememberUser =  localStorage.getItem('rememberUser');
    if(rememberUser!=null && rememberUser!=""){
      this.authService.currentUser.Username =JSON.parse(rememberUser).username
      this.authService.currentUser.Password =JSON.parse(rememberUser).password
    }
    if (form != null)
      form.resetForm();
  }
  loginUser() {
    this.laddaSubmitLoading = true;
    this.authService.login().toPromise().then(res=> {
      if (res["Token"] != null) {
        this.authService.currentUser.Token = res["Token"];
        localStorage.setItem('currentUser', JSON.stringify(this.authService.currentUser));
        localStorage.setItem('userToken', JSON.stringify(res["Token"]));
        this.authService.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        //remember me
        if(this.rememberMe){
          let dataUser = {
            username:this.authService.currentUser.Username,
            password:this.authService.currentUser.Password
          };
          localStorage.setItem('rememberUser',JSON.stringify(dataUser));
        }
        else{
          localStorage.setItem('rememberUser',"");
        }
        //navigate
        const returnUrl = this.routeActive.snapshot.queryParams.returnUrl;
        if (returnUrl !== '' && returnUrl != null) {
          this.router.navigate([returnUrl]);
        } else { this.router.navigate(['/pages']); }


      }
      else {
        //this.toastr.warning('Incorrect password or username', 'Login failed!');
        this.toastr.warning(this.translate.instant("messg.login.failed"),this.translate.instant("messg.login.caption"))
        // console.log(res["Errors"]);
        // this.router.navigate(['/register']);
      }
      this.laddaSubmitLoading = false;
    }).catch(err=>{
      this.toastr.error(err.message,err.statusText+': '+err.status);
      this.laddaSubmitLoading = false;
    });
    ;
  }
}
