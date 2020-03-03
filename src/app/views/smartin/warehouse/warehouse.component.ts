import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MyHelperService } from 'src/app/services/my-helper.service';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { Warehouse, Files, WarehouseLocation, WarehouseFile } from 'src/app/models/SmartInModels';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { trigger, transition, animate, style } from '@angular/animations';
import { HttpEventType } from '@angular/common/http';
declare let $: any;
@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [
      transition(':leave',
        animate(300, style({ opacity: 0 })))
    ])
  ]
})
export class WarehouseComponent implements OnInit {
  @ViewChild('myInputFile')// Dropzone:  set for emtpy file after Close or Reload
  InputManual: ElementRef;
  constructor(
    private api: WaterTreatmentService,
    private toastr: ToastrService,
    public trans: TranslateService,
    public helper: MyHelperService,
    private auth: AuthService
  ) { }
  /** INIT / DECLARATION */
  Warehouse: Warehouse[] = []; //init data
  entity: Warehouse;
  locationEntity: WarehouseLocation;
  newLocationEntity: WarehouseLocation;
  laddaSubmitLoading = false;
  iboxloading = false;
  files: File[] = [];
  addFiles: { FileList: File[], FileLocalNameList: string[] };
  keyword: string = '';
  private pathFile = "uploadFileWarehouse";
  ACTION_STATUS: string;
  Warehouse_showed = 0;
  invalid: any = { Existed_WarehouseCode: false, Existed_WarehouseName: false };
  initCombobox = { Factories: [], Users: [] };
  uploadReportProgress: any = { progress: 0, message: null, isError: null };
  EditRowID: number = 0;
  /**INIT FUNCTIONS */
  ngOnInit() { //init functions
    this.resetEntity();
    this.loadInit();
    this.loadFactoryList();
    this.loadUsers();

    
  }
  private loadFactoryList() {
    this.api.getFactory().subscribe(res => {
      this.initCombobox.Factories = res;
      console.log(this.initCombobox);
    }, err => this.toastr.warning('Get factories Failed, check network'))
  }
  private loadUsers() {
    this.auth.getUsers().subscribe(res=>{
      this.initCombobox.Users= res;
    })
  }

