import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { RoutesResolver } from 'src/app/core/resolvers/routes.resolver';
import { ChemicalNormsComponent } from './chemical-norms.component';
import { MainViewChemicalNormComponent } from './main-view-chemical-norm/main-view-chemical-norm.component';

const routes: Routes = [{
    path: '',
    component: ChemicalNormsComponent,
    children: [
        {
            path: 'main/:id',
            resolve: { menu: RoutesResolver },
            component: MainViewChemicalNormComponent
        },
        { path: '', redirectTo: 'main', pathMatch: 'full' },
        { path: '**', redirectTo: 'main' },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class ChemicalNormsRoutingModule {
}
