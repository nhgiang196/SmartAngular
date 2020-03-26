import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { LanguageService } from 'src/app/core/services/language.service';
import { MainViewCategoryComponent } from './main-view-category/main-view-category.component';
import { DxButtonModule, DxDataGridModule } from 'devextreme-angular';
import { CustomersComponent } from './customers/customers.component';
import { ItemComponent } from './item/item.component';
import { ItemTypeComponent } from './item-type/item-type.component';
import { StageComponent } from './stage/stage.component';
import { UnitComponent } from './unit/unit.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { UISampleModule } from '../../UISample/UISample.module';
import { FormsModule } from '@angular/forms';


const COMPONENTS = [
  CategoriesComponent,
  MainViewCategoryComponent,
  CustomersComponent,
  ItemComponent,
  ItemTypeComponent,
  StageComponent,
  UnitComponent,
  WarehouseComponent,

];

@NgModule({
  imports: [
    CategoriesRoutingModule,
    CommonModule,
    SharedModule,
    UISampleModule,
    DxButtonModule,
    DxDataGridModule,
    DxButtonModule,
    FormsModule,
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS, UISampleModule ],
  providers:[
  ]
})
export class CategoriesModule { }
