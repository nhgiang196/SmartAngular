import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartSelectComponent } from './smart-select/smart-select.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SmartUploadComponent } from './smart-upload/smart-upload.component';
import { SmartTableComponent } from './smart-table/smart-table.component';

@NgModule({
  declarations: [SmartSelectComponent, SmartUploadComponent, SmartTableComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [SmartSelectComponent, SmartUploadComponent, SmartTableComponent],
})
export class UiSampleModule { }

