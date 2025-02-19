import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthsModule } from './views/auths/auths.module';
import { AuthGuard } from './core/guards/auth.guard';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthInterceptor } from './core/helpers/AuthInterceptor';
import { SharedModule } from './core/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PagesModule } from './views/pages/pages.module';
import { StoreService } from './core/services/general/store.service';
import {
  AuthService,
  BomService,
  CustomerService,
  FactoryService,
  ItemService,
  ItemTypePropertyService,
  ItemTypeService,
  MonitorService,
  MonitorStandarService,
  ProcessLogService,
  // ProcessPlanFactoryService,
  UnitService,
  WareHouseService,
  ModuleService,
  FunctionService,
  ContractService
} from  './core/services';
import { ThemeModule } from './theme/theme.module';
import { RoutesResolver } from './core/resolvers/routes.resolver';
import { UISampleModule } from './views/UISample/UISample.module';
import { ItemResolver } from './core/resolvers/item.resolver';
import { FileService } from './core/services/file.service';
import { DevextremeService } from './core/services/general/devextreme.service';
import { GenericFactoryService } from './core/services/general/generic-factory.service';
import { Unit } from './core/models/unit';
import { MyHelperService } from './core/services/utility/my-helper.service';
import { ProcessLogItemService } from './core/services/process-log-item.service';
import { NotifyService } from './core/services/utility/notify.service';
const SERVICE = [
  AuthService,
  BomService,
  ContractService,
  CustomerService,
  FactoryService,
  ItemService,
  ItemTypePropertyService,
  ItemTypeService,
  MonitorService,
  MonitorStandarService,
  ProcessLogService,
  // ProcessPlanFactoryService,
  ProcessLogItemService,
  UnitService,
  WareHouseService,
  ModuleService,
  FunctionService,
  FileService,
  ProcessLogService,
  DevextremeService,
  NotifyService
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
    UISampleModule,
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
    RoutesResolver,
    ItemResolver,
    ...SERVICE
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
