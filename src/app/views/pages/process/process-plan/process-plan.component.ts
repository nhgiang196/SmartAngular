import { Component, OnInit } from '@angular/core';
import { ProcessPlanFactoryService } from 'src/app/core/services/process-plan.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services';
import { FileService } from 'src/app/core/services/file.service';
import { MyHelperService } from 'src/app/core/services/my-helper.service';
import { ToastrService } from 'ngx-toastr';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';

@Component({
  selector: 'app-process-plan',
  templateUrl: './process-plan.component.html',
  styleUrls: ['./process-plan.component.css']
})
export class ProcessPlanComponent implements OnInit {
  dataSourceProcessPlan: any;
  dataSourceFactory:any;
  constructor(//private processPlanFactoryService: ProcessPlanFactoryService,
    private trans: TranslateService,
    private auth: AuthService,
    private fileService: FileService,
    private helper: MyHelperService,
    private toastr: ToastrService,
    private devExtreme:DevextremeService) {
    }
  ngOnInit() {
    this.loadDataSourceProcessPlan();
    this.loadDataSourceFactory();
  }

  loadDataSourceProcessPlan(){
    let actionLoad = "DataGridProcessPlanFactoryPagination";
    let actionDelete = "DeleteProcessPlanFactory";
    this.dataSourceProcessPlan= this.devExtreme.loadDxoGrid("ProcessPlanFactory",actionLoad,actionDelete);
  }

  loadDataSourceFactory(){
    this.dataSourceFactory= this.devExtreme.loadDxoLookup("Factory");
  }
}
