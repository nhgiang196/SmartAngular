import { Component, OnInit, Input } from '@angular/core';
import { EngineService } from 'src/app/services/engine.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ApiEMCSService } from 'src/app/services/api-ecms.service';
import { MongoApiService } from 'src/app/services/mongo-api.service';

@Component({
  selector: 'app-start-process',
  templateUrl: './start-process.component.html',
  styleUrls: ['./start-process.component.css']
})
export class StartProcessComponent implements OnInit {
  @Input() flowKey;
  @Input() docId: string;
  @Input() userChecklist;
  collection: any[]=[];
  itemCollection: any={};
  constructor(
    private engineApi: EngineService,
    private toastr: ToastrService,
    private api: ApiEMCSService,
    private mongoApi: MongoApiService,
    private router: Router) { }

  ngOnInit() {
  }
  
  //submit to BPMN and MongoDB too
  fnSubmit() {    
    switch (this.flowKey) {
      case "EMCSWorkFlow":
      //form feilds save to mongoDB        
        //Change Voucher state to S 
        this.api.updateVoucherState(this.docId, "S").subscribe(res => {
          if (res.Success) this.startProcess();
          else { this.toastr.error(res.Caption,res.Message);}
        })
        break;

      default:
        break;
    }
  }
  startProcess() {
    var myObject = {}
    myObject[this.userChecklist] = { "value": this.engineApi.lsCheckers }
    //set start for Camunda
    let formHistory = {
      "variables": myObject,
      "businessKey": this.docId
    }
    this.engineApi.processDefinitionStart(this.flowKey, formHistory).subscribe(res => {
      if (res != null) {
        this.itemCollection={
          processIntanceId: 'xx',
          processDefinitionId: res.definitionId,
          activityName:'khongco',
          activityId:res.id,
          voucherId:res.businessKey,
          description: "demo"
        }
        this.mongoApi.createCollection(this.itemCollection).subscribe(res=>{
          console.log(res);
        },err=>this.toastr.error(err));
        this.toastr.success('Submit Sucess!', 'Your voucher already submitted\n Thank you!');
        //after complete Task have been refresh TaskList
        this.engineApi.loadAllTask(true);
        setTimeout(() => {
          this.router.navigateByUrl('mainView');
        }, 1500)
      }
      
      else {
        this.toastr.error('Error!', 'Your task did not submit\n Please try again!');
      }
    })
  }

}
