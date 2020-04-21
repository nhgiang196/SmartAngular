import { Component, OnInit, ViewChild } from '@angular/core';
import { ProcessLog, FilterModel, ProcessLogItem, SearchProcessLog } from 'src/app/core/models/process';
import { ProcessLogService } from 'src/app/core/services';
import { MyHelperService } from 'src/app/core/services/utility/my-helper.service';
import { BomFactory, BomStage } from 'src/app/core/models/bom';
import { async } from 'rxjs/internal/scheduler/async';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
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
  @ViewChild('targetForm', { static: true }) targetForm: DxFormComponent;
  @ViewChild('modalChild',{static:false}) modalChild;
  @ViewChild('modalChildItem',{static:false}) modalChildItem;
  //entity: ProcessLog = new ProcessLog();
  // startDay:any=null;
  // endDay: any=null;
  // factoryId:number=0;
  bomFactory: BomFactory
  dataSourceProcessLog: any;
  dataSourceFactory:any;
  dataSourceStage:any;
  dataSourceItem:any;
  dataSourceUnit:any;
  dataSourceShift:any;
  bsConfig = { dateInputFormat: "YYYY-MM-DD", adaarptivePosition: true };
  modelSearch :SearchProcessLog
  

  constructor(
    private processLogService: ProcessLogService,
    private processLogItemService: ProcessLogItemService,
    private devExtreme: DevextremeService,
    private helper: MyHelperService,
    public trans: TranslateService,
    private notifyService: NotifyService
    ) {
      this.validateStartDate = this.validateStartDate.bind(this);
      this.validateEndDate = this.validateEndDate.bind(this);
     }

  ngOnInit() {
    this.bomFactory = new BomFactory();
    this.modelSearch = new SearchProcessLog();
    activeDefaultTabProcessLog();
    this.showModalDetail = this.showModalDetail.bind(this);
    this.showModalItemOut = this.showModalItemOut.bind(this);
    this.deleteItemOut = this.deleteItemOut.bind(this);
     this.dataSourceItem= this.devExtreme.loadDxoLookup("Item");
     this.dataSourceUnit= this.devExtreme.loadDxoLookup("Unit");
     this.dataSourceFactory = this.devExtreme.loadDxoLookup("Factory");
  }

  async fnFindBomFactoryId(){
    // if(compareDate(this.modelSearch.startDay,this.modelSearch.endDay) ==1){
    //   this.notifyService.warning("Thời gian bắt đầu phải nhỏ hơn hoặc bằng thời gian kết thúc");
    //   this.bomFactory = new BomFactory();
    //   return;
    // }
    let startDate = this.helper.dateConvertToString(this.modelSearch.startDay)
    let endDate = this.helper.dateConvertToString(this.modelSearch.endDay)
    var dataBomFactory =await  this.processLogService.searchProcessLog(this.modelSearch.factoryId,endDate).toPromise().then();
    if(dataBomFactory!=null){
      this.bomFactory = dataBomFactory;
      if(this.bomFactory!=null&&this.bomFactory.BomStage.length>0&& this.bomFactory.BomStage[0].BomItemOut.length>0){
        let stage =  this.bomFactory.BomStage[0];
        let itemOut = this.bomFactory.BomStage[0].BomItemOut[0];
        this.dataSourceProcessLog =  this.processLogService.loadDxoGridProcessLog(this.modelSearch.factoryId,stage.StageId,itemOut.ItemId,startDate,endDate);
      }
    }
    else{
      this.notifyService.warning("Không tìm thấy dữ liệu");
      this.bomFactory = new BomFactory();
    }

  }

  form_fieldDataChanged(e){
    console.log(e);
  }

  validateStartDate(e){
    return compareDate(e.value,this.modelSearch.endDay) ==1 ?false:true;
  }

  validateEndDate(e){
    return compareDate(this.modelSearch.startDay,e.value) ==1 ?false:true;
  }

 async onChange(event){
    if(this.modelSearch.startDay!=null && this.modelSearch.endDay!=null && this.modelSearch.factoryId!=0 && this.modelSearch.factoryId!=null){
       await this.fnFindBomFactoryId();
    }
    else{
      this.bomFactory = new BomFactory();
    }
  }

  loadProcessLogByItemOut(stageId , itemId){
    let startDate = this.helper.dateConvertToString(this.modelSearch.startDay)
    let endDate = this.helper.dateConvertToString(this.modelSearch.endDay)
    this.dataSourceProcessLog =  this.processLogService.loadDxoGridProcessLog(this.modelSearch.factoryId,stageId,itemId,startDate,endDate);
  }

  loadProcessLogByStage(stage: BomStage){
    let startDate = this.helper.dateConvertToString(this.modelSearch.startDay)
    let endDate = this.helper.dateConvertToString(this.modelSearch.endDay)
    if(stage.BomItemOut.length>0){
      let itemOutId = stage.BomItemOut[0].ItemId;
      this.dataSourceProcessLog =  this.processLogService.loadDxoGridProcessLog(this.modelSearch.factoryId,stage.StageId,itemOutId,startDate,endDate);
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
    entity.FactoryId = this.modelSearch.factoryId;
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
