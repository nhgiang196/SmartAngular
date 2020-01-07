import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MainViewComponent } from './main-view.component';
import { ApiEMCSService } from 'src/app/services/api-ecms.service';


@NgModule({
  declarations: [
    MainViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule    
  ],
  providers:[ApiEMCSService],
  exports:[
  MainViewComponent]
})
export class MainViewModule { }
