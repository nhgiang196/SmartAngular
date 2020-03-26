import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';
import { trigger, transition, animate, style } from '@angular/animations';
import { PageChangedEvent } from 'ngx-bootstrap';
import { Warehouse, WarehouseLocation } from 'src/app/core/models/warehouse';
import { WareHouseService, AuthService } from 'src/app/core/services';
import { SmartUploadComponent } from 'src/app/views/UISample/smart-upload/smart-upload.component';
import { SmartSelectComponent } from 'src/app/views/UISample/smart-select/smart-select.component';
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
  @ViewChild(SmartUploadComponent, {static: true}) uploadComponent: SmartUploadComponent;
  @ViewChild(SmartSelectComponent, {static: true}) selectComponent: SmartSelectComponent;
  constructor(
    private toastr: ToastrService,
    private api: WareHouseService,
    public trans: TranslateService,
    private auth: AuthService
  ) { }
  /** INIT / DECLARATION */
  Warehouse: any[] = []; //init data
  entity: Warehouse;
  locationEntity: WarehouseLocation;
  newLocationEntity: WarehouseLocation;
  laddaSubmitLoading = false;
  iboxloading = false;
  keyword: string = '';
  pathFile = "uploadFileWarehouse";
  ACTION_STATUS: string;
  Warehouse_showed = 0;
  invalid: any = { Existed_WarehouseCode: false, Existed_WarehouseName: false };
  initCombobox = { Factories: [], FullFactories: [], Users: [] };
  EditRowNumber: number = 0;
  pageIndex = 1;
  pageSize = 12;
  /**INIT FUNCTIONS */
  ngOnInit() { //init functions
    this.resetEntity();
    this.loadUsers();
    this.loadInit();
  }
  private loadUsers() {
    this.auth.getUsers().subscribe(res=>{
      this.initCombobox.Users= res;
    }, err => this.toastr.warning('Get users Failed, check network'))
  }
  searchLoad(){
    this.pageIndex=1;
    this.loadInit();

  }

  loadInit() { //init loading
    this.iboxloading = true;
    this.api.getWarehousePagination(this.keyword,this.pageIndex, this.pageSize).subscribe(res => {
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
  onSwitchStatus (_TYPE){ //modal switch on change
    if (_TYPE == 'newLocationEntity') this.newLocationEntity.Status=  this.newLocationEntity.Status==0 ? 1: 0;
    if (_TYPE == 'locationEntity') this.locationEntity.Status =  this.locationEntity.Status==0 ? 1: 0;
    if (_TYPE == 'entity') this.entity.Status = this.entity.Status==0? 1: 0;
  }
  /** BUTTON ACTIONS */
  fnAdd() { //press new button
    this.ACTION_STATUS = 'add';
    this.resetEntity();
    this.uploadComponent.resetEntity();
    this.entity.CreateBy = this.auth.currentUser.Username;
  }
  async fnEditSignal(id) { //press a link of ENTITY
    
    if (id == null) { this.toastr.warning('ID is Null, cant show modal'); return; }
    
    this.ACTION_STATUS = 'update';
    this.iboxloading = true;
    await this.api.findWarehouseById(id).subscribe(res => {
      this.resetEntity();
      this.entity = res;
      $("#myModal4").modal('show');
      this.iboxloading = false;
      console.log('getEntity',res);
      
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
        this.api.deleteWarehouse(id).subscribe(res => {
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
    this.laddaSubmitLoading = true;
    var e = this.entity;
    
    if (await this.fnValidate(e)) {
      await this.uploadComponent.uploadFile();
      if (this.ACTION_STATUS == 'add') {
        e.CreateBy = this.auth.currentUser.Username;
        this.api.addWarehouse(e).subscribe(res => {
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
        this.api.updateWarehouse(e).subscribe(res => {
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
  }
  
  async fnAddItem(itemAdd) { //press add item
    let _checkValidate = await this.validateItem(itemAdd);
     if (!_checkValidate) return;
    itemAdd.WarehouseId = this.entity.WarehouseId;
    this.entity.WarehouseLocation.push(itemAdd);
    this.newLocationEntity = new WarehouseLocation();
  }
  async fnSaveItem(itemAdd,index) { //press add item
    let _checkValidate = await this.validateItem(itemAdd,index);
     if (!_checkValidate) return;
    itemAdd.WarehouseId = this.entity.WarehouseId;
    this.entity.WarehouseLocation.splice(index,1,itemAdd)
    this.locationEntity = new WarehouseLocation();
  }
  async validateItem(itemAdd, index = -1){
    for (const i in this.entity.WarehouseLocation) {
        const t = this.entity.WarehouseLocation[i];
        if (index.toString() == i) continue;
        if (t.WarehouseLocationName.toLowerCase().trim()  === itemAdd.WarehouseLocationName.toLowerCase().trim())
        {
          swal.fire("Validate", this.trans.instant('Warehouse.data.WarehouseLocationCode') + this.trans.instant('messg.isexisted'), 'warning');
          return false;
        } 
        if (t.WarehouseLocationCode.toLowerCase().trim()  === itemAdd.WarehouseLocationCode.toLowerCase().trim())
        {
          swal.fire("Validate", this.trans.instant('Warehouse.data.WarehouseLocationCode') + this.trans.instant('messg.isexisted'), 'warning');
          return false;
        } 
    }
    this.EditRowNumber = 0;
    return true;
  }

  fnEditItem(index) { //press a link of Item
    this.EditRowNumber = index + 1;
    this.locationEntity = Object.assign({}, this.entity.WarehouseLocation[index]); //stop binding
  }
  fnDeleteItem(index) { //PRESS delete button item
    this.entity.WarehouseLocation.splice(index, 1);
  }

  /** EVENT TRIGGERS */
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
  private async resetEntity() { //reset entity values
    
    this.entity = new Warehouse();
    this.locationEntity = new WarehouseLocation();
    this.newLocationEntity = new WarehouseLocation();
    this.invalid = {};
    this.EditRowNumber=0;
    
  }
  private CheckBeforeEdit(id) { //check auth before edit 
    this.toastr.warning("User not dont have permission");
  }

  ngOnDestroy(){
    $('.modal').modal('hide');
  }

}
