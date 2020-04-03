import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BomService } from 'src/app/core/services';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { environment } from 'src/environments/environment';
import { BomStage } from 'src/app/core/models/bom';
import { BomStageComponent } from '../bom-stage/bom-stage.component';

@Component({
  selector: 'app-bom-list',
  templateUrl: './bom-list.component.html',
  styleUrls: ['./bom-list.component.css']
})
export class BomListComponent implements OnInit {
  @ViewChild('modalChild',{static:false}) modalChild;
  dataSource:any;
  dataSourceFactory;
  dataSourceBomStage: BomStage[] = [];
  constructor(private bomService:BomService) {
    this.showModalBomStage = this.showModalBomStage.bind(this);
   }

  ngOnInit() {
    this.dataSource = this.bomService.getDataGridBomFactory("BomFactoryId");
    this.loadFactorySelectBox();

  }
  loadFactorySelectBox(){
    let keyId = "FactoryId";
    this.dataSourceFactory =  createStore({
      key: keyId,
      loadUrl: `${environment.apiUrl}/Factory/UI_SelectBox`,
      loadParams: { keyId: keyId },
      onBeforeSend: function (method, ajaxOptions) {
        ajaxOptions.data.keyId = keyId;
        if (ajaxOptions.data.filter != null) {

          let dataParse = JSON.parse(ajaxOptions.data.filter);
          if (dataParse.length == 2)
            dataParse = JSON.parse(JSON.stringify([dataParse]));
          dataParse.push('and');
          dataParse.push(["Status", "=", 1]);
          ajaxOptions.data.filter = JSON.stringify(dataParse);
        }
        else {
          ajaxOptions.data.filter = JSON.stringify(["Status", "=", 1]);
        }
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });
  }

  loadBomStage(e){
    console.log(e);
  }

    showModalBomStage(e){
      this.modalChild.showChildModal(e.row.data);
  }
}
