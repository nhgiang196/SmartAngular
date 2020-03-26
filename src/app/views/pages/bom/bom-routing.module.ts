import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { RoutesResolver } from 'src/app/core/resolvers/routes.resolver';
import { BomComponent } from './bom.component';
import { MainViewBomComponent } from './main-view-bom/main-view-bom.component';
import { BomListComponent } from './bom-list/bom-list.component';
import { BomStageComponent } from './bom-stage/bom-stage.component';

const routes: Routes = [{
    path: '',
    component: BomComponent,
    children: [
        {
            path: 'main',
            resolve: { menu: RoutesResolver },
            component: MainViewBomComponent
        },
        {
            path: 'list',
            component: BomListComponent
        },
        {
            path: 'stage',
            component: BomStageComponent
        },
        { path: '', redirectTo: 'main', pathMatch: 'full' },
        { path: '**', redirectTo: 'main' },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class BomRoutingModule {
}
