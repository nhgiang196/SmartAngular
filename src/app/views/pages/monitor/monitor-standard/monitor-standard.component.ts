import { element } from 'protractor';
import {
  Component,
  OnInit,
  ViewChild} from '@angular/core';

import { MonitorStandarService, AuthService, FactoryService } from 'src/app/core/services';
import { DxDataGridComponent } from 'devextreme-angular';
import config from 'devextreme/core/config';
import { directions } from 'src/app/core/helpers/DevExtremeExtention';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';

@Component({
  selector: 'app-monitor-standard',
  templateUrl: './monitor-standard.component.html',
  styleUrls: ['./monitor-standard.component.css']
})
export class MonitorStandardComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  dataSource: any;
  lkDataSourceFactory: any;
  constructor(
    private monitorStandarService: MonitorStandarService,
    private factoryService: FactoryService,
    private devExtremeService:DevextremeService,
    private auth: AuthService,
    private toastr: ToastrService
  ) { 
    //LOAD DATAGRID MONITOR
    this.dataSource = this.monitorStandarService.getDataGridMonitorStandard();
    this.loadFactorySelectBox();
  }

  ngOnInit() {
    
  }
  loadFactorySelectBox() {
    this.lkDataSourceFactory =  this.devExtremeService.loadDxoLookup("Factory");
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
  onRowUpdating(e)
  {
debugger;
  }
  selectedChanged()
  {
    
  }


}
