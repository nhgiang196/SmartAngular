import { Component, OnInit, ViewChild } from '@angular/core';
import { FactoryService, MonitorService } from 'src/app/core/services';
import { formatDate } from '@angular/common';
import { Monitor, MonitorDescription, ChartFactory } from 'src/app/core/models/monitor';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
import DataSource from 'devextreme/data/data_source';
import { DxChartComponent } from 'devextreme-angular';
import { HttpClient } from '@angular/common/http';

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
  monitorsInfo: Monitor[];
  monitorSources: MonitorDescription[];
  types: string[] = ["bar", "line", "stackedline", "fullstackedline"];
  private _visualRange: any = {};
  //HALFDAY: number = 36000//43200000;
  ONE_HOUR: number = 36000; // set reload chart by 1 hour
  packetsLock: number = 0;
  chartDataSource: any;
  bounds: any;
  constructor(private factoryService: FactoryService,
    private http: HttpClient,
    private monitorService: MonitorService,
    private devService: DevextremeService) {
    this.chartFactory = new ChartFactory();
    this.labelLocation = "top";
    this.readOnly = false;
    this.showColon = true;
    this.minColWidth = 300;
    this.colCount = 2;
    this.chartDataSource = new DataSource({
      store: [],
      sort: "date",
      paginate: false
    });
    
  }

  ngOnInit() {
    this.factories = this.devService.loadDxoLookup('Factory', false);
  }
  get currentVisualRange(): any {
    return this._visualRange;
  }

  set currentVisualRange(range: any) {
    this._visualRange = range;
    this.onVisualRangeChanged();
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
  onValueChanged(e) {
    this.chartFactory.factoryId = e.value
  }
  chartQuery() {
    const format = 'MM/dd/yyyy HH:mm:ss';
    const locale = 'en-US';
    this.bounds = {
      startValue: formatDate(this.chartFactory.dateFrom, format, locale),//new Date(2020, 2, 1),
      endValue: formatDate(this.chartFactory.dateTo, format, locale)//new Date(2020, 2, 31)
    };

    this._visualRange = {
      startValue: new Date(2020, 2, 15),
      length: {
        days: 1
      }
    };
    // const format = 'MM/dd/yyyy HH:mm:ss';
    // const locale = 'en-US';
    // let entity = this.chartFactory;
    // entity.dateFrom = formatDate(entity.dateFrom, format, locale);
    // entity.dateTo = formatDate(entity.dateTo, format, locale);
    // this.monitorService.getChartByDate(entity).subscribe(res => {
    //   this.monitorsInfo = res as Monitor[]
    //   console.log(this.monitorsInfo.length);
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
