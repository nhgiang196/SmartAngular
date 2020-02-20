import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-reset-password',
  templateUrl: './user-reset-password.component.html',
  styleUrls: ['./user-reset-password.component.css']
})
export class UserResetPasswordComponent implements OnInit {
  Password: '';
  ConfirmPassword: '';
  Token: any;
  Email:''
  laddaSubmitLoading = false;

  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {this.Token = params.token, this.Email = params.email});
    console.log(decodeURI(this.Token));
  }
  resetPassword() {
    this.laddaSubmitLoading = true;
    let ResetObj = {
      Token: this.replaceStr(this.Token),
      Password: this.Password,
      Email: this.Email
    }
    console.log(ResetObj);
    this.authService.resetPassword(ResetObj).subscribe(res => this.laddaSubmitLoading=false, err => this.laddaSubmitLoading=false );
  }
  replaceStr = (source)=> source.replace('%20','+','%2F','/');

}
