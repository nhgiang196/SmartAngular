import { Component, OnInit } from '@angular/core';
import { collapseIboxHelper } from '../../../app.helpers';

import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { Factory, FactoryTechnology } from 'src/app/models/SmartInModels';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';
import { trigger, transition, style, animate } from '@angular/animations';
declare let $:any;

@Component({
  selector: 'app-factory',
  templateUrl: './factory.component.html',
  styleUrls: ['./factory.component.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [
      transition(':leave',
        animate(300, style({opacity: 0})))
    ])
  ]

  
})
export class FactoryComponent implements OnInit {

  constructor(
    private api : WaterTreatmentService,
    private toastr: ToastrService,
    public trans: TranslateService,
    ) { }
  /** INIT */
  factory : Factory[]; //init data
  entity : Factory;
  tech_entity : FactoryTechnology;
  laddaSubmitLoading = false;
  iboxloading = false;
  
  ACTION_STATUS : string;

  ngOnInit() {
    
    this.resetEntity();
    this.factory = [];
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
    this.ACTION_STATUS = 'add';
    this.resetEntity();
  }

  fnEditSignal(id){
    this.ACTION_STATUS = 'update';
    this.iboxloading = true;
    this.api.getFactoryById(id).subscribe(res=>{
      console.log(res);
      this.entity = res;
      $("#myModal4").modal('show');
      this.iboxloading = false;
    },  error => {
      this.iboxloading = false;
      this.toastr.error(error.statusText,"Load factory information error" );
    })
  }


  fnDelete(id){
    swal.fire({
      title: this.trans.instant('Factory.DeleteAsk_Title'),
      titleText: this.trans.instant('Factory.DeleteAsk_Text'),
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true
    })
    .then((result) => {
      if (result.value) {
        swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      } else if (
        result.dismiss === swal.DismissReason.cancel
      ) {
        swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
    

  }

  fnCheckBeforeEdit(id){
    this.toastr.warning("User not dont have permission");
  }


  fnAddItem(){
    var itemAdd = this.tech_entity;
    itemAdd.FactoryId = this.entity.FactoryId;
    this.tech_entity = new FactoryTechnology();
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
        console.log('send entity: ',e);
        if (this.ACTION_STATUS =='add')
        {
          this.api.addFactory(e).subscribe(res=>{
            var operationResult: any = res
            if (operationResult.Success)
              this.toastr.success(this.trans.instant("messg.add.success"));
            else this.toastr.warning(operationResult.Message);
            this.laddaSubmitLoading=false;
          }, err=> {this.toastr.error(err.statusText); this.laddaSubmitLoading=false;})
        }

        if (this.ACTION_STATUS =='update')
        {
          this.api.updateFactory(e).subscribe(res=>{
            var operationResult: any = res
            if (operationResult.Success)
              this.toastr.success(this.trans.instant("messg.update.success"));
            else this.toastr.warning(operationResult.Message);
            this.laddaSubmitLoading=false;
          }, err=> {this.toastr.error(err.statusText); this.laddaSubmitLoading=false;})
        }
        
      }
  }

  private fnValidate(e){
    // this.toastr.warning('test');
    // this.laddaSubmitLoading=false
    return true;
  }

  ngAfterViewInit(){ //CSS
    
    
  }

}
