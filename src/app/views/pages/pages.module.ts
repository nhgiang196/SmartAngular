import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { ThemeModule } from 'src/app/theme/theme.module';
import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { CategoriesModule } from './categories/categories.module';
import { ChemicalNormsModule } from './chemical-norms/chemical-norms.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    SharedModule,
    CommonModule,
    ThemeModule,
    CategoriesModule,
    ChemicalNormsModule
  ],
  declarations: [PagesComponent,DashboardComponent]
})
export class PagesModule { }
