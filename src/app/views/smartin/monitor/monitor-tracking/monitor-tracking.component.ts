import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { SignalRService } from 'src/app/services/signal-r.service';
import { Factory, MonitorChartTracking } from 'src/app/models/SmartInModels';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { ToastrService } from 'ngx-toastr';
import { MyHelperService } from 'src/app/services/my-helper.service';

@Component({
  selector: 'app-monitor-tracking',
  templateUrl: './monitor-tracking.component.html',
  styleUrls: ['./monitor-tracking.component.css']
})
export class MonitorTrackingComponent implements OnInit {

  public lineChartCOD: ChartDataSets []=[  { data: this.signalRService.codData, label: 'COD' }]
  public lineChartpH: ChartDataSets []=[  { data: this.signalRService.pHData, label: 'pH' }]
  public lineChartTemperature: ChartDataSets []=[  { data: this.signalRService.temperatureData, label: 'Temperature' }]
  public lineChartTSS: ChartDataSets []=[  { data: this.signalRService.TSSData, label: 'TSS' }]
  public lineChartQ: ChartDataSets []=[  { data: this.signalRService.qData, label: 'Q' }]
  public lineChartColor : ChartDataSets []=[  { data: this.signalRService.colorData, label: 'Color' }]
  public lineChartAmoni : ChartDataSets []=[  { data: this.signalRService.amoniData, label: 'Amoni' }]  
  initCombobox = { Factories: [], FullFactories: [], Users: [] };
  speed = 250;
  entity : MonitorChartTracking = new MonitorChartTracking();
  bsConfig = { dateInputFormat: "YYYY-MM-DD", adaptivePosition: true };
  public lineChartLabels: Label[] = this.signalRService.dataMonitorDate//['January', 'February', 'March', 'April', 'May', 'June', 'July'];
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

  constructor(public signalRService: SignalRService, 
              private api: WaterTreatmentService,
              private helpper: MyHelperService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addTransferChartDataListener();
    //this.startRequestLatestChart();
    this.loadFactoryList();
  }
  private async loadFactoryList() {
    let res = await this.api.getBasicFactory().toPromise().then().catch(err => this.toastr.warning('Get factories Failed, check network')) as any;
    this.initCombobox.Factories = ( res as any).result.filter(x=>x.Status ==1) as Factory[];
  }

  private startHttpRequest = () => {
    this.signalRService.getMonitorChart().subscribe(res => console.log(res))
  }
  private startRequestLatestChart =() =>{
    this.signalRService.getLatestMonitorChart().subscribe(res => console.log(res))
  }
  private startRequestChartbyDate =() =>
  {
    //this.signalRService.getChartByDate('2020-02-10','2020-03-10').subscribe(res => console.log(res))
  }
  public chartClicked = (event) => {
    this.signalRService.broadcastChartData();
  }

  loadViewChart(){
    var start = this.helpper.dateConvert(this.entity.StartDate);
    var end = this.helpper.dateConvert(this.entity.EndDate);
    this.signalRService.getChartByFactory(this.entity.FactoryId,start,end).subscribe(res => console.log(res));
  }
}
