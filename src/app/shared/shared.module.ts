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
import { BsDatepickerModule , PopoverModule, TimepickerModule } from 'ngx-bootstrap/';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    DataTablesModule,
    FormsModule,
    NgSelectModule,
    SweetAlert2Module.forRoot(),
    BsDatepickerModule.forRoot(),
    PopoverModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  exports: [
    TranslateModule,
    FormsModule,
    DataTablesModule,
    NgSelectModule,
    SweetAlert2Module,
    BsDatepickerModule,
    PopoverModule,
    TimepickerModule
  ]

})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    }
  }
}
