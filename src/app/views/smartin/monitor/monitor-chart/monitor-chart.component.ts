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
      responsive: true,
      animation: {
        duration: this.speed * 1.5,
        easing: 'linear'
      },
      legend: false,     
    };
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(255, 99, 132, 0.1)',
      borderColor: 'rgb(255, 99, 132)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  constructor(public signalRService: SignalRService, private api: WaterTreatmentService) { }

  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addTransferChartDataListener();
    this.signalRService.addBroadcastChartDataListener();
    this.startHttpRequest();
  }

  private startHttpRequest = () => {
    this.api.getMonitorChart().subscribe(res => console.log(res))
  }
  public chartClicked = (event) => {
    this.signalRService.broadcastChartData();
  }

}
