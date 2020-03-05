import { Component, OnInit } from '@angular/core';
import { Stage, StageFile } from 'src/app/models/SmartInModels';
import { Subject } from 'rxjs';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { MyHelperService } from 'src/app/services/my-helper.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
declare let $: any;
@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit {

  Stages: Stage[]
  entity: Stage;  
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  ACTION_STATUS: string;
  laddaSubmitLoading = false;
  existName = false;
  iboxloading = false;
  files: File[] = [];
  addFiles : {FileList : File[], FileLocalNameList: string[]};
  private pathFile = "uploadFilesStage"
  uploadReportProgress : any= { progress : 0, message: null , isError: null };
  constructor(
    private api: WaterTreatmentService,
    private toastr: ToastrService,
    private trans: TranslateService,
    private auth: AuthService,
    private helper: MyHelperService
  ) { }

  ngOnInit(): void {
    this.loadInit()
    this.resetEntity();
    //  this.serverSide();
  }
  private resetEntity() {
    this.entity = new Stage();
    this.files = [];
    this.addFiles = { FileList: [], FileLocalNameList : []}
    this.uploadReportProgress =  { progress : 0, message: null , isError: null };
  }

 loadInit = async () => {
   await this.loadStage();
    this.dtOptions = {
      autoWidth: true,
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      language:
      {
        searchPlaceholder: this.trans.instant('DefaultTable.searchPlaceholder'),
        emptyTable: this.trans.instant('DefaultTable.emptyTable'),
        info: this.trans.instant('DefaultTable.info'),
        infoEmpty: this.trans.instant('DefaultTable.infoEmpty'),
        infoFiltered: this.trans.instant('DefaultTable.infoFiltered'),
        infoPostFix: this.trans.instant('DefaultTable.infoPostFix'),
        thousands: this.trans.instant('DefaultTable.thousands'),
        lengthMenu: this.trans.instant('DefaultTable.lengthMenu'),
        loadingRecords: this.trans.instant('DefaultTable.loadingRecords'),
        processing: this.trans.instant('DefaultTable.processing'),
        search: this.trans.instant('DefaultTable.search'),
        zeroRecords: this.trans.instant('DefaultTable.zeroRecords'),
        //url: this.trans.instant('DefaultTable.url'),
        paginate: {
          first: '<<',
          last: ">>",
          next: ">",
          previous: "<"
        }
      }
    };    
  }

   loadStage = async () => {
    $('#myTable').DataTable().clear().destroy();
    this.api.getStage().subscribe(res => {
      this.Stages = res as any
      this.dtTrigger.next();
    });

  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  
  onRemove(event) { //press x to delte file (in modal)
    let index = this.files.indexOf(event);
    this.files.splice(index, 1); //UI del
    this.entity.StageFile.splice(index,1);
  }
  fnDelete(id) {
    swal.fire({
      title: this.trans.instant('Stage.DeleteAsk_Title'),
      titleText: this.trans.instant('Stage.DeleteAsk_Text'),
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true
    }).then((result) => {
        if (result.value) {
          this.api.deleteStage(id).subscribe(res => {
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
  fnAdd() {
    this.ACTION_STATUS = 'add';    
    this.existName = false;
    this.resetEntity();
  }
  onSwitchStatus (){
    this.entity.Status = this.entity.Status==0? 1: 0;
  }  

  async fnSave() {
    this.laddaSubmitLoading = true;
    var e = this.entity;
    if (this.ACTION_STATUS == 'add') 
        e.CreateBy = this.auth.currentUser.Username;
    else 
      e.ModifyBy = this.auth.currentUser.Username

    if (await this.fnValidate(e)) {
      console.log('send entity: ', e);
      if (this.ACTION_STATUS == 'add') {
        this.api.addStage(e).subscribe(res => {
          var operationResult: any = res
          if (operationResult.Success){
            if (this.addFiles.FileList.length>0) this.uploadFile(this.addFiles.FileList);
            this.toastr.success(this.trans.instant("messg.add.success"));
          }
          else this.toastr.warning(operationResult.Message);
          this.laddaSubmitLoading = false;
        }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
      }
      if (this.ACTION_STATUS == 'update') {   
        this.api.updateStage(e).subscribe(res => {
          var operationResult: any = res
          if (operationResult.Success)
          {
            if (this.addFiles.FileList.length>0) this.uploadFile(this.addFiles.FileList);
            this.toastr.success(this.trans.instant("messg.update.success"));
            this.addFiles = { FileList: [], FileLocalNameList :[]};
          }            
          else this.toastr.warning(operationResult.Message);
          this.laddaSubmitLoading = false;
        }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
      }
     await this.loadInit();
    }
  }
  fnUpdate(id) { //press a link name of entity
    this.existName = false;
    this.ACTION_STATUS = 'update'
    $("#myModal4").modal('hide');
    if (id===null)  { this.toastr.warning('Stage ID is Null, cant show modal'); return; }
    this.resetEntity();
    this.ACTION_STATUS = 'update';
    this.iboxloading = true;
    this.api.findStageById(id).subscribe(res => {
      this.entity = res;
      //debugger
      $("#myModal4").modal('show');
      this.iboxloading = false;
      /**CONTROL FILES */
      this.entity.StageFile.forEach(item =>{
        let _tempFile = new File([],item.File.FileLocalName);
        this.files.push(_tempFile);
      })
      this.entity.ModifyBy = this.auth.currentUser.Username;
      this.files.push();    
    }, error => {
      this.iboxloading = false;
      this.toastr.error(error.statusText, "Load Stage information error");
    })
  }
  private async fnValidate(e) {
      let result =  await this.api.validateStage(this.entity).toPromise().then() as any;
      if (result.Success) return true;
      else {
        this.laddaSubmitLoading = false;
        this.existName = true;
        return false;
      }
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
      let currentFile = this.entity.StageFile;
      let  findElement =  currentFile.filter(x=>x.File.FileOriginalName == item.name)[0];
      //ASK THEN GET RESULT
      if (findElement!=null) {
        if (!askBeforeUpload) {
          askBeforeUpload = true;
          var allowUpload =true;
          await swal.fire({
            title: this.trans.instant('File.DuplicateCaption'),
            titleText: this.trans.instant('File.DuplicateMessage'),
            type: 'warning',
            confirmButtonText: this.trans.instant('Button.OK'),
            cancelButtonText: this.trans.instant('Button.Cancel'),
            showCancelButton: true,
            reverseButtons: true
            }).then((result) => {
               if (result.dismiss === swal.DismissReason.cancel) allowUpload = false;
            })
        }
        if (!allowUpload)  return;
        let _FileElement = this.files.filter(x=>x.name == findElement.File.FileOriginalName)[0];
        let _indexFileElement = this.files.indexOf(_FileElement,0);
        this.files.splice(_indexFileElement, 1);
        this.addFiles.FileList.splice(_indexFileElement, 1);
      }
      else{
        let _stageFile = new StageFile();
        _stageFile.File.FileOriginalName= item.name;
        _stageFile.File.FileLocalName = convertName;  
        _stageFile.File.Path = this.pathFile + '/' + convertName;
        _stageFile.File.FileType = item.type;
        this.entity.StageFile.push(_stageFile);
        this.addFiles.FileLocalNameList.push(convertName);
      }
      
    }
    this.files.push(...event.addedFiles); //refresh showing in Directive
    this.addFiles.FileList.push(...event.addedFiles);
    
  }
  private uploadFile(files: File[]){ //upload file to server
    let formData = new FormData();
    for (let index = 0; index < files.length; index++) {
      let _file = files[index];
      formData.append("files", _file, this.addFiles.FileLocalNameList[index]);
    }
    this.api.uploadFile(formData, this.pathFile).subscribe(event=> {
      if (event.type === HttpEventType.UploadProgress)
       {   this.uploadReportProgress.progress = Math.round(100 * event.loaded / event.total);
          console.log(this.uploadReportProgress.progress);
        }
      else if (event.type === HttpEventType.Response) {
        this.uploadReportProgress.message = this.trans.instant('Upload.UploadFileSuccess');
        }
    },err=>{
      this.toastr.warning(err.statusText, this.trans.instant('Upload.UploadFileError'));
      this.uploadReportProgress = { progress: 0, message: 'Error: '+ err.statusText, isError: true };
    });
  }
}
