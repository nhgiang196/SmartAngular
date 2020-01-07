import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgwWowModule } from 'ngx-wow';

import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { ToastrModule } from 'node_modules/ngx-toastr';
import { LayoutsModule } from './components/common/layouts/layouts.module';
import { AdminModule } from './components/common/admin/admin.module';
import { LoginComponent } from './views/login/login.component';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';
import { EngineService } from './services/engine.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EMCSModule } from './views/emcs/emcs.module';
import { UserIdleModule } from 'angular-user-idle';
import { MainViewModule } from './views/main-view/main-view.module';
import { SharedModule } from './shared/shared.module';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgwWowModule,
    FormsModule,
    AdminModule,
    MainViewModule,
    // Optionally you can set time for `idle`, `timeout` and `ping` in seconds.
    // Default values: `idle` is 600 (10 minutes), `timeout` is 300 (5 minutes)
    // and `ping` is 120 (2 minutes).
    UserIdleModule.forRoot({ idle: 600, timeout: 5, ping: 300 }),  
    SharedModule,
    //Views
    LayoutsModule,
    EMCSModule,

    SweetAlert2Module.forRoot(
      {
        buttonsStyling: false,
        customClass: 'sweet-alert',
        confirmButtonClass: 'btn btn-primary',
        cancelButtonClass: 'btn'
      }
    ),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true
    }),
    RouterModule.forRoot(ROUTES),
    TimepickerModule.forRoot()
  ],
  exports: [
    CommonModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, AuthGuard, AuthService, EngineService],
  bootstrap: [AppComponent]
})
export class AppModule { }
