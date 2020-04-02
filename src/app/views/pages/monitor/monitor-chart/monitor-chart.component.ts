import { Component, OnInit } from '@angular/core';
import { FactoryService, ChartFactory } from 'src/app/core/services';

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
   constructor(private factoryService: FactoryService) 
  {
    this.chartFactory = new ChartFactory();
    this.labelLocation = "top";
    this.readOnly = false;
    this.showColon = true;
    this.minColWidth = 300;
    this.colCount = 2;
   
  }

   ngOnInit() {
    // let filter = id!=0?["ItemTypeId", "=",id]:[];
    // //this.dataSource= this.itemService.getDataGridItem('ItemId');
    // this.dataSource.filter(filter);
    this.factories =  this.factoryService.loadFactorySelectBox('FactoryId');
    console.log(this.factories);
  }

}
