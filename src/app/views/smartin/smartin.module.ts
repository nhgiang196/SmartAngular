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
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { StageComponent } from './stage/stage.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerDetailComponent } from './customer/customer-detail/customer-detail.component';
import { ContractComponent } from './contract/contract.component';
import { CustomerComponent } from './customer/customer.component';


const COMPONENTS = [
  FactoryComponent,
  ItemTypeComponent,
  UnitMeasurementComponent,
  WarehouseComponent,
  ItemListComponent,
  ItemGridComponent,
  ItemActionComponent
];


@NgModule({
  declarations: [...COMPONENTS, ItemDetailComponent, StageComponent, CustomerListComponent, CustomerDetailComponent,  ContractComponent, CustomerComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  exports:[COMPONENTS]
})
export class SmartinModule { }
