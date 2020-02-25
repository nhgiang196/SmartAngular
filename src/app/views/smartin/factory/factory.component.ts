import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { collapseIboxHelper } from '../../../app.helpers';
import { MyHelperService } from 'src/app/services/my-helper.service';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { Factory, FactoryTechnology, FactoryFile, Files } from 'src/app/models/SmartInModels';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { MomentModule } from 'ngx-moment';
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
    public helper: MyHelperService,
    private auth: AuthService
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
  invalid : any = {FactoryCodeNull: false, FactoryCodeExist: false, FactoryNameNull: false, FactoryNameExist: false};
  ngOnInit() {
    this.resetEntity();
    this.loadInit();
  }authService
  
  loadInit() {
    this.iboxloading = true;
    this.factory = [];
    this.api.getFactoryPagination(this.keyword).subscribe(res => {
      
      var data = res as any;
      this.factory = data.result;
      this.factory_showed = data.totalCount;
      this.iboxloading = false;
      
    }, err => {
      this.toastr.error(err.statusText, "Load init failed!");
      this.iboxloading = false;
    })
  }
  private resetEntity() {
    this.entity = new Factory();
    this.tech_entity = new FactoryTechnology();
    this.files = [];
  }
  fnAdd() {
    this.ACTION_STATUS = 'add';
    this.resetEntity();
    this.entity.CreateBy = this.auth.currentUser.Username;
  }
  fnEditSignal(id) {
    if (id==null)  { this.toastr.warning('Factory ID is Null, cant show modal'); return; }
    this.resetEntity();
    this.ACTION_STATUS = 'update';
    this.iboxloading = true;
    this.api.getFactoryById(id).subscribe(res => {
      this.entity = res;
      $("#myModal4").modal('show');
      this.iboxloading = false;
      /**CONTROL FILES */
      this.entity.FactoryFile.forEach(item =>{
        let _tempFile = new File([],item.File.FileOriginalName);
        this.files.push(_tempFile);
      })
      this.entity.ModifyBy = this.auth.currentUser.Username;
      this.files.push();
      
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

  fnEditItem(index){
    this.tech_entity = this.entity.FactoryTechnology[index];
    this.entity.FactoryTechnology.splice(index, 1);
  }
  fnDeleteItem(index) {
    this.entity.FactoryTechnology.splice(index, 1);
  }
  
  onSelect(event) {
    console.log(event);
    // this.files.push(...event.addedFiles); //refresh showing in Directive
    if (event.rejectedFiles.length>0) this.toastr.warning(this.trans.instant('messg.maximumFileSize2000'));
    for (var index in event.addedFiles) {
      let item = event.addedFiles[index];
      let currentFile = this.files;
      var _existIndex = currentFile.filter(x=>x.name == item.name).length;
      if (_existIndex>0) this.files.splice(_existIndex-1,1);
      else{
        
        let _factoryFile = new FactoryFile();
        _factoryFile.File.FileOriginalName= item.name;
        _factoryFile.File.FileName = this.helper.getFileNameWithExtension(item);
        _factoryFile.File.Path = this.pathFile + '/' + item.name;
        this.entity.FactoryFile.push(_factoryFile);
      }
    }
    this.files.push(...event.addedFiles); //refresh showing in Directive
    this.uploadFile(event.addedFiles);
    
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
          formData.append("files",file);
      });
      this.api.uploadFile(formData, this.pathFile).subscribe(res=> console.log(res));
  }

  onSwitchStatus (){
    this.entity.Status = this.entity.Status==0? 1: 0;
    if (this.entity.Status==1) this.entity.FactoryEndDate = null;
  }


  // removeFile = (file) => this.api.deleteFile(`${this.pathFile}\\${file.name}`).subscribe(res=>console.log(res));
  

  async fnSave() {
    this.laddaSubmitLoading = true;
    var e = this.entity;
    console.log('send entity: ', e);
    debugger;
    if (await this.fnValidate(e))
    {
      
      if (this.ACTION_STATUS == 'add') {
        this.api.addFactory(e).subscribe(res => {
          var operationResult: any = res
          if (operationResult.Success){
            this.toastr.success(this.trans.instant("messg.add.success"));
            $("#myModal4").modal('hide');
            this.loadInit();
            this.fnEditSignal(operationResult.Data);
          }
          else this.toastr.warning(operationResult.Message);
          this.laddaSubmitLoading = false;
          
        }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
      }

      if (this.ACTION_STATUS == 'update') {
        this.api.updateFactory(e).subscribe(res => {
          var operationResult: any = res
          if (operationResult.Success){
            this.loadInit();
            this.toastr.success(this.trans.instant("messg.update.success"));
          }
          else this.toastr.warning(operationResult.Message);
          this.laddaSubmitLoading = false;
        }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
      }

    }

  }

  private async fnValidate(e: Factory) {
    this.invalid = {};
    
    let result = await this.api.validateFactory(e).toPromise().then() as any;
    if (!result.Success)
    {
      this.laddaSubmitLoading = false;
      this.invalid[result.Message] = true;
      return false;
    }
    return true;
  }



  
  ngAfterViewInit() { //CSS
  }
}
