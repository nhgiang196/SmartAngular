import { Component, OnInit, ViewChild } from "@angular/core";

import * as AspNetData from "devextreme-aspnet-data-nojquery";
import { UnitService } from "src/app/core/services";
import { Unit } from "src/app/core/models/unit";
import { DxDataGridComponent } from "devextreme-angular";
import DataSource from "devextreme/data/data_source";
import { HttpParams } from "@angular/common/http";
const API_URL = "api/v1//Unit/";
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
  constructor(private api: UnitService) {}
  ngOnInit() {
    let self =this;
    this.dataSource = new DataSource({
      key: "UnitId",
      load: loadOptions => {
        console.log(loadOptions);
        return this.api
          .getUnitTest(loadOptions)
          .toPromise()
          .then(res => {
            let result = res as any;
            return {
              data: result.result,
              totalCount: result.countItem
            };
          });
      }
    });
  }
  isNotEmpty(value: any): boolean {
    return value !== undefined && value !== null && value !== "";
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
