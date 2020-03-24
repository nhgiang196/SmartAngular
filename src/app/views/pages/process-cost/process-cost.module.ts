import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessCostComponent } from './process-cost.component';
import { MainViewProcessCostComponent } from './main-view-process-cost/main-view-process-cost.component';
import { ProcessCostRoutingModule } from './process-cost-routing.module';

@NgModule({
  imports: [
    ProcessCostRoutingModule,
    CommonModule
  ],
  declarations: [ProcessCostComponent,MainViewProcessCostComponent]
})
export class ProcessCostModule { }
