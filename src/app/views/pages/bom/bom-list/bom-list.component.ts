import { Component, OnInit } from '@angular/core';
import { BomService } from 'src/app/core/services';

@Component({
  selector: 'app-bom-list',
  templateUrl: './bom-list.component.html',
  styleUrls: ['./bom-list.component.css']
})
export class BomListComponent implements OnInit {
  dataSource:any;
  constructor(private bomService:BomService) { }

  ngOnInit() {
    this.dataSource = this.bomService.getDataGridBomFactory("BomFactoryId");
  }



}
