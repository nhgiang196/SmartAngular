import { Component, OnInit, ViewChild } from '@angular/core';
import { ProcessLog, FilterModel, ProcessLogItem } from 'src/app/core/models/process';
import { ProcessLogService } from 'src/app/core/services';
import { MyHelperService } from 'src/app/core/services/utility/my-helper.service';
import { BomFactory, BomStage } from 'src/app/core/models/bom';
import { async } from 'rxjs/internal/scheduler/async';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { activeDefaultTabProcessLog } from 'src/app/app.helpers';
import swal from "sweetalert2";
import { TranslateService } from '@ngx-translate/core';
import { ProcessLogItemService } from 'src/app/core/services/process-log-item.service';
import { ToastrService } from 'ngx-toastr';
import { compareDate } from 'src/app/core/helpers/helper';
import { NotifyService } from 'src/app/core/services/utility/notify.service';
@Component({
  selector: 'app-process-log',
  templateUrl: './process-log.component.html',
  styleUrls: ['./process-log.component.css']
})
export class ProcessLogComponent implements OnInit {
  @ViewChild("dataGridVar",{static:false}) dataGrid: DxDataGridComponent;
  @ViewChild('modalChild',{static:false}) modalChild;
  @ViewChild('modalChildItem',{static:false}) modalChildItem;
  //entity: ProcessLog = new ProcessLog();
  startDay:any=null;
  endDay: any=null;
  factoryId:number=0;
  bomFactory: BomFactory
  dataSourceProcessLog: any;
  dataSourceFactory:any;
  dataSourceStage:any;
  dataSourceItem:any;
  dataSourceUnit:any;
  dataSourceShift:any;
  bsConfig = { dateInputFormat: "YYYY-MM-DD", adaarptivePosition: true };


  constructor(
    private processLogService: ProcessLogService,
    private processLogItemService: ProcessLogItemService,
    private devExtreme: DevextremeService,
    private helper: MyHelperService,
    private trans: TranslateService,
    private notifyService: NotifyService
    ) { }

  ngOnInit() {
    this.bomFactory = new BomFactory();
    activeDefaultTabProcessLog();
    this.showModalDetail = this.showModalDetail.bind(this);
    this.showModalItemOut = this.showModalItemOut.bind(this);
    this.deleteItemOut = this.deleteItemOut.bind(this);
     this.dataSourceItem= this.devExtreme.loadDxoLookup("Item");
     this.dataSourceUnit= this.devExtreme.loadDxoLookup("Unit");
  }

  async fnFindBomFactoryId(){
    if(compareDate(this.startDay,this.endDay) ==1){
      this.notifyService.warning("Thời gian bắt đầu phải nhỏ hơn hoặc bằng thời gian kết thúc");
      this.bomFactory = new BomFactory();
      return;
    }
    let startDate = this.helper.dateConvertToString(this.startDay)
    let endDate = this.helper.dateConvertToString(this.endDay)
    var dataBomFactory =await  this.processLogService.searchProcessLog(this.factoryId,endDate).toPromise().then();
    if(dataBomFactory!=null){
      this.bomFactory = dataBomFactory;
      if(this.bomFactory!=null&&this.bomFactory.BomStage.length>0&& this.bomFactory.BomStage[0].BomItemOut.length>0){
        let stage =  this.bomFactory.BomStage[0];
        let itemOut = this.bomFactory.BomStage[0].BomItemOut[0];
        this.dataSourceProcessLog =  this.processLogService.loadDxoGridProcessLog(this.factoryId,stage.StageId,itemOut.ItemId,startDate,endDate);
      }
    }
    else{
      this.notifyService.warning("Không tìm thấy dữ liệu");
      this.bomFactory = new BomFactory();
    }

  }

 async onChange(){
    if(this.startDay!=null && this.endDay!=null && this.factoryId!=0 && this.factoryId!=null){
       await this.fnFindBomFactoryId();
    }
    else{
      this.bomFactory = new BomFactory();
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

  showModalDetail(e){
    this.modalChild.showChildModal(e.row.data);
  }

  loadInit(){
    this.dataSourceProcessLog.reload();
  }

  showModalAdd(stageId,itemOutId){
    let entity = new ProcessLog();
    entity.FactoryId = this.factoryId;
    entity.StageId = stageId;
    entity.ItemOutId = itemOutId;
    this.modalChild.showChildModal(entity);
  }
  showModalItemOut(e){
    console.log(e);
    this.modalChildItem.showChildModal( e.row.data);
  }

  showModalAddItemOut(e){
    console.log(e);
    let itemOut = new ProcessLogItem();
    itemOut.ProcessLogId = e.data.ProcessLogId;
    this.modalChildItem.showChildModal(itemOut);
  }

  loadInitItem(e){
    this.dataSourceProcessLog.reload();
  }

  deleteItemOut(e){
    this.notifyService.confirmDelete(() =>{
      this.processLogItemService.remove(e.row.data.ProcessLogItemId).then(res => {
        var operationResult: any = res
        if (operationResult.Success) {
          this.notifyService.confirmDeleteSuccess();
          this.dataSourceProcessLog.reload();
        }
        else this.notifyService.warning(operationResult.Message);
      }, err => { this.notifyService.error(err.statusText) })
    })
  }
}
