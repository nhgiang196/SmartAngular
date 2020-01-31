import { Component, OnInit } from '@angular/core';
import { NgForm , Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User,RegisterAccount} from 'src/app/models/user';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    public translate: TranslateService,
    public languageService: LanguageService
  ) {
    
   }

   /****************************************** DECLARATION *******************************************/
   regUser: RegisterAccount;
   laddaSubmitLoading : boolean;
   regForm : NgForm;
   /****************************************** DECLARATION *******************************************/


  ngOnInit() {
    this.resetForm(this.regForm);
  }
  resetForm(form?: NgForm) {
    if (form != null) form.resetForm();
    this.regUser =  {};
    this.laddaSubmitLoading = false;
  }

  registerSubmit(){
    if (!this.validateForm()) return;
    this.authService.register(this.regUser).toPromise().then(res =>{
      if (res['errors']!=null)
      {
        let errTitle= this.translate.instant('Register.ErrorSubmit');
        this.toastr.warning(res['errors'][0],errTitle);
        this.laddaSubmitLoading= false;
      }
      else 
      {
        let errTitle= this.translate.instant('Register.SuccessSubmit');
        this.toastr.success(errTitle);
        this.router.navigate(['/mainView']);
      }
    }).catch(err=>{
      this.toastr.error(err.message,err.statusText+': '+err.status);
      this.laddaSubmitLoading= false;
    }
    );
  }

  validateForm(){
      let e = this.regUser;
      if (e.Password.length<6)
      {
        this.toastr.warning(this.translate.instant('Register.Valid_PasswordLength'),this.translate.instant('Register.Validate'));
        return false;
      }
      if (e.ConfirmPassword != e.Password) 
      {
        this.toastr.warning(this.translate.instant('Register.Valid_ConfirmPasswork'),this.translate.instant('Register.Validate'));
        return false;
      }
      this.laddaSubmitLoading = true;
      return true;
  }

  langChanged(value) {
    localStorage.setItem('locallanguage', value);
    this.translate.use(value);
    this.router.onSameUrlNavigation = 'reload';
  }



  

}
