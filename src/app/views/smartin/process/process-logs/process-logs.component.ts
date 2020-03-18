import { Component, OnInit } from '@angular/core';
import { MonitorChartTracking, Factory, Unit, BomFactory } from 'src/app/models/SmartInModels';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { ToastrService } from 'ngx-toastr';
declare let $: any;
@Component({
  selector: 'app-process-logs',
  templateUrl: './process-logs.component.html',
  styleUrls: ['./process-logs.component.css']
})
export class ProcessLogsComponent implements OnInit {

  entity : MonitorChartTracking = new MonitorChartTracking();
  bsConfig = { dateInputFormat: "YYYY-MM-DD", adaptivePosition: true };
  initComboboxFactories = { Factories: [], FullFactories: [], FactoriesCopy:[]};
  initComboboxStages = { Stages: [], FullStages: [], StagesCopy:[]};  
  units: Unit[] = [];
  iboxloading = false;
  bomFactory : BomFactory = new BomFactory();
  constructor(
            private api: WaterTreatmentService,
            private toastr: ToastrService) { }

  async ngOnInit() {    
    await this.loadFactoryList();
    await this.loadUnit();
  }
  fnUpdate()
  {
    
    $("#modalIn").modal("show");
  }
  async fnFindBomFactoryId()
  {
    this.bomFactory = await this.api.findBomFactoryById(100).toPromise().then();
    // debugger;
    console.log(this.bomFactory);
  }
  private async loadFactoryList() {
    let res = await this.api.getBasicFactory().toPromise().then().catch(err => this.toastr.warning('Get factories Failed, check network')) as any;
    this.initComboboxFactories.Factories = ( res as any).result.filter(x=>x.Status ==1) as Factory[];
  }
  async loadUnit() {
    let keySearch = "";
    let data: any = await this.api
      .getUnitPagination(keySearch)
      .toPromise()
      .then();
    this.units = data.result;
  }

}
