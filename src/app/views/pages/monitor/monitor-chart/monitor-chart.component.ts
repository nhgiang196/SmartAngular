import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
export class MonitorChartComponent implements OnInit, AfterViewInit {
  @ViewChild(DxChartComponent, { static: false }) component: DxChartComponent;
  factories: any;
  labelLocation: string;
  readOnly: boolean;
  showColon: boolean;
  minColWidth: number;
  colCount: number;
  width: any;
  chartFactory: ChartFactory;
  monitorsInfo: DataSource;
  monitorSources: MonitorDescription[];
  types: string[] = ["bar", "line", "stackedline", "fullstackedline"];
  private _visualRange: any = {};
  chartDataSource: any;
  public options: Highcharts.Options;
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
    this.options = {
      chart: {
        zoomType: 'x'
      },
      tooltip: {
        valueDecimals: 2
      },
      xAxis: {
        type: 'datetime'
      },
    }
    this.factories = this.devService.loadDxoLookup('Factory', false);
  }
  ngOnInit() {
    this.chartFactory = new ChartFactory();
    console.log(this.factories);
    this.chartFactory.factoryId = 1 //default
  }
  async chartQuery() {
    const format = 'MM/dd/yyyy HH:mm:ss';
    const locale = 'en-US';
    let entity = this.chartFactory;
    entity.dateFrom = formatDate(entity.dateFrom, format, locale);
    entity.dateTo = formatDate(entity.dateTo, format, locale);
    var _filterDataSource = [
      ["FactoryId", "=", entity.factoryId],
      "and",
      ["MonitorDate", ">=",   entity.dateFrom ],
      "and",
      ["MonitorDate", "<=",  entity.dateTo ]
    ]
    this.monitorsInfo.filter(_filterDataSource);
    await this.monitorsInfo.load();
    console.log(this.monitorsInfo);
    this.loadChart();

  }
  loadChart() {
    this.monitorSources.forEach((item) => {
      let containerOption = this.options;
      containerOption.series = [{
        type: "line",
        data: this.monitorsInfo.items().length > 0 ? this.monitorsInfo.items().map((e) => { return e['data_' + item.value] }) : [],
        lineWidth: 0.5,
        name: 'Chỉ số'
      }]
      containerOption.title = {
        text: item.name
      },
        Highcharts.chart(item.value, containerOption)
    })
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.loadChart();
  }

}