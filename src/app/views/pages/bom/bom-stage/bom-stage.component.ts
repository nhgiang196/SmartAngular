import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { BomStage, BomFactory, BomItemOut } from 'src/app/core/models/bom';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { environment } from 'src/environments/environment';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';

@Component({
  selector: 'app-bom-stage',
  templateUrl: './bom-stage.component.html',
  styleUrls: ['./bom-stage.component.css']
})
export class BomStageComponent implements OnInit {
  @ViewChild("childModal", { static: false }) childModal: ModalDirective;
  entity: BomFactory;
  dataSourceStage:any;
  dataSourceUnit:any;
  dataSourceItem:any;
   //config
   bsConfig = { dateInputFormat: "YYYY-MM-DD", adaptivePosition: true };
  constructor(private devExtreme: DevextremeService) { }

  ngOnInit() {
    this.entity = new BomFactory();
    this.loadDataSourceStage();
    this.loadDataSourceItem();
    this.loadDataSourceUnit();
  }
  fnSave(){
    console.log(this.entity);
  }

  loadDataSourceStage(){
    this.dataSourceStage = this.devExtreme.loadDxoLookup("Stage");
  }

  loadDataSourceItem(){
    this.dataSourceItem = this.devExtreme.loadDxoLookup("Item");
  }

  loadDataSourceUnit(){
    this.dataSourceUnit = this.devExtreme.loadDxoLookup("Unit");
  }

  getBomOut(key: BomStage){
    if(key.BomItemOut==null){
      key.BomItemOut = new Array<BomItemOut>();
    }
     return key.BomItemOut;
  }

  onSwitchStatus() {
    this.entity.Status = this.entity.Status == 0 ? 1 : 0;
  }
  showChildModal(item){
    console.log(item);
    this.entity =JSON.parse(JSON.stringify(item));
    this.childModal.show();
  }
  //Bom Out
  onValueChanged(event){
    console.log(event);
  }

}
