
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, Renderer, Input } from "@angular/core";
import { Subject } from "rxjs";
import { WaterTreatmentService } from "src/app/services/api-watertreatment.service";
import { TranslateService } from "@ngx-translate/core";
import { DataTableDirective } from 'angular-datatables';
import swal from "sweetalert2";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare let $: any;

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent  implements  AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective)  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  public ACTION_STATUS: string;
  iboxloading = false;
  laddaSubmitLoading = false;
  lsData: any = [];
  constructor(
    private api: WaterTreatmentService,
    private trans: TranslateService,
    public router: Router,
    private toastr: ToastrService
  ) { 
  }

  lsDatatable : any= []; //return datatable
  ngOnInit() {
    this.dtOptions = {
      autoWidth: true,
      responsive: true,
      dom: ` <"row"<"col-sm-4 m-b-xs"l><"#myid.col-sm-4 m-b-xs"f><"col-sm-4"p>><t><"row"<"col-sm-4 m-b-xs"i><"#myid2.col-sm-4 m-b-xs"f><"col-sm-4"p>>`, //recommend Dom --nhgiang
      serverSide: true,
      processing: true,
      deferRender: true,
      stateSave: true,
      paging: true,
      pageLength: 10,    
      pagingType: 'full_numbers',
      search: { regex: true },
      columns: [
          { data: 'CustomerId' }
         , { data: 'CustomerName'}
         , { data: 'FactoryName'}
         , { data: 'CustomerAddress'}
         , { data: 'ContactName'}
         , { data: 'ContactEmail'}
         , { data: 'ContactPhone'}
         , { data: 'Description'}
         , { data: 'CreateBy'}
         , { data: 'CreateDate'}
         , { data: 'ModifyBy'}
         , { data: 'ModifyDate'}
         , { data: 'Status'}
         , { data: 'IsIntergration'}
         , { data : null}
      ],
      ajax: (dataTablesParameters: any, callback) => {
        this.dtOptions.ajax= (dataTablesParameters: any, callback) => { //chèn lại ajax ở một vị trí duy nhất khi định nghĩa
          this.api.getDataTableCustomerPagination(dataTablesParameters).subscribe(res => {
            
            this.lsData = res.data;
            console.log("DATATABLE:",this.lsData);
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
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe(); 
    
  }

  tableRender(){
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  
  fnDelete(id){

    swal.fire({
      titleText: this.trans.instant('Customer.mssg.DeleteAsk_Text'),
      confirmButtonText: this.trans.instant('Button.OK'),
      cancelButtonText: this.trans.instant('Button.Cancel'),
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.api.deleteCustomer(id).subscribe(res => {
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
            this.tableRender();
          }
          else this.toastr.warning(operationResult.Message);
        }, err => { this.toastr.error(err.statusText) })
      }
    })





  }



  
  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.tableRender();
  }





}

