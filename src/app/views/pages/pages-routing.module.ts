import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { RoutesResolver } from 'src/app/core/resolvers/routes.resolver';

const routes: Routes = [{
    path: '',
    component: PagesComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
        {
            path: 'dashboard',
            component: DashboardComponent
        },
        {
            path:'category',
            loadChildren: () => import('./categories/categories.module')
                .then(m => m.CategoriesModule),

        },
        {
            path:'bom',
            loadChildren: () => import('./bom/bom.module')
                .then(m => m.BomModule),
        },
        {
            path:'monitor',
            loadChildren: () => import('./monitor/monitor.module')
                .then(m => m.MonitorModule),
        },
        {
            path:'process',
            loadChildren: () => import('./process/process.module')
                .then(m => m.ProcessModule),
        },
        {
            path:'inventory',
            loadChildren: () => import('./inventory/inventory.module')
                .then(m => m.InventoryModule),
        },
        {
            path:'process-cost',
            loadChildren: () => import('./process-cost/process-cost.module')
                .then(m => m.ProcessCostModule),
        },
        {
            path:'example',
            loadChildren: () => import('./example/example.module')
                .then(m => m.ExampleModule),
        },
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: '**', redirectTo: 'dashboard' },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class PagesRoutingModule {
}
