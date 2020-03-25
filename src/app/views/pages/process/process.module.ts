import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessComponent } from './process.component';
import { ProcessRoutingModule } from './process-routing.module';
import { MainViewProcessComponent } from './main-view-process/main-view-process.component';
import { ProcessLogComponent } from './process-log/process-log.component';
import { ProcessPlanComponent } from './process-plan/process-plan.component';


const COMPONENTS =[
  ProcessComponent,
  MainViewProcessComponent,
  ProcessLogComponent,
  ProcessPlanComponent
]
@NgModule({
  imports: [
    ProcessRoutingModule,
    CommonModule
  ],
  declarations: [...COMPONENTS]
})
export class ProcessModule { }
