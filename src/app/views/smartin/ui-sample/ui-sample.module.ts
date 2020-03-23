import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartSelectComponent } from './smart-select/smart-select.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SmartUploadComponent } from './smart-upload/smart-upload.component';
import { SmartTableComponent } from './smart-table/smart-table.component';
import { DxFormModule, DxDataGridModule, DxListModule, DxDropDownBoxModule, DxTagBoxModule, DxSelectBoxModule, DxButtonModule, DxCheckBoxModule } from 'devextreme-angular';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [SmartSelectComponent, SmartUploadComponent, SmartTableComponent],
  imports: [
    CommonModule,
    SharedModule,
    DxFormModule ,
    DxDataGridModule,
    DxListModule,
    DxDropDownBoxModule,
    DxTagBoxModule,
    DxSelectBoxModule,
    DxButtonModule,
    DxCheckBoxModule,
    HttpClientModule,
    
  ],
  exports: [SmartSelectComponent, SmartUploadComponent, SmartTableComponent],
})
export class UiSampleModule { }

