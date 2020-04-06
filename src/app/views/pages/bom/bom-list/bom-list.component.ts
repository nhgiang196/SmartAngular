import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BomService } from 'src/app/core/services';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { environment } from 'src/environments/environment';
import { BomStage } from 'src/app/core/models/bom';
import { BomStageComponent } from '../bom-stage/bom-stage.component';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';

@Component({
  selector: 'app-bom-list',
  templateUrl: './bom-list.component.html',
  styleUrls: ['./bom-list.component.css']
})
export class BomListComponent implements OnInit {
  @ViewChild('modalChild',{static:false}) modalChild;
  dataSource:any;
  dataSourceFactory;
  constructor(private bomService:BomService,private devExtreme: DevextremeService) {
    this.showModalBomStage = this.showModalBomStage.bind(this);
   }

  ngOnInit() {
    this.dataSource = this.bomService.getDataGridBomFactory("BomFactoryId");
    this.loadFactorySelectBox();

  }
  loadFactorySelectBox(){
    this.dataSourceFactory = this.devExtreme.loadDxoLookup("Factory");
  }


  showModalBomStage(e){
      this.modalChild.showChildModal(e.row.data);
  }

  showAdd(){
    this.modalChild.showChildModal(null);
  }

  loadInit(){
    this.dataSource.reload();
  }
}
