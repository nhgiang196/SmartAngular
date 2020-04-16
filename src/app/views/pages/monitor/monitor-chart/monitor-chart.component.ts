import { Component, OnInit, ViewChild } from '@angular/core';
import { FactoryService, MonitorService } from 'src/app/core/services';
import { formatDate } from '@angular/common';
import { Monitor, MonitorDescription, ChartFactory } from 'src/app/core/models/monitor';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
import DataSource from 'devextreme/data/data_source';
import { DxChartComponent } from 'devextreme-angular';
import { HttpClient } from '@angular/common/http';

import * as Highcharts from 'highcharts';
import { Subscription, interval } from 'rxjs';
declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');
Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-monitor-chart',
  templateUrl: './monitor-chart.component.html',
  styleUrls: ['./monitor-chart.component.css']
})
export class MonitorChartComponent implements OnInit {
  @ViewChild(DxChartComponent, { static: false }) component: DxChartComponent;
  factories: any;
  labelLocation: string;
  readOnly: boolean;
  showColon: boolean;
  minColWidth: number;
  colCount: number;
  width: any;
  chartFactory: ChartFactory;
  // monitorsInfo: Monitor[];
  monitorsInfo: any;
  monitorSources: MonitorDescription[];
  types: string[] = ["bar", "line", "stackedline", "fullstackedline"];
  monitorField: any;

  private _visualRange: any = {};
  //HALFDAY: number = 36000//43200000;
  ONE_HOUR: number = 36000; // set reload chart by 1 hour
  packetsLock: number = 0;
  chartDataSource: any;
  bounds: any;


  public options: any = {
    chart: {
      type: 'scatter',
      height: 700
    },
    title: {
      text: 'Sample Scatter Plot'
    },
    credits: {
      enabled: false
    },
    tooltip: {
      formatter: function() {
        return '<b>x: </b>' + Highcharts.dateFormat('%e %b %y %H:%M:%S', this.x) +
          ' <br> <b>y: </b>' + this.y.toFixed(2);
      }
    },
    xAxis: {
      type: 'datetime',
      labels: {
        formatter: function() {
          return Highcharts.dateFormat('%e %b %y', this.value);
        }
      }
    },
    series: [
      {
        name: 'Normal',
        turboThreshold: 500000,
        data: [[new Date('2018-01-25 18:38:31').getTime(), 2]]
      },
      {
        name: 'Abnormal',
        turboThreshold: 500000,
        data: [[new Date('2018-02-05 18:38:31').getTime(), 7]]
      }
    ]
  }



  subscription: Subscription;
  constructor(private factoryService: FactoryService, private monitorService: MonitorService,
    private devService: DevextremeService, private http: HttpClient) {
    this.chartFactory = new ChartFactory();
    this.monitorSources = this.monitorService.getMonitorSources();
    this.labelLocation = "top";
    this.readOnly = false;
    this.showColon = true;
    this.minColWidth = 300;
    this.colCount = 2;
    this.monitorsInfo = this.monitorService.getChartMonitor();
    this.chartDataSource = new DataSource({
      store: [],
      sort: "date",
      paginate: false
    });

    this.bounds = {
      startValue: this.chartFactory.dateFrom ,//new Date(2020, 2, 1),
      endValue: this.chartFactory.dateTo//new Date(2020, 2, 31)
    };

    this._visualRange = {
      startValue: this.chartFactory.dateFrom,
      length: {
        hours: 1
      }
    };

    



  }

  ngOnInit() {
    this.chartFactory = new ChartFactory();
    this.factories = this.devService.loadDxoLookup('Factory', false);
    console.log(this.factories);
    
    
     // Set 10 seconds interval to update data again and again
     const source = interval(10000);

     // Sample API
     const apiLink = 'https://api.myjson.com/bins/13lnf4';
 
     this.subscription = source.subscribe(val => this.getApiResponse(apiLink).then(
       data => {
         const updated_normal_data = [];
         const updated_abnormal_data = [];
         data.forEach(row => {
           const temp_row = [
             new Date(row.timestamp).getTime(),
             row.value
           ];
           row.Normal === 1 ? updated_normal_data.push(temp_row) : updated_abnormal_data.push(temp_row);
         });
         this.options.series[0]['data'] = updated_normal_data;
         this.options.series[1]['data'] = updated_abnormal_data;
         Highcharts.chart('container', this.options);
       },
       error => {
         console.log('Something went wrong.');
       })
     );



  }

