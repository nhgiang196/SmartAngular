import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactoryComponent } from './factory/factory.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { ItemTypeComponent } from './item-type/item-type.component';

@NgModule({
  declarations: [FactoryComponent, ItemTypeComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  exports:[FactoryComponent]
})
export class SmartinModule { }
