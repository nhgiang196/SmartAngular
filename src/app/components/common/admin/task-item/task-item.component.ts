import { Component, OnInit, Input } from '@angular/core';
import { EngineService } from 'src/app/services/engine.service';
import { Task } from 'src/app/models/camunda';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent implements OnInit {
  @Input() taskItem: Task;
  constructor(private engineApi:EngineService) { }

  ngOnInit() {
    console.log(this.taskItem.businessKey);
  }
}