  getApiResponse(url) {
    return this.http.get<any>(url, {})
      .toPromise().then(res => {
        return res;
      });
  }
  
  onValueChanged(e) {
    this.chartFactory.factoryId = e.value
  }


  get currentVisualRange(): any {
    return this._visualRange;
  }

  set currentVisualRange(range: any) {
    this._visualRange = range;
    // this.onVisualRangeChanged();
  }

  onVisualRangeChanged() {
    const items = this.component.instance.getDataSource().items();

    if (!items.length ||
      items[0].monitorDate - this._visualRange.startValue >= this.ONE_HOUR ||
      this._visualRange.endValue - items[items.length - 1].monitorDate >= this.ONE_HOUR) {
      this.uploadDataByVisualRange();
    }
  }


  uploadDataByVisualRange() {
    const dataSource = this.component.instance.getDataSource();
    const storage = dataSource.items();
    const ajaxArgs = {
      startVisible: this.getDateString(this._visualRange.startValue),
      endVisible: this.getDateString(this._visualRange.endValue),
      startBound: this.getDateString(storage.length ? storage[0].monitorDate : null),
      endBound: this.getDateString(storage.length ?
        storage[storage.length - 1].monitorDate : null)
    };
    if (ajaxArgs.startVisible !== ajaxArgs.startBound &&
      ajaxArgs.endVisible !== ajaxArgs.endBound && !this.packetsLock) {
      this.packetsLock++;
      this.component.instance.showLoadingIndicator();
      this.getDataFrame(ajaxArgs)
        .then((dataFrame: any) => {
          if (dataFrame.length > 0) {
            console.log(dataFrame);
            this.packetsLock--;
            dataFrame = dataFrame.map(i => {
              return {
                monitorDate: new Date(i.MonitorDate),
                cod: i.Cod,
                pH: i.PH,
                tss: i.Tss,
                q: i.Q,
                color: i.Color,
                amoni: i.Amoni,
                temperature: i.Temperature
              };
            });
            const componentStorage = dataSource.store();
            dataFrame.forEach(item => componentStorage.insert(item));
            dataSource.reload();
            this.onVisualRangeChanged();
          }


        })
        .catch(error => {
          this.packetsLock--;
          dataSource.reload();
        });
    }
  }

  async getDataFrame(args: any) {
    let params = '?';
    params += "factoryId=" + this.chartFactory.factoryId;
    params += "&startVisible=" + args.startVisible;
    params += "&endVisible=" + args.endVisible;
    params += "&startBound=" + args.startBound;
    params += "&endBound=" + args.endBound;
    return await this.monitorService.getChartByDate(params).toPromise();
  }

