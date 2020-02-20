import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { collapseIboxHelper } from '../../../app.helpers';
import { MyHelperService } from 'src/app/services/my-helper.service';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { Factory, FactoryTechnology, FactoryFile, Files } from 'src/app/models/SmartInModels';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';
import { trigger, transition, style, animate } from '@angular/animations';
declare let $: any;
@Component({
  selector: 'app-factory',
  templateUrl: './factory.component.html',
  styleUrls: ['./factory.component.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [
      transition(':leave',
        animate(300, style({ opacity: 0 })))
    ])
  ]
})
export class FactoryComponent implements OnInit {
  @ViewChild('myInputFile')// set for emtpy file after Close or Reload
  InputManual: ElementRef;
  constructor(
    private api: WaterTreatmentService,
    private toastr: ToastrService,
    public trans: TranslateService,
    public helper: MyHelperService
  ) { }
  /** INIT */
  factory: Factory[]; //init data
  entity: Factory;
  tech_entity: FactoryTechnology;
  laddaSubmitLoading = false;
  iboxloading = false;
  files: File[] = [];
  keyword : string = '';
  private pathFile = "uploadFilesFactory"
  ACTION_STATUS: string;
  factory_showed = 0;
  statusInline ='';
  
  ngOnInit() {
    this.resetEntity();
    this.loadInit();
  }authService
  private loadInit() {
    this.factory = [];
    this.api.getFactoryPagination(this.keyword).subscribe(res => {
      
      var data = res as any;
      this.factory = data.result;
      this.factory_showed = data.totalCount;
      
    }, err => {
      this.toastr.error(err.statusText, "Load init failed!");
    })
  }
  searchValueOnChange(){
    let wordSearch = this.keyword;
    setTimeout(() => {
        if (wordSearch == this.keyword) this.loadInit();
    }, 2000);

  }
  private resetEntity() {
    this.entity = new Factory();
    this.tech_entity = new FactoryTechnology();
    this.files = [];
  }
  fnAdd() {
    this.ACTION_STATUS = 'add';
    this.resetEntity();
  }
  fnEditSignal(id) {
    if (id==null)  { this.toastr.warning('Factory ID is Null, cant show modal'); return; }
    this.resetEntity();
    this.ACTION_STATUS = 'update';
    this.iboxloading = true;
    this.api.getFactoryById(id).subscribe(res => {
      console.log(res);
      
      this.entity = res;
      
      this.entity.FactoryFile.forEach(item =>{
        let _tempFile = new File([],item.File.FileOriginalName);
        this.files.push(_tempFile);
      })
      
      this.files.push()
      $("#myModal4").modal('show');
      this.iboxloading = false;
      
    }, error => {
      this.iboxloading = false;
      this.toastr.error(error.statusText, "Load factory information error");
    })
  }
  fnDelete(id) {
    swal.fire({
      title: this.trans.instant('Factory.DeleteAsk_Title'),
      titleText: this.trans.instant('Factory.DeleteAsk_Text'),
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true
    })
      .then((result) => {
        if (result.value) {
          this.api.deleteFactory(id).subscribe(res => {
            var operationResult: any = res
            if (operationResult.Success) {
              swal.fire(
                'Deleted!', this.trans.instant('messg.delete.success'), 'success'
              );
              this.loadInit();
              $("#myModal4").modal('hide');
            }
            else this.toastr.warning(operationResult.Message);
          }, err => { this.toastr.error(err.statusText) })
        }
      })
  }
  fnCheckBeforeEdit(id) {
    this.toastr.warning("User not dont have permission");
  }
  fnAddItem() {
    var itemAdd = this.tech_entity;
    if (itemAdd.TechnologyName == null) {
      this.toastr.warning("Validate", this.trans.instant('Factory.data.TechnologyName') + this.trans.instant('messg.isnull'))
      return;
    }
    if (itemAdd.TechnologyDescription == null) {
      this.toastr.warning("Validate", this.trans.instant('Factory.data.TechnologyDescription') + this.trans.instant('messg.isnull'))
      return;
    }
    if (itemAdd.TechnologyFromDate == null) {
      this.toastr.warning("Validate", this.trans.instant('Factory.data.TechnologyFromDate') + this.trans.instant('messg.isnull'))
      return;
    }
    itemAdd.FactoryId = this.entity.FactoryId;
    this.tech_entity = new FactoryTechnology();
    this.entity.FactoryTechnology.push(itemAdd);
  }
  fnDeleteItem(index) {
    this.entity.FactoryTechnology.splice(index, 1);
  }
  
  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
    this.uploadFile(event.addedFiles);
    event.addedFiles.forEach(item =>{
      let _factoryFile = new FactoryFile();
      _factoryFile.File.FileOriginalName= item.name;
      _factoryFile.File.FileName = this.helper.getFileNameWithExtension(item) ;
      _factoryFile.File.Path = this.pathFile + '/' + item.name
      this.entity.FactoryFile.push(_factoryFile);
    });
  }
   
  onRemove(event) {
    console.log(event);
    let index = this.files.indexOf(event);
    this.files.splice(index, 1); //UI del
    this.entity.FactoryFile.splice(index,1);
    
    // this.removeFile(event);
  }
  downloadFile(filename){
    this.api.downloadFile(this.pathFile+'/'+filename);
  }
  uploadFile(files: File[])
  {
      let formData = new FormData();
      files.forEach(file => {
          formData.append("files",file)
      });
      this.api.uploadFile(formData, this.pathFile).subscribe(res=> console.log(res));
  }

  onSwitchStatus (){
    this.entity.Status = this.entity.Status==0? 1: 0;
    if (this.entity.Status==0) this.entity.FactoryEndDate = new Date();
  }


  fnSubmit(){
    this.laddaSubmitLoading = true;
    this.fnValidate(this.entity);
  }


  // removeFile = (file) => this.api.deleteFile(`${this.pathFile}\\${file.name}`).subscribe(res=>console.log(res));
  private fnValidate(e: Factory) {
    if (e.FactoryName == null || e.FactoryName =='')
    {
      this.toastr.warning(this.trans.instant("Factory.Valid_FactoryNameNull"));
      this.laddaSubmitLoading = false;
      return false;
    }
    if (e.FactoryStartDate ==null || e.FactoryBuiltDate == null) 
    {
      this.toastr.warning(this.trans.instant("Factory.Valid_FactoryDate"));
      this.laddaSubmitLoading = false;
      return false;
    }
    if (this.ACTION_STATUS=='add')
    this.api.validateFactory(e).subscribe(res=>{
      var result = res as any;
      debugger;
      if (!result.Success) {
        this.toastr.warning(this.trans.instant("Factory."+result.message));
        this.laddaSubmitLoading = false;
        return false;
      }
      else this.fnSave();
    },err=>this.toastr.warning(err.statusText,"Erron on sending vaidate Factory"))
    else this.fnSave();
  }

  private fnSave() {
    var e = this.entity;
    console.log('send entity: ', e);
    if (this.ACTION_STATUS == 'add') {
      this.api.addFactory(e).subscribe(res => {
        var operationResult: any = res
        if (operationResult.Success){
          this.toastr.success(this.trans.instant("messg.add.success"));
          $("#myModal4").modal('hide');
        }
        else this.toastr.warning(operationResult.Message);
        this.laddaSubmitLoading = false;
        
      }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
    }
    if (this.ACTION_STATUS == 'update') {
      this.api.updateFactory(e).subscribe(res => {
        var operationResult: any = res
        if (operationResult.Success)
          this.toastr.success(this.trans.instant("messg.update.success"));
        else this.toastr.warning(operationResult.Message);
        this.laddaSubmitLoading = false;
      }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
    }
  }

  
  ngAfterViewInit() { //CSS
  }
}
