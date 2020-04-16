import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FactoryService, MonitorService } from 'src/app/core/services';
import { formatDate } from '@angular/common';
import { Monitor, MonitorDescription, ChartFactory } from 'src/app/core/models/monitor';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
import DataSource from 'devextreme/data/data_source';
import { DxChartComponent } from 'devextreme-angular';
import { HttpClient } from '@angular/common/http';
import * as Highcharts from 'highcharts/highstock';
import { Subscription, interval } from 'rxjs';
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
  chartType: string = ''
  chartFactory: ChartFactory;
  monitorsInfo: DataSource;
  monitorSources: MonitorDescription[] = [];
  types: string[] = ["line", "column", "stackedline", "fullstackedline"];
  private _visualRange: any = {};
  chartDataSource: any;
  public options: Highcharts.Options;
  subscription: Subscription;
  constructor(private factoryService: FactoryService, private monitorService: MonitorService,
    private devService: DevextremeService, private http: HttpClient) {
    this.chartFactory = new ChartFactory();
    this.chartType = this.types[0]
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
      //ngôn ngữ chưa hoat động
      lang: {
        loading: "Đang tải ...",
        months: [
          "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
          "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9",
          "Tháng 10", "Tháng 11", "Tháng 12"],
        weekdays: [
          'Dimanche', 'Lundi', 'Mardi', 'Mercredi',
          'Jeudi', 'Vendredi', 'Samedi'
        ]
      }
    }
    this.factories = this.devService.loadDxoLookup('Factory', false);
  }
  ngOnInit() {
    this.chartFactory = new ChartFactory();
    console.log(this.factories);
    this.chartFactory.factoryId = 1 //default
  }
  onSelectionChanged(event) {
    switch(event.selectedItem)
    {
      case 'line':
        this.monitorSources.forEach((item) => {
          this.options.series = [{
            type: "line",
            data: this.monitorsInfo.items().map((e) => { return e['data_' + item.value] }),
            lineWidth: 0.5,
            name: 'Chỉ số'
          }]
          this.options.title = {
            text: item.name
          },
            Highcharts.stockChart(item.value, this.options)
        })
      case 'column':
        this.monitorSources.forEach((item) => {
          this.options.series = [{
            type: "column",
            data: this.monitorsInfo.items().map((e) => { return e['data_' + item.value] }),
            
            name: 'Chỉ số'
          }]
          this.options.title = {
            text: item.name
          },
            Highcharts.stockChart(item.value, this.options)
        })
    }
  }
  async chartQuery() {
    this.monitorSources = this.monitorService.getMonitorSources();
    var _filterDataSource = [
      ["FactoryId", "=", this.chartFactory.factoryId],
      "and",
      ["MonitorDate", ">=", this.chartFactory.dateFrom],
      "and",
      ["MonitorDate", "<=", this.chartFactory.dateTo]
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
        data: this.monitorsInfo.items().map((e) => { return e['data_' + item.value] }),
        lineWidth: 0.5,
        name: 'Chỉ số'
      }]
      containerOption.title = {
        text: item.name
      },
        Highcharts.stockChart(item.value, containerOption)
    })
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.loadChart();
  }

}