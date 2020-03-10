import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer, CustomerFile, Factory, Contract } from 'src/app/models/SmartInModels';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { MyHelperService } from 'src/app/services/my-helper.service';
import { TranslateService } from '@ngx-translate/core';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { trigger, animate, style, transition } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { HttpEventType } from '@angular/common/http';
declare let $: any;

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [
      transition(':leave',
        animate(300, style({ opacity: 0 })))
    ])
  ]
})
export class CustomerDetailComponent implements OnInit {
  constructor(
    private api: WaterTreatmentService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private helper: MyHelperService,
    private trans: TranslateService,
    private auth: AuthService
  ) { } 
  private pathFile = "uploadFileCustomer";
  entity: Customer;
  files: File[] = [];
  addFiles: { FileList: File[], FileLocalNameList: string[] };
  invalid: any = {};
  uploadReportProgress: any = { progress: 0, message: null, isError: null };
  initCombobox = { Factories: [], FullFactories: [] };
  EditRowID = 0;
  laddaSubmitLoading = false;
  app_ContractID= 0;
  /**INIT FUNCTIONS */
  ngOnInit() {
    this.resetEntity();
    this.loadInit();
  }
  async loadInit() {
    await this.loadFactoryList();
    /**Add Combobox Value: FACTORY */
    let dataResolver = this.route.snapshot.data["dataResolver"];
    let _factoryAddTag = await this.initCombobox.FullFactories.find(x => x.FactoryID == dataResolver.FactoryId);
    if (_factoryAddTag && await !this.initCombobox.Factories.find(x => x.FactoryID == dataResolver.FactoryId))
      this.initCombobox.Factories = this.initCombobox.Factories.concat([_factoryAddTag]);
    this.entity = dataResolver;
    
    // await this.loadContractByCustomer();
    this.entity.CustomerFile.forEach(item => {
      let _tempFile = new File([], item.File.FileOriginalName);
      this.files.push(_tempFile);
    })
    console.log(this.entity);
  }  
  /**PRIVATE FUNCTIONS */
  private async loadFactoryList() {
    
    let res = await this.api.getBasicFactory().toPromise().then().catch(err => this.toastr.warning('Get factories Failed, check network')) as any;
    this.initCombobox.Factories = (res as any).result.filter(x => x.Status == 1) as Factory[];
    this.initCombobox.FullFactories = (res as any).result as Factory[];
    console.log(this.initCombobox);
  }
  // private async loadContractByCustomer() {
  //   this.entity.Contract = []; 
  //   this.api.getContractByCustomer(this.route.snapshot.params.id).subscribe(res => {
  //     this.entity.Contract = res.result as any;
  //     console.log('init Contract',res.result);
  //   })
  // } 
  private async resetEntity() { //reset entity values
    this.entity = new Customer();
    this.files = [];
    this.addFiles = { FileList: [], FileLocalNameList: [] }
    this.invalid = {};
    this.uploadReportProgress = { progress: 0, message: null, isError: null };
    this.EditRowID = 0;
  }
  async fnSave() { // press save button 
    this.laddaSubmitLoading = true;
    var e = this.entity;
    if (await this.fnValidate(e)) {
      if (this.route.snapshot.params.id == null) { //add
        e.CreateBy = this.auth.currentUser.Username;
        this.api.addCustomer(e).subscribe(res => {
          var operationResult: any = res
          if (operationResult.Success) {
            this.toastr.success(this.trans.instant("messg.add.success"));
            this.router.navigate(["/category/customer/" + operationResult.Data]);
          }
          else this.toastr.warning(operationResult.Message);
          this.laddaSubmitLoading = false;
        }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
      }
      else {
        e.ModifyBy = this.auth.currentUser.Username;
        this.api.updateCustomer(e).subscribe(res => {
          var operationResult: any = res
          if (operationResult.Success) {
            if (this.addFiles.FileList.length > 0) this.uploadFile(this.addFiles.FileList);
            this.toastr.success(this.trans.instant("messg.update.success"));
            this.router.navigate(["/category/customer/" + this.entity.CustomerID]);
          }
          else this.toastr.warning(operationResult.Message);
          this.laddaSubmitLoading = false;
        }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
      }
    }
  }
  fnValidate(e) {
    return true;
  } 
  /**EVENT TRIGGER */
  async onSelect(event) { //drag file(s) or choose file(s) in ngFileZone
    var askBeforeUpload = false;
    if (event.rejectedFiles.length > 0) this.toastr.warning(this.trans.instant('messg.maximumFileSize5000'));
    var _addFiles = event.addedFiles;
    for (var index in _addFiles) { 
      let item = event.addedFiles[index];
      let convertName = this.helper.getFileNameWithExtension(item);
      let currentFile = this.entity.CustomerFile;
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
        let _warehouseFile = new CustomerFile();
        _warehouseFile.File.FileOriginalName = item.name;
        _warehouseFile.File.FileLocalName = convertName;
        _warehouseFile.File.Path = this.pathFile + '/' + convertName;
        _warehouseFile.File.FileType = item.type;
        this.entity.CustomerFile.push(_warehouseFile);
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
    this.entity.CustomerFile.splice(index, 1);
  } 
  onSwitchStatus(_TYPE) { //modal switch on change
    if (_TYPE == 'entity') this.entity.Status = this.entity.Status == 0 ? 1 : 0;
    if (_TYPE == 'entityIsIntergration') this.entity.IsIntergration = !this.entity.IsIntergration;
  }
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


  fnEditItem(id){
    console.log('edit item',id);
    this.app_ContractID = id;
  }

  fnDeleteItem(index){
    swal.fire({
      title: this.trans.instant('Contract.mssg.DeleteAsk_Title'),
      titleText: this.trans.instant('Contract.mssg.DeleteAsk_Text'),
      confirmButtonText: this.trans.instant('Button.OK'),
      cancelButtonText: this.trans.instant('Button.Cancel'),
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true
    }).then((result) => {
    if (result.value) {
        this.entity.Contract.splice(index, 1);
      }
    })
  }

  onChangeAdd(returnContract : Contract){
    console.log('return Contract',returnContract);


  }

  ngAfterViewInit() { 
    
  } 
}
