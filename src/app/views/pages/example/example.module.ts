import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExampleComponent } from './example.component';
import { MainViewExampleComponent } from './main-view-example/main-view-example.component';
import { ExampleRoutingModule } from './example-routing.module';
import { FunctionComponent } from './function/function.component';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';

@NgModule({
  imports: [
    ExampleRoutingModule,
    CommonModule,
    DxDataGridModule,
    DxButtonModule
  ],
  declarations: [ExampleComponent,MainViewExampleComponent,FunctionComponent]
})
export class ExampleModule { }
