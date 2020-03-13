import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Item, MonitorStandard, Factory } from 'src/app/models/SmartInModels';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { MyHelperService } from 'src/app/services/my-helper.service';
declare let $ : any;
@Component({
  selector: 'app-monitor-standard',
  templateUrl: './monitor-standard.component.html',
  styleUrls: ['./monitor-standard.component.css']
})
export class MonitorStandardComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject()
  monitors:Array<MonitorStandard> = new Array<MonitorStandard>();
  recordStart: number;
  dtOptions: DataTables.Settings = {};
  ACTION_STATUS: string;
  existName = false;
  laddaSubmitLoading = false;
  EditRowID: number =0;
  entity: MonitorStandard;
  isDisable =false;
  iboxloading = false;
  keyword: string = '';
  monitorstandard_showed = 0;
  initCombobox = { Factories: [], FullFactories: [] };

  //config
  bsConfig = { dateInputFormat: "YYYY-MM-DD", adaptivePosition: true };

  constructor(
    private api: WaterTreatmentService,
    private toastr: ToastrService,
    private trans: TranslateService,
    private auth: AuthService,
    private helpper: MyHelperService,
    private route: ActivatedRoute,
    ) { }

  ngOnInit() {
    this.entity = new MonitorStandard();
    this.loadFactoryList();
    this.loadData();

  }

  loadData = async () => { //init loading
    this.dtOptions = {//Cau hinh datatable
      autoWidth: true,
      responsive: true,
      serverSide: true,
      paging: true,
      stateSave: true,
      pagingType: 'full_numbers',
      search: { regex: true },
      processing: true,
      pageLength: 10,
      columns: [ //khai du cot de render datatable lai nhan du
          { data: 'MonitorStandardId' },
          { data: 'FactoryName' },
          { data: 'ValidateDateFrom' },
          { data: 'ValidateDateTo' },
          { data: 'TemperatureMaX' },
          { data: 'pHMax' },
          { data: 'CODMax' },
          { data: 'TSSMax' },
          { data: 'ColorMax' },
          { data: 'AmoniMax' },
          { data: 'Note' },
          { data: null}

      ],
      ajax: (dataTablesParameters: any, callback) => {
        this.dtOptions.ajax= (dataTablesParameters: any, callback) => {
          //chèn lại ajax ở một vị trí duy nhất khi định nghĩa
           this.api.getDataTableMonitorStandardPagination(dataTablesParameters).subscribe(res => {
            this.monitors = res.data;
            console.log(this.monitors);
            this.recordStart = dataTablesParameters.start;
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

  tableRender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

   /**PRIVATE FUNCTIONS */
   private async loadFactoryList() {
    let res = await this.api.getBasicFactory().toPromise().then().catch(err => this.toastr.warning('Get factories Failed, check network')) as any;
    this.initCombobox.Factories = (res as any).result.filter(x => x.Status == 1) as Factory[];
    this.initCombobox.FullFactories = (res as any).result as Factory[];
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  fnDelete(id) {
    swal.fire({
      title: this.trans.instant('Monitor.DeleteAsk_Title'),
      titleText: this.trans.instant('Monitor.DeleteAsk_Text'),
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true
    }).then((result) => {
        if (result.value) {
          this.api.deleteMonitorStandard(id).subscribe(res => {
            var operationResult: any = res
            if (operationResult.Success) {
              this.tableRender();
              swal.fire('Deleted!', this.trans.instant('messg.delete.success'), 'success');
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
    this.isDisable = false;
    this.entity = new MonitorStandard();
  }

  async fnUpdate(current)
  {

    this.ACTION_STATUS = 'update';
    this.isDisable = true;
    this.existName = false;

    let _factoryAddTag = await this.initCombobox.FullFactories.find(x => x.FactoryId == current.FactoryId);
    if (_factoryAddTag && await !this.initCombobox.Factories.find(x => x.FactoryId == current.FactoryId))
      this.initCombobox.Factories = this.initCombobox.Factories.concat([_factoryAddTag]);
      this.api.findMonitorStandardById(current.MonitorStandardId).subscribe(res=>{
        console.log(res)
        this.entity = res
      })
  //  /   console.log(re)
      // /this.entity = current;

  }

  async fnSave() {
    this.laddaSubmitLoading = true;
    var e = this.entity;
    e.ValidateDateFrom = this.helpper.dateConvertToString(e.ValidateDateFrom);
    e.ValidateDateTo = this.helpper.dateConvertToString(e.ValidateDateTo);

    if ( await this.fnValidate(e)) {
      if (this.ACTION_STATUS == 'add') {
        e.CreateBy = this.auth.currentUser.Username;
        e.Factory = null;
        this.api.addMonitorStandard(e).subscribe(res => {
          var operationResult: any = res
          if (operationResult.Success) {
            this.tableRender();
            this.toastr.success(this.trans.instant("messg.add.success"));

          }
          else this.toastr.warning(operationResult.Message);
          this.laddaSubmitLoading = false;
          $('#myModal4').modal('hide');
        }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
      }
      if (this.ACTION_STATUS == 'update') {
        e.ModifyBy = this.auth.currentUser.Username;
        this.api.updateMonitorStandard(e).subscribe(res => {
          var operationResult: any = res
          if (operationResult.Success) {
            this.tableRender();
            this.toastr.success(this.trans.instant("messg.update.success"));

          }
          else this.toastr.warning(operationResult.Message);
          this.laddaSubmitLoading = false;
          $('#myModal4').modal('hide');
        }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
      }
      }
      else{
        this.toastr.error("Validate Date was nested!");
            this.laddaSubmitLoading = false;
            this.tableRender();
    }

  }
  private async fnValidate(e) {

    if(e.ValidateDateFrom < e.ValidateDateTo)
    {
      let result =  await this.api.validateMonitorStandard(e).toPromise().then() as any;
      if (result.Success) {
        this.existName = false;
        return true;
      }
      else {
        this.laddaSubmitLoading = false;
        this.existName = true;
        return false;
      }
    }
    else{
      this.toastr.error("ValidateForm bigger than ValidateTo!");
      this.laddaSubmitLoading = false;
      this.existName = true;
        return false;
    }
}

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.tableRender();
  }
  reSetExistName(){// hiden is-invalid
    this.existName = false;
  }
}
