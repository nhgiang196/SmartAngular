import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactoryComponent } from './factory/factory.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { ItemTypeComponent } from './item-type/item-type.component';
import { UnitMeasurementComponent } from './unit-measurement/unit-measurement.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { ChemicalListComponent } from './chemical/chemical-list/chemical-list.component';
import { ChemicalActionComponent } from './chemical/chemical-action/chemical-action.component';
import { ItemGridComponent } from './item/item-grid/item-grid.component';


const COMPONENTS = [
  FactoryComponent,
  ItemTypeComponent,
  UnitMeasurementComponent,
  ChemicalListComponent,
  WarehouseComponent,
  ChemicalActionComponent,
  ItemGridComponent
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
