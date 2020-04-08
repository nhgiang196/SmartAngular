import { Component, OnInit } from '@angular/core';
import { FactoryService, MonitorService } from 'src/app/core/services';
import { formatDate } from '@angular/common';
import { Monitor, MonitorDescription, ChartFactory } from 'src/app/core/models/monitor';

@Component({
  selector: 'app-monitor-chart',
  templateUrl: './monitor-chart.component.html',
  styleUrls: ['./monitor-chart.component.css']
})
export class MonitorChartComponent implements OnInit {
  factories: any;
  labelLocation: string;
  readOnly: boolean;
  showColon: boolean;
  minColWidth: number;
  colCount: number;
  width: any;
  chartFactory: ChartFactory;
  monitorsInfo: Monitor[];
  monitorSources: MonitorDescription[];
  types: string[] = ["bar", "line", "stackedline", "fullstackedline"];
  constructor(private factoryService: FactoryService, private monitorService: MonitorService) {
    this.chartFactory = new ChartFactory();
    this.monitorSources = this.monitorService.getMonitorSources();
    this.labelLocation = "top";
    this.readOnly = false;
    this.showColon = true;
    this.minColWidth = 300;
    this.colCount = 2;

  }

  ngOnInit() {
    this.factories = this.factoryService.loadFactorySelectBox('FactoryId');
    console.log(this.factories);
  }
  onValueChanged(e){
    this.chartFactory.factoryId = e.value
  }
  chartQuery() {
    const format = 'MM/dd/yyyy HH:mm:ss';
    const locale = 'en-US';
    let entity = this.chartFactory;
    entity.dateFrom = formatDate(entity.dateFrom, format, locale);
    entity.dateTo = formatDate(entity.dateTo, format, locale);
    this.monitorService.getChartByDate(entity).subscribe(res =>  {
      this.monitorsInfo = res as Monitor[]
      console.log(this.monitorsInfo.length);
    });
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
