import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { BomStage, BomFactory } from 'src/app/core/models/bom';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bom-stage',
  templateUrl: './bom-stage.component.html',
  styleUrls: ['./bom-stage.component.css']
})
export class BomStageComponent implements OnInit {
  @ViewChild("childModal", { static: false }) childModal: ModalDirective;
  entity: BomFactory;
  dataSourceStage:any;
   //config
   bsConfig = { dateInputFormat: "YYYY-MM-DD", adaptivePosition: true };
  constructor() { }

  ngOnInit() {
    this.entity = new BomFactory();
    this.loadDataSourceStage();
  }
  fnSave(){
    console.log(this.entity);
  }

  loadDataSourceStage(){
    let keyId = "StageId";

    this.dataSourceStage = createStore({
      key: keyId,
      loadUrl: `${environment.apiUrl}/Stage/UI_SelectBox`,
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

  onSwitchStatus() {
    this.entity.Status = this.entity.Status == 0 ? 1 : 0;
  }
  showChildModal(item){
    console.log(item);
    this.entity =JSON.parse(JSON.stringify(item));
    this.childModal.show();
  }


}
