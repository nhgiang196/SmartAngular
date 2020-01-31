import { NgModule } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { RolesComponent } from './roles/roles.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RegisterComponent, ResetpasswordComponent, RolesComponent],
  imports: [
    SharedModule
  ]
})
export class AdminModule { }
