import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { LanguageService } from 'src/app/core/services/language.service';
import { MainViewCategoryComponent } from './main-view-category/main-view-category.component';
import { DxButtonModule, DxDataGridModule } from 'devextreme-angular';
@NgModule({
  imports: [
    CategoriesRoutingModule,
    CommonModule,
    SharedModule,
    DxButtonModule,
    DxDataGridModule,
    DxButtonModule
  ],
  declarations: [CategoriesComponent,MainViewCategoryComponent],
  providers:[
  ]
})
export class CategoriesModule { }
