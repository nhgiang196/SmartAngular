import { element } from 'protractor';
import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import { MonitorStandarService, AuthService, FactoryService } from 'src/app/core/services';
import { DxDataGridComponent } from 'devextreme-angular';
import config from 'devextreme/core/config';
import { directions } from 'src/app/core/helpers/DevExtremeExtention';
import { compareDate } from 'src/app/core/helpers/helper';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
import { MyHelperService } from 'src/app/core/services/utility/my-helper.service';

@Component({
  selector: 'app-monitor-standard',
  templateUrl: './monitor-standard.component.html',
  styleUrls: ['./monitor-standard.component.css']
})
export class MonitorStandardComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  dataSource: any;
  lkDataSourceFactory;
  myValidation:any ={}
  constructor(
    private monitorStandarService: MonitorStandarService,
    private factoryService: FactoryService,
    private devExtremeService: DevextremeService,
    private auth: AuthService,
    private toastr: ToastrService,
    private helper: MyHelperService

  ) {
  }

  ngOnInit() {
     //LOAD DATAGRID MONITOR
     this.dataSource = this.monitorStandarService.getDataGrid(false);
     this.loadFactorySelectBox();
     // this.validateMSId = this.validateMSId.bind(this);
     // this.validateDateFrom = this.validateDateFrom.bind(this);
  }
  loadFactorySelectBox() {
    this.lkDataSourceFactory = this.devExtremeService.loadDxoLookup("Factory");
  }

  addRow() {
    this.dataGrid.instance.addRow();
    this.dataGrid.instance.deselectAll();
  }
  onEditorPreparing(e) {
    //Prepare Status editor to dxSwitch
    if (e.dataField == "Status" && e.parentType === "dataRow") {
      e.editorName = "dxSwitch";
    }
    // if (e.dataField == "MonitorStandardDescription" && e.parentType === "dataRow") {
    //   e.editorName = "dxTextArea";
    //   e.editorOptions.height = 50;
    // }
  }
  
  onInitNewRow(e) {
    e.data.Status = 1;
    e.data.ValidateDateFrom = new Date();
    e.data.ValidateDateTo = new Date();
    e.data.TemperatureMin = e.data.TemperatureMax
      = e.data.PHmin = e.data.PHmax
      = e.data.Codmin = e.data.Codmax
      = e.data.Tssmin = e.data.Tssmax
      = e.data.ColorMin = e.data.ColorMax
      = e.data.Qmin = e.data.Qmax
      = e.data.AmoniMin = e.data.AmoniMax
      = 0;
  }

  onRowInserting(e) {
    e.data.MonitorStandardId = 0;
    e.data.CreateBy = this.auth.currentUser.Username;
    e.data.CreateDate = new Date();
    e.data.Status = e.data.Status ? 1 : 0;
  }

  onRowUpdating(e) {
    const data = Object.assign(e.oldData, e.newData);
    data.ModifyBy = this.auth.currentUser.Username;
    data.ModifyDate = new Date();
    data.Status = data.Status ? 1 : 0;
    e.newData = data;//set object
  }


  validation(e) {
    let data;
    if (e.oldData != null) {
      data = Object.assign(e.oldData, e.newData);
    } else data = e.newData;
  
    if (data.FactoryId == null) {
      e.isValid = false;
      e.errorText = "Factory is empty!";
    }
    if (data.ValidateDateFrom > data.ValidateDateTo) {
      e.isValid = false;
      e.errorText = "Date From greater than date To ";
    } else {
      if(data.Status == true) data.Status= 1
      if(data.Status == false) data.Status= 0 
      e.promise = this.monitorStandarService.validate(data)
        .then((result: any) => {
          if (!result.Success) {
            e.isValid = false;
            e.errorText = result.Message;
          }
        });
    }
  }
  validateMSId(e) {
  }
  validateDateFrom(e) {
    let date;
    if (typeof (e.data.ValidateDateTo) === 'string') {
      date = new Date(e.data.ValidateDateTo);
    } else date = e.data.ValidateDateTo
    if ( compareDate(e.value, date) == 1) {
      e.rule.message = "DateFrom greater than dateTo!";
      return false
    } else return true;
  }
  validateDateTo(e) {
    let date;
    if (typeof (e.data.ValidateDateFrom) === 'string') {
      date = new Date(e.data.ValidateDateFrom);
    } else date = e.data.ValidateDateFrom
    if (compareDate(date,e.value ) == 1) {
      e.rule.message = "DateTo smaller than dateFrom!";
      return false
    } else{
       return true;
    }
  }
  calculateDateTo(rowData) {
    return rowData.validateDateFrom;
}
}
