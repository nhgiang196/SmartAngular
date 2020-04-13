import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ProcessLog } from 'src/app/core/models/process';

@Component({
  selector: 'app-process-log-detail',
  templateUrl: './process-log-detail.component.html',
  styleUrls: ['./process-log-detail.component.css']
})
export class ProcessLogDetailComponent implements OnInit {
  @ViewChild("childModal", { static: false }) childModal: ModalDirective;
  entity:ProcessLog
  optionsDate ={
    format: 'DD-MM-YYYY'
  }
  optionsTime ={
    format: 'LT'
  }
  constructor() { }

  ngOnInit() {
    this.entity = new ProcessLog();
  }

   showChildModal(item: ProcessLog) {
    this.entity = item;
    this.childModal.show();
  }
  onSwitchStatus() {
    this.entity.Status = this.entity.Status == 0 ? 1 : 0;
  }
}
