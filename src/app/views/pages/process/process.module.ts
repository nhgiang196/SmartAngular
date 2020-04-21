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
import { ProcessPlanActionComponent } from './process-plan/process-plan-action/process-plan-action.component';
import { ProcessLogDetailComponent } from './process-log/process-log-detail/process-log-detail.component';
import {A2Edatetimepicker} from 'ng2-eonasdan-datetimepicker';
import { ProcessLogItemComponent } from './process-log/process-log-item/process-log-item.component';

const COMPONENTS =[
  ProcessComponent,
  MainViewProcessComponent,
  ProcessLogComponent,
  ProcessPlanComponent,
  ProcessPlanActionComponent,
  ProcessLogDetailComponent,
  ProcessLogItemComponent
]
@NgModule({
  imports: [
    ProcessRoutingModule,
    SharedModule,
    CommonModule,
    FormsModule,
    UISampleModule,
    DxSwitchModule,
    ModalModule.forRoot(),
    A2Edatetimepicker,
    DxDateBoxModule
  ],
  declarations: [...COMPONENTS]
})
export class ProcessModule { }
