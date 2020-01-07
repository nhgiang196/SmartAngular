import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [NavigationComponent],
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    SharedModule
  ],
  exports:[NavigationComponent]
})
export class NavigationModule { }
