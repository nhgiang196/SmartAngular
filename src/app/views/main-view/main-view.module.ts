import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MainViewComponent } from './main-view.component';
import { ApiEMCSService } from 'src/app/services/api-ecms.service';
// import { LandingViewComponent } from './landing-view/landing-view.component';


@NgModule({
  declarations: [
    MainViewComponent,
    // LandingViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers:[ApiEMCSService],
  exports:[
  MainViewComponent,
  // LandingViewComponent
]
})
export class MainViewModule { }
