import { element } from 'protractor';
import {
  Component,
  OnInit,
  ViewChild} from '@angular/core';

import { UnitService, AuthService } from 'src/app/core/services';
import { DxDataGridComponent } from 'devextreme-angular';
import config from 'devextreme/core/config';
import { directions } from 'src/app/core/helpers/DevExtremeExtention';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Unit } from 'src/app/core/models/unit';
@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  dataSource: any;
  entity: Unit = new Unit()
  constructor(
    private api: UnitService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {
    this.dataSource = this.api.getDataGridUnit();
    config({
      floatingActionButtonConfig: directions.down
    });
  }
  ngOnInit() {}
  onSwitchStatus(e) {
   this.entity.Status = e.value;//this.entity.Status == 0 ? 1 : 0;
  }
  onRowInserting(e) {
    e.data.Status = 1;
    e.data.CreateBy = this.auth.currentUser.Username;
    e.data.CreateDate = new Date();
    e.data.UnitId = 0;
  }
  onRowUpdating(e) {
    // Modify entity olddata to newdata;
    const data = Object.assign(e.oldData, e.newData);
    data.ModifyBy = this.auth.currentUser.Username;
    // data.Status = data.Status ? 1 : 0; //tenary operation if (data.status == true) return 1 else return 0
    data.Status = this.entity.Status;
    e.newData = data;
  }

  /**
   * Init Function
   * @param e fd
   */
  onInitNewRow(e) {
    e.data.Status = 1;
    e.data.CreateBy = this.auth.currentUser.Username;
  }

}
