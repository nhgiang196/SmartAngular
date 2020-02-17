import { Component, OnInit } from '@angular/core';
import { collapseIboxHelper } from '../../../app.helpers';
import { TranslateService } from '@ngx-translate/core';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { Factory } from 'src/app/models/SmartInModels';



@Component({
  selector: 'app-factory',
  templateUrl: './factory.component.html',
  styleUrls: ['./factory.component.css']
})
export class FactoryComponent implements OnInit {

  constructor(private api : WaterTreatmentService) { }
  /** INIT */
  factory : Factory[];
  entity : Factory;

  ngOnInit() {
    this.resetEntity();

    this.api.getFactory().subscribe(res=>{
      this.factory = res;
    })



    
  }

  resetEntity() {
    this.entity = { FactoryType: 1, Status: 1};
  }

  ngAfterViewInit(){ //CSS
    
  }

}
