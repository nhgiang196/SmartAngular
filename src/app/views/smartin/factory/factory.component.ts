import { Component, OnInit } from '@angular/core';
import { collapseIboxHelper } from '../../../app.helpers';
import { TranslateService } from '@ngx-translate/core';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { Factory } from 'src/app/models/SmartInModels';

declare let $:any;

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
    this.factory = [];
    this.resetEntity();

    this.api.getFactory().subscribe(res=>{
      this.factory = res;
    })
    
  }

  private resetEntity() {
    this.entity = new Factory();
  }

  fnAdd(){
    this.resetEntity();


  }

  fnEdit(id){
    this.api.getFactoryById(id).subscribe(res=>{
      console.log(res);
      this.entity = res;
      $("#myModal4").modal('show');
    })
    

  }

  ngAfterViewInit(){ //CSS
    
    
  }

}
