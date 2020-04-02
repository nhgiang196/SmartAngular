import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from '../services/language.service';
import { LaddaModule } from 'angular2-ladda';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule, PopoverModule, TimepickerModule, PaginationModule } from 'ngx-bootstrap';
import { DxButtonModule, DxDataGridModule, DxPopupModule } from 'devextreme-angular';

import { UserIdleModule } from 'angular-user-idle';

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
      },
      defaultLanguage: localStorage.getItem('locallanguage')
    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true
    }),
    LaddaModule.forRoot({}),
    NgxDropzoneModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    PopoverModule.forRoot(),
    TimepickerModule.forRoot(),
    PaginationModule.forRoot(),
    DxButtonModule,
    DxDataGridModule,
    UserIdleModule.forRoot({ idle: 600, timeout: 5, ping: 300 }),


  ],
  exports: [
    TranslateModule,
    ToastrModule,
    LaddaModule,
    NgxDropzoneModule,
    NgSelectModule,
    BsDatepickerModule,
     PopoverModule,
    TimepickerModule,
    PaginationModule,
    DxButtonModule,
    DxDataGridModule,
    DxPopupModule,
    UserIdleModule
  ],
  providers: [
    LanguageService
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    }
  }
}
