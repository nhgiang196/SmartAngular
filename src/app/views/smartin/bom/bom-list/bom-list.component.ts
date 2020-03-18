import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import {
  BomFactory,
  BomStage,
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
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map
} from "rxjs/operators";
@Component({
  selector: "app-bom-list",
  templateUrl: "./bom-list.component.html",
  styleUrls: ["./bom-list.component.css"]
})
export class BomListComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  initComboboxFactories = {
    Factories: [],
    FullFactories: [],
    FactoriesCopy: []
  };
  initComboboxStages = { Stages: [], FullStages: [], StagesCopy: [] };
  BomFactorys: BomFactory[];
  // Default load data
  entity: BomFactory;
  units: Unit[] = [];
  stages: Stage[] = [];
  factories: Factory[] = [];
  items: Item[] = [];
  itemsBuffer: Item[] = [];

  dtOptions: DataTables.Settings = {};
  ACTION_STATUS: string;
  laddaSubmitLoading = false;
  iboxloading = false;
  bsConfig = { dateInputFormat: "YYYY-MM-DD", adaptivePosition: true };

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
    this.loadInit();
    this.resetEntity();
    //  this.serverSide();
    await this.loadUnit();
    await this.loadFactories();
    await this.loadStages();
    await this.loadItems();
  }
  private resetEntity() {
    this.entity = new BomFactory();
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
      columns: [
        { data: null },
        { data: "BomFactoryId" },
        { data: "Validate" },
        { data: "Descriptions" },
        { data: "CreateBy" },
        { data: "CreateDate" },
        { data: "ModifyBy" },
        { data: "ModifyDate" },
        { data: "Status" },
        { data: null }
      ],
      language: {
        searchPlaceholder: this.trans.instant("DefaultTable.searchPlaceholder"),
        emptyTable: this.trans.instant("DefaultTable.emptyTable"),
        info: this.trans.instant("DefaultTable.info"),
        infoEmpty: this.trans.instant("DefaultTable.infoEmpty"),
        infoFiltered: this.trans.instant("DefaultTable.infoFiltered"),
        infoPostFix: this.trans.instant("DefaultTable.infoPostFix"),
        thousands: this.trans.instant("DefaultTable.thousands"),
        lengthMenu: this.trans.instant("DefaultTable.lengthMenu"),
        loadingRecords: this.trans.instant("DefaultTable.loadingRecords"),
        processing: this.trans.instant("DefaultTable.processing"),
        search: this.trans.instant("DefaultTable.search"),
        zeroRecords: this.trans.instant("DefaultTable.zeroRecords"),
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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
    let keySearch = "";
    let data: any = await this.api
      .getFactoryPagination(keySearch)
      .toPromise()
      .then();
    // this.factories = data.result.filter(x=>x.Status==true);
    this.initComboboxFactories.Factories = (data as any).result.filter(
      x => x.Status == 1
    ) as Factory[];
    this.initComboboxFactories.FullFactories = (data as any)
      .result as Factory[];
    this.initComboboxFactories.FactoriesCopy = (data as any).result.filter(
      x => x.Status == 1
    ) as Factory[];
  }
  async loadStages() {
    let keySearch = "";
    let data: any = await this.api
      .getStagePagination(keySearch)
      .toPromise()
      .then();
    this.stages = data.result;
    this.initComboboxStages.Stages = (data as any).result.filter(
      x => x.Status == 1
    ) as Stage[];
    this.initComboboxStages.FullStages = (data as any).result as Stage[];
    this.initComboboxStages.StagesCopy = (data as any).result.filter(
      x => x.Status == 1
    ) as Stage[];
  }
  async loadItems() {
    let keySearch = "";
    let data: any = await this.api
      .getItemPagination(keySearch)
      .toPromise()
      .then();
    this.items = data.result;
    console.log("records: " + data.result.length);
    this.itemsBuffer = this.items.slice(0, this.bufferSize);
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  fnDelete(id) {
    swal
      .fire({
        title: this.trans.instant("BomFactory.mssg.DeleteAsk_Title"),
        titleText: this.trans.instant("BomFactory.mssg.DeleteAsk_Text"),
        confirmButtonText: this.trans.instant("Button.Yes"),
        cancelButtonText: this.trans.instant("Button.Cancel"),
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
                swal.fire({
                  title: this.trans.instant("messg.delete.caption"),
                  titleText: this.trans.instant("messg.delete.success"),
                  confirmButtonText: this.trans.instant("Button.OK"),
                  type: "success"
                });
                this.rerender();
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
    this.resetEntity();
  }

  isLoadData(isLoad) {
    if (isLoad) {
      this.rerender();
    }
  }

  customEntityUpdated() {
    this.entity.BomStage.forEach(item => {
      item.StageName = item.Stage.StageName;
      item.BomItemOut.forEach(itemBomOut => {
        itemBomOut.Status = true;
        itemBomOut.IsNew = false;
        itemBomOut.ItemName = itemBomOut.Item.ItemName;
        itemBomOut.UnitName = itemBomOut.Unit.UnitName;
        itemBomOut.BomItemIn.forEach(itemBomIn => {
          itemBomIn.Status = true;
          itemBomIn.IsNew = false;
          itemBomIn.ItemName = itemBomIn.Item.ItemName;
          itemBomIn.UnitName = itemBomIn.Unit.UnitName;
          return itemBomIn;
        });
        return itemBomOut;
      });
      return item;
    });
  }

  fnUpdate(id) {
    //press a link name of entity
    this.ACTION_STATUS = "update";

    this.resetEntity();
    this.ACTION_STATUS = "update";
    this.iboxloading = true;
    this.api.findBomFactoryById(id).subscribe(
      res => {
        console.log(res);
        this.entity = res;
        if (
          this.initComboboxFactories.Factories.find(
            x => x.FactoryId == res.FactoryId && x.isCopy != true
          ) == null
        ) {
          let item = this.initComboboxFactories.FullFactories.find(
            x => x.FactoryId == res.FactoryId
          );
          this.initComboboxFactories.Factories = this.initComboboxFactories.Factories.concat(
            [
              {
                FactoryId: item.FactoryId,
                FactoryName: item.FactoryName,
                isCopy: true
              }
            ]
          );
        } else {
          this.initComboboxFactories.Factories = this.initComboboxFactories.FactoriesCopy;
        }
        console.log(this.initComboboxFactories);

        this.customEntityUpdated();
        //debugger
        $("#modalStages").modal("show");
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
}
