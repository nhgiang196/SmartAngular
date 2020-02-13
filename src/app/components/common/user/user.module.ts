import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { UserResetPasswordComponent } from './user-reset-password/user-reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [LoginComponent, ChangePasswordComponent, UpdateProfileComponent, ProfileComponent, UserResetPasswordComponent, ForgotPasswordComponent],
  imports: [
    SharedModule
  ]
})
export class UserModule { }
