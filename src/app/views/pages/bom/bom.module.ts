import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BomComponent } from './bom.component';
import { BomRoutingModule } from './bom-routing.module';
import { MainViewBomComponent } from './main-view-bom/main-view-bom.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { BomListComponent } from './bom-list/bom-list.component';
import { BomStageComponent } from './bom-stage/bom-stage.component';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';

const COMPONENTS =[
  BomComponent,
  MainViewBomComponent,
  BomListComponent,
  BomStageComponent
]

@NgModule({
  imports: [
    BomRoutingModule,
    CommonModule,
    SharedModule
  ],
  declarations: [
    ...COMPONENTS
  ]
})
export class BomModule { }
