import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactoryComponent } from './factory/factory.component';

@NgModule({
  declarations: [FactoryComponent],
  imports: [
    CommonModule
  ],
  exports:[FactoryComponent]
})
export class SmartinModule { }
