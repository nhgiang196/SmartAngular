import { Component, OnInit, ViewChild } from '@angular/core';
import { ProcessPlanFactoryService } from 'src/app/core/services/process-plan.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services';
import { FileService } from 'src/app/core/services/file.service';
import { MyHelperService } from 'src/app/core/services/utility/my-helper.service';
import { ToastrService } from 'ngx-toastr';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';

@Component({
  selector: 'app-process-plan',
  templateUrl: './process-plan.component.html',
  styleUrls: ['./process-plan.component.css']
})
export class ProcessPlanComponent implements OnInit {
  @ViewChild('modalChild',{static:false}) modalChild;
  dataSourceProcessPlan: any;
  dataSourceFactory:any;
  lookupField: any = {};
  constructor(
    private processPlanService:ProcessPlanFactoryService,
    private devExtreme:DevextremeService,
    private trans: TranslateService) {
      this.showModalAction = this.showModalAction.bind(this);
      this.lookupField['Status'] = devExtreme.loadDefineLookup("Status",trans.currentLang);
    }
  ngOnInit() {
    this.loadDataSourceProcessPlan();
    this.loadDataSourceFactory();
  }

  loadDataSourceProcessPlan(){
    this.dataSourceProcessPlan= this.processPlanService.getDataGridWithOutUrl();
  }

  loadDataSourceFactory(){
    this.dataSourceFactory= this.devExtreme.loadDxoLookup("Factory");
  }
  showModalAction(e){
    this.modalChild.showChildModal(e.row.data);
  }


  showAdd(){
    this.modalChild.showChildModal(null);
  }

  loadInit(){
    this.dataSourceProcessPlan.reload();
  }
}
