import { Component, OnInit, ViewChild, enableProdMode, ChangeDetectionStrategy } from '@angular/core';

import * as AspNetData from "devextreme-aspnet-data-nojquery";
import { UnitService } from 'src/app/core/services';
import { Unit } from 'src/app/core/models/unit';
import { DxDataGridComponent } from 'devextreme-angular';
import { environment } from 'src/environments/environment';


const API_URL = 'api/v1/Unit'
@Component({
  selector: "app-unit",
  templateUrl: "./unit.component.html",
  styleUrls: ["./unit.component.css"]
})
export class UnitComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  customersData: any;
  shippersData: any;
  dataSource: any;
  url: string;
  masterDetailDataSource: any;
  constructor(private api: UnitService) {
    this.url = `${environment.apiUrl}`;

        this.dataSource = AspNetData.createStore({
            key: "MonitorId",
            loadUrl: this.url + "/Unit/Test",
            insertUrl: this.url + "/InsertOrder",
            updateUrl: this.url + "/UpdateOrder",
            deleteUrl: this.url + "/DeleteOrder",
            onBeforeSend: function(method, ajaxOptions) {
                ajaxOptions.xhrFields = { withCredentials: true };
            }
        });

      //   this.customersData = AspNetData.createStore({
      //     key: "Value",
      //     loadUrl: this.url + "/CustomersLookup",
      //     onBeforeSend: function(method, ajaxOptions) {
      //         ajaxOptions.xhrFields = { withCredentials: true };
      //     }
      // });

      // this.shippersData = AspNetData.createStore({
      //     key: "Value",
      //     loadUrl: this.url + "/ShippersLookup",
      //     onBeforeSend: function(method, ajaxOptions) {
      //         ajaxOptions.xhrFields = { withCredentials: true };
      //     }
      // });

  }
  ngOnInit() {
    //this.loadUnit();
  }
  onRowInserting(e) {
    this.api.addUnit(e.data).subscribe(res => {
      this.loadUnit();
      this.dataGrid.instance.refresh();
    });
  }
  async onRowUpdating(e) {
    let data = await e.oldData; // wait for get New Data Replace for oldData
    console.log(data);
    this.api.updateUnit(e.key).subscribe(res => {
      this.loadUnit();
      this.dataGrid.instance.refresh();
    });
  }
  onRowRemoving(e) {
    console.log(e);
    this.api.deleteUnit(e.data.UnitId).subscribe(res => {
      this.loadUnit();
      this.dataGrid.instance.refresh();
    });
  }

  async loadUnit() {
    //this.dataSource = await this.api.getUnit().toPromise().then();
  }
}
