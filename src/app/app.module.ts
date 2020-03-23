import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthsModule } from './views/auths/auths.module';
import { AuthGuard } from './core/guards/auth.guard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthInterceptor } from './core/helpers/AuthInterceptor';
import { SharedModule } from './core/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PagesModule } from './views/pages/pages.module';
import { StoreService } from './core/services/store.service';
import { AuthService,BomService,ContrackService,CustomerService,FactoryService,ItemService,ItemTypePropertyService,ItemTypeService,MonitorService,MonitorStandarService,ProcessService,UnitService,WareHouseService } from  './core/services';
import { ThemeModule } from './theme/theme.module';

const SERVICE = [
  AuthService,
  BomService,
  ContrackService,
  CustomerService,
  FactoryService,
  ItemService,
  ItemTypePropertyService,
  ItemTypeService,
  MonitorService,
  MonitorStandarService,
  ProcessService,
  UnitService,
  WareHouseService
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    ThemeModule,
    PagesModule,
    AuthsModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AuthGuard,
    StoreService,
    ...SERVICE
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
