import { Component, OnInit, Inject, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyTaskInjector } from 'src/app/helpers/MyTaskInjector';

import { Task } from 'src/app/models/camunda';
import { VoucherApprovalComponent } from 'src/app/views/emcs/voucher-approval/voucher-approval.component';
import { VoucherRequisitionDetailComponent } from 'src/app/views/emcs/voucher-requisition-detail/voucher-requisition-detail.component';
import { EngineService } from 'src/app/services/engine.service';
import { TaskCompleteComponent } from '../task-complete/task-complete.component';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskCurrent: Task;
  myDecisionList: any[] = []
  approveComponent: any;
  bonusComponent: any;
  myInjector: Injector;
  checkCondition: String;
  constructor(private injector: Injector, private route: ActivatedRoute, private router: Router, public engineApi: EngineService) { }

  ngOnInit() {
    this.engineApi.hiddenApprove = true;// invisible Component Approval
    this.route.params.subscribe((res) => {
      this.engineApi.currentTask = this.taskCurrent = res as Task;
      this.myInjector = Injector.create({ providers: [{ provide: MyTaskInjector, useValue: this.taskCurrent }, { provide: MyTaskInjector, useValue: this.myDecisionList }], parent: this.injector });

    })
    this.loadComponent();
  }
  loadComponent() {
    switch (this.taskCurrent.formKey) {
      case 'VoucherRequisitionComponent':
              this.approveComponent = VoucherRequisitionDetailComponent; // detailComponent
              this.bonusComponent = TaskCompleteComponent; //This is bonus Component
              this.checkCondition = "IsPublish";//condition Completed              
              this.engineApi.decisionList = [{ name: 'Agree', value: 'Yes' }, { name: 'Disagree', value: 'No' }]; //List conditions in dropdownlist

        break;
      default:
        break;
    }
  }

}
