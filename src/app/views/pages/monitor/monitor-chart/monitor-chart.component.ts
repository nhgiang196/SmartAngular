import { Component, OnInit, ViewChild } from '@angular/core';
import { MonitorService } from 'src/app/core/services';
import { MonitorDescription, ChartFactory } from 'src/app/core/models/monitor';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
import DataSource from 'devextreme/data/data_source';
import { DxChartComponent } from 'devextreme-angular';
//load laguage default
import higchart_vn from 'src/assets/i18n/highchart_vn.json';
import higchart_en from 'src/assets/i18n/highchart_en.json';

import * as Highcharts from 'highcharts/highstock';
require('highcharts/modules/exporting')(Highcharts);
import HC_exportData from 'highcharts/modules/export-data';
import { LanguageService } from 'src/app/core/services/language.service';
HC_exportData(Highcharts);
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
  chartType: string = ''
  chartFactory: ChartFactory;
  monitorsInfo: DataSource;
  monitorSources: MonitorDescription[] = [];
  types: string[] = ["line", "column", "area","areaspline"];
  chartDataSource: any;
  showData = true;
  public options: Highcharts.Options ={
    chart: {
      zoomType: 'x'
    },
    tooltip: {
      valueDecimals: 2
    },
    xAxis: {
      type: 'datetime'
    }
  };
  constructor(private monitorService: MonitorService,
    private langService: LanguageService,
    private devService: DevextremeService) {
    this.chartFactory = new ChartFactory();
    this.chartType = this.types[0]
    this.labelLocation = "top";
    this.readOnly = false;
    this.showColon = true;
    this.minColWidth = 300;
    this.colCount = 2;
    this.monitorsInfo = this.monitorService.getChartMonitor();
    this.options.lang = (this.langService.getLanguage() =='vn'? higchart_vn : higchart_en);
    Highcharts.setOptions(this.options)
    this.factories = this.devService.loadDxoLookup('Factory', false);
  }
  ngOnInit() {
    this.chartFactory = new ChartFactory();
    console.log(this.factories);
    console.log()
    this.chartFactory.factoryId = 1 //default
  }

  /**
   * Use for change type chart
   * @param event get values when selectedItem
   */
  onSelectionChanged(event) {
    this.loadChart(event.selectedItem);
  }
  loadOptions(chartName, data, chartType) {
    this.options.series = [{
      type: chartType,
      data: data,
      lineWidth: 0.5,
      name: 'Chỉ số'
    }],
      this.options.title = {
        text: chartName
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
    if (this.monitorsInfo.items().length > 0) {
      this.loadChart('line'); // load chartType default
      this.showData = true;
    }
    else
      this.showData = false;
  }
  loadChart(chartType) {
    //create some charts in Array
    this.monitorSources.forEach((item) => {
      this.loadOptions(item.name, this.monitorsInfo.items().map((e) => { return e['data_' + item.value] }), chartType);
      this.options.colors = [item.color]
      Highcharts.stockChart(item.value, this.options)
    })
  }

}