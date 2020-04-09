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
import { DxButtonModule, DxDataGridModule, DxPopupModule, DxCheckBoxModule, DxValidationGroupModule, DxFormModule } from 'devextreme-angular';

import { UserIdleModule } from 'angular-user-idle';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      },
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
    DxCheckBoxModule,
    DxValidationGroupModule,
    DxFormModule,
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
    UserIdleModule,
    DxPopupModule,
    DxCheckBoxModule,
    DxValidationGroupModule,
    DxFormModule,
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
