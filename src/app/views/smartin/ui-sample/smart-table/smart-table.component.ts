import { Component, OnInit } from '@angular/core';
import { TestService, State, Employee } from 'src/app/views/test/test.service';

@Component({
  selector: 'app-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.css']
})
export class SmartTableComponent  {

  dataSource: any[];
  states: any[];

  constructor(service: TestService) {
      this.dataSource = service.getEmployees();
      this.states = service.getStates();
  }


}
  