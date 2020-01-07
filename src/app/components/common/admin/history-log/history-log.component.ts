import { Component, OnInit } from '@angular/core';
import { EngineService } from 'src/app/services/engine.service';
import { MongoApiService } from 'src/app/services/mongo-api.service';

@Component({
  selector: 'app-history-log',
  templateUrl: './history-log.component.html',
  styleUrls: ['./history-log.component.css']
})
export class HistoryLogComponent implements OnInit {


  constructor(public engineApi: EngineService) {     
  }

  ngOnInit() {
   
  }

}
