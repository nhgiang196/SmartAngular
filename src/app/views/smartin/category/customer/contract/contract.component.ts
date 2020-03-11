import { Component, OnInit, AfterViewInit, OnDestroy, Input, Output, SimpleChanges , EventEmitter} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Contract, ContractPrice, ContractBreach, ContractFile } from 'src/app/models/SmartInModels';
import { collapseIboxHelper } from 'src/app/app.helpers';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { MyHelperService } from 'src/app/services/my-helper.service';
import { AuthService } from 'src/app/services/auth.service';
declare let $: any;
import swal from 'sweetalert2';
import { trigger, transition, animate, style } from '@angular/animations';
@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [
      transition(':leave',
        animate(300, style({ opacity: 0 })))
    ])
  ]
})
export class ContractComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('contractid') contractId : number;
  @Output('contract') send_entity = new EventEmitter<Contract>();
  
  constructor(
    private api: WaterTreatmentService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private helper: MyHelperService,
    private trans: TranslateService,
    private auth: AuthService
  ) {
  }
  private pathFile = 'uploadFileContract'
  entity : Contract;
  files: File[] = [];
  addFiles: { FileList: File[], FileLocalNameList: string[] };
  invalid: any = {};
  uploadReportProgress: any = { progress: 0, message: null, isError: null };
  initCombobox = {  };
  EditRowID = 0;
  EditRowID_PRICE = 0;
  laddaSubmitLoading= false;
  bsConfig = { dateInputFormat: 'YYYY-MM-DD', adaptivePosition: true };

  subEntity_ContractPrice : ContractPrice = new ContractPrice();
  newEntity_ContractPrice : ContractPrice = new ContractPrice();
  subEntity_ContractBreach: ContractBreach = new ContractBreach();
  newEntity_ContractBreach :ContractBreach= new ContractBreach();

  ngOnInit() {
    this.resetEntity();
    
  }

  private async resetEntity() { //reset entity values
    this.entity = new Contract();
    this.files = [];
    this.addFiles = { FileList: [], FileLocalNameList: [] }
    this.invalid = { Existed_ContractNo: false};
    this.uploadReportProgress = { progress: 0, message: null, isError: null };
    this.EditRowID = 0;
    this.EditRowID_PRICE = 0;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes',changes);
    if (changes.contractId.firstChange || changes.contractId.currentValue==null ) return;
  }

  ngAfterViewInit(){
    $('#myContractModal').modal('show');
  }
  ngOnDestroy(){

  }


  /**Button Functions */
  fnSave(){
    this.send_entity.emit(this.entity);
  }
  
  fnAddContractBreach(itemAdd){
    // let _checkValidate = await this.validateItem(itemAdd);
    //  if (!_checkValidate) return;
    // let validateResult = await this.api.validateWarehouseLocation(itemAdd).toPromise().then() as any;
    // if (!validateResult.Success){
    //   swal.fire("Validate",this.trans.instant('Warehouse.invalid.'+ validateResult.Message),'warning'); return;
    // }
    itemAdd.ContractID = this.entity.ContractID;
    this.entity.ContractBreach.push(itemAdd);
    this.newEntity_ContractBreach = new ContractBreach();
  }
  fnAddContractPrice(itemAdd){
    itemAdd.ContractID = this.entity.ContractID;
    this.entity.ContractPrice.push(itemAdd);
    this.newEntity_ContractPrice= new ContractPrice();
  }

  fnEditContractBreach(index){
    this.EditRowID = index + 1;
    this.subEntity_ContractBreach = this.entity.ContractBreach[index];
  }

  fnEditContractPrice(index){
    this.EditRowID_PRICE = index + 1;
    this.subEntity_ContractPrice = this.entity.ContractPrice[index];
  }

  fnDeleteContractPrice(index){
    this.entity.ContractPrice.splice(index, 1);
  }
  
  fnDeleteContractBreach(index){
    this.entity.ContractBreach.splice(index, 1);
  }

  fnValidateContractBreach(){

  }

  fnValidateContractPrice(){
    
  }

  



  /**Event triggers */


  async onSelect(event) { //drag file(s) or choose file(s) in ngFileZone
    var askBeforeUpload = false;
    if (event.rejectedFiles.length > 0) this.toastr.warning(this.trans.instant('messg.maximumFileSize5000'));
    var _addFiles = event.addedFiles;
    for (var index in _addFiles) { 
      let item = event.addedFiles[index];
      let convertName = this.helper.getFileNameWithExtension(item);
      let currentFile = this.entity.ContractFile;
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
        let _FileElement = this.files.filter(x => x.name == findElement.File.FileOriginalName)[0];
        let _indexFileElement = this.files.indexOf(_FileElement, 0);
        this.files.splice(_indexFileElement, 1);
        this.addFiles.FileList.splice(_indexFileElement, 1);
      }
      else {
        let _warehouseFile = new ContractFile();
        _warehouseFile.File.FileOriginalName = item.name;
        _warehouseFile.File.FileLocalName = convertName;
        _warehouseFile.File.Path = this.pathFile + '/' + convertName;
        _warehouseFile.File.FileType = item.type;
        this.entity.ContractFile.push(_warehouseFile);
        this.addFiles.FileLocalNameList.push(convertName);
      }
    }
    this.files.push(...event.addedFiles); //refresh showing in Directive
    this.addFiles.FileList.push(...event.addedFiles);
  }

  fnDownloadFile(filename) { //press FILES preview
    this.api.downloadFile(this.pathFile + '/' + filename);
  }
  fnRemoveFile(event) { //PRESS X TO REMOVE FILES
    let index = this.files.indexOf(event);
    this.files.splice(index, 1); //UI del
    this.entity.ContractFile.splice(index, 1);
  } 
  

  /**PRIVATE FUNCTIONS */

  private uploadFile(files: File[]) { //upload file to server
    let formData = new FormData();
    for (let index = 0; index < files.length; index++) {
      let _file = files[index];
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
      this.uploadReportProgress = { progress: 0, message: 'Error: ' + err.statusText, isError: true };
    });
  }


  

}
