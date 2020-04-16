import { Component, OnInit } from '@angular/core';
import { ChartFactory, Monitor } from 'src/app/core/models/monitor';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
import { MonitorService } from 'src/app/core/services';
import { Chart, StockChart } from 'angular-highcharts';
import { async } from 'rxjs/internal/scheduler/async';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-monitor-chart-demo',
  templateUrl: './monitor-chart-demo.component.html',
  styleUrls: ['./monitor-chart-demo.component.css']
})
export class MonitorChartDemoComponent implements OnInit {
  chartFactory: ChartFactory;
  factories: any;
  readOnly: boolean;
  showColon: boolean;
  minColWidth: number;
  colCount: number;
  width: any;
  labelLocation: string;
  types: string[] = ["bar", "line", "stackedline", "fullstackedline"];


  //hight chart
  chart:any;
  constructor(private devService: DevextremeService,private monitorService: MonitorService) {


   }

  ngOnInit() {
    this.chartFactory = new ChartFactory();
    this.labelLocation = "top";
    this.readOnly = false;
    this.showColon = true;
    this.minColWidth = 300;
    this.colCount = 2;
    this.factories = this.devService.loadDxoLookup('Factory', false);
    //this.getAll();

  }

  onValueChanged(e) {
    this.chartFactory.factoryId = e.value
  }

  initChart(dataChart: number[]){
    this.chart = new StockChart({
      rangeSelector: {
        selected: 1
    },

    title: {
        text: 'AAPL Stock Price'
    },

    series: [{
        name: 'AAPL',
        data: dataChart,
        tooltip: {
            valueDecimals: 2
        },
        type:undefined
    }]
    });

    // this.chart = new Chart({
    //   chart: {
    //     type: 'spline'
    //   },
    //   title: {
    //     text: 'Linechart'
    //   },
    //   credits: {
    //     enabled: false
    //   },
    //   series: [
    //     {
    //       name: 'NVDA',
    //       data: dataChart,
    //       type: undefined,
    //   }],
    //   xAxis:{
    //     categories:['December 2010', 'May 2012', 'January 2014', 'July 2015', 'October 2017', 'September 2019']
    //   }
    // });
  }

 async add(){
    let dataAll =await this.getAll();
    let dataChartph = dataAll.map(x=> x.PH);

    var arrayCategories = ['COD','pH','TSS','Q','Color','Amoni','Amoni']
    //var test =  [34.8, 43.0, 51.2, 41.4, 64.9, 72.4];
    this.initChart(dataChartph);
  }

  chartQuery(){

  }

 async getAll(){
  return await this.monitorService.getAll().toPromise().then();
  }

}
