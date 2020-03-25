import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { RoutesResolver } from 'src/app/core/resolvers/routes.resolver';
import { MonitorComponent } from './monitor.component';
import { MainViewMonitorComponent } from './main-view-monitor/main-view-monitor.component';
import { MonitorChartComponent } from './monitor-chart/monitor-chart.component';
import { MonitorFactoryDataComponent } from './monitor-factory-data/monitor-factory-data.component';
import { MonitorStandardComponent } from './monitor-standard/monitor-standard.component';
import { MonitorTrackingComponent } from './monitor-tracking/monitor-tracking.component';

const routes: Routes = [{
    path: '',
    component: MonitorComponent,
    children: [
        {
            path: 'main',
            resolve: { menu: RoutesResolver },
            component: MainViewMonitorComponent
        },
        {
            path: 'chart',
            component: MonitorChartComponent
        },
        {
            path: 'factory-data',
            component: MonitorFactoryDataComponent
        },
        {
            path: 'standard',
            component: MonitorStandardComponent
        },
        {
            path: 'tracking',
            component: MonitorTrackingComponent
        },
        { path: '', redirectTo: 'main', pathMatch: 'full' },
        { path: '**', redirectTo: 'main' },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class MonitorRoutingModule {
}
