import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessComponent } from './process.component';
import { ProcessRoutingModule } from './process-routing.module';
import { MainViewProcessComponent } from './main-view-process/main-view-process.component';

@NgModule({
  imports: [
    ProcessRoutingModule,
    CommonModule
  ],
  declarations: [ProcessComponent,MainViewProcessComponent]
})
export class ProcessModule { }
