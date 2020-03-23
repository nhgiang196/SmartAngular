import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { CategoriesComponent } from './categories.component';
import { DemoComponent } from './demo/demo.component';
import { RoutesResolver } from 'src/app/core/resolvers/routes.resolver';

const routes: Routes = [{
    path: '',
    component: CategoriesComponent,
    children: [
        {
            path: 'demo',
            component: DemoComponent
        },
        {
            path: 'main/:id',
            resolve: { menu: RoutesResolver },
            component: DemoComponent
        },
        { path: '', redirectTo: 'main', pathMatch: 'full' },
        { path: '**', redirectTo: 'main' },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class CategoriesRoutingModule {
}
