import { Component, OnInit, ViewChild, SimpleChanges, Output, EventEmitter } from '@angular/core';
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
import { BomFactory, BomItemOut } from 'src/app/core/models/bom';
import { checkActiveTab } from 'src/app/app.helpers';

@Component({
  selector: 'app-process-plan-action',
  templateUrl: './process-plan-action.component.html',
  styleUrls: ['./process-plan-action.component.css']
})
export class ProcessPlanActionComponent implements OnInit {
  @ViewChild("childModal", { static: false }) childModal: ModalDirective;
  @Output() loadInit = new EventEmitter<void>();
  entity: ProcessPlanFactory = new ProcessPlanFactory();
  bomFactory: BomFactory = new BomFactory();


  processPlanStage: ProcessPlanStage = new ProcessPlanStage();
  processPlanItem: ProcessPlanItem = new ProcessPlanItem();
  laddaSubmitLoading = false;
  minModeMonth: BsDatepickerViewMode = "month";
  minModeYear: BsDatepickerViewMode = "year";
  bsConfigMonth: Partial<BsDatepickerConfig>;
  bsConfigYear: Partial<BsDatepickerConfig>;
  dataSourceItem: any;
  dataSourceUnit: any;
  showTab: boolean = false;
  flag: boolean = true;
  action:string;
  constructor(private devExtreme: DevextremeService, private processPlanService: ProcessPlanFactoryService, private toastr: ToastrService,
    private trans: TranslateService, private auth: AuthService,
    private helper: MyHelperService) { }

  ngOnInit() {
    this.bsConfigMonth = Object.assign({}, {
      minMode: this.minModeMonth,
      dateInputFormat: "MM",
      adaptivePosition: true
    });
    this.bsConfigYear = Object.assign({}, {
      minMode: this.minModeYear,
      dateInputFormat: "YYYY",
      adaptivePosition: true
    });

    this.dataSourceItem = this.devExtreme.loadDxoLookup("Item");
    this.dataSourceUnit = this.devExtreme.loadDxoLookup("Unit");
  }

  fnSave(){
    console.log(this.entity);
    this.processPlanService.add(this.entity).then(res=>{
      let result = res as any;
      if(result.Success){
        this.toastr.success("Add success");
        this.loadInit.emit();
        this.childModal.hide();
      }
    })
  }

  async showChildModal(item: ProcessPlanFactory) {
    if (item != null) {
      this.action ="update";
      var data = await this.processPlanService.findById(item.ProcessPlanFactoryId).toPromise().then();
      this.entity = data;
      console.log(this.entity)
    } else {
      this.action ="add";
      this.entity = new ProcessPlanFactory();
    }
    this.showTab = true;
    this.childModal.show();
  }
  async onChange() {
    if (this.entity.FactoryId != 0 && this.entity.ProcessPlanMonth != 0 && this.entity.ProcessPlanYear != 0 && this.action=="add") {

      let type = typeof(this.entity.ProcessPlanMonth);
         this.entity.ProcessPlanMonth = this.helper.monthConvertToString(
          new Date(this.entity.ProcessPlanMonth)
        );
        this.entity.ProcessPlanYear = this.helper.yearConvertToString(
          new Date(this.entity.ProcessPlanYear)
        );

      let dataBomFactory = await this.loadBomStageNearestByFactoryId(this.entity.FactoryId, this.entity.ProcessPlanMonth, this.entity.ProcessPlanYear);
      if (dataBomFactory != null) {
        this.entity.ProcessPlanStage = new Array<ProcessPlanStage>();

        if (dataBomFactory.BomStage.length > 0) {
          dataBomFactory.BomStage.forEach(item => {
            var processPlanStage = new ProcessPlanStage();
            processPlanStage.StageId = item.StageId;
            processPlanStage.StageName = item.StageName;
            if (item.BomItemOut.length > 0) {
              item.BomItemOut.forEach(itemOut => {
                var processPlanItem = new ProcessPlanItem();
                processPlanItem.ItemId = itemOut.ItemId;
                processPlanItem.UnitId = itemOut.UnitId;
                processPlanItem.Quantity = itemOut.Quantity;
                processPlanStage.ProcessPlanItem.push(processPlanItem);
              });
            }
            this.entity.ProcessPlanStage.push(processPlanStage);
          }
          );
        }
        console.log(this.entity.ProcessPlanStage);
        this.showTab = true;
      }
      else {
        this.entity.ProcessPlanStage = new Array<ProcessPlanStage>();
      }
    }
    else {
      this.showTab = false;
    }
  }

  async loadBomStageNearestByFactoryId(factoryId, month, year) {
    let params = { factoryId: factoryId, month: month, year: year };
    return await this.processPlanService.getBomStageNearestByFactoryId(params).toPromise().then();
  }

  enableActiveTab() {
    checkActiveTab();
  }


}
