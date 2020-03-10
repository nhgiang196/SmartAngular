import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import {BomFactory,
  BomStage,
  BomItem,
  Unit,
  Stage,
  Factory,
  DataTablePaginationParams,
  Item
} from "src/app/models/SmartInModels";
import { WaterTreatmentService } from "src/app/services/api-watertreatment.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "src/app/services/auth.service";
import { MyHelperService } from "src/app/services/my-helper.service";
import { HttpEventType } from "@angular/common/http";
declare let $: any;
import swal from "sweetalert2";
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
@Component({
  selector: "app-bom-list",
  templateUrl: "./bom-list.component.html",
  styleUrls: ["./bom-list.component.css"]
})
export class BomListComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  //const
  typeBomIn: string = "In";
  typeBomOut: string = "Out";

  BomFactorys: BomFactory[];
  bomStage: BomStage;
  newBomStage: BomStage;
  inBomItem: BomItem;
  outBomItem: BomItem;
  newBomItem: BomItem;
  entity: BomFactory;
  bomItems: BomItem[];
  inBomItems: BomItem[] = [];
  dtOptions: DataTables.Settings = {};
  ACTION_STATUS: string;
  laddaSubmitLoading = false;
  existName = false;
  iboxloading = false;
  currentStageId: number = 0;
  bsConfig = { dateInputFormat: "YYYY-MM-DD", adaptivePosition: true };
  //set rowEdit
  editRowId: number = 0;
  // Default load data
  units: Unit[] = [];
  stages: Stage[] = []
  factories: Factory[] = []
  items: Item[] =[]
  itemsBuffer : Item[]=[]

  input$ = new Subject<string>();
  // ng-select server side
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  loading = false;
  constructor(
    private api: WaterTreatmentService,
    private toastr: ToastrService,
    private trans: TranslateService
  ) {}

  async ngOnInit() {
    //  this.loadInit()
    this.resetEntity();
    //  this.serverSide();
    await this.loadUnit();
    await this.loadFactories();
    await this.loadStages();
    await this.loadItems();
    this.onSearch(); // for search in server
  }
  private resetEntity() {
    this.entity = new BomFactory();
    this.bomStage = new BomStage();
    this.newBomStage = new BomStage();
    this.inBomItem = new BomItem();
    this.outBomItem = new BomItem();
    this.newBomItem = new BomItem();
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
      pagingType: "full_numbers",
      search: { regex: true },
      processing: true,
      pageLength: 10,
      ajax: (dataTablesParameters: any, callback) => {
        this.api
          .getDataTableBomFactoryPagination(dataTablesParameters)
          .subscribe(res => {
            this.BomFactorys = res.data;
            callback({
              recordsTotal: res.recordsTotal,
              recordsFiltered: res.recordsFiltered,
              data: []
            });
          });
      },
      columns: [{ data: 'BomFactoryId' }, { data: 'BomFactoryName' },
      { data: 'BomFactoryCode' }, { data: 'CreateBy' },
      { data: 'CreateDate' }, { data: 'ModifyBy' },
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
          first: "<<",
          last: ">>",
          next: ">",
          previous: "<"
        }
      }
    };
  };
  // client side
  loadBomFactory = async () => {
    $("#myTable")
      .DataTable()
      .clear()
      .destroy();
    this.api.getBomFactory().subscribe(res => {
      this.BomFactorys = res as any;
      this.dtTrigger.next();
    });
  };

  showBomFactoryModal() {
    $("#myModal2").modal("hide");
    $("#myModal4").modal("show");
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  onScrollToEnd() {
    this.fetchMore();
  }

  onScroll({ end }) {
    if (this.loading || this.items.length <= this.itemsBuffer.length) 
        return;
    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.itemsBuffer.length)
        this.fetchMore();
  }

  private fetchMore() {
    const len = this.itemsBuffer.length;
    const more = this.items.slice(len, this.bufferSize + len);
    this.loading = true;
    // using timeout here to simulate backend API delay
    setTimeout(() => {
      this.loading = false;      
      this.itemsBuffer = this.itemsBuffer.concat(more);
    }, 200)
  }
  async loadUnit() {
    let keySearch = "";
    let data: any = await this.api
      .getUnitPagination(keySearch)
      .toPromise()
      .then();
    this.units = data.result;
  }
  async loadFactories() {
    let keySearch = ""
    let data: any = await this.api.getFactoryPagination(keySearch).toPromise().then();
    this.factories = data.result;
  }
  async loadStages() {
    let keySearch = ""
    let data: any = await this.api.getStagePagination(keySearch).toPromise().then();
    this.stages = data.result;
  }
  async loadItems() {
    let keySearch = ""
    let data: any = await this.api.getItemPagination(keySearch).toPromise().then();
    this.items = data.result;
    console.log('records: ' +data.result.length);
    this.itemsBuffer = this.items.slice(0, this.bufferSize);
  }
 onSearch(){
    this.input$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term =>  this.fakeService(term))
    ).subscribe(data => {
        this.itemsBuffer = data.slice(0, this.bufferSize);
      })
  }
  private  fakeService(term) {
    let data =  this.api.getItemPagination(term).pipe(map(data=> {
      return data.result.filter((x: { ItemName: string }) => x.ItemName.includes(term))
    }));   
    return data;
  }
  customSearchFn(term: string, item: Item) {
    term = term.toLowerCase();
    return item.ItemName.toLowerCase().indexOf(term) > -1
}



  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  async fnAddStage() {
    //press add item (in modal)
    let _checkValidate =  this.validateStage(this.newBomStage, "add");
    if (!_checkValidate) return;
    this.entity.BomStage.push(this.newBomStage);
    this.newBomStage = new BomStage();
  }

  fnSaveStage(index) {}
  
   validateStage(itemAdd: BomStage, typeAction) {
    if (itemAdd.BomStageId == null) {
      swal.fire(
        "Validate",
        this.trans.instant("Factory.data.TechnologyName") +
          this.trans.instant("messg.isnull"),
        "warning"
      );
      return false;
    }
    if (( this.entity.BomStage.filter(t => t.BomStageId == itemAdd.BomStageId).length) > 0 &&typeAction == "add") {
      swal.fire(
        "Validate",
        this.trans.instant("Factory.data.TechnologyName") +
          this.trans.instant("messg.isexisted"),
        "warning"
      );
      return false;
    }
    if (( this.entity.BomStage.filter(t => t.BomStageId == itemAdd.BomStageId).length) > 1 &&typeAction == "edit") {
      swal.fire(
        "Validate",
        this.trans.instant("Factory.data.TechnologyName") +
          this.trans.instant("messg.isexisted"),
        "warning"
      );
      return false;
    }
    if (typeAction == "edit") this.editRowId = 0;
    return true;
  }

  async fnAddInBomItem() {
    //press add item (in modal)
    //let _checkValidate = await this.validateItem(this.newBomStage)
    //if (!_checkValidate) return;
    // this.bomItems.push(this.inBomItem);
    // this.bomItems.push(this.outBomItem)
    // this.entity.BomStage[id].BomItem.push();
    // this.entity.BomStage[id].BomItem = this.bomItems;
    if(this.fnValidateBomItem(this.newBomItem,'add')){
      this.newBomItem.BomType = this.typeBomIn;
      this.inBomItems.push(this.newBomItem);
      this.newBomItem = new BomItem();
    }
  
  }

  fnValidateBomItem(item: BomItem,typeAction) {
    console.log(item);
   
    if (this.inBomItems.filter(x => x.ItemId == item.ItemId).length > 0 &&typeAction == "add") {
      swal.fire(
        "Validate",
        this.trans.instant("Factory.data.TechnologyName") +
          this.trans.instant("messg.isexisted"),
        "warning"
      );
      return false;
    }
    if (this.inBomItems.filter(x => x.ItemId == item.ItemId).length > 0 &&typeAction == "edit") {
      swal.fire(
        "Validate",
        this.trans.instant("Factory.data.TechnologyName") +
          this.trans.instant("messg.isexisted"),
        "warning"
      );
      return false;
    }

    if (typeAction == "edit") this.editRowId = 0;
    return true;
  }

  fnEditInBomItem(index) {
    //press edit item (in modal)
    this.editRowId = index + 1;
    this.inBomItem =JSON.parse(JSON.stringify( this.inBomItems[index]));
    this.newBomItem = new BomItem();
  }
  fnSaveOutBomItem() {
    this.entity.BomStage[this.currentStageId].BomItem = this.inBomItems;
    // this.outBomItems = [];
    // this.inBomItem = new BomItem();

    console.log(this.entity);

    // $("#myModal2").modal('hide');
  }
  fnReset() {
    this.inBomItems = [];
    this.inBomItem = new BomItem();
  }
  fnDeleteInBomItem(index) {
    //press delete item (in modal)
    this.inBomItems.splice(index, 1);
  }

  fnSaveInBomItem(index) {console.log(this.inBomItems)
    if (this.fnValidateBomItem(this.inBomItem,'edit')) {
      this.inBomItems[index] = this.inBomItem;
      this.editRowId = 0;
    }
  }
  
  fnSaveBomItem() {
    this.entity.BomStage[this.currentStageId].BomItem = this.inBomItems;
    this.outBomItem.BomType = this.typeBomOut;
    this.entity.BomStage[this.currentStageId].BomItem.push(this.outBomItem);
    this.inBomItems = [];
    this.inBomItem = new BomItem();
    console.log("currentStage: " + this.currentStageId);
    console.log(this.entity);
  }

  fnDelete(id) {
    swal
      .fire({
        title: this.trans.instant("BomFactory.DeleteAsk_Title"),
        titleText: this.trans.instant("BomFactory.DeleteAsk_Text"),
        type: "warning",
        showCancelButton: true,
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          this.api.deleteBomFactory(id).subscribe(
            res => {
              var operationResult: any = res;
              if (operationResult.Success) {
                swal.fire(
                  "Deleted!",
                  this.trans.instant("messg.delete.success"),
                  "success"
                );
                this.rerender();
                $("#myModal4").modal("hide");
              } else this.toastr.warning(operationResult.Message);
            },
            err => {
              this.toastr.error(err.statusText);
            }
          );
        }
      });
  }
  fnAdd() {
    this.ACTION_STATUS = "add";
    this.existName = false;
    this.resetEntity();
  }
  
  onSwitchSequence() {
    !this.newBomStage.Sequence;
  }

  
  fnUpdate(id) {
    //press a link name of entity
    this.existName = false;
    this.ACTION_STATUS = "update";
    $("#myModal4").modal("hide");
    if (id === null) {
      this.toastr.warning("BomFactory ID is Null, cant show modal");
      return;
    }
    this.resetEntity();
    this.ACTION_STATUS = "update";
    this.iboxloading = true;
    this.api.findBomFactoryById(id).subscribe(
      res => {
        this.entity = res;
        //debugger
        $("#myModal4").modal("show");
        this.iboxloading = false;
      },
      error => {
        this.iboxloading = false;
        this.toastr.error(
          error.statusText,
          "Load BomFactory information error"
        );
      }
    );
  }
  private async fnValidate() {
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
