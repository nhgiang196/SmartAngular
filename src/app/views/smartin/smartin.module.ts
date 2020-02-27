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
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  exports:[COMPONENTS]
})
export class SmartinModule { }
