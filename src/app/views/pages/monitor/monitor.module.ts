import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitorComponent } from './monitor.component';
import { MainViewMonitorComponent } from './main-view-monitor/main-view-monitor.component';
import { MonitorRoutingModule } from './monitor-routing.module';
import { MonitorChartComponent } from './monitor-chart/monitor-chart.component';
import { MonitorFactoryDataComponent } from './monitor-factory-data/monitor-factory-data.component';
import { MonitorStandardComponent } from './monitor-standard/monitor-standard.component';
import { MonitorTrackingComponent } from './monitor-tracking/monitor-tracking.component';
import { DxDataGridModule,DxSelectBoxModule, DxSwitchModule, DxSpeedDialActionModule } from 'devextreme-angular';
import { SharedModule } from 'src/app/core/shared/shared.module';
const COMPONENTS =[
  MonitorComponent,
  MainViewMonitorComponent,
  MonitorChartComponent,
  MonitorFactoryDataComponent,
  MonitorStandardComponent,
  MonitorTrackingComponent
]
@NgModule({
  imports: [
    MonitorRoutingModule,
    SharedModule,
    CommonModule,
    DxSpeedDialActionModule,
    DxSwitchModule,
    DxSelectBoxModule
  ],
  declarations: [...COMPONENTS]
})
export class MonitorModule { }
