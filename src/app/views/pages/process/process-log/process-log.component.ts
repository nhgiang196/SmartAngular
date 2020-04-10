import { Component, OnInit } from '@angular/core';
import { ProcessLog } from 'src/app/core/models/process';
import { ProcessLogService } from 'src/app/core/services';
import { MyHelperService } from 'src/app/core/services/my-helper.service';
import { BomFactory } from 'src/app/core/models/bom';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
  selector: 'app-process-log',
  templateUrl: './process-log.component.html',
  styleUrls: ['./process-log.component.css']
})
export class ProcessLogComponent implements OnInit {
  //entity: ProcessLog = new ProcessLog();
  startDay:Date
  endDay: Date
  factoryId:number
  bomFactory: BomFactory

  bsConfig = { dateInputFormat: "YYYY-MM-DD", adaarptivePosition: true };
  constructor(private processLogService: ProcessLogService,private helper: MyHelperService) { }

  ngOnInit() {
    this.bomFactory = new BomFactory();
  }

  async fnFindBomFactoryId(){
    let endDay = this.helper.dateConvertToString(this.endDay)
    var dataBomFactory =await  this.processLogService.searchProcessLog(this.factoryId,endDay).toPromise().then();
    this.bomFactory = dataBomFactory;
    if(this.bomFactory!=null&&this.bomFactory.BomStage.length>0&& this.bomFactory.BomStage[0].BomItemOut.length>0){
      let stage =  this.bomFactory.BomStage[0];
      let itemOut = this.bomFactory.BomStage[0].BomItemOut[0];
      this.findProcessLog(this.factoryId,stage.StageId,itemOut.ItemId).subscribe(res=>{
        console.log(res);
      });
    }
  }

  findProcessLog(factoryId,stageId,itemOutId){
   return this.processLogService.findProcessLog(factoryId,stageId,itemOutId);
  }

}
