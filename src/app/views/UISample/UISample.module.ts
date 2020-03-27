import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartUploadComponent } from './smart-upload/smart-upload.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { SmartSelectComponent } from './smart-select/smart-select.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SmartSelectBoxComponent } from './smart-select-box/smart-select-box.component';
import { DxSelectBoxModule } from 'devextreme-angular';



@NgModule({
  declarations: [SmartUploadComponent, SmartSelectComponent, SmartSelectBoxComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    DxSelectBoxModule
  ],
  exports: [DxSelectBoxModule,
    SmartUploadComponent, SmartSelectComponent, SmartSelectBoxComponent, ]
})
export class UISampleModule { }
