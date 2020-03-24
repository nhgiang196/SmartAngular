import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { RoutesResolver } from 'src/app/core/resolvers/routes.resolver';
import { ExampleComponent } from './example.component';
import { MainViewExampleComponent } from './main-view-example/main-view-example.component';
import { FunctionComponent } from './function/function.component';

const routes: Routes = [{
    path: '',
    component: ExampleComponent,
    children: [
        {
            path: 'main/:id',
            resolve: { menu: RoutesResolver },
            component: MainViewExampleComponent
        },
        {
            path: 'function',
            component: FunctionComponent
        },
        { path: '', redirectTo: 'main', pathMatch: 'full' },
        { path: '**', redirectTo: 'main' },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class ExampleRoutingModule {
}
