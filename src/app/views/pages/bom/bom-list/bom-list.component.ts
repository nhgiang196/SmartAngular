import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BomService } from 'src/app/core/services';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { environment } from 'src/environments/environment';
import { BomStage } from 'src/app/core/models/bom';
import { BomStageComponent } from '../bom-stage/bom-stage.component';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
import { NotifyService } from 'src/app/core/services/utility/notify.service';

@Component({
  selector: 'app-bom-list',
  templateUrl: './bom-list.component.html',
  styleUrls: ['./bom-list.component.css']
})
export class BomListComponent implements OnInit {
  @ViewChild('modalChild',{static:false}) modalChild;
  dataSource:any;
  dataSourceFactory;
  constructor(private bomService:BomService,private devExtreme: DevextremeService, private notifyService:NotifyService) {
    this.showModalBomStage = this.showModalBomStage.bind(this);
    this.fnDelete = this.fnDelete.bind(this);
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

  fnDelete(e){
    this.notifyService.confirmDelete(() => {
      this.bomService.remove(e.row.data.BomFactoryId).then(
        (res) => {
          var operationResult: any = res;
          if (operationResult.Success) {
            this.notifyService.confirmDeleteSuccess();
            this.dataSource.reload();
          } else this.notifyService.warning(operationResult.Message);
        },
        (err) => {
          this.notifyService.error(err.statusText);
        }
      );
    });
  }
}
