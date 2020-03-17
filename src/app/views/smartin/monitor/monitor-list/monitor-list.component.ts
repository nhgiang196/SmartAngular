import { Component, OnInit } from '@angular/core';
import { SignalRService } from 'src/app/services/signal-r.service';

@Component({
  selector: 'app-monitor-list',
  templateUrl: './monitor-list.component.html',
  styleUrls: ['./monitor-list.component.css']
})
export class MonitorListComponent implements OnInit {

  constructor(public signalRService: SignalRService) { }

  ngOnInit() {
   this.signalRService.startConnection()
   this.signalRService.addTransferFactoryDataListener();
  //  this.signalRService.addBroadcastChartDataListener();
    // this
    this.startRequestTableFactory();
  }

  private startHttpRequest = () => {
    this.signalRService.getMonitorChart().subscribe(res => console.log(res))
  }
  private startRequestTableFactory =() =>{
    this.signalRService.getTableFactory().subscribe(res => console.log(res))
  }

  public getColor(val,type="color"){
    let result = [];
    if(val.includes("#"))
    {
      let arr = val.split("#");
      result.push(arr[0]);
      result.push(arr[1])
    }
     else{
      result.push(val);
      result.push("")
     }
     return result;
    
  }


}
