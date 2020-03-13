import { Component, OnInit } from '@angular/core';
import { SignalRService } from 'src/app/services/signal-r.service';
import { HttpClient } from '@angular/common/http';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-monitor-chart',
  templateUrl: './monitor-chart.component.html',
  styleUrls: ['./monitor-chart.component.css']
})
export class MonitorChartComponent implements OnInit {

  public lineChartData: ChartDataSets[] = [
    { data: this.signalRService.myData, label: 'Series A' },
  ];
  speed = 250;
  public lineChartLabels: Label[] = this.signalRService.myLabel//['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: any =
    {
      label: "My First dataset",     
      fill: false,
    };
  public lineChartColors: Color[] = [
    {
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      pointBorderColor: "rgba(75,192,192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 5,
      pointHitRadius: 10,
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  constructor(public signalRService: SignalRService) { }

  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addTransferChartDataListener();
   // this.signalRService.addBroadcastChartDataListener();
    //this.startHttpRequest();
    this.startRequestLatestChart();
  }

  private startHttpRequest = () => {
    this.signalRService.getMonitorChart().subscribe(res => console.log(res))
  }
  private startRequestLatestChart =() =>{
    this.signalRService.getLatestMonitorChart().subscribe(res => console.log(res))
  }
  private startRequestChartbyDate =() =>
  {
    this.signalRService.getChartByDate('2020-02-10','2020-03-10').subscribe(res => console.log(res))
  }
  public chartClicked = (event) => {
    this.signalRService.broadcastChartData();
  }

}
