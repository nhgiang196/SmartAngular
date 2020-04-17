import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitorComponent } from './monitor.component';
import { MainViewMonitorComponent } from './main-view-monitor/main-view-monitor.component';
import { MonitorRoutingModule } from './monitor-routing.module';
import { MonitorChartComponent } from './monitor-chart/monitor-chart.component';
import { MonitorStandardComponent } from './monitor-standard/monitor-standard.component';
import { DxDataGridModule,DxSelectBoxModule, DxSwitchModule, DxSpeedDialActionModule, DxFormModule, DxDateBoxModule, DxChartModule } from 'devextreme-angular';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';

const COMPONENTS =[
  MonitorComponent,
  MainViewMonitorComponent,
  MonitorChartComponent,
  MonitorStandardComponent,
]

@NgModule({
  imports: [
    MonitorRoutingModule,
    SharedModule,
    CommonModule,
    DxSpeedDialActionModule,
    DxSwitchModule,
    DxFormModule,
    DxChartModule,
    DxDateBoxModule,
    DxSelectBoxModule,
    ChartModule
  ],
  declarations: [...COMPONENTS]
})
export class MonitorModule { }
