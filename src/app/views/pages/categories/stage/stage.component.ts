import { Component, OnInit } from '@angular/core';
import { StageService } from 'src/app/core/services/stage.service';
import CustomStore from 'devextreme/data/custom_store';
var URL = "api/v1/Stage";
@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})

export class StageComponent implements OnInit {
  dataSource: any;
  stageFiles: any[] = [];
  constructor(private stageService: StageService) {
    // this.dataSource = new CustomStore({
    //   key: "StageId",
    //   load: () => this.stageService.sendRequest(URL + "/GetStageDataGridPagination"),
    //   insert: (values) => this.stageService.sendRequest(URL + "/InsertOrder", "POST", {
    //     values: JSON.stringify(values)
    //   }),
    //   update: (key, values) => this.stageService.sendRequest(URL + "/UpdateOrder", "PUT", {
    //     key: key,
    //     values: JSON.stringify(values)
    //   }),
    //   remove: (key) => this.stageService.sendRequest(URL + "/DeleteOrder", "DELETE", {
    //     key: key
    //   })
    // });
  }

  ngOnInit() {
    // this.dataSource = this.stageService.getDataGridStage('StageId',this.stageFiles);
    //  this.dataSource = new CustomStore({
    //    load: ()=> this.stageService.ge
    //  })
    this.dataSource = this.stageService.getDataItemType();
  }


}
