import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { BomFactory, BomStage, BomItem, Unit, DataTablePaginationParram } from 'src/app/models/SmartInModels';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { MyHelperService } from 'src/app/services/my-helper.service';
import { HttpEventType } from '@angular/common/http';
declare let $: any;
import swal from 'sweetalert2';

@Component({
  selector: 'app-bom-list',
  templateUrl: './bom-list.component.html',
  styleUrls: ['./bom-list.component.css']
})
export class BomListComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject()
  BomFactorys: BomFactory[]
  bomStage: BomStage;
  newBomStage: BomStage;
  inBomItem: BomItem;
  outBomItem: BomItem;
  newBomItem: BomItem;
  entity: BomFactory;
  bomItems: BomItem [];
  dtOptions: DataTables.Settings = {};
  ACTION_STATUS: string;
  laddaSubmitLoading = false;
  existName = false;
  iboxloading = false;
  bsConfig = { dateInputFormat: 'YYYY-MM-DD' , adaptivePosition: true };
    //set rowEdit
    editRowId: number = 0;
  // Default load data
  listUnit: Unit [] = [];
  constructor(
    private api: WaterTreatmentService,
    private toastr: ToastrService,
    private trans: TranslateService,
    private auth: AuthService,
    private helper: MyHelperService
  ) { }

  async ngOnInit() {
  //  this.loadInit()
    this.resetEntity();
    //  this.serverSide();
    await this.loadUnit();
  }
  private resetEntity() {
    this.entity = new BomFactory();   
    this.bomStage = new BomStage();
    this.newBomStage = new BomStage();
    this.inBomItem = new BomItem();
    this.outBomItem  = new BomItem();
    this.newBomItem =  new BomItem();
    this.bomItems = [];
    this.BomFactorys = [];
  }

  loadInit = async () => {
   
    this.dtOptions = {
      autoWidth: true,
      responsive: true,
      serverSide: true,
      paging: true,
      stateSave: true,
      pagingType: 'full_numbers',
      search: { regex: true },
      processing: true,
      pageLength: 10,
      ajax: (dataTablesParameters: any, callback) => {
        this.api.getDataTableBomFactoryPagination(dataTablesParameters).subscribe(res => {
          this.BomFactorys = res.data;
          callback({
            recordsTotal: res.recordsTotal,
            recordsFiltered: res.recordsFiltered,
            data: []
          });
        })
      },
      columns: [{ data: 'BomFactoryId' }, { data: 'BomFactoryName' },
      { data: 'BomFactoryCode' },{ data: 'CreateBy' }, 
      { data: 'CreateDate' },{ data: 'ModifyBy' }, 
      { data: 'ModifyDate' }, { data: 'Status' }],
      language:
      {
        searchPlaceholder: this.trans.instant('DefaultTable.searchPlaceholder'),
        emptyTable: this.trans.instant('DefaultTable.emptyTable'),
        info: this.trans.instant('DefaultTable.info'),
        infoEmpty: this.trans.instant('DefaultTable.infoEmpty'),
        infoFiltered: this.trans.instant('DefaultTable.infoFiltered'),
        infoPostFix: this.trans.instant('DefaultTable.infoPostFix'),
        thousands: this.trans.instant('DefaultTable.thousands'),
        lengthMenu: this.trans.instant('DefaultTable.lengthMenu'),
        loadingRecords: this.trans.instant('DefaultTable.loadingRecords'),
        processing: this.trans.instant('DefaultTable.processing'),
        search: this.trans.instant('DefaultTable.search'),
        zeroRecords: this.trans.instant('DefaultTable.zeroRecords'),
        //url: this.trans.instant('DefaultTable.url'),
        paginate: {
          first: '<<',
          last: ">>",
          next: ">",
          previous: "<"
        }
      }
    };
  }
  // client side
  loadBomFactory = async () => {
    $('#myTable').DataTable().clear().destroy();
    this.api.getBomFactory().subscribe(res => {
      this.BomFactorys = res as any
      this.dtTrigger.next();
    });

  }
  showBomModal(){
    $('#myModal4').modal('hide');
  }
  showBomFactoryModal(){
    $('#myModal2').modal('hide');
    $('#myModal4').modal('show');
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

 
  async loadUnit() {
    const model: DataTablePaginationParram = {
      key: "",
      entity: "Unit",
      keyFields: "",
      selectFields: "UnitName,UnitId",
      page: 1,
      pageSize: 9999,
      orderDir: "asc",
      orderBy: "UnitName"
    };
    let data: any = await this.api
      .getUnitPagination(model)
      .toPromise()
      .then();
    this.listUnit = data.result;
  }
  loadItems(){

  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  async fnAddItem() { //press add item (in modal)
    let _checkValidate = await this.validateItem(this.newBomStage)
    if (!_checkValidate) return;
    this.entity.BomStage.push(this.newBomStage);
    this.newBomStage = new BomStage();
  }
  fnEditItem(index){ //press edit item (in modal)
    this.editRowId = index +1;
    this.bomStage = this.entity.BomStage[index];
  }
  fnSaveItem(index){
    
  }
  fnDeleteItem(index) { //press delete item (in modal)
    this.entity.BomStage.splice(index, 1);
  }
  async validateItem(itemAdd: BomStage){
    if (itemAdd.BomStageId == null) {
      swal.fire("Validate", this.trans.instant('Factory.data.TechnologyName') + this.trans.instant('messg.isnull'), 'warning');
      return false;
    }
    if (await this.entity.BomStage.filter(t =>t.BomStageId == itemAdd.BomStageId).length>0)
    {
      swal.fire("Validate", this.trans.instant('Factory.data.TechnologyName') + this.trans.instant('messg.isexisted'), 'warning');
      return false;
    }
    this.editRowId = 0;
    return true
  }

  async fnAddBomItem() { //press add item (in modal)
    let _checkValidate = await this.validateItem(this.newBomStage)
    if (!_checkValidate) return;
    this.entity.BomStage.push(this.newBomStage);
    this.newBomStage = new BomStage();
  }
  fnEditBomItem(index){ //press edit item (in modal)
    this.editRowId = index +1;
    this.bomStage = this.entity.BomStage[index];
  }
  fnSaveBomItem(index){
    
  }
  fnDeleteBomItem(index) { //press delete item (in modal)
    this.entity.BomStage.splice(index, 1);
  }
  async validateBomItem(itemAdd: BomStage){
    if (itemAdd.BomStageId == null) {
      swal.fire("Validate", this.trans.instant('Factory.data.TechnologyName') + this.trans.instant('messg.isnull'), 'warning');
      return false;
    }
    if (await this.entity.BomStage.filter(t =>t.BomStageId == itemAdd.BomStageId).length>0)
    {
      swal.fire("Validate", this.trans.instant('Factory.data.TechnologyName') + this.trans.instant('messg.isexisted'), 'warning');
      return false;
    }
    this.editRowId = 0;
    return true
  }


  fnDelete(id) {
    swal.fire({
      title: this.trans.instant('BomFactory.DeleteAsk_Title'),
      titleText: this.trans.instant('BomFactory.DeleteAsk_Text'),
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.api.deleteBomFactory(id).subscribe(res => {
          var operationResult: any = res
          if (operationResult.Success) {
            swal.fire(
              'Deleted!', this.trans.instant('messg.delete.success'), 'success'
            );
            this.rerender();
            $("#myModal4").modal('hide');
          }
          else this.toastr.warning(operationResult.Message);
        }, err => { this.toastr.error(err.statusText) })
      }
    })
  }
  fnAdd() {
    this.ACTION_STATUS = 'add';
    this.existName = false;
    this.resetEntity();
  }
  onSwitchStatus() {
    this.entity.Status = this.entity.Status == 0 ? 1 : 0;
  }

  async fnSave() {
    this.laddaSubmitLoading = true;
    var e = this.entity;  
    if (await this.fnValidate(e)) {
      console.log('send entity: ', e);
      if (this.ACTION_STATUS == 'add') {
        this.api.addBomFactory(e).subscribe(res => {
          var operationResult: any = res
          if (operationResult.Success) {
            this.toastr.success(this.trans.instant("messg.add.success"));
            this.rerender();
          }
          else this.toastr.warning(operationResult.Message);
          this.laddaSubmitLoading = false;
          $("#myModal4").modal('hide');
        }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
      }
      if (this.ACTION_STATUS == 'update') {
        this.api.updateBomFactory(e).subscribe(res => {
          var operationResult: any = res
          if (operationResult.Success) {
            this.toastr.success(this.trans.instant("messg.update.success"));
          }
          else this.toastr.warning(operationResult.Message);
          this.laddaSubmitLoading = false;
        }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
      }
    //  await this.loadInit();
    }
  }
  fnUpdate(id) { //press a link name of entity
    this.existName = false;
    this.ACTION_STATUS = 'update'
    $("#myModal4").modal('hide');
    if (id === null) { this.toastr.warning('BomFactory ID is Null, cant show modal'); return; }
    this.resetEntity();
    this.ACTION_STATUS = 'update';
    this.iboxloading = true;
    this.api.findBomFactoryById(id).subscribe(res => {
      this.entity = res;
      //debugger
      $("#myModal4").modal('show');
      this.iboxloading = false;
    }, error => {
      this.iboxloading = false;
      this.toastr.error(error.statusText, "Load BomFactory information error");
    })
  }
  private async fnValidate(e) {
    let result = await this.api.validateBomFactory(this.entity).toPromise().then() as any;
    if (result.Success) return true;
    else {
      this.laddaSubmitLoading = false;
      this.existName = true;
      return false;
    }
  }
 
    // ngAfterViewInit(): void {
    //   this.dtTrigger.next();
    // }

}
