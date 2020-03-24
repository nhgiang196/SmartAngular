import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BomComponent } from './bom.component';
import { BomRoutingModule } from './bom-routing.module';
import { MainViewBomComponent } from './main-view-bom/main-view-bom.component';
import { SharedModule } from 'src/app/core/shared/shared.module';

@NgModule({
  imports: [
    BomRoutingModule,
    CommonModule,
    SharedModule
  ],
  declarations: [BomComponent,MainViewBomComponent]
})
export class BomModule { }
