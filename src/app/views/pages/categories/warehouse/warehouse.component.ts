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
    private factoryService: FactoryService
  ) { 
    
  }
  /** INIT / DECLARATION */
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
  /**INIT FUNCTIONS */
  ngOnInit() { //init functions
    this.resetEntity();
    this.loadUsers();
    this.loadInit();
  }

  
  private loadUsers() {
    this.auth.getUsers().subscribe(res => {
      this.initCombobox.Users = res;
    }, err => this.toastr.warning('Get users Failed, check network'))
  }
  initWarehouseLocation(e){
    e.data.WarehouseLocationId = 0;
    e.data.WarehouseId = this.entity.WarehouseId;
    e.data.Status = true;
  }

  changeWarehouseLocationStatus(event){
    event.data.Status = event.data.Status? 1: 0;
  }
  searchLoad() {
    this.pageIndex = 1;
    this.loadInit();
  }
  loadInit() { //init loading
    this.iboxloading = true;
    this.warehouseService.getPagination(this.keyword, this.pageIndex, this.pageSize).subscribe(res => {
      var data = res as any;
      // this.selectComponent.specialId = res.FactoryId;
      // this.selectComponent.loadInit();
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
    this.resetEntity();
    this.targetForm.instance.resetValues();
    this.ACTION_STATUS = 'add';
    
    this.uploadComponent.resetEntity();
    this.entity.CreateBy = this.auth.currentUser.Username;
  }
  async fnEditSignal(id) { //press a link of ENTITY
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
      this.uploadComponent.loadInit(res.WarehouseFile);
      this.entity.ModifyBy = this.auth.currentUser.Username;
    }, error => {
      this.iboxloading = false;
      this.toastr.error(error.statusText, "Load factory information error");
    })
  }
  pageChanged(event: PageChangedEvent): void {
    this.pageIndex = event.page;
    this.loadInit();
  }
  fnDelete(id) { //press Delete Entity
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
        this.warehouseService.delete(id).subscribe(res => {
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
  async fnSave() { // press save butotn
    if (!this.targetForm.instance.validate().isValid) return;
    this.laddaSubmitLoading = true;
    var e = this.entity;
    await this.uploadComponent.uploadFile();
    if (this.ACTION_STATUS == 'add') {
      e.CreateBy = this.auth.currentUser.Username;
      this.warehouseService.add(e).subscribe(res => {
        var operationResult: any = res
        if (operationResult.Success) {
          this.toastr.success(this.trans.instant("messg.add.success"));
          $("#myModal4").modal('hide');
          this.loadInit();
        }
        else this.toastr.warning(operationResult.Message);
        this.laddaSubmitLoading = false;
      }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
    }
    if (this.ACTION_STATUS == 'update') {
      e.ModifyBy = this.auth.currentUser.Username;
      this.warehouseService.update(e).subscribe(res => {
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
  /** EVENT TRIGGERS */
  /** PRIVATES FUNCTIONS */
  private async resetEntity() { //reset entity values
    this.entity = new Warehouse();
    this.EditRowNumber = 0;
  }
  private CheckBeforeEdit(id) { //check auth before edit 
    this.toastr.warning("User not dont have permission");
  }


  validateFunction = (e) => {
    if (e.column){}
    switch (e.column.dataField) {
      case "WarehouseLocationCode": return this.entity.WarehouseLocation.filter(x=>x.WarehouseLocationCode==e.data.WarehouseLocationCode && x.WarehouseLocationId != e.data.WarehouseLocationId).length==0
      case "WarehouseLocationName": return this.entity.WarehouseLocation.filter(x=>x.WarehouseLocationName==e.data.WarehouseLocationName && x.WarehouseLocationId != e.data.WarehouseLocationId).length==0
    }
    return true;
  };

  validateAsync = (e) =>{ 
    console.log('Validate Async', e)
    // return true;
    return new Promise(async (resolve) => { 
      let obj = Object.assign({}, this.entity); //stop binding
      obj[e.formItem.dataField] = e.value;
      let _res =await this.warehouseService.validate(obj).toPromise().then() as any;
      let _validate = _res.Success? _res.Success : _res.ValidateData.indexOf(e.formItem.dataField)<0;
      resolve(_validate);
    });   

  }
  
  ngOnDestroy() {
    $('.modal').modal('hide');
  }
}
