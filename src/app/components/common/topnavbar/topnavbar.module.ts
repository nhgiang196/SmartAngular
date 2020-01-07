import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { TopnavbarComponent } from './topnavbar.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [TopnavbarComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    SharedModule
  ],
  exports:[
    TopnavbarComponent
  ]
})
export class TopnavbarModule { }
