import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChemicalNormsComponent } from './chemical-norms.component';
import { ChemicalNormsRoutingModule } from './chemical-norms-routing.module';
import { MainViewChemicalNormComponent } from './main-view-chemical-norm/main-view-chemical-norm.component';
import { SharedModule } from 'src/app/core/shared/shared.module';

@NgModule({
  imports: [
    ChemicalNormsRoutingModule,
    CommonModule,
    SharedModule
  ],
  declarations: [ChemicalNormsComponent,MainViewChemicalNormComponent]
})
export class ChemicalNormsModule { }
