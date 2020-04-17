import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import {
  FooterComponent,
  HeaderComponent,
  SidebarComponent,
} from './components';
import { SharedModule } from '../core/shared/shared.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap';


const COMPONENTS = [
  HeaderComponent,
  SidebarComponent,
  FooterComponent,
  LayoutComponent,
  NotFoundComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule ,
    SharedModule,
    TooltipModule.forRoot()
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS]
})
export class ThemeModule { }
