import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { RoutesResolver } from './core/resolvers/routes.resolver';


const routes: Routes = [
  {
    path: 'pages/:cid',
    resolve: { menu: RoutesResolver },
    loadChildren: () => import('./views/pages/pages.module')
      .then(m => m.PagesModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./views/auths/auths.module')
      .then(m => m.AuthsModule),
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: false
};

@NgModule({
  imports: [RouterModule.forRoot(
    routes, config
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
