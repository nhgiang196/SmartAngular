import { Component, OnInit } from '@angular/core';
import { NgForm , Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User,RegisterAccount} from 'src/app/models/user';
import { TranslateService } from '@ngx-translate/core';
import { WindowService } from 'ngx-wow';
import { timeout } from 'rxjs/operators';
import { setTimeout } from 'timers';


@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private trans: TranslateService
  ) {
    
   }

   /****************************************** DECLARATION *******************************************/
   regUser: RegisterAccount;
   laddaSubmitLoading : boolean;
   userForm : NgForm;
   /****************************************** DECLARATION *******************************************/


  ngOnInit() {
    this.resetForm(this.userForm);
  }
  resetForm(form?: NgForm) {
    if (form != null) form.resetForm();
    this.regUser =  {};
    this.laddaSubmitLoading = false;
  }

  registerSubmit(){
    if (this.validateForm())
    console.log(this.regUser);
    this.authService.register(this.regUser).subscribe(res =>{
      debugger;
      console.log(res);
      if (res['errors']!=null)
      {
        let errTitle= this.trans.instant('Register.ErrorSubmit');
        this.toastr.error(res['errors'][0],errTitle);
        this.laddaSubmitLoading= false;
      }
      else 
      {
        let errTitle= this.trans.instant('Register.SuccessSubmit');
        this.toastr.success(errTitle);
        this.router.navigate(['/mainView']);
      }
    })
  }

  validateForm(){
      let e = this.regUser;
      if (e.Password.length<6)
      {
        this.toastr.warning(this.trans.instant('Register.Valid_PasswordLength'),this.trans.instant('Register.Validate'));
        return false;
      }
      if (e.ConfirmPassword != e.Password) 
      {
        this.toastr.warning(this.trans.instant('Register.Valid_ConfirmPasswork'),this.trans.instant('Register.Validate'));
        return false;
      }
      this.laddaSubmitLoading = true;
      return true;
  }

  

}
