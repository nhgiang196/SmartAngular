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
import { InfiniteScrollingComponent } from './infinite-scrolling/infinite-scrolling.component';
import { DisplayProfileComponent } from './display-profile/display-profile.component';
import { UiSampleModule } from '../smartin/ui-sample/ui-sample.module';
import { TestService } from './test.service';


@NgModule({
  declarations: [CustomerEditorComponent, FormEditComponent, TestComponent, CrudGenerationComponent, CustomizeKeyboardNavigationComponent, InfiniteScrollingComponent, DisplayProfileComponent ],
  providers : [TestService],
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
    HttpClientModule,
    UiSampleModule

  ],
  

})
export class TestModule {
  // static forRoot(): ModuleWithProviders {
  //   return {
  //     ngModule: TestModule
  //   }
  // }


 }
