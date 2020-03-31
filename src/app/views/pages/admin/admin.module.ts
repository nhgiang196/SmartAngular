import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactoryComponent } from './factory/factory.component';
import { AdminComponent } from './admin.component';
import { SharedModule } from 'src/app/core/shared/shared.module';

import { RouterModule, Routes } from '@angular/router';
import { MainViewAdminComponent } from './main-view-admin/main-view-admin.component';


const routes: Routes = [{
  path: '',
  component: AdminComponent,
  children: [
      {
          path: 'main',
          component: MainViewAdminComponent
      },
      {
          path: 'factory',
          component: FactoryComponent
      },
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: '**', redirectTo: 'main' },
  ]
}];

@NgModule({
  declarations: [FactoryComponent, AdminComponent, MainViewAdminComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule
  ],
  exports: [RouterModule, FactoryComponent, AdminComponent, MainViewAdminComponent],
  
})
export class AdminModule { }
