import { element } from 'protractor';
import {
  Component,
  OnInit,
  ViewChild} from '@angular/core';

import { MonitorStandarService, AuthService } from 'src/app/core/services';
import { DxDataGridComponent } from 'devextreme-angular';
import config from 'devextreme/core/config';
import { directions } from 'src/app/core/helpers/DevExtremeExtention';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-monitor-standard',
  templateUrl: './monitor-standard.component.html',
  styleUrls: ['./monitor-standard.component.css']
})
export class MonitorStandardComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  dataSource: any;
  constructor(
    private api: MonitorStandarService,
    private auth: AuthService,
    private toastr: ToastrService
  ) { 
    this.dataSource = this.api.getDataGridMonitorStandard(this.dataSource, 'MonitorStandardId');
  }

  ngOnInit() {
    
  }
  onInitNewRow()
  {
    
  }
  onRowRemoving()
  {

  }
  onRowInserting()
  {

  }
  onRowUpdating()
  {

  }
  selectedChanged()
  {
    
  }


}
