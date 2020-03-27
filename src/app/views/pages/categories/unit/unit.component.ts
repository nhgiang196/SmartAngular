import {
  Component,
  OnInit,
  ViewChild,
  enableProdMode,
  ChangeDetectionStrategy
} from '@angular/core';

import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { UnitService, AuthService } from 'src/app/core/services';
import { Unit } from 'src/app/core/models/unit';
import { DxDataGridComponent } from 'devextreme-angular';
import { environment } from 'src/environments/environment';
import config from 'devextreme/core/config';

import { from } from 'rxjs';
import { directions } from 'src/app/core/helpers/DevExtremeExtention';
import { ToastrService } from 'ngx-toastr';
import { findReadVarNames } from '@angular/compiler/src/output/output_ast';
import Swal from 'sweetalert2';
import { add } from 'ngx-bootstrap/chronos/public_api';
const API_URL = 'api/v1/Unit';
@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;

  dataSource: any;
  url: string;
  masterDetailDataSource: any;
  selectedRowIndex = -1;
  constructor(
    private api: UnitService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {
    this.dataSource = this.api.getDataGridUnit(this.dataSource, 'UnitId');
    config({
      floatingActionButtonConfig: directions.down
    });
  }
  ngOnInit() { }
  /**
   * Function Insert
   * @param e with e is params in DevExtreme
   */
  onRowInserting(e) {
    console.log(e);
    this.api.addUnit(e.data).subscribe(res => {
      const result = res as any;
      if (result.Success) {
        this.toastr.success('Insert success!', 'Success!');
        this.dataGrid.instance.refresh();
      } else {
        Swal.fire('Error!', result.Message, 'error');
      }
      this.dataGrid.instance.refresh();
    });
  }
  onRowUpdating(e) {
    // Modify entity olddata to newdata;
    const data = Object.assign(e.oldData, e.newData);
    data.ModifyBy = this.auth.currentUser.Username;
    data.Status = data.Status ? 1 : 0; //tenary operation if (data.status == true) return 1 else return 0
    console.log(e);
    console.log(data);
    this.api.updateUnit(data).subscribe(res => {
      const result = res as any;
      if (result.Success) {
        this.toastr.success('Update success!', 'Success!');
        this.dataGrid.instance.refresh();
      } else {
        Swal.fire('Error!', result.Message, 'error');
      }
    });
  }
  onRowRemoving(e) {
    this.api.deleteUnit(e.data.UnitId).subscribe(res => {
      const result = res as any;
      if (result.Success) {
        this.toastr.success('Delete success!', 'Success!');
        this.dataGrid.instance.refresh();
      } else {
        Swal.fire('Error!', result.Message, 'error');
      }
    });
  }

  editRow() {
    this.dataGrid.instance.editRow(this.selectedRowIndex);
    this.dataGrid.instance.deselectAll();
  }

  deleteRow() {
    this.dataGrid.instance.deleteRow(this.selectedRowIndex);
    this.dataGrid.instance.deselectAll();
  }
  /**
   * Init Function
   * @param e fd
   */
  onInitNewRow(e) {
    e.data.Status = 1;
    e.data.CreateBy = this.auth.currentUser.Username;
  }

  addRow() {
    this.dataGrid.instance.addRow();
    this.dataGrid.instance.deselectAll();
  }
  selectedChanged(e) {
    this.selectedRowIndex = e.component.getRowIndexByKey(e.selectedRowKeys[0]);
  }
}
