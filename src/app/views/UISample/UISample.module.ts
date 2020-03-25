import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartUploadComponent } from './smart-upload/smart-upload.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { SmartSelectComponent } from './smart-select/smart-select.component';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [SmartUploadComponent, SmartSelectComponent],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [SmartUploadComponent, SmartSelectComponent]
})
export class UISampleModule { }
