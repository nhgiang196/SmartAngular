import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { ThemeModule } from 'src/app/theme/theme.module';
import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { CategoriesModule } from './categories/categories.module';
import { BomModule } from './bom/bom.module';
import { MonitorModule } from './monitor/monitor.module';
import { ProcessModule } from './process/process.module';
import { ProcessCostModule } from './process-cost/process-cost.module';
import { InventoryModule } from './inventory/inventory.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

const COMPONNENT = [PagesComponent,DashboardComponent]

@NgModule({
  imports: [
    TranslateModule,
    PagesRoutingModule,
    SharedModule,
    CommonModule,
    ThemeModule,
    CategoriesModule,
    BomModule,
    MonitorModule,
    ProcessModule,
    ProcessCostModule,
    InventoryModule,

  ],
  declarations: [...COMPONNENT]
})
export class PagesModule { }
