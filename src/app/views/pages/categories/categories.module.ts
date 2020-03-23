import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { DemoComponent } from './demo/demo.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { LanguageService } from 'src/app/core/services/language.service';
import { MainViewCategoryComponent } from './main-view-category/main-view-category.component';

@NgModule({
  imports: [
    CategoriesRoutingModule,
    CommonModule,
    SharedModule,
  ],
  declarations: [CategoriesComponent,DemoComponent,MainViewCategoryComponent],
})
export class CategoriesModule { }
