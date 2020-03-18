import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BsDatepickerModule, PopoverModule, TimepickerModule, PaginationModule } from 'ngx-bootstrap/';
import { LaddaModule } from 'node_modules/angular2-ladda';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { UserIdleModule } from 'angular-user-idle';
import { NgwWowModule } from 'ngx-wow';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MomentModule } from 'ngx-moment';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgxMaskModule, IConfig } from 'ngx-mask'

import { Select2Module } from 'ng2-select2';
import { ChartsModule } from 'ng2-charts';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}



@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    NgwWowModule,
    // Optionally you can set time for `idle`, `timeout` and `ping` in seconds.
    // Default values: `idle` is 600 (10 minutes), `timeout` is 300 (5 minutes)
    // and `ping` is 120 (2 minutes).
    UserIdleModule.forRoot({ idle: 600, timeout: 5, ping: 300 }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true
    }),
    NgxDropzoneModule,
    DataTablesModule,
    NgSelectModule,
    LaddaModule.forRoot({
    }),
    SweetAlert2Module.forRoot(
      {
        buttonsStyling: false,
        customClass: 'sweet-alert',
        confirmButtonClass: 'btn btn-primary',
        cancelButtonClass: 'btn'
      }
    ),
    BsDatepickerModule.forRoot(),
    PopoverModule.forRoot(),
    TimepickerModule.forRoot(),
    MomentModule.forRoot(),
    SlickCarouselModule,
    ChartsModule,
    PaginationModule.forRoot(),
    NgxMaskModule.forRoot(),

  ],
  exports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    CommonModule,
    UserIdleModule,
    BrowserAnimationsModule,
    NgwWowModule,
    TranslateModule,
    DataTablesModule,
    NgSelectModule,
    SweetAlert2Module,
    BsDatepickerModule,
    PopoverModule,
    TimepickerModule,
    ToastrModule,
    LaddaModule,
    MomentModule,
    NgxDropzoneModule,
    AutocompleteLibModule,
    Select2Module,
    SlickCarouselModule,
    ChartsModule,
    PaginationModule,
    NgxMaskModule

  ]

})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    }
  }
}
