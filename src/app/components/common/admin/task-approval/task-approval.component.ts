import { Component, OnInit, Input, Injector, ReflectiveInjector } from '@angular/core';
import { EngineService } from 'src/app/services/engine.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ApiEMCSService } from 'src/app/services/api-ecms.service';
import { Task } from 'src/app/models/camunda';

@Component({
  selector: 'app-task-approval',
  templateUrl: './task-approval.component.html',
  styleUrls: ['./task-approval.component.css']
})
export class TaskApprovalComponent implements OnInit {
  @Input() checkCondition: any;
  @Input() camundaTask:Task
  Params: any;
  selectedValue: any;
  lsChecker: any[] = [];
   constructor(
    private api: ApiEMCSService,
    public engine: EngineService,
    private toastr: ToastrService,
    private router: Router) { 
    }

  ngOnInit() {
    this.selectedValue = '';
  }

  fnSubmit() {
    switch (this.camundaTask.formKey) {
      case "VoucherRequisitionComponent":
        this.emcsWorkFlow();
        break;
      default:
        break;
    }

  }
  //submit to MongoDB
  saveToMongoDB() {
    //this
  }

  //save Draft if we need
  fnSave() {

  }
  //change state by EMCS Api
  emcsWorkFlow() {
    //after complete Task have been refresh TaskList
    let state = this.selectedValue == 'Agree' ? 'P' : 'M'; //P is Publish, M Reject is Modify
    this.api.updateVoucherState(this.camundaTask.businessKey, state).subscribe((res) => {
      if (res.Success) {
        this.submitBPMN();
        //save log to MongoDB here
      }
    })

  }

  //All task have to submit BPMN it can be reused
  submitBPMN() {
    let itemSelected = this.engine.decisionList.find(x => x.name === this.selectedValue);
    /**
     * This is default structure in Camunda
     */
    // this.Params={
    //   variables:{
    //     IsPublish:{
    //       value:[itemSelected.value]
    //     }
    //   }
    // }

    //Create an object to complete task
    let myCheck = {};
    myCheck[this.checkCondition] = { value: itemSelected.value }
    this.Params = {
      variables: myCheck
    }
    this.engine.completeTask(this.camundaTask.id, this.Params).subscribe(res => {
      if (res === null || res === '') {
        this.toastr.success('Task Complete!', 'Your task already submitted\n Thank you!');
        this.engine.loadAllTask(true);
        setTimeout(() => {
          this.router.navigateByUrl('mainView');
        }, 3000)
      }
      else {
        this.toastr.error('Error!', 'Your task did not submit\n Please try again!');
      }
    })
  }

}
