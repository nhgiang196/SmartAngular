import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxFormModule, DxDataGridModule, DxListModule, DxDropDownBoxModule, DxTagBoxModule, DxSelectBoxModule, DxButtonModule, DxCheckBoxModule } from 'devextreme-angular';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CustomerEditorComponent } from './customer-editor/customer-editor.component';
import { FormEditComponent } from './form-edit/form-edit.component';
import { TestComponent } from './test.component';
import { CrudGenerationComponent } from './crud-generation/crud-generation.component';
import { HttpClientModule } from '@angular/common/http';
import { CustomizeKeyboardNavigationComponent } from './customize-keyboard-navigation/customize-keyboard-navigation.component';

@NgModule({
  declarations: [CustomerEditorComponent, FormEditComponent, TestComponent, CrudGenerationComponent, CustomizeKeyboardNavigationComponent],
  imports: [
    BrowserModule,
    RouterModule,
    CommonModule,
    DxFormModule ,
    DxDataGridModule,
    DxListModule,
    DxDropDownBoxModule,
    DxTagBoxModule,
    DxSelectBoxModule,
    DxButtonModule,
    DxCheckBoxModule,
    HttpClientModule
  ],
  

})
export class TestModule {
  // static forRoot(): ModuleWithProviders {
  //   return {
  //     ngModule: TestModule
  //   }
  // }


 }
