import { Component, OnInit } from '@angular/core';
import { ProcessPlanFactoryService } from 'src/app/core/services/process-plan.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services';
import { FileService } from 'src/app/core/services/file.service';
import { MyHelperService } from 'src/app/core/services/my-helper.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-process-plan',
  templateUrl: './process-plan.component.html',
  styleUrls: ['./process-plan.component.css']
})
export class ProcessPlanComponent implements OnInit {
  dataSourceProcessPlan: any;
  constructor(//private processPlanFactoryService: ProcessPlanFactoryService,
    private trans: TranslateService,
    private auth: AuthService,
    private fileService: FileService,
    private helper: MyHelperService,
    private toastr: ToastrService) { 
      // this.dataSourceProcessPlan = this.processPlanFactoryService.getDataGridProcessPlanFactory();
    }
  // constructor(){}
  ngOnInit() {
  }
    //Trigger for raise event update
    onEditorPreparing(e) {
      if (e.dataField == "FactoryId" && e.parentType === "dataRow") {
        e.setValue((e.value == null) ? "" : (e.value + "")); // Updates the cell value
      }
    }

}
