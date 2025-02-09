import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import { UnitService, AuthService } from 'src/app/core/services';
import { DxDataGridComponent } from 'devextreme-angular';
import config from 'devextreme/core/config';
import { directions } from 'src/app/core/helpers/DevExtremeExtention';
import { Unit } from 'src/app/core/models/unit';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/core/services/language.service';
@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  dataSource: any;
  entity: Unit = new Unit();
  lookupField: any = {};
  constructor(
    private unitService: UnitService,
    private auth: AuthService,
    private devserivce: DevextremeService,
    private lang: LanguageService
  ) {
    this.dataSource = this.unitService.getDataGrid(false);
    this.lookupField['Status']= devserivce.loadDefineSelectBox("Status",lang.getLanguage());
    this.unitValidation = this.unitValidation.bind(this);
    config({
      floatingActionButtonConfig: directions.down
    });
  }
  ngOnInit() {
    this.resetEntity();
    this.lookupField['Status'].load();
  }
  resetEntity() {
    this.entity = new Unit();
  }
  onSwitchStatus(e) {
    this.entity.Status = e.value;
  }

  addRow() {
    this.dataGrid.instance.addRow();
    this.dataGrid.instance.deselectAll();
  }

  onRowInserting(e) {
    e.data.Status = e.data.Status ? 1 : 0;
    e.data.CreateBy = this.auth.currentUser.Username;
    e.data.CreateDate = new Date();
    e.data.UnitId = 0;
  }

  onRowUpdating(e) {
    // Modify entity olddata to newdata;
    const data = Object.assign(e.oldData, e.newData);
    data.ModifyBy = this.auth.currentUser.Username;
    data.Status = data.Status ? 1 : 0;//tenary operation if (data.status == true) return 1 else return 0
    e.newData = data;
  }

  //Trigger for raise event update
  onEditorPreparing(e) {
    if (e.dataField == "UnitName" && e.parentType === "dataRow") {
      e.setValue((e.value == null) ? "" : (e.value + "")); // Updates the cell value
    }
    //Prepare Status editor to dxSwitch
    // if (e.dataField == "Status" && e.parentType === "dataRow") {
    //   e.editorName = "dxSwitch";
    // }

  }

  /**
   * Init Function
   * @param e fd
   */
  onInitNewRow(e) {
    e.data.Status = 1;
    e.data.CreateBy = this.auth.currentUser.Username;
  }

  unitValidation(e) {
    if (e.newData == null) {
      if (e.value == "" || e.value == null) {
        return new Promise((resolve, reject) => {
          reject("Field is empty!");
        });
      } else {  
        if(e.data.Status == true) e.data.Status= 1
        if(e.data.Status == false) e.data.Status= 0 
        return new Promise((resolve, reject) => {
          this.unitService.validate(e.data)
            .then((result: any) => {
              result.Success ? resolve() : reject("Unit already exist!");
              resolve(result);
            }).catch(() => {
              //console.error("Server-side validation error", error);
              resolve()
            });
        });
      }
    }
  }
}
