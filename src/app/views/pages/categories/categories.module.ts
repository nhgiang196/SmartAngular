import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { LanguageService } from 'src/app/core/services/language.service';
import { MainViewCategoryComponent } from './main-view-category/main-view-category.component';
import { DxButtonModule, DxDataGridModule, DxSpeedDialActionModule, DxSwitchModule, DxSelectBoxModule, DxTextBoxModule, DxCheckBoxModule, DxDateBoxModule, DxValidatorModule, DxValidationSummaryModule, DxFormModule } from 'devextreme-angular';

import { ItemComponent } from './item/item.component';
import { ItemTypeComponent } from './item-type/item-type.component';
import { StageComponent } from './stage/stage.component';
import { UnitComponent } from './unit/unit.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { UISampleModule } from '../../UISample/UISample.module';
import { FormsModule } from '@angular/forms';
import { CustomerComponent } from './customers/customer.component';
import { CustomerListComponent } from './customers/customer-list/customer-list.component';
import { CustomerDetailComponent } from './customers/customer-detail/customer-detail.component';
import { ContractComponent } from './customers/contract/contract.component';
import { ItemActionComponent } from './item/item-action/item-action.component';
import { ModalModule } from 'ngx-bootstrap';


const COMPONENTS = [
  CategoriesComponent,
  MainViewCategoryComponent,
  ContractComponent,
  CustomerListComponent,
  CustomerComponent,
  CustomerDetailComponent,
  ItemComponent,
  ItemTypeComponent,
  StageComponent,
  UnitComponent,
  WarehouseComponent,
  ItemActionComponent
];

@NgModule({
  imports: [
    CategoriesRoutingModule,

    SharedModule,
    CommonModule,
    UISampleModule,
    FormsModule,
    DxSpeedDialActionModule,
    DxSwitchModule,
    DxSelectBoxModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxDateBoxModule,
    DxButtonModule,
    DxValidatorModule,
    DxFormModule,
    DxValidationSummaryModule,
    ModalModule.forRoot()
  ],
  declarations: [...COMPONENTS],
  exports: [],
  providers:[
  ]
})
export class CategoriesModule { }
