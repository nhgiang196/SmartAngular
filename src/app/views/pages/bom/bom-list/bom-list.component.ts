import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BomService } from 'src/app/core/services';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { environment } from 'src/environments/environment';
import { BomStage } from 'src/app/core/models/bom';
import { BomStageComponent } from '../bom-stage/bom-stage.component';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-bom-list',
  templateUrl: './bom-list.component.html',
  styleUrls: ['./bom-list.component.css']
})
export class BomListComponent implements OnInit {
  @ViewChild('modalChild',{static:false}) modalChild;
  dataSource:any;
  dataSourceFactory;
  lookupField: any = {};
  constructor(private bomService:BomService,private devExtreme: DevextremeService, private trans: TranslateService) {
    this.showModalBomStage = this.showModalBomStage.bind(this);
    this.lookupField['Status']= devExtreme.loadDefineLookup("Status",trans.currentLang);
   }

  ngOnInit() {
    this.dataSource = this.bomService.getDataGridWithOutUrl();
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
