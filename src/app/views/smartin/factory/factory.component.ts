import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { collapseIboxHelper } from '../../../app.helpers';
import { MyHelperService } from 'src/app/services/my-helper.service';
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
  @ViewChild('myInputFile')// set for emtpy file after Close or Reload
  InputManual: ElementRef;

  constructor(
    private api : WaterTreatmentService,
    private toastr: ToastrService,
    public trans: TranslateService,
    public helper: MyHelperService
    ) { }
  /** INIT */
  factory : Factory[]; //init data
  entity : Factory;
  tech_entity : FactoryTechnology;
  laddaSubmitLoading = false;
  iboxloading = false;
  private _file : FileList;
  
  ACTION_STATUS : string;

  ngOnInit() {
    this.resetEntity();
    this.loadInit();
  }

  private loadInit(){
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
        this.api.deleteFactory(id).subscribe(res=>{
          var operationResult: any = res
          if (operationResult.Success){
            swal.fire(
              'Deleted!',this.trans.instant('messg.delete.success'),'success'
            );
            this.loadInit();
            $("#myModal4").modal('hide');
          }
          else this.toastr.warning(operationResult.Message);
        }, err=> {this.toastr.error(err.statusText)})
      } 
    })
    

  }

  fnCheckBeforeEdit(id){
    this.toastr.warning("User not dont have permission");
  }


  fnAddItem(){
    var itemAdd = this.tech_entity;
    if (itemAdd.TechnologyName==null){
      this.toastr.warning("Validate",this.trans.instant('Factory.data.TechnologyName') + this.trans.instant('messg.isnull'))
      return;
    }
    if (itemAdd.TechnologyDescription==null){
      this.toastr.warning("Validate",this.trans.instant('Factory.data.TechnologyDescription') + this.trans.instant('messg.isnull'))
      return;
    }
    if (itemAdd.TechnologyFromDate==null){
      this.toastr.warning("Validate",this.trans.instant('Factory.data.TechnologyFromDate') + this.trans.instant('messg.isnull'))
      return;
    }
    if (itemAdd.TechnologyToDate==null){
      this.toastr.warning("Validate",this.trans.instant('Factory.data.TechnologyToDate') + this.trans.instant('messg.isnull'))
      return;
    }
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

  uploadFile(files: File[]){
    var formData = new FormData();

    for (let file of files)
    formData.append("files", file);
    
    // for (let index = 0; index < files.length; index++) {
    //   const file = files[index];
      
    //   formData.set("files", file ,  this.helper.getFileNameWithExtension(file));
    // }
    this.api.uploadFile(formData).subscribe(res => {
      console.log('upload Res',res);
    }, err => {
      this.toastr.error('Can not upload File\n Api upload Error '+ err.Message, 'Error');
    });
  }

  private fnValidate(e){
    // this.toastr.warning('test');
    // this.laddaSubmitLoading=false
    return true;
  }

  ngAfterViewInit(){ //CSS
    
    
  }

}
