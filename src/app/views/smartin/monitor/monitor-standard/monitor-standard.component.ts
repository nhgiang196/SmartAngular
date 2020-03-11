import { Component, OnInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Item, MonitorStandard } from 'src/app/models/SmartInModels';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';
@Component({
  selector: 'app-monitor-standard',
  templateUrl: './monitor-standard.component.html',
  styleUrls: ['./monitor-standard.component.css']
})
export class MonitorStandardComponent implements OnInit {
  monitors:Array<MonitorStandard> = new Array<MonitorStandard>();
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  ACTION_STATUS: string;
  existName = false;
  entity: MonitorStandard;
  constructor(  private api: WaterTreatmentService,private toastr: ToastrService,private trans: TranslateService,) { }

  ngOnInit() {
    this.dtOptions = {
      autoWidth: true,
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
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

    this.loadData();
  }
 //config
 bsConfig = { dateInputFormat: "YYYY-MM-DD", adaptivePosition: true };
  loadData(){
    $('#myTable').DataTable().clear().destroy();
    this.api.getAllMonitorStandard().subscribe(res=>{
      this.monitors = res;
      this.dtTrigger.next();
    },
    err=>{
      this.toastr.error(err.statusText)
    }
    )
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
              swal.fire(
                'Deleted!', this.trans.instant('messg.delete.success'), 'success'
              );
             this.loadData();
              // $("#myModal4").modal('hide');
            }
            else this.toastr.warning(operationResult.Message);
          }, err => { this.toastr.error(err.statusText) })
        }
      })
  }

  fnUpdate(current)
  {
    this.ACTION_STATUS = 'update'
    this.entity = current;
    this.existName = false;
  }
}
