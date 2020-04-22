
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, Renderer, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/core/services';
import { DxDataGridComponent } from 'devextreme-angular';
declare let $: any;
import swal from "sweetalert2";
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
import { StringLengthRule } from 'devextreme/ui/validation_engine';
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  // @ViewChild(DataTableDirective)  datatableElement: DataTableDirective;
  // dtOptions: DataTables.Settings = {};
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  public ACTION_STATUS: string;
  iboxloading = false;
  laddaSubmitLoading = false;
  lsData: any = [];
  dataSource: any
  constructor(
    private api: CustomerService,
    private trans: TranslateService,
    public router: Router,
    private toastr: ToastrService,
    public devService: DevextremeService,
  ) {
    
    this.dataSource = this.api.getDataGridWithOutUrl(false);
    this.dataSourceFactory = devService.loadDxoLookup("Factory",false);
    
    this.routerToDetail = this.routerToDetail.bind(this);
    this.fnDelete = this.fnDelete.bind(this);
    this.lookupCustomerType = devService.loadDefineLookup("CustomerType");
    this.lookup["CustomerType"] =  devService.loadDefineLookup("CustomerType");
    this.lookup["IsIntergration"] =  devService.loadDefineLookup("IsIntergration");
    this.lookup["Status"] =  devService.loadDefineLookup("Status");
    this.displayLookup = devService.loadDefineDisplayExpr();
    
  }
  displayLookup : string;
  lookup: any = {};
  lookupCustomerType: any;
  dataSourceFactory: any;
  lsDatatable: any = []; //return datatable
  ngOnInit() {
  }
  fnDelete(rowValue) {
    swal.fire({
      titleText: this.trans.instant('Customer.mssg.DeleteAsk_Text'),
      confirmButtonText: this.trans.instant('Button.OK'),
      cancelButtonText: this.trans.instant('Button.Cancel'),
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.api.remove(rowValue.row.data.CustomerId).then(res => {
          var operationResult: any = res
          if (operationResult.Success) {
            swal.fire(
              // 'Deleted!', this.trans.instant('messg.delete.success'), 
              {
                title: 'Deleted!',
                titleText: this.trans.instant('messg.delete.success'),
                confirmButtonText: this.trans.instant('Button.OK'),
                type: 'success',
              }
            );
            // this.tableRender();
            this.dataSource.reload();
          }
          else this.toastr.warning(operationResult.Message);
        }, err => { this.toastr.error(err.statusText) })
      }
    })
  }
  routerToDetail(rowValue) {
    this.router.navigateByUrl('pages/category/customer/' + rowValue.row.data.CustomerId);
  }
}
