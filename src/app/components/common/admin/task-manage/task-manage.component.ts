import { Component, OnInit } from '@angular/core';
import { EngineService } from 'src/app/services/engine.service';
@Component({
  selector: 'app-task-manage',
  templateUrl: './task-manage.component.html',
  styleUrls: ['./task-manage.component.css']
})
export class TaskManageComponent implements OnInit {


  constructor(public engineApi:EngineService) { }
  ngOnInit() {
   this.engineApi.allTaskInProcess();
  }
  taskItemByProcess(){
    this.engineApi.loadAllTask(false);// if false load all user tasks
  }

}
