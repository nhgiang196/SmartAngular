import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';
import { trigger, transition, animate, style } from '@angular/animations';
import { PageChangedEvent, ModalDirective } from 'ngx-bootstrap';
import { Warehouse, WarehouseLocation } from 'src/app/core/models/warehouse';
import { WareHouseService, AuthService } from 'src/app/core/services';
import { SmartUploadComponent } from 'src/app/views/UISample/smart-upload/smart-upload.component';
import { SmartSelectComponent } from 'src/app/views/UISample/smart-select/smart-select.component';
import { DxFormComponent } from 'devextreme-angular';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
import DataSource from 'devextreme/data/data_source';
import { DxoDataSourceModule, DxoGridComponent } from 'devextreme-angular/ui/nested';
import { LanguageService } from 'src/app/core/services/language.service';
declare let $: any;
@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {
  // @ViewChild('myInputFile') InputManual: ElementRef;
  @ViewChild('targetSmartUpload', { static: false }) uploadComponent: SmartUploadComponent;
  @ViewChild('targetForm', { static: true }) targetForm: DxFormComponent;
  @ViewChild("childModal", { static: false }) childModal: ModalDirective;
  @ViewChild("targetGrid", { static: false }) targetGrid: DxoGridComponent;
  pathFile = "uploadFileWarehouse";
  dataSource: DataSource;
  factoryList: any;
  userList: any;
  entity: Warehouse;
  laddaSubmitLoading = false;
  iboxloading = false;
  private ACTION_STATUS: string;
  lookupField: any = {};
  closeButtonOptions = {
    stylingMode: 'text',
    template: ` <button type="button" class="btn btn-white" data-dismiss="modal"> ${this.trans.instant('Button.Close')}</button>`, //template hoạt động cho Ispinia,
    onClick: () => { this.childModal.hide() }
  }
  submitButtonOptions = {
    stylingMode: 'text',
    template: `<button type="button" class="btn btn-primary"><i class="fa fa-paper-plane-o"></i> ${this.trans.instant('Button.Save')}</button>`, //template hoạt động cho Ispinia
    useSubmitBehavior: true,
  }
  constructor(
    private toastr: ToastrService,
    private warehouseService: WareHouseService,
    public trans: TranslateService,
    private auth: AuthService,
    private devService: DevextremeService,
    private lang: LanguageService,
  ) {
    this.factoryList = devService.loadDxoLookup("Factory");
    this.dataSource = warehouseService.getDataGridWithOutUrl(false);
    this.fnEdit = this.fnEdit.bind(this);
    this.fnDelete = this.fnDelete.bind(this);
    this.lookupField['WarehouseStatus']= devService.loadDefineSelectBox("WarehouseStatus",lang.getLanguage());
  }
  ngOnInit() {
    
    this.lookupField['WarehouseStatus'].load();
    this.resetEntity();
    this.loadUsers();
  }
  private resetEntity() {
    this.entity = new Warehouse();
  }
  private loadUsers() {
    this.auth.getUsers().subscribe(res => {
      this.userList = res;
    }, err => this.toastr.warning('Get users Failed, check network'))
  }
  fnAdd() {
    this.resetEntity();
    this.targetForm.instance.resetValues();
    this.targetForm.instance.updateData(new Warehouse());
    this.targetForm.instance.getEditor("FactoryId").option("isValid", true);
    this.ACTION_STATUS = 'add';
    this.uploadComponent.resetEntity();
    this.entity.CreateBy = this.auth.currentUser.Username;
  }
  fnEdit(rowValue) {
    this.showModal(rowValue.row.data.WarehouseId);
  }
  async showModal(id) {
    if (id == null) { this.toastr.warning('ID is Null, cant show modal'); return; }
    this.ACTION_STATUS = 'update';
    this.iboxloading = true;
    await this.warehouseService.findById(id).subscribe(res => {
      this.resetEntity();
      this.entity = res;
      this.childModal.show();
      this.iboxloading = false;
      /**CONTROL FILES */
      this.uploadComponent.loadInit((res as any).WarehouseFile);
      this.entity.ModifyBy = this.auth.currentUser.Username;
    }, error => {
      this.iboxloading = false;
      this.toastr.error(error.statusText, "Load factory information error");
    })
  }
  fnDelete(rowValue) {
    swal.fire({
      title: this.trans.instant('Warehouse.mssg.DeleteAsk_Title'),
      titleText: this.trans.instant('Warehouse.mssg.DeleteAsk_Text'),
      confirmButtonText: this.trans.instant('Button.OK'),
      cancelButtonText: this.trans.instant('Button.Cancel'),
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.warehouseService.remove(rowValue.row.data.WarehouseId).then(res => {
          var operationResult: any = res
          if (operationResult.Success) {
            swal.fire(
              {
                title: this.trans.instant('messg.delete.caption'),
                titleText: this.trans.instant('messg.delete.success'),
                confirmButtonText: this.trans.instant('Button.OK'),
                type: 'success',
              }
            );
            this.dataSource.reload();
            $("#myModal4").modal('hide');
          }
          else this.toastr.warning(operationResult.Message);
        }, err => { this.toastr.error(err.statusText) })
      }
    })
  }
  async fnSave() {
    if (! await this.targetForm.instance.validate().isValid) return;
    this.laddaSubmitLoading = true;
    var e = this.entity;
    await this.uploadComponent.uploadFile();
    if (this.ACTION_STATUS == 'add') {
      e.CreateBy = this.auth.currentUser.Username;
      this.warehouseService.add(e).then(res => {
        var operationResult: any = res
        if (operationResult.Success) {
          this.toastr.success(this.trans.instant("messg.add.success"));
          $("#myModal4").modal('hide');
          this.dataSource.reload();
          this.showModal(operationResult.Data);
        }
        else this.toastr.warning(operationResult.Message);
        this.laddaSubmitLoading = false;
      }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
    }
    if (this.ACTION_STATUS == 'update') {
      e.ModifyBy = this.auth.currentUser.Username;
      this.warehouseService.update(e).then(res => {
        var operationResult: any = res
        if (operationResult.Success) {
          this.dataSource.reload();
          this.toastr.success(this.trans.instant("messg.update.success"));
        }
        else this.toastr.warning(operationResult.Message);
        this.laddaSubmitLoading = false;
      }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
    }
  }
  onInitNewRowWarehouseLocation(e) {
    e.data = new WarehouseLocation();
    e.data.WarehouseId = this.entity.WarehouseId;
    e.data.Status = true;
  }

  onRowInsertedLocation(){
    this.targetGrid.instance.addRow();
    this.targetGrid.instance.focus(this.targetGrid.instance.getCellElement(0,0))
  }
  onChangeWarehouseLocationStatus(event) {
    event.data.Status = event.data.Status ? 1 : 0;
  }
  validateFunction = (e) => {
    if (e.formItem)
      switch (e.formItem.dataField) {
        case "FactoryId": return !(e.value == null || e.value == 0)
      }
    if (e.column) {
      switch (e.column.dataField) {
        case "WarehouseLocationCode":
          let _find = this.entity.WarehouseLocation.find(x => x.WarehouseLocationCode.toLowerCase().trim() == e.data.WarehouseLocationCode.toLowerCase().trim());
          if (!_find) return true;
          else if (_find.WarehouseLocationName == e.data.WarehouseLocationName
            && _find.WarehouseLocationHeight == e.data.WarehouseLocationHeight
            && _find.WarehouseLocationWidth == e.data.WarehouseLocationWidth
            && _find.WarehouseLocationLength == e.data.WarehouseLocationLength) return true;
          else return false;
        case "WarehouseLocationName":
          let _findWarehouseLocationName = this.entity.WarehouseLocation.find(x => x.WarehouseLocationName.toLowerCase().trim() == e.data.WarehouseLocationName.toLowerCase().trim());
          if (!_findWarehouseLocationName) return true;
          else if (_findWarehouseLocationName.WarehouseLocationCode == e.data.WarehouseLocationCode
            && _findWarehouseLocationName.WarehouseLocationHeight == e.data.WarehouseLocationHeight
            && _findWarehouseLocationName.WarehouseLocationWidth == e.data.WarehouseLocationWidth
            && _findWarehouseLocationName.WarehouseLocationLength == e.data.WarehouseLocationLength) return true;
          else return false;
      }
    }
    return true;
  };
  validateAsync = (e) => {
    return new Promise(async (resolve) => {
      this.laddaSubmitLoading = true;
      let obj = new Warehouse; //stop binding
      obj.WarehouseId = this.entity.WarehouseId;
      obj[e.formItem.dataField] = e.value;
      let _res = await this.warehouseService.validate(obj).then() as any;
      let _validate = _res.Success ? _res.Success : _res.ValidateData.indexOf(e.formItem.dataField) < 0;
      if (_validate == true) this.laddaSubmitLoading = false;
      resolve(_validate);
    });
  }
  ngOnDestroy() {
    $('.modal').modal('hide');
  }
}
