import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactoryComponent } from './factory/factory.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { ItemTypeComponent } from './item-type/item-type.component';
import { UnitMeasurementComponent } from './unit-measurement/unit-measurement.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { Select2Module } from 'ng2-select2';
import { ChemicalListComponent } from './chemical/chemical-list/chemical-list.component';

@NgModule({
  declarations: [FactoryComponent, ItemTypeComponent, UnitMeasurementComponent, ChemicalListComponent, WarehouseComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    AutocompleteLibModule,
    Select2Module
  ],
  exports:[FactoryComponent]
})
export class SmartinModule { }
