import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, Renderer } from "@angular/core";
import {Item, ItemType} from "src/app/models/SmartInModels";
import { Subject } from "rxjs";
import { WaterTreatmentService } from "src/app/services/api-watertreatment.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "src/app/services/auth.service";
import swal from "sweetalert2";
import { MyHelperService } from "src/app/services/my-helper.service";
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
declare let $: any;
@Component({
  selector: "app-item-list",
  templateUrl: "./item-list.component.html",
  styleUrls: ["./item-list.component.css"]
})
export class ItemListComponent implements  AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective)  datatableElement: DataTableDirective;
  Items: Item[];
  listItemType: Array<ItemType> = new Array<ItemType>();
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dtElement: DataTableDirective;

  public ACTION_STATUS: string;
  iboxloading = false;
  itemTypeIdPram: any;
  itemTypeId: 0;

  constructor(
    private api: WaterTreatmentService,
    private toastr: ToastrService,
    private trans: TranslateService,
    private auth: AuthService,
    public helper: MyHelperService,
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer,
  ) { }

  ngOnInit(): void {
    this.loadInit();
    this.getAllItemType();
  }

  loadInit = () => { 
    this.dtOptions = {
      autoWidth: true,
      // dom: ` <"row"<"col-sm-4 m-b-xs"l><"#myid.col-sm-4 m-b-xs"f><"col-sm-4"p>><t><"row"<"col-sm-4 m-b-xs"i><"#myid2.col-sm-4 m-b-xs"f><"col-sm-4"p>>`, //recommend Dom --nhgiang
      responsive: true,
      serverSide: true,
      deferRender: true,
      paging: true,
      stateSave: true,
      pagingType: 'full_numbers',
      search: { regex: true },
      processing: true,
      pageLength: 10,    
      columns: [
          { data: 'ItemID' }
        , { data: 'ItemTypeID' }
        , { data: 'ItemNo' }
        , { data: 'ItemName' }
        , { data: 'ItemPrintName' }
        , { data: 'ItemUnitID' }
        , { data: 'ItemModel' }
        , { data: 'ItemSerial' }
        , { data: 'ItemManufactureCountry' }
        , { data: 'ItemManufactureYear' }
        , { data: 'ItemLength' }
        , { data: 'ItemWidth' }
        , { data: 'ItemHeight' }
        , { data: 'ItemWeight' }
        , { data: 'CreateBy' }
        , { data: 'CreateDate' }
        , { data: 'ModifyBy' }
        , { data: 'ModifyDate' }
        , { data: 'Status' }
        , { data : null}
      ],
      

      ajax: (dataTablesParameters: any, callback) => {
        this.dtOptions.ajax= (dataTablesParameters: any, callback) => { //chèn lại ajax ở một vị trí duy nhất khi định nghĩa
          this.api.getItemByItemType(dataTablesParameters, this.itemTypeId).subscribe(res => {
            this.Items = res.data;
            console.log(this.Items)
            callback({
              recordsTotal: res.recordsTotal,
              recordsFiltered: res.recordsFiltered,
              data: []
            });
          })
        }
      },
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
    this.itemTypeId = this.itemTypeIdPram = this.route.snapshot.params.id || 0; //shortcut rework
  };

  fnDelete(id) {
    swal
      .fire({
        title: this.trans.instant("Factory.DeleteAsk_Title"),
        titleText: this.trans.instant("Factory.DeleteAsk_Text"),
        type: "warning",
        showCancelButton: true,
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          this.api.deleteItem(id).subscribe(
            res => {
              let operationResult: any = res;
              if (operationResult.Success) {
                swal.fire(
                  "Deleted!",
                  this.trans.instant("messg.delete.success"),
                  "success"
                );
                this.loadInit();
              } else {
                this.toastr.warning(operationResult.Message);
              }
            },
            err => {
              this.toastr.error(err.statusText);
            }
          );
        }
      });
  }
  fnAdd() {
    this.router.navigate(['category/item/action']);
  }

  fnUpdate(itemId) {
    this.router.navigate(['category/item/action/' + itemId]);
  }

  async getAllItemType() {
    this.listItemType = await this.api.getItemType().pipe(map(res => {
      return res as Array<ItemType>;
    })).toPromise().then();
  }

  searchItemByItemType(idItemType) {
    this.tableRender();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe(); 
  }

  tableRender(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.tableRender();
  }

}
