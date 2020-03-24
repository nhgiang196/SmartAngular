import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { RoutesResolver } from 'src/app/core/resolvers/routes.resolver';
import { ProcessCostComponent } from './process-cost.component';
import { MainViewProcessCostComponent } from './main-view-process-cost/main-view-process-cost.component';

const routes: Routes = [{
    path: '',
    component: ProcessCostComponent,
    children: [
        {
            path: 'main/:id',
            resolve: { menu: RoutesResolver },
            component: MainViewProcessCostComponent
        },
        { path: '', redirectTo: 'main', pathMatch: 'full' },
        { path: '**', redirectTo: 'main' },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class ProcessCostRoutingModule {
}
