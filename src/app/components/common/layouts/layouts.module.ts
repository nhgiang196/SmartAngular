import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationModule } from '../navigation/navigation.module';
import { TopnavbarModule } from '../topnavbar/topnavbar.module';
import { FooterModule } from '../footer/footer.module';
import { RouterModule } from '@angular/router';
import { BasicComponent } from './basic/basic.component';
import { BlankComponent } from './blank/blank.component';
import { HomeMenuComponent } from './home-menu/home-menu.component';

@NgModule({
  declarations: [BasicComponent,BlankComponent, HomeMenuComponent],
  imports: [
    CommonModule,
    NavigationModule,
    TopnavbarModule,
    FooterModule,
    RouterModule
  ],
  exports     : [BasicComponent,BlankComponent, HomeMenuComponent]
})
export class LayoutsModule { }
