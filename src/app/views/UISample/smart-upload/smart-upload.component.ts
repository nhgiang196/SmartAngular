import { Component, OnInit, ElementRef, ViewChild, Input, Output ,EventEmitter, OnChanges, SimpleChange, SimpleChanges} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';
import { ItemService } from 'src/app/core/services';
import { UI_CustomFile } from 'src/app/core/models/file';
import { MyHelperService } from 'src/app/core/services/my-helper.service';

@Component({
  selector: 'app-smart-upload',
  templateUrl: './smart-upload.component.html',
  styleUrls: ['./smart-upload.component.css']
})
export class SmartUploadComponent implements OnInit {

  @Input('filePath') pathFile: string = 'uploadFileRandom';
  @Output('entityFile') send_entityFile = new EventEmitter<UI_CustomFile[]>();  /*** * example: WarehouseFile[] -> File()    */

  constructor(
    private api: ItemService,
    private toastr: ToastrService,
    public trans: TranslateService,
    private helper: MyHelperService,
  ) { }
  /** INIT / DECLARATION */
  entityFile : UI_CustomFile[] = [];
  files: File[] = [];
  addFiles: { FileList: File[], FileLocalNameList: string[] };
  
  uploadReportProgress: any = { progress: 0, message: null, isError: null };
  /**INIT FUNCTIONS */
  ngOnInit() { //init functions
    // this.resetEntity();
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
    console.log(this.files);
  }
  /** Lệnh upload lên server, thường dùng chờ hàm này trước khi gửi dữ liệu (await) */
  public uploadFile() { //upload file to server
    if (this.addFiles.FileList.length==0) return;
    this.uploadReportProgress = { progress: 0, message: null, isError: null };
    let formData = new FormData();
    for (let index = 0; index < this.addFiles.FileList.length; index++) {
      let _file = this.addFiles.FileList[index];
      formData.append("files", _file, this.addFiles.FileLocalNameList[index]);
    }
    // this.api.uploadFile(formData, this.pathFile).subscribe(event => {
    //   if (event.type === HttpEventType.UploadProgress)
    //     this.uploadReportProgress.progress = Math.round(100 * event.loaded / event.total);
    //   else if (event.type === HttpEventType.Response) {
    //     this.uploadReportProgress.message = this.trans.instant('Upload.UploadFileSuccess');
    //     // this.onUploadFinished.emit(event.body);
    //   }
    // }, err => {
    //   this.toastr.warning(err.statusText, this.trans.instant('Upload.UploadFileError'));
    //   this.uploadReportProgress = { progress: 0, message: 'Error: '+ err.statusText, isError: true };
    // });
  }

   fnDownloadFile(filename) { //press FILES preview
    let url: string = '/api/v1/File/DownloadFile?fileName='+this.pathFile + '/' + filename;
    window.open(url);
  }
    fnRemoveFile(event) { //PRESS X TO REMOVE FILES
    let index = this.files.indexOf(event);
    this.files.splice(index, 1); //UI del
    this.entityFile.splice(index, 1);
    this.send_entityFile.emit(this.entityFile);
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
    var _addFiles = Object.assign({}, event.addedFiles); //stop binding
    for (var index in _addFiles) {
      let item = _addFiles[index];
      let convertName = this.helper.getFileNameWithExtension(item);
      let currentFile = this.entityFile;
      let findElement = currentFile.filter(x => x.File.FileOriginalName == item.name)[0];
      //ASK THEN GET RESULT
      if (findElement != null) {
        // if (!askBeforeUpload) {
        //   askBeforeUpload = true;
        var allowUpload = true;
        await swal.fire({
          title: this.trans.instant("Upload.DuplicateCaption"),
          titleText: this.trans.instant("Upload.DuplicateMessage")+ findElement.File.FileOriginalName,
          type: 'warning',
          confirmButtonText: this.trans.instant('Button.Yes'),
          cancelButtonText: this.trans.instant('Button.Cancel'),
          showCancelButton: true,
          reverseButtons: true
        }).then((result) => {
          if (result.dismiss === swal.DismissReason.cancel) allowUpload = false;
        })
        // }
        if (!allowUpload) {
          event.addedFiles.splice(event.addedFiles.indexOf(item),1);
          continue;
        }
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
