import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthsComponent } from './auths.component';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LaddaModule } from 'node_modules/angular2-ladda';
import { ToastrModule } from 'ngx-toastr';
import {HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { LanguageService } from 'src/app/core/services/language.service';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  imports: [
    AuthRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule,
    HttpClientModule,

  ],
  declarations: [AuthsComponent,LoginComponent],
  providers:[]
})
export class AuthsModule { }