  loadInit() { //init loading
    this.iboxloading = true;

    this.api.getWarehousePagination(this.keyword).subscribe(res => {
      var data = res as any;
      this.Warehouse = data.result;
      this.Warehouse_showed = data.totalCount;
      this.iboxloading = false;
    }, err => {
      this.toastr.error(err.statusText, "Load init failed!");
      this.iboxloading = false;
    });
  }
  onSwitchStatus (_TYPE){ //modal switch on change
    if (_TYPE == 'newLocationEntity') this.newLocationEntity.Status=  this.newLocationEntity.Status==0 ? 1: 0;
    if (_TYPE == 'locationEntity') this.locationEntity.Status =  this.locationEntity.Status==0 ? 1: 0;
  }
  /** BUTTON ACTIONS */
  fnAdd() { //press new button
    this.ACTION_STATUS = 'add';
    this.resetEntity();
    this.entity.CreateBy = this.auth.currentUser.Username;
  }
  fnEditSignal(id) { //press a link of ENTITY
    if (id == null) { this.toastr.warning('ID is Null, cant show modal'); return; }
    this.resetEntity();
    this.ACTION_STATUS = 'update';
    this.iboxloading = true;
    this.api.findWarehouseById(id).subscribe(res => {
      this.entity = res;
      console.log(res);
      $("#myModal4").modal('show');
      this.iboxloading = false;
      /**CONTROL FILES */
      this.entity.WarehouseFile.forEach(item => {
        let _tempFile = new File([], item.File.FileOriginalName);
        this.files.push(_tempFile);
      })
      this.entity.ModifyBy = this.auth.currentUser.Username;
      this.files.push();

    }, error => {
      this.iboxloading = false;
      this.toastr.error(error.statusText, "Load factory information error");
    })
  }
  fnDelete(id) { //press Delete Entity
    swal.fire({
      title: this.trans.instant('Warehouse.mssg.DeleteAsk_Title'),
      titleText: this.trans.instant('Warehouse.mssg.DeleteAsk_Text'),
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.api.deleteWarehouse(id).subscribe(res => {
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

  async fnSave() { // press save butotn
    this.laddaSubmitLoading = true;
    var e = this.entity;
    console.log('send entity: ', e);

    if (await this.fnValidate(e)) {
      if (this.ACTION_STATUS == 'add') {
        e.CreateBy = this.auth.currentUser.Username;
        this.api.addWarehouse(e).subscribe(res => {
          var operationResult: any = res
          if (operationResult.Success) {
            this.toastr.success(this.trans.instant("messg.add.success"));
            $("#myModal4").modal('hide');
            if (this.addFiles.FileList.length > 0) this.uploadFile(this.addFiles.FileList);
            this.loadInit();
            this.fnEditSignal(operationResult.Data);
          }
          else this.toastr.warning(operationResult.Message);
          this.laddaSubmitLoading = false;

        }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
      }
      if (this.ACTION_STATUS == 'update') {
        e.ModifyBy = this.auth.currentUser.Username;
        this.api.updateWarehouse(e).subscribe(res => {
          var operationResult: any = res
          if (operationResult.Success) {
            if (this.addFiles.FileList.length > 0) this.uploadFile(this.addFiles.FileList);
            this.loadInit();
            this.toastr.success(this.trans.instant("messg.update.success"));
            
          }
          else this.toastr.warning(operationResult.Message);
          this.laddaSubmitLoading = false;
        }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
      }
    }
  }
  fnDownloadFile(filename) { //press FILES preview
    debugger;
    this.api.downloadFile(this.pathFile + '/' + filename);
  }
  fnRemoveFile(event) { //PRESS X TO REMOVE FILES
    console.log(event);
    let index = this.files.indexOf(event);
    this.files.splice(index, 1); //UI del
    this.entity.WarehouseFile.splice(index, 1);
  }
  
  async fnAddItem() { //press add item
    var itemAdd = this.newLocationEntity;
    if (itemAdd.WarehouseLocationCode == null) {
      swal.fire("Validate", this.trans.instant('Warehouse.data.WarehouseLocationCode') + this.trans.instant('messg.isnull'), 'warning');
      return;
    }
    if (itemAdd.WarehouseLocationName == null) {
      swal.fire("Validate", this.trans.instant('Warehouse.data.WarehouseLocationName') + this.trans.instant('messg.isnull'), 'warning');
      return;
    }
    if (this.entity.WarehouseLocation.filter(t =>t.WarehouseLocationCode.toLowerCase() == itemAdd.WarehouseLocationCode.toLowerCase())!=null)
    {
      swal.fire("Validate", this.trans.instant('Warehouse.data.WarehouseLocationCode') + this.trans.instant('messg.isexisted'), 'warning');
      return;
    }
    if (this.entity.WarehouseLocation.filter(t =>t.WarehouseLocationName.toLowerCase() == itemAdd.WarehouseLocationName.toLowerCase())!=null)
    {
      swal.fire("Validate", this.trans.instant('Warehouse.data.WarehouseLocationName') + this.trans.instant('messg.isexisted'), 'warning');
      return;
    }
    // let validateResult = await this.api.validateWarehouseLocation(itemAdd).toPromise().then() as any;
    // if (!validateResult.Success){
    //   swal.fire("Validate",this.trans.instant('Warehouse.invalid.'+ validateResult.Message),'warning'); return;
    // }
    itemAdd.WarehouseId = this.entity.WarehouseId;
    this.entity.WarehouseLocation.push(itemAdd);
    this.newLocationEntity = new WarehouseLocation();


  }
  fnEditItem(index) { //press a link of Item
    this.EditRowID = index + 1;
    this.locationEntity = this.entity.WarehouseLocation[index];
  }
  fnDeleteItem(index) { //PRESS delete button item
    this.entity.WarehouseLocation.splice(index, 1);
  }

  /** EVENT TRIGGERS */
  async onSelect(event) { //drag file(s) or choose file(s) in ngFileZone
    var askBeforeUpload = false;
    if (event.rejectedFiles.length > 0) this.toastr.warning(this.trans.instant('messg.maximumFileSize5000'));
    var _addFiles = event.addedFiles;
    for (var index in _addFiles) {
      let item = event.addedFiles[index];
      let convertName = this.helper.getFileNameWithExtension(item);
      let currentFile = this.entity.WarehouseFile;
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
        let _indexElement = this.entity.WarehouseFile.indexOf(findElement, 0);
        this.files.splice(_indexElement, 1);
        this.addFiles.FileList.splice(_indexElement, 1);
      }
      else {
        let _warehouseFile = new WarehouseFile();
        _warehouseFile.File.FileOriginalName = item.name;
        _warehouseFile.File.FileLocalName = convertName;
        _warehouseFile.File.Path = this.pathFile + '/' + convertName;
        _warehouseFile.File.FileType = item.type;
        this.entity.WarehouseFile.push(_warehouseFile);
        this.addFiles.FileLocalNameList.push(convertName);
      }

    }
    this.files.push(...event.addedFiles); //refresh showing in Directive
    this.addFiles.FileList.push(...event.addedFiles);

  }

  /** PRIVATES FUNCTIONS */
  private async fnValidate(e: Warehouse) { // validate entity value
    this.invalid = {};
    let result = await this.api.validateWarehouse(e).toPromise().then() as any;
    if (!result.Success)
    {
      this.laddaSubmitLoading = false;
      this.invalid[result.Message] = true;
      return false;
    }
    return true;
  }
  private resetEntity() { //reset entity values
    this.entity = new Warehouse();
    this.locationEntity = new WarehouseLocation();
    this.newLocationEntity = new WarehouseLocation();
    this.files = [];
    this.addFiles = { FileList: [], FileLocalNameList: [] }
    this.invalid = {};
    this.uploadReportProgress =  { progress : 0, message: null , isError: null };
    this.EditRowID=0;
  }
  private CheckBeforeEdit(id) { //check auth before edit 
    this.toastr.warning("User not dont have permission");
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
        this.uploadReportProgress.message = 'Upload success';
        // this.onUploadFinished.emit(event.body);
      }
    }, err => {
      this.toastr.warning(err.statusText, 'Upload file bị lỗi');
      this.uploadReportProgress = { progress: 0, message: 'Error', isError: true };
    });
  }

  ngOnDestroy(){
    $('.modal').modal('hide');
  }

}
