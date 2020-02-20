import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminNavigationComponent } from './admin-navigation/admin-navigation.component';
import { SmartinModule } from 'src/app/views/smartin/smartin.module';
import { UserNavigationComponent } from './user-navigation/user-navigation.component';
import { CategoryNavigationComponent } from './category-navigation/category-navigation.component';

@NgModule({
  declarations: [NavigationComponent, AdminNavigationComponent, UserNavigationComponent, CategoryNavigationComponent],
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
