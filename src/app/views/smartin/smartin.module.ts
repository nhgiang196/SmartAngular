import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactoryComponent } from './factory/factory.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [FactoryComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  exports:[FactoryComponent]
})
export class SmartinModule { }
