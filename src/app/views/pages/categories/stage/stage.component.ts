import { Component, OnInit, ViewChild } from '@angular/core';
import { StageService } from 'src/app/core/services/stage.service';
import CustomStore from 'devextreme/data/custom_store';
import { AuthService } from 'src/app/core/services';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { MyHelperService } from 'src/app/core/services/utility/my-helper.service';
import { StageFile, Stage } from 'src/app/core/models/stage';
import { HttpEventType } from '@angular/common/http';
import { FileService } from 'src/app/core/services/file.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { NotifyService } from 'src/app/core/services/utility/notify.service';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
import { LanguageService } from 'src/app/core/services/language.service';
var URL = "api/v1/Stage";
@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})

export class StageComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  dataSource: any;
  stageFiles: any[] = [];
  files: File[] = [];
  entity: Stage;
  addFiles: { FileList: File[], FileLocalNameList: string[] };
  private pathFile = "uploadFilesStage"
  uploadReportProgress: any = { progress: 0, message: null, isError: null };
  lookupField: any = {};
  constructor(private stageService: StageService,
    private trans: TranslateService,
    private auth: AuthService,
    private fileService: FileService,
    private helper: MyHelperService,
    private notifyService: NotifyService,
    private toastr: ToastrService,
    private lang: LanguageService,
    private devExtremeService: DevextremeService) {
    this.dataSource = this.stageService.getDataGrid(false);
    this.stageValidation = this.stageValidation.bind(this);
    this.validateStageCode = this.validateStageCode.bind(this);
    this.fnDelete = this.fnDelete.bind(this);
    this.lookupField['Status']= devExtremeService.loadDefineLookup("Status",lang.getLanguage());
  }

  ngOnInit() {
    this.resetEntity();
    
  }
  addRow() {
    this.dataGrid.instance.addRow();
    this.dataGrid.instance.deselectAll();
  }
  onSwitchStatus(e) {
    this.entity.Status = e.value;//this.entity.Status == 0 ? 1 : 0;
  }
  //Load popup by propertyId
  filterByStageId(e) {
    this.resetEntity();
    this.entity.StageId = e.data.StageId
    this.stageService.findById(this.entity.StageId).subscribe(res => {
      this.entity = res
      this.pushFiles(this.entity.StageFile);
    })
  }
  pushFiles(stageFiles) {
    /**CONTROL FILES */
    stageFiles.forEach(item => {
      let _tempFile = new File([], item.File.FileLocalName);
      this.files.push(_tempFile);
    })
    this.files.push();
  }
  private resetEntity() {
    this.entity = new Stage();
    this.files = [];
    this.addFiles = { FileList: [], FileLocalNameList: [] }
    this.uploadReportProgress = { progress: 0, message: null, isError: null };
  }
  //Trigger for raise event update
  onEditorPreparing(e) {
    if (e.dataField == "StageName" && e.parentType === "dataRow") {
      e.setValue((e.value == null) ? "" : (e.value + "")); // Updates the cell value
    }
    // if (e.dataField == "Status" && e.parentType === "dataRow") {
    //   e.editorName = "dxSwitch";
    // }
  }

  /**
   * Prepare Stage dataSource to Update
   * It will be execute in StageService
   * @param e params as Stage with dataSourcePropeties
   */
  onRowUpdatingStage(e) {
    //reAssign for get properties of oldData
    const data = Object.assign(e.oldData, e.newData);
    data.ModifyBy = this.auth.currentUser.Username;
    data.ModifyDate = new Date();
    data.Status = data.Status ? 1 : 0; //tenary operation if (data.status == true) return 1 else return 0
    data.StageFile = this.resetStageId(this.entity.StageFile)
    e.newData = data;//set object
    if (this.addFiles.FileList.length > 0)
      this.uploadFile(this.addFiles.FileList);

  }

  onRowInsertingStage(e) {
    e.data.Status = e.data.Status ? 1 : 0;
    e.data.CreateBy = this.auth.currentUser.Username;
    e.data.CreateDate = new Date();
    e.data.StageId = 0;
    e.data.StageFile = this.entity.StageFile//this.stageFiles;
    if (this.addFiles.FileList.length > 0)
      this.uploadFile(this.addFiles.FileList);
  }

  onInitNewRow(e) {
    this.resetEntity();
    e.data.Status = 1;
    e.data.CreateBy = this.auth.currentUser.Username;
  }
  /**
 * reset StagePropertyId = 0
 * Although use for instead of forEach. But I used forEach to read easier.
 * @param dataSource
 */
  resetStageId(dataSource) {
    dataSource.forEach(item => {
      item.StageId = 0
    })
    return dataSource;
  }
  downloadFile(filename) { //press File to download (in modal)
    this.fileService.downloadFile(this.pathFile + '/' + filename);
  }

  onRemove(event) { //press x to delte file (in modal)
    let index = this.files.indexOf(event);
    this.files.splice(index, 1); //UI del
    this.entity.StageFile.splice(index, 1);
  }

  /** EVENT TRIGGERS */
  async onSelect(event) { //drag file(s) or choose file(s) in ngFileZone
    var askBeforeUpload = false;
    if (event.rejectedFiles.length > 0) {
      swal.fire(
        {
          title: this.trans.instant('Upload.OverMaximumSizeCaption'),
          titleText: this.trans.instant('Upload.OverMaximumSize5000Message'),
          confirmButtonText: this.trans.instant('Button.OK'),
          type: 'warning',
        }
      );
      allowUpload = false;
    }
    var _addFiles = event.addedFiles;
    for (var index in _addFiles) {
      let item = event.addedFiles[index];
      let convertName = this.helper.getFileNameWithExtension(item);
      let currentFile = this.entity.StageFile;
      let findElement = currentFile.filter(x => x.File.FileOriginalName == item.name)[0];
      //ASK THEN GET RESULT
      if (findElement != null) {
        if (!askBeforeUpload) {
          askBeforeUpload = true;
          var allowUpload = true;
          await swal.fire({
            title: this.trans.instant("Upload.DuplicateCaption"),
            titleText: this.trans.instant("Upload.DuplicateMessage"),
            type: 'warning',
            confirmButtonText: this.trans.instant('Button.Yes'),
            cancelButtonText: this.trans.instant('Button.Cancel'),
            showCancelButton: true,
            reverseButtons: true
          }).then((result) => {
            if (result.dismiss === swal.DismissReason.cancel) allowUpload = false;
          })
        }
        if (!allowUpload) return;
        let _FileElement = this.files.filter(x => x.name == findElement.File.FileOriginalName)[0];
        let _indexFileElement = this.files.indexOf(_FileElement, 0);
        this.files.splice(_indexFileElement, 1);
        this.addFiles.FileList.splice(_indexFileElement, 1);
      }
      else {
        let _stageFile = new StageFile();
        _stageFile.File.FileOriginalName = item.name;
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
  private uploadFile(files: File[]) { //upload file to server
    let formData = new FormData();
    for (let index = 0; index < files.length; index++) {
      let _file = files[index];
      formData.append("files", _file, this.addFiles.FileLocalNameList[index]);
    }
    this.fileService.uploadFile(formData, this.pathFile).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.uploadReportProgress.progress = Math.round(100 * event.loaded / event.total);
        
      }
      else if (event.type === HttpEventType.Response) {
        this.uploadReportProgress.message = this.trans.instant('Upload.UploadFileSuccess');
      }
    }, err => {
      this.toastr.warning(err.statusText, this.trans.instant('Upload.UploadFileError'));
      this.uploadReportProgress = { progress: 0, message: 'Error: ' + err.statusText, isError: true };
    });
  }
  stageValidation(e) {
    
    if (e.value == "" || e.value == null) {
      return new Promise((resolve, reject) => {
        reject("Field is empty!");
      });
    } else {
      return new Promise((resolve, reject) => {
        this.stageService.validate(e.data)
          .then((result: any) => {
            result.Success ? resolve() : reject("StageName already exist!");
            resolve(result);
          }).catch(error => {
            //console.error("Server-side validation error", error);
            resolve()
          });
      });
    }
  }
  validateStageCode(e){
    if (e.value == "" || e.value == null) {
      return new Promise((resolve, reject) => {
        reject("Field is empty!");
      });
    } else {
      return new Promise((resolve, reject) => {
        this.stageService.validateCode(e.data)
          .then((result: any) => {
            result.Success ? resolve() : reject("StageCode already exist!");
            resolve(result);
          }).catch(error => {
            //console.error("Server-side validation error", error);
            resolve()
          });
      });
    }
  }
  fnDelete(e){
      this.notifyService.confirmDelete(()=>{
       this.stageService.remove(e.row.data.StageId).then((result: any)=>{
        this.dataGrid.instance.refresh();
        this.notifyService.success("Xóa thành công!");
       }).catch(error => {
          if(error.error.search("Error Number:547")){
            this.notifyService.error("Dữ liệu đã phát sinh!");
          }
       });
      });
  }
}
