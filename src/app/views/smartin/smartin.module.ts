import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactoryComponent } from './factory/factory.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { ItemTypeComponent } from './item-type/item-type.component';
import { UnitMeasurementComponent } from './unit-measurement/unit-measurement.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { ItemListComponent } from './item/item-list/item-list.component';
import { ItemActionComponent } from './item/item-action/item-action.component';
import { ItemGridComponent } from './item/item-grid/item-grid.component';
import { ItemDetailComponent } from './item/item-detail/item-detail.component';
import { StageComponent } from './stage/stage.component';
import { BomListComponent } from './bom/bom-list/bom-list.component';

import { CustomerListComponent } from './category/customer/customer-list/customer-list.component';
import { CustomerDetailComponent } from './category/customer/customer-detail/customer-detail.component';
import { CustomerComponent } from './category/customer/customer.component';
import { ContractComponent } from './category/customer/contract/contract.component';
import { BomStageModalComponent } from './bom/bom-stage-modal/bom-stage-modal.component';
import { BomItemModalComponent } from './bom/bom-item-modal/bom-item-modal.component';




const COMPONENTS = [
  FactoryComponent,
  ItemTypeComponent,
  UnitMeasurementComponent,
  WarehouseComponent,
  ItemListComponent,
  ItemGridComponent,
  ItemActionComponent,
  ItemDetailComponent, 
  StageComponent, 
  CustomerListComponent, 
  CustomerDetailComponent, 
  CustomerComponent,
  ContractComponent,
  BomListComponent,
  BomStageModalComponent,
  BomItemModalComponent
];


@NgModule({
  declarations: [...COMPONENTS ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  exports:[COMPONENTS]
})
export class SmartinModule { }
