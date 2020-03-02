import { Component, OnInit, ElementRef, ViewChild, Output } from '@angular/core';
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
import { HttpEventType } from '@angular/common/http';
import { EventEmitter } from 'protractor';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
  /** DECLARATION */
  factory: Factory[]= []; //init data
  entity: Factory;
  tech_entity: FactoryTechnology;
  laddaSubmitLoading = false;
  iboxloading = false;
  files: File[] = [];
  newTechnology : FactoryTechnology;
  addFiles : {FileList : File[], FileLocalNameList: string[]};
  keyword : string = '';
  private pathFile = "uploadFilesFactory"
  ACTION_STATUS: string;
  factory_showed = 0;
  invalid : any = {FactoryCodeNull: false, FactoryCodeExist: false, FactoryNameNull: false, FactoryNameExist: false};
  uploadReportProgress : any= { progress : 0, message: null , isError: null };
  
  FactoryBuiltDate: Date = new Date();
  FactoryStartDate: Date = new Date();
  FactoryEndDate: Date = null;
  EditRowID: number =0;
  
  ngOnInit() {
    this.resetEntity();
    this.loadInit();
  }
  /**INIT FUNCTIONS */
  loadInit() {
    this.iboxloading = false;    
    this.EditRowID =0;
    
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
    this.newTechnology = new FactoryTechnology();
    this.files = [];
    this.addFiles = { FileList: [], FileLocalNameList : []}
    this.invalid = {};
    this.FactoryBuiltDate = new Date();
    this.FactoryStartDate= new Date();
    this.FactoryEndDate= null;
    this.uploadReportProgress =  { progress : 0, message: null , isError: null };
    this.EditRowID=0;
  }

  /** BUTTON ACTIONS */
  
  fnAdd() { //press add buton
    this.ACTION_STATUS = 'add';
    this.resetEntity();
    this.entity.CreateBy = this.auth.currentUser.Username;
  }
  fnEditSignal(id) { //press a link name of entity
    $("#myModal4").modal('hide');
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
        let _tempFile = new File([],item.File.FileLocalName);
        this.files.push(_tempFile);
      })
      this.entity.ModifyBy = this.auth.currentUser.Username;
      this.files.push();
      /** ALL DATE */
      this.FactoryBuiltDate = this.entity.FactoryBuiltDate? new Date(this.entity.FactoryBuiltDate): null;
      this.FactoryStartDate = this.entity.FactoryStartDate? new Date(this.entity.FactoryStartDate): null;
      this.FactoryEndDate= this.entity.FactoryEndDate? new Date(this.entity.FactoryEndDate): null;
    }, error => {
      this.iboxloading = false;
      this.toastr.error(error.statusText, "Load factory information error");
    })
  }
  fnDelete(id) { //press X to delete entity
    swal.fire({
      title: this.trans.instant('Factory.mssg.DeleteAsk_Title'),
      titleText: this.trans.instant('Factory.mssg.DeleteAsk_Text'),
      confirmButtonText: 'ok',
      cancelButtonText: 'no ok',
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
                // 'Deleted!', this.trans.instant('messg.delete.success'), 
                {
                  title: 'Deleted!',
                  titleText: this.trans.instant('messg.delete.success'),
                  confirmButtonText: 'ok',
                  type: 'success',
                }
              );
              this.loadInit();
              $("#myModal4").modal('hide');
            }
            else this.toastr.warning(operationResult.Message);
          }, err => { this.toastr.error(err.statusText) })
        }
      })
  }
  
  fnAddItem() { //press add item (in modal)
    var itemAdd = this.newTechnology;
    if (itemAdd.TechnologyName == null) {
      swal.fire("Validate", this.trans.instant('Factory.data.TechnologyName') + this.trans.instant('messg.isnull'), 'warning');
      return;
    }
    itemAdd.FactoryId = this.entity.FactoryId;
    this.newTechnology = new FactoryTechnology();
    this.entity.FactoryTechnology.push(itemAdd);
  }

  fnEditItem(index){ //press edit item (in modal)
    this.EditRowID = index +1;
    this.tech_entity = this.entity.FactoryTechnology[index];
  }
  fnSaveItem(index){
    this.EditRowID = 0;
  }
  fnDeleteItem(index) { //press delete item (in modal)
    this.entity.FactoryTechnology.splice(index, 1);
    console.log(this.entity.FactoryTechnology);
  }

  async fnSave() { //press save/SUBMIT button 
    this.uploadReportProgress =  { progress : 0, message: null, isError: null };
    this.laddaSubmitLoading = true;
    var e = this.entity;
    e.FactoryStartDate = this.helper.dateConvertToString(this.FactoryStartDate);
    e.FactoryBuiltDate = this.helper.dateConvertToString(this.FactoryBuiltDate);
    e.FactoryEndDate = this.helper.dateConvertToString(this.FactoryEndDate); 
    console.log('send entity: ', e);
    
    
    if (await this.fnValidate(e))
    {
      
      if (this.ACTION_STATUS == 'add') {
        this.api.addFactory(e).subscribe(res => {
          var operationResult: any = res
          if (operationResult.Success){
            this.toastr.success(this.trans.instant("messg.add.success"));
            $("#myModal4").modal('hide');
            if (this.addFiles.FileList.length>0) this.uploadFile(this.addFiles.FileList);
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
            if (this.addFiles.FileList.length>0) this.uploadFile(this.addFiles.FileList);
            this.loadInit();
            this.toastr.success(this.trans.instant("messg.update.success"));
            this.addFiles = { FileList: [], FileLocalNameList :[]};
            
          }
          else this.toastr.warning(operationResult.Message);
          this.laddaSubmitLoading = false;
        }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
      }
      
    }

  }


  onRemove(event) { //press x to delte file (in modal)
    console.log(event);
    let index = this.files.indexOf(event);
    this.files.splice(index, 1); //UI del
    this.entity.FactoryFile.splice(index,1);
    // this.removeFile(event);
  }
  downloadFile(filename){ //press File to download (in modal)
    this.api.downloadFile(this.pathFile+'/'+filename);
  }

  /** EVENT TRIGGERS */
  async onSelect(event) { //drag file(s) or choose file(s) in ngFileZone
    var askBeforeUpload = false;
    if (event.rejectedFiles.length>0) this.toastr.warning(this.trans.instant('messg.maximumFileSize5000'));
    var _addFiles = event.addedFiles;
    for (var index in _addFiles) {
      let item = event.addedFiles[index];
      let convertName = this.helper.getFileNameWithExtension(item);
      let currentFile = this.entity.FactoryFile;
      let  findElement =  currentFile.filter(x=>x.File.FileOriginalName == item.name)[0];
      //ASK THEN GET RESULT
      if (findElement!=null) {
        if (!askBeforeUpload) {
          askBeforeUpload = true;
          var allowUpload =true;
          await swal.fire({
            title: 'File trùng',
            titleText: 'Một số file bị trùng, bạn có muốn đè các file này lên bản gốc?',
            type: 'warning',
            showCancelButton: true,
            reverseButtons: true
            }).then((result) => {
               if (result.dismiss === swal.DismissReason.cancel) allowUpload = false;
            })
        }
        if (!allowUpload)  return;
        let _indexElement = this.entity.FactoryFile.indexOf(findElement,0);
        this.files.splice( _indexElement,1 );
        this.addFiles.FileList.splice(_indexElement,1 );
      }
      else{
        let _factoryFile = new FactoryFile();
        _factoryFile.File.FileOriginalName= item.name;
        _factoryFile.File.FileLocalName = convertName;  
        _factoryFile.File.Path = this.pathFile + '/' + convertName;
        _factoryFile.File.FileType = item.type;
        this.entity.FactoryFile.push(_factoryFile);
        this.addFiles.FileLocalNameList.push(convertName);
      }
      
    }
    this.files.push(...event.addedFiles); //refresh showing in Directive
    this.addFiles.FileList.push(...event.addedFiles);
    // this.uploadFile(event.addedFiles);
    
  }
  onSwitchStatus (){ //modal switch on change
    this.entity.Status = this.entity.Status==0? 1: 0;
    if (this.entity.Status==1) {
      this.entity.FactoryEndDate = null;
      this.FactoryEndDate = null;
    
    }

  }
  /** PRIVATES FUNCTIONS */
 

  private async fnValidate(e: Factory) { //validate entity
    this.invalid = {};
    
    let result = await this.api.validateFactory(e).toPromise().then().catch(err => {
      this.laddaSubmitLoading = false;
      this.toastr.warning(err.statusText,'Validate Got Error');
    }) as any;
    if (!result.Success)
    {
      this.laddaSubmitLoading = false;
      this.invalid[result.Message] = true;
      return false;
    }
    return true;
  }
  private uploadFile(files: File[]){ //upload file to server
    let formData = new FormData();
    for (let index = 0; index < files.length; index++) {
      let _file = files[index];
      formData.append("files", _file, this.addFiles.FileLocalNameList[index]);
    }
    this.api.uploadFile(formData, this.pathFile).subscribe(event=> {
      if (event.type === HttpEventType.UploadProgress)
          this.uploadReportProgress.progress = Math.round(100 * event.loaded / event.total);
      else if (event.type === HttpEventType.Response) {
          this.uploadReportProgress.message = 'Upload success';
          // this.onUploadFinished.emit(event.body);
        }
    },err=>{
      this.toastr.warning(err.statusText,'Upload file bị lỗi');
      this.uploadReportProgress =  { progress : 0, message: 'Error', isError: true};
    });
  }

  private fnCheckBeforeEdit(id) { //un done
    this.toastr.warning("User not dont have permission");
  }
  ngAfterViewInit() { //CSS
  }

  ngOnDestroy(){
    $('.modal').modal('hide');
  }


}