  getDateString(dateTime: Date) {
    return dateTime ? dateTime.toLocaleDateString("en-US") : "";
  }
  chartQuery() {

    const format = 'MM/dd/yyyy HH:mm:ss';
    const locale = 'en-US';
    this.bounds = {
      startValue: this.chartFactory.dateFrom ,//new Date(2020, 2, 1),
      endValue: this.chartFactory.dateTo//new Date(2020, 2, 31)
    };

    this._visualRange = {
      startValue: this.chartFactory.dateFrom,
      length: {
        hours: 1
      }
    };
    let entity = this.chartFactory;
    // entity.dateFrom = formatDate(entity.dateFrom, format, locale);
    // entity.dateTo = formatDate(entity.dateTo, format, locale);
    var _filterDataSource = [
      ["FactoryId", "=", entity.factoryId],
      "and",
      ["MonitorDate", ">", entity.dateFrom],
      "and",
      ["MonitorDate", "<=", entity.dateTo]
    ]
    this.monitorsInfo.filter(_filterDataSource);
    this.monitorsInfo.load();
    console.log(this.monitorsInfo);



    // const format = 'MM/dd/yyyy HH:mm:ss';
    // const locale = 'en-US';
    // let entity = this.chartFactory;
    // entity.dateFrom = formatDate(entity.dateFrom, format, locale);
    // entity.dateTo = formatDate(entity.dateTo, format, locale);
    // this.monitorService.getChartByDate(entity).subscribe(res =>  {
    //   this.monitorsInfo = res as Monitor[]
    //   console.log(this.monitorsInfo.length);
    // });


    // this.monitorService.getChartByDate(entity).subscribe(res =>  {
    //   this.monitorsInfo = res as Monitor[]
    //   // this.monitorField['PH'] = res.filter(x=>x.)
    //   console.log(this.monitorsInfo.length);
    //   console.log(this.monitorsInfo);
    // });
    // this.monitorsInfo = await this.monitorService.getChartByDate(entity).toPromise().then();
    // console.log(this.monitorsInfo);
  }
  legendClick(e: any) {
    var series = e.target;
    if (series.isVisible()) {
      series.hide();
    } else {
      series.show();
    }
  }





















}


/**
 

<dx-chart id="fullChart" 
palette="Violet" [dataSource]="monitorsInfo" (onLegendClick)="legendClick($event)"
[zoomAndPan]="{ argumentAxis: 'pan' }">

  <dxi-series *ngFor="let monitor of monitorSources" [valueField]="monitor.value" [name]="monitor.name"  [pane]="monitor.name+'pane'">
  </dxi-series>
 
  <dxo-scroll-bar [visible]="true"></dxo-scroll-bar>
  <dxo-common-series-settings #seriesSettings argumentField="MonitorDate" selectionMode="allArgumentPoints">
  </dxo-common-series-settings>
  <dxo-margin [bottom]="20"></dxo-margin>
  <!-- <dxo-argument-axis [valueMarginsEnabled]="false" discreteAxisDivisionMode="crossLabels">
    <dxo-grid [visible]="true"></dxo-grid>
  </dxo-argument-axis> -->

  <!-- <dxo-argument-axis
    argumentType="datetime"
    visualRangeUpdateMode="keep"
    [(visualRange)]="currentVisualRange"
    [wholeRange]="bounds">
  </dxo-argument-axis> -->

  <dxi-pane *ngFor="let monitor of monitorSources" [name]="monitor.name+'pane'"></dxi-pane>
  <dxi-value-axis *ngFor="let monitor of monitorSources" [pane]="monitor.name+'pane'" [valueMarginsEnabled]="false" discreteAxisDivisionMode="crossLabels">
      <dxo-grid [visible]="true"></dxo-grid>
      <dxo-title [text]="monitor.name"></dxo-title>
  </dxi-value-axis>

  <!-- <dxo-argument-axis argumentType="datetime" [valueMarginsEnabled]="false" discreteAxisDivisionMode="crossLabels"
  [visualRangeUpdateMode]="keep" [(visualRange)]="currentVisualRange" [wholeRange]="bounds">
  <dxo-grid [visible]="true"></dxo-grid>
  </dxo-argument-axis> -->

 
  <!-- <dxo-title text="Full Chart">
    <dxo-subtitle text="(Millions of Tons, Oil Equivalent)">
    </dxo-subtitle>
  </dxo-title> -->
  <!-- <dxo-export [enabled]="true"></dxo-export>
  <dxo-tooltip [enabled]="true"></dxo-tooltip> -->
  <dxo-loading-indicator backgroundColor="none">
    <dxo-font [size]="14"></dxo-font>
  </dxo-loading-indicator>
  <dxo-animation [enabled]="false"></dxo-animation>
  <dxo-legend [visible]="false" verticalAlignment="bottom" horizontalAlignment="center" itemTextPosition="bottom"></dxo-legend>

</dx-chart>

 */