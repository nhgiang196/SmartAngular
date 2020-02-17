import { Component, OnInit } from '@angular/core';
import { collapseIboxHelper } from '../../../app.helpers';
import { TranslateService } from '@ngx-translate/core';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { Factory, FactoryTechnology } from 'src/app/models/SmartInModels';
import { ToastrService } from 'ngx-toastr';



declare let $:any;

@Component({
  selector: 'app-factory',
  templateUrl: './factory.component.html',
  styleUrls: ['./factory.component.css']
})
export class FactoryComponent implements OnInit {

  constructor(
    private api : WaterTreatmentService,
    private toastr: ToastrService) { }
  /** INIT */
  factory : Factory[];
  entity : Factory;
  tech_entity : FactoryTechnology;
  laddaSubmitLoading = false;
  loading = false;

  ngOnInit() {
    this.factory = [];
    this.resetEntity();

    this.api.getFactory().subscribe(res=>{
      this.factory = res;
    }, err=> {
      this.toastr.error(err.statusText, "Load init failed!");
    })
    
  }

  private resetEntity() {
    this.entity = new Factory();
    this.tech_entity = new FactoryTechnology();
  }

  fnAdd(){
    this.resetEntity();
  }

  fnEdit(id){
    this.loading = true;
    this.api.getFactoryById(id).subscribe(res=>{
      console.log(res);
      this.entity = res;
      $("#myModal4").modal('show');
      this.loading = false;
    },  error => {
      this.loading = false;
      this.toastr.error(error.statusText,"Load factory information error" );
    })
  }
  fnAddItem(){
    var itemAdd = this.tech_entity;
    this.tech_entity = new FactoryTechnology();
    debugger;
    this.entity.FactoryTechnology.push(itemAdd);
  }

  fnDeleteItem(index){
    this.entity.FactoryTechnology.splice(index,1);
  }

  fnSave(){
    this.laddaSubmitLoading=true;
    var e = this.entity;
    if (this.fnValidate(e)) 
      {
        
        this.laddaSubmitLoading=false
      }
  }

  private fnValidate(e){
    this.toastr.warning('test');
    this.laddaSubmitLoading=false
    return false;
  }

  ngAfterViewInit(){ //CSS
    
    
  }

}
