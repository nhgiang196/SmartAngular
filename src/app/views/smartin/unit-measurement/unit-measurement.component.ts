import { Component, OnInit } from '@angular/core';
import { Unit, DataTablesResponse } from 'src/app/models/SmartInModels';
import { Subject } from 'rxjs';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import swal from 'sweetalert2';
import { async } from '@angular/core/testing';
import { MyHelperService } from 'src/app/services/my-helper.service';
declare let $: any;
@Component({
  selector: 'app-unit-measurement',
  templateUrl: './unit-measurement.component.html',
  styleUrls: ['./unit-measurement.component.css']
})
export class UnitMeasurementComponent implements OnInit {

  Units: Unit[]
  entity: Unit;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  ACTION_STATUS: string;
  laddaSubmitLoading = false;
  existName = false;
  iboxloading = false;
  constructor(
    private api: WaterTreatmentService,
    private toastr: ToastrService,
    private trans: TranslateService,
    private auth: AuthService,
    private helper: MyHelperService
  ) { }

  ngOnInit(): void {
    this.loadInit()
    this.resetEntity();
    //  this.serverSide();
  }
  private resetEntity() {
    this.entity = new Unit();
  }

 loadInit = async () => {
    this.dtOptions = {
      autoWidth: true,
      responsive: true,
      serverSide : true,
      paging: true,
      stateSave: true,
      pagingType: 'full_numbers',
      search: { regex: true },
      processing : true,
      pageLength: 10,
      ajax: (dataTablesParameters: any, callback) => {
        this.api.getUnitServerside(dataTablesParameters).subscribe(res=>{
         this.Units = res.data;
          callback({
            recordsTotal: res.recordsTotal,
            recordsFiltered: res.recordsFiltered,
            data: []
          });
        })
      },
      columns: [{ data: 'UnitId' }, { data: 'UnitName' }, 
                { data: 'CreateBy' },{ data: 'CreateDate' },
                { data: 'ModifyBy' },{ data: 'ModifyDate' }],
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

   loadUnit = async () => {
    $('#myTable').DataTable().clear().destroy();
    this.api.getUnit().subscribe(res => {
      this.Units = res as any
      this.dtTrigger.next();
    });

   // this.Units = await  this.api.getUnit().toPromise().then() as any;
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  fnUpdate(current)
  {
    this.existName = false;
    this.ACTION_STATUS = 'update'
    this.entity = current;
  }
  fnDelete(id) {
    swal.fire({
      title: this.trans.instant('Factory.DeleteAsk_Title'),
      titleText: this.trans.instant('Factory.DeleteAsk_Text'),
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true
    }).then((result) => {
        if (result.value) {
          this.api.deleteUnit(id).subscribe(res => {
            var operationResult: any = res
            if (operationResult.Success) {
              swal.fire(
                'Deleted!', this.trans.instant('messg.delete.success'), 'success'
              );
             this.loadInit();
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
  onSwitchStatus (){
    this.entity.Status = this.entity.Status==0? 1: 0;
  }

  async fnSave() {
    this.laddaSubmitLoading = true;
    var e = this.entity;
    if (this.ACTION_STATUS == 'add')
        e.CreateBy = this.auth.currentUser.Username;
    else
      e.ModifyBy = this.auth.currentUser.Username

    if (await this.fnValidate(e)) {
      console.log('send entity: ', e);
      if (this.ACTION_STATUS == 'add') {
        this.api.addUnit(e).subscribe(res => {
          var operationResult: any = res
          if (operationResult.Success){
            $("#myModal4").modal('hide');
            this.toastr.success(this.trans.instant("messg.add.success"));
          }
          else this.toastr.warning(operationResult.Message);
          this.laddaSubmitLoading = false;
        }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
      }
      if (this.ACTION_STATUS == 'update') {
        this.api.updateUnit(e).subscribe(res => {
          var operationResult: any = res
          if (operationResult.Success)
            this.toastr.success(this.trans.instant("messg.update.success"));
          else this.toastr.warning(operationResult.Message);
          this.laddaSubmitLoading = false;
        }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
      }
     await this.loadInit();
    }
  }
  private async fnValidate(e) {
      let result =  await this.api.validateUnit(this.entity).toPromise().then() as any;
      if (result.Success) return true;
      else {
        this.laddaSubmitLoading = false;
        this.existName = true;
        return false;
      }
  }
}
