import { Component, OnInit } from "@angular/core";
import {
  Item,
  ItemProperty,
  Factory,
  ItemFactory,
  DataTablePaginationParram,
  Unit,
  ItemPackage,
  FactoryFile,
  ItemFile
} from "src/app/models/SmartInModels";
import { Subject } from "rxjs";
import { WaterTreatmentService } from "src/app/services/api-watertreatment.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "src/app/services/auth.service";
import swal from "sweetalert2";
import { MyHelperService } from "src/app/services/my-helper.service";
import { Router } from '@angular/router';
declare let $: any;
@Component({
  selector: "app-item-list",
  templateUrl: "./item-list.component.html",
  styleUrls: ["./item-list.component.css"]
})
export class ItemListComponent implements OnInit {
  Items: Item[];
  
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  public ACTION_STATUS: string;
  iboxloading = false;
  
  constructor(
    private api: WaterTreatmentService,
    private toastr: ToastrService,
    private trans: TranslateService,
    private auth: AuthService,
    public helper: MyHelperService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadInit();
  }

  loadInit = () => {
    this.dtOptions = {
      autoWidth: true,
      responsive: true,
      pagingType: "full_numbers",
      pageLength: 10,
      language: {
        searchPlaceholder: "Nhập nội dung tìm kiếm",
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
        // url: this.trans.instant('DefaultTable.url'),
        paginate: {
          first: "<<",
          last: ">>",
          next: ">",
          previous: "<"
        }
      }
    };
    this.loadItem();
  };

  loadItem = () => {
    $("#myTable")
      .DataTable()
      .clear()
      .destroy();
    this.api.getItem().subscribe(res => {
      console.log(res);
      this.Items = res as any;
      this.dtTrigger.next();
    });
  };

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

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
    this.router.navigate(['category/item/action/'+itemId]);
  }
}
