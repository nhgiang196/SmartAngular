import { Component, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { ProcessPlanFactory, ProcessPlanStage, ProcessPlanItem } from 'src/app/core/models/process';
import { ModalDirective, BsDatepickerConfig } from 'ngx-bootstrap';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
import { TranslateService } from '@ngx-translate/core';
import { MyHelperService } from 'src/app/core/services/my-helper.service';
import { AuthService } from 'src/app/core/services';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker/models';
import { BehaviorSubject } from 'rxjs';
import { ProcessPlanFactoryService } from 'src/app/core/services/process-plan.service';
import { async } from 'rxjs/internal/scheduler/async';
import { BomFactory } from 'src/app/core/models/bom';

@Component({
  selector: 'app-process-plan-action',
  templateUrl: './process-plan-action.component.html',
  styleUrls: ['./process-plan-action.component.css']
})
export class ProcessPlanActionComponent implements OnInit {
  @ViewChild("childModal", { static: false }) childModal: ModalDirective;
  entity:ProcessPlanFactory = new  ProcessPlanFactory();
  bomFactory:BomFactory= new BomFactory();
  processPlanStage:ProcessPlanStage = new ProcessPlanStage();
  processPlanItem: ProcessPlanItem = new ProcessPlanItem();
  laddaSubmitLoading = false;
  minModeMonth: BsDatepickerViewMode = "month";
  minModeYear: BsDatepickerViewMode = "year";
  bsConfigMonth :Partial<BsDatepickerConfig>;
  bsConfigYear : Partial<BsDatepickerConfig>;
  dataSourceItem: any;
  dataSourceUnit:any;
  showTab: boolean =false;
  constructor(private devExtreme: DevextremeService,private processPlanService:ProcessPlanFactoryService, private toastr: ToastrService,
    private trans: TranslateService, private auth: AuthService,
    private helper: MyHelperService) { }

  ngOnInit() {
    this.bsConfigMonth = Object.assign({},{
      minMode: this.minModeMonth,
      dateInputFormat: "MM",
      adaptivePosition: true
    });
    this.bsConfigYear = Object.assign({},{
      minMode:this.minModeYear,
      dateInputFormat: "YYYY",
      adaptivePosition: true
    });

    this.dataSourceItem = this.devExtreme.loadDxoLookup("Item");
    this.dataSourceUnit = this.devExtreme.loadDxoLookup("Unit");
  }

  showChildModal(item:ProcessPlanFactory) {
    if(item!=null){
      this.entity =item;
    }else{
      this.entity = new ProcessPlanFactory();
    }

    this.childModal.show();
  }
 async onChange(){
    if(this.entity.FactoryId!=0   && this.entity.ProcessPlanMonth!=0&&this.entity.ProcessPlanYear!=0){
      let month = this.helper.monthConvertToString(
        new Date(this.entity.ProcessPlanMonth)
      );
      let year = this.helper.yearConvertToString(
        new Date(this.entity.ProcessPlanYear)
      );
      let dataBomFactory =await this.loadBomStageNearestByFactoryId(this.entity.FactoryId,month,year);
      if(dataBomFactory!=null){
        this.bomFactory = dataBomFactory
        console.log(dataBomFactory);
        this.showTab =true;
      }
    }
    else{
      this.showTab= false;
    }
  }

 async loadBomStageNearestByFactoryId(factoryId,month,year){
    let params ={factoryId:factoryId,month:month,year:year};
    return  await this.processPlanService.getBomStageNearestByFactoryId(params).toPromise().then();
  }

}
