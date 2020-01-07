import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationModule } from '../navigation/navigation.module';
import { TopnavbarModule } from '../topnavbar/topnavbar.module';
import { FooterModule } from '../footer/footer.module';
import { RouterModule } from '@angular/router';
import { BasicComponent } from './basic/basic.component';
import { BlankComponent } from './blank/blank.component';

@NgModule({
  declarations: [BasicComponent,BlankComponent],
  imports: [
    CommonModule,
    NavigationModule,
    TopnavbarModule,
    FooterModule,
    RouterModule
  ]
})
export class LayoutsModule { }
