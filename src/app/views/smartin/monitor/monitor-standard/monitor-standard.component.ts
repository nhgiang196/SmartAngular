import { Component, OnInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Item, MonitorStandard } from 'src/app/models/SmartInModels';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-monitor-standard',
  templateUrl: './monitor-standard.component.html',
  styleUrls: ['./monitor-standard.component.css']
})
export class MonitorStandardComponent implements OnInit {
  Items:Array<MonitorStandard> = new Array<MonitorStandard>();
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(  private api: WaterTreatmentService,private toastr: ToastrService,) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.api.getAllMonitorStandard().subscribe(res=>{
      this.Items = res;
    },
    err=>{

    }
    )
  }

}
