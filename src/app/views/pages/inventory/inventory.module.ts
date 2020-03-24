import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory.component';
import { MainViewInventoryComponent } from './main-view-inventory/main-view-inventory.component';
import { InventoryRoutingModule } from './inventory-routing.module';

@NgModule({
  imports: [
    InventoryRoutingModule,
    CommonModule
  ],
  declarations: [InventoryComponent,MainViewInventoryComponent]
})
export class InventoryModule { }
