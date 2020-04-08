import { Component, OnInit } from '@angular/core';
import { SignalRService } from 'src/app/core/services/signal-r.service';

@Component({
  selector: 'app-main-view-monitor',
  templateUrl: './main-view-monitor.component.html',
  styleUrls: ['./main-view-monitor.component.css']
})
export class MainViewMonitorComponent implements OnInit {
  descriptions: any [] =[
    {Code: "#FEFEFE", Description: "Bình thường"},
    {Code: "#CCCC00", Description: "Vượt chuẩn (Từ bình thường nhảy vượt)"},
    {Code: "#FF9900", Description: "Vượt chuẩn 3 lần liên tục "},
    {Code: "#FF0000", Description: "Vượt chuẩn 5 lần liên tục "},
    {Code: "#99CC00", Description: "Xu hướng tăng liên tục chuẩn bị vượt chuẩn"},
    {Code: "#98CC00", Description: "Xu hướng giảm liên tục chuẩn bị vượt chuẩn"}
  ]
  constructor(public signalRService: SignalRService) { }
  
  ngOnInit() {
   this.signalRService.startConnection()
   this.signalRService.addTransferFactoryDataListener();
   this.startRequestTableFactory();
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
