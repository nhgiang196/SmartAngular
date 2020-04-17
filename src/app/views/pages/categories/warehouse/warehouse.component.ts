import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';
import { trigger, transition, animate, style } from '@angular/animations';
import { PageChangedEvent, ModalDirective } from 'ngx-bootstrap';
import { Warehouse, WarehouseLocation } from 'src/app/core/models/warehouse';
import { WareHouseService, AuthService, FactoryService } from 'src/app/core/services';
import { SmartUploadComponent } from 'src/app/views/UISample/smart-upload/smart-upload.component';
import { SmartSelectComponent } from 'src/app/views/UISample/smart-select/smart-select.component';
import { DxFormComponent } from 'devextreme-angular';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
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
  // @ViewChild('myInputFile') InputManual: ElementRef;
  @ViewChild('targetSmartUpload', { static: false }) uploadComponent: SmartUploadComponent;
  @ViewChild('targetForm', { static: true }) targetForm: DxFormComponent;
  @ViewChild("childModal", { static: false }) childModal: ModalDirective;
  constructor(
    private toastr: ToastrService,
    private warehouseService: WareHouseService,
    public trans: TranslateService,
    private auth: AuthService,
    private factoryService: FactoryService,
    private devService: DevextremeService,
  ) {
    this.factoryList = devService.loadDxoLookup("Factory");
  }
  /** INIT / DECLARATION */
  factoryList: any;
  Warehouse: any[] = []; //init data
  entity: Warehouse;
  laddaSubmitLoading = false;
  iboxloading = false;
  keyword: string = '';
  pathFile = "uploadFileWarehouse";
  ACTION_STATUS: string;
  Warehouse_showed = 0;
  initCombobox = { Factories: [], FullFactories: [], Users: [] };
  EditRowNumber: number = 0;
  pageIndex = 1;
  pageSize = 12;
  buttonOptions: any = {
    stylingMode: 'text', // để tắt đường viền container
    template: `<button type="button" class="btn btn-primary"><i class="fa fa-paper-plane-o"></i>${this.trans.instant('Button.Save')}</button>`, //template hoạt động cho Ispinia
    useSubmitBehavior: true, //submit = validate + save
  }
  ngOnInit() {
    this.resetEntity();
    this.loadUsers();
    this.loadInit();
  }
  private resetEntity() {
    this.entity = new Warehouse();
    this.EditRowNumber = 0;
  }
  private loadUsers() {
    this.auth.getUsers().subscribe(res => {
      this.initCombobox.Users = res;
    }, err => this.toastr.warning('Get users Failed, check network'))
  }
  loadInit() {
    this.iboxloading = true;
    this.warehouseService.getWarehousePaginationMain(this.keyword, this.pageIndex, this.pageSize).subscribe(res => {
      var data = res as any;
      this.Warehouse = data.data;
      this.Warehouse_showed = data.recordsTotal;
      this.iboxloading = false;
    }, err => {
      this.toastr.error(err.statusText, "Load init failed!");
      this.iboxloading = false;
    });
  }
  fnSearchLoad() {
    this.pageIndex = 1;
    this.loadInit();
  }
  fnAdd() {
    this.resetEntity();
    this.targetForm.instance.resetValues();
    this.ACTION_STATUS = 'add';
    this.uploadComponent.resetEntity();
    this.entity.CreateBy = this.auth.currentUser.Username;
  }
  async fnEditSignal(id) {
    if (id == null) { this.toastr.warning('ID is Null, cant show modal'); return; }
    this.ACTION_STATUS = 'update';
    this.iboxloading = true;
    await this.warehouseService.findById(id).subscribe(res => {
      this.resetEntity();
      this.entity = res;
      this.childModal.show();
      this.iboxloading = false;
      console.log('getEntity', res);
      /**CONTROL FILES */
      this.uploadComponent.loadInit((res as any).WarehouseFile);
      this.entity.ModifyBy = this.auth.currentUser.Username;
    }, error => {
      this.iboxloading = false;
      this.toastr.error(error.statusText, "Load factory information error");
    })
  }
  fnDelete(id) {
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
        this.warehouseService.remove(id).then(res => {
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
            this.loadInit();
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
          this.loadInit();
          this.fnEditSignal(operationResult.Data);
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
          this.loadInit();
          this.toastr.success(this.trans.instant("messg.update.success"));
        }
        else this.toastr.warning(operationResult.Message);
        this.laddaSubmitLoading = false;
      }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
    }
  }
  onPageChanged(event: PageChangedEvent): void {
    this.pageIndex = event.page;
    this.loadInit();
  }
  onInitNewRowWarehouseLocation(e) {
    e.data.WarehouseLocationId = 0;
    e.data.WarehouseId = this.entity.WarehouseId;
    e.data.Status = true;
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
    console.log('Validate Async', e)
    return new Promise(async (resolve) => {
      this.laddaSubmitLoading = true;
      let obj = Object.assign({}, this.entity); //stop binding
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
