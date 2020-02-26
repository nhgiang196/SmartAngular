import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MyHelperService } from 'src/app/services/my-helper.service';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { Warehouse, Files, WarehouseLocation, WarehouseFile } from 'src/app/models/SmartInModels';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
declare let $: any;
@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {
  @ViewChild('myInputFile')// set for emtpy file after Close or Reload
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
  sub_entity: WarehouseLocation;
  laddaSubmitLoading = false;
  iboxloading = false;
  files: File[] = [];
  keyword : string = '';
  private pathFile = "uploadFileWarehouse"
  ACTION_STATUS: string;
  Warehouse_showed = 0;
  invalid : any = {Existed_WarehouseCode: false, Existed_WarehouseName: false};
  
  /**INIT FUNCTIONS */
  ngOnInit() { //init functions
    this.resetEntity();
    this.loadInit();
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
  /** BUTTON ACTIONS */
  fnAdd() { //press new button
    this.ACTION_STATUS = 'add';
    this.resetEntity();
    this.entity.CreateBy = this.auth.currentUser.Username;
  }
  fnEditSignal(id) { //press a link of ENTITY
    if (id==null)  { this.toastr.warning('ID is Null, cant show modal'); return; }
    this.resetEntity();
    this.ACTION_STATUS = 'update';
    this.iboxloading = true;
    this.api.findWarehouseById(id).subscribe(res => {
      debugger;
      this.entity = res;
      $("#myModal4").modal('show');
      this.iboxloading = false;
      /**CONTROL FILES */
      this.entity.WarehouseFile.forEach(item =>{
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
  fnDelete(id) { //press Delete Entity
    swal.fire({
      title: this.trans.instant('Warehouse.mssg.DeleteAsk_Title'),
      titleText: this.trans.instant('Warehouse.mssg.DeleteAsk_Text'),
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true
    })
      .then((result) => {
        if (result.value) {
          this.api.deleteWarehouse(id).subscribe(res => {
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
  fnAddItem() { //press add item
    var itemAdd = this.sub_entity;
    // itemAdd.FactoryId = this.entity.FactoryId;
    // this.sub_entity = new WarehouseLocation();
    // this.entity.WarehouseLocation.push(itemAdd);
  }
  fnEditItem(index){ //press a link of Item
    this.sub_entity = this.entity.WarehouseLocation[index];
    this.entity.WarehouseLocation.splice(index, 1);
  }
  fnDeleteItem(index) { //PRESS delete button item
    this.entity.WarehouseLocation.splice(index, 1);
  }
  async fnSave() { // press save butotn
    this.laddaSubmitLoading = true;
    var e = this.entity;
    console.log('send entity: ', e);
    debugger;
    if (await this.fnValidate(e))
    {
      
      if (this.ACTION_STATUS == 'add') {
        this.api.addWarehouse(e).subscribe(res => {
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
        this.api.updateWarehouse(e).subscribe(res => {
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
  fnDownloadFile(filename){ //press FILES preview
    this.api.downloadFile(this.pathFile+'/'+filename);
  }
  fnRemoveFile(event) { //PRESS X TO REMOVE FILES
    console.log(event);
    let index = this.files.indexOf(event);
    this.files.splice(index, 1); //UI del
    this.entity.WarehouseFile.splice(index,1);
    // this.removeFile(event);
  }
  
  /** EVENT TRIGGERS */
  
  onSelect(event) { // on upload files
    console.log(event);
    // this.files.push(...event.addedFiles); //refresh showing in Directive
    if (event.rejectedFiles.length>0) this.toastr.warning(this.trans.instant('messg.maximumFileSize2000'));
    for (var index in event.addedFiles) {
      let item = event.addedFiles[index];
      let currentFile = this.files;
      var _existIndex = currentFile.filter(x=>x.name == item.name).length;
      if (_existIndex>0) this.files.splice(_existIndex-1,1);
      else{
        
        let _WarehouseFile = new WarehouseFile();
        _WarehouseFile.File.FileOriginalName= item.name;
        _WarehouseFile.File.FileName = this.helper.getFileNameWithExtension(item);
        _WarehouseFile.File.Path = this.pathFile + '/' + item.name;
        this.entity.WarehouseFile.push(_WarehouseFile);
      }
    }
    // this.files.push(...event.addedFiles); //refresh showing in Directive
    this.uploadFile(event.addedFiles);
    
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
    this.sub_entity = new WarehouseLocation();
    this.files = [];
    this.invalid = {};
  }
  private CheckBeforeEdit(id) { //check auth before edit 
    this.toastr.warning("User not dont have permission");
  }
  private uploadFile(files: File[])  //upload file to server
  {
      let formData = new FormData();
      files.forEach(file => {
          formData.append("files",file);
      });
      this.api.uploadFile(formData, this.pathFile).subscribe(res=> console.log(res));
  }
  
}
