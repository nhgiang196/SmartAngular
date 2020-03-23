import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import {
  FooterComponent,
  HeaderComponent,
  SidebarComponent,
} from './components';
import { SharedModule } from '../core/shared/shared.module';

const COMPONENTS = [
  HeaderComponent,
  SidebarComponent,
  FooterComponent,
  LayoutComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS]
})
export class ThemeModule { }
