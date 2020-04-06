import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessComponent } from './process.component';
import { ProcessRoutingModule } from './process-routing.module';
import { MainViewProcessComponent } from './main-view-process/main-view-process.component';
import { ProcessLogComponent } from './process-log/process-log.component';
import { ProcessPlanComponent } from './process-plan/process-plan.component';
import { DxSwitchModule, DxSelectBoxModule, DxCheckBoxModule, DxTextBoxModule, DxDateBoxModule, DxButtonModule, DxValidatorModule, DxFormModule, DxValidationSummaryModule, DxDataGridModule } from 'devextreme-angular';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { UISampleModule } from '../../UISample/UISample.module';
import { ModalModule } from 'ngx-bootstrap';


const COMPONENTS =[
  ProcessComponent,
  MainViewProcessComponent,
  ProcessLogComponent,
  ProcessPlanComponent
]
@NgModule({
  imports: [
    ProcessRoutingModule,
    CommonModule,
    FormsModule,
    SharedModule,
    UISampleModule,
    DxSwitchModule,
    ModalModule.forRoot(),
  ],
  declarations: [...COMPONENTS]
})
export class ProcessModule { }
