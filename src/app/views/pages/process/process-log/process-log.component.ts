import { Component, OnInit, ViewChild } from '@angular/core';
import { ProcessLog, FilterModel, ProcessLogItem } from 'src/app/core/models/process';
import { ProcessLogService } from 'src/app/core/services';
import { MyHelperService } from 'src/app/core/services/my-helper.service';
import { BomFactory, BomStage } from 'src/app/core/models/bom';
import { async } from 'rxjs/internal/scheduler/async';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { activeDefaultTabProcessLog } from 'src/app/app.helpers';

@Component({
  selector: 'app-process-log',
  templateUrl: './process-log.component.html',
  styleUrls: ['./process-log.component.css']
})
export class ProcessLogComponent implements OnInit {
  @ViewChild("dataGridVar",{static:false}) dataGrid: DxDataGridComponent;
  //entity: ProcessLog = new ProcessLog();
  startDay:Date
  endDay: Date
  factoryId:number
  bomFactory: BomFactory
  dataSourceProcessLog: any;
  dataSourceFactory:any;
  dataSourceStage:any;
  dataSourceItem:any;
  dataSourceUnit:any;
  dataSourceShift:any;
  bsConfig = { dateInputFormat: "YYYY-MM-DD", adaarptivePosition: true };
  constructor(private processLogService: ProcessLogService,private devExtreme: DevextremeService,private helper: MyHelperService) { }

  ngOnInit() {
    this.bomFactory = new BomFactory();
    activeDefaultTabProcessLog();
    // this.dataSourceFactory= this.devExtreme.loadDxoLookup("Factory");
    // this.dataSourceStage= this.devExtreme.loadDxoLookup("Stage");
    // this.dataSourceItem= this.devExtreme.loadDxoLookup("Item");
    // this.dataSourceUnit= this.devExtreme.loadDxoLookup("Unit");
    // this.dataSourceShift= this.devExtreme.loadDxoLookup("Shift");
  }

  async fnFindBomFactoryId(){
    let startDate = this.helper.dateConvertToString(this.startDay)
    let endDate = this.helper.dateConvertToString(this.endDay)
    var dataBomFactory =await  this.processLogService.searchProcessLog(this.factoryId,endDate).toPromise().then();
    this.bomFactory = dataBomFactory;
    if(this.bomFactory!=null&&this.bomFactory.BomStage.length>0&& this.bomFactory.BomStage[0].BomItemOut.length>0){
      let stage =  this.bomFactory.BomStage[0];
      let itemOut = this.bomFactory.BomStage[0].BomItemOut[0];
      this.dataSourceProcessLog =  this.processLogService.loadDxoGridProcessLog(this.factoryId,stage.StageId,itemOut.ItemId,startDate,endDate);
    }
  }

  loadProcessLogByItemOut(stageId , itemId){
    let startDate = this.helper.dateConvertToString(this.startDay)
    let endDate = this.helper.dateConvertToString(this.endDay)
    this.dataSourceProcessLog =  this.processLogService.loadDxoGridProcessLog(this.factoryId,stageId,itemId,startDate,endDate);
  }

  loadProcessLogByStage(stage: BomStage){
    let startDate = this.helper.dateConvertToString(this.startDay)
    let endDate = this.helper.dateConvertToString(this.endDay)
    if(stage.BomItemOut.length>0){
      let itemOutId = stage.BomItemOut[0].ItemId;
      this.dataSourceProcessLog =  this.processLogService.loadDxoGridProcessLog(this.factoryId,stage.StageId,itemOutId,startDate,endDate);
    }

  }

  getProcessLogItem(key: ProcessLog) {
    if (key.ProcessLogItem == null) {
      key.ProcessLogItem = new Array<ProcessLogItem>();
    }
    return key.ProcessLogItem;
  }

}
