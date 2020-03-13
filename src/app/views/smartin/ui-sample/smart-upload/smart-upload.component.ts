import { Component, OnInit, ElementRef, ViewChild, Input, Output ,EventEmitter, OnChanges, SimpleChange, SimpleChanges} from '@angular/core';
import { MyHelperService } from 'src/app/services/my-helper.service';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { UI_CustomFile } from 'src/app/models/SmartInModels';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-smart-upload',
  templateUrl: './smart-upload.component.html',
  styleUrls: ['./smart-upload.component.css']
})
export class SmartUploadComponent implements OnInit {
  @Input('filePath') pathFile: string = 'uploadFileRandom';
  // @Input('receiveList') receiveList: any;

  @Output('entityFile') send_entityFile = new EventEmitter<UI_CustomFile[]>();  /*** * example: WarehouseFile[] -> File()    */

  constructor(
    private api: WaterTreatmentService,
    private toastr: ToastrService,
    public trans: TranslateService,
    public helper: MyHelperService,
  ) { }
  /** INIT / DECLARATION */
  entityFile : UI_CustomFile[] = [];
  files: File[] = [];
  addFiles: { FileList: File[], FileLocalNameList: string[] };
  
  uploadReportProgress: any = { progress: 0, message: null, isError: null };
  /**INIT FUNCTIONS */
  ngOnInit() { //init functions
    this.resetEntity();
  }
  /**
   *  làm trống file hiển thị
   */
  public  resetEntity() { //reset entity values
    this.entityFile = [];
    this.files = [];
    this.addFiles = { FileList: [], FileLocalNameList: [] }
    this.uploadReportProgress =  { progress : 0, message: null , isError: null };
  }
  /**
   * Load file để hiển thị
   * @param DATA : Entity File - danh sách entity
   */
  public loadInit(DATA: UI_CustomFile[]){
    this.resetEntity();
    this.entityFile = this.entityFile.concat(DATA);
    this.entityFile.forEach(item => {
      let _tempFile = new File([], item.File.FileLocalName);
      this.files.push(_tempFile);
    })
  }
  /** Lệnh upload lên server, thường dùng với await */
  public uploadFile() { //upload file to server
    if (this.addFiles.FileList.length==0) return;
    this.uploadReportProgress = { progress: 0, message: null, isError: null };
    let formData = new FormData();
    for (let index = 0; index < this.addFiles.FileList.length; index++) {
      let _file = this.addFiles.FileList[index];
      formData.append("files", _file, this.addFiles.FileLocalNameList[index]);
    }
    this.api.uploadFile(formData, this.pathFile).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress)
        this.uploadReportProgress.progress = Math.round(100 * event.loaded / event.total);
      else if (event.type === HttpEventType.Response) {
        this.uploadReportProgress.message = this.trans.instant('Upload.UploadFileSuccess');
        // this.onUploadFinished.emit(event.body);
      }
    }, err => {
      this.toastr.warning(err.statusText, this.trans.instant('Upload.UploadFileError'));
      this.uploadReportProgress = { progress: 0, message: 'Error: '+ err.statusText, isError: true };
    });
  }

   fnDownloadFile(filename) { //press FILES preview
    this.api.downloadFile(this.pathFile + '/' + filename);
  }
    fnRemoveFile(event) { //PRESS X TO REMOVE FILES
    let index = this.files.indexOf(event);
    this.files.splice(index, 1); //UI del
    this.entityFile.splice(index, 1);
  }
  /** EVENT TRIGGERS */
   async onSelect(event) { //drag file(s) or choose file(s) in ngFileZone
    var askBeforeUpload = false;
    if (event.rejectedFiles.length > 0) this.toastr.warning(this.trans.instant('messg.maximumFileSize5000'));
    var _addFiles = event.addedFiles;
    for (var index in _addFiles) {
      
      let item = event.addedFiles[index];
      let convertName = this.helper.getFileNameWithExtension(item);
      let currentFile = this.entityFile;
      let findElement = currentFile.filter(x => x.File.FileOriginalName == item.name)[0];
      //ASK THEN GET RESULT
      if (findElement != null) {
        if (!askBeforeUpload) {
          askBeforeUpload = true;
          var allowUpload = true;
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
        if (!allowUpload) return;
        let _FileElement = this.files.filter(x=>x.name == findElement.File.FileOriginalName)[0];
        let _indexFileElement = this.files.indexOf(_FileElement,0);
        this.files.splice(_indexFileElement, 1);
        this.addFiles.FileList.splice(_indexFileElement, 1);
      }
      else {
        let _prepareFileAdd = new UI_CustomFile();
        _prepareFileAdd.File.FileOriginalName = item.name;
        _prepareFileAdd.File.FileLocalName = convertName;
        _prepareFileAdd.File.Path = this.pathFile + '/' + convertName;
        _prepareFileAdd.File.FileType = item.type;
        this.entityFile.push(_prepareFileAdd);
        this.addFiles.FileLocalNameList.push(convertName);
      }

    }
    this.files.push(...event.addedFiles); //refresh showing in Directive
    this.addFiles.FileList.push(...event.addedFiles);
    this.send_entityFile.emit(this.entityFile);
    
  }

  

  

}
