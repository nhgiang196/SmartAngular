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
  warehouse: Warehouse[]; //init data
  entity: Warehouse;
  sub_entity: WarehouseLocation;
  laddaSubmitLoading = false;
  iboxloading = false;
  files: File[] = [];
  keyword : string = '';
  private pathFile = "uploadFileWarehouse"
  ACTION_STATUS: string;
  factory_showed = 0;
  invalid : any = {Existed_WarehouseCode: false, Existed_WarehouseName: false};
  
  /**INIT FUNCTIONS */
  ngOnInit() {
    this.resetEntity();
    this.loadInit();
  }
  
  
  loadInit() {
    this.iboxloading = true;
    this.warehouse = [];
    this.api.getFactoryPagination(this.keyword).subscribe(res => {
      var data = res as any;
      this.warehouse = data.result;
      this.iboxloading = false;
      
    }, err => {
      this.toastr.error(err.statusText, "Load init failed!");
      this.iboxloading = false;
    })
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
    var itemAdd = this.sub_entity;
    // itemAdd.FactoryId = this.entity.FactoryId;
    // this.sub_entity = new WarehouseLocation();
    // this.entity.WarehouseLocation.push(itemAdd);
  }

  fnEditItem(index){
    this.sub_entity = this.entity.WarehouseLocation[index];
    this.entity.WarehouseLocation.splice(index, 1);
  }
  fnDeleteItem(index) {
    this.entity.WarehouseLocation.splice(index, 1);
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
   
  onRemove(event) {
    console.log(event);
    let index = this.files.indexOf(event);
    this.files.splice(index, 1); //UI del
    this.entity.WarehouseFile.splice(index,1);
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


  /**private functions */
  private async fnValidate(e: Warehouse) {
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

  private resetEntity() {
    this.entity = new Warehouse();
    this.sub_entity = new WarehouseLocation();
    this.files = [];
    this.invalid = {};
  }
  fnAdd() {
    this.ACTION_STATUS = 'add';
    this.resetEntity();
    this.entity.CreateBy = this.auth.currentUser.Username;
  }


}
