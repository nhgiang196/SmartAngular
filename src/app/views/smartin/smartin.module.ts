import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactoryComponent } from './factory/factory.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { ItemTypeComponent } from './item-type/item-type.component';
import { UnitMeasurementComponent } from './unit-measurement/unit-measurement.component';
import { ChemicalComponent } from './chemical/chemical.component';

@NgModule({
  declarations: [FactoryComponent, ItemTypeComponent, UnitMeasurementComponent, ChemicalComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  exports:[FactoryComponent]
})
export class SmartinModule { }
