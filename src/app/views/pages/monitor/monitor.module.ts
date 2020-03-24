import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitorComponent } from './monitor.component';
import { MainViewMonitorComponent } from './main-view-monitor/main-view-monitor.component';
import { MonitorRoutingModule } from './monitor-routing.module';

@NgModule({
  imports: [
    MonitorRoutingModule,
    CommonModule
  ],
  declarations: [MonitorComponent,MainViewMonitorComponent]
})
export class MonitorModule { }
