import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { RoutesResolver } from 'src/app/core/resolvers/routes.resolver';
import { ProcessComponent } from './process.component';
import { MainViewProcessComponent } from './main-view-process/main-view-process.component';

const routes: Routes = [{
    path: '',
    component: ProcessComponent,
    children: [
        {
            path: 'main/:id',
            resolve: { menu: RoutesResolver },
            component: MainViewProcessComponent
        },
        { path: '', redirectTo: 'main', pathMatch: 'full' },
        { path: '**', redirectTo: 'main' },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class ProcessRoutingModule {
}
