import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

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
