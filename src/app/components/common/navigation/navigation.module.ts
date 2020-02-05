import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminNavigationComponent } from './admin-navigation/admin-navigation.component';
import { SmartinModule } from 'src/app/views/smartin/smartin.module';

@NgModule({
  declarations: [NavigationComponent, AdminNavigationComponent],
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    SharedModule,
    SmartinModule
  ],
  exports:[NavigationComponent]
})
export class NavigationModule { }
