import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker/models';
import { Factory, BomFactory, Unit } from 'src/app/models/SmartInModels';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { MyHelperService } from 'src/app/services/my-helper.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-process-plan',
  templateUrl: './process-plan.component.html',
  styleUrls: ['./process-plan.component.css']
})
export class ProcessPlanComponent implements OnInit {
  bsConfig: Partial<BsDatepickerConfig>;
  minMode: BsDatepickerViewMode = "year";
  factoryId="";
  month = 0;
  year=0;
  initCombobox = { Factories: [], FullFactories: [] };
  initComboboxUnit = { Units: [], FullUnits: [] };
  bomFactory: BomFactory;
  editRowNumber: number = 0;
  EditTabNumber: number = 0;
  constructor(
    private api: WaterTreatmentService,
    private toastr: ToastrService,
    private trans: TranslateService,
    private auth: AuthService,
    private helpper: MyHelperService,
    private route: ActivatedRoute
    )
    { }

  ngOnInit() {
    this.bsConfig = Object.assign(
      {},
      {
        minMode: this.minMode,
        dateInputFormat: "YYYY",
        adaptivePosition: true
      }
    );
    this.loadFactoryList();
    this.loadUnitList();

  }
  private async loadFactoryList() {
    let res = await this.api.getBasicFactory().toPromise().then().catch(err => this.toastr.warning('Get factories Failed, check network')) as any;
    this.initCombobox.Factories = (res as any).result.filter(x => x.Status == 1) as Factory[];
    this.initCombobox.FullFactories = (res as any).result as Factory[];
  }
  private async loadUnitList() {
    let res = await this.api.getBasicUnit().toPromise().then().catch(err => this.toastr.warning('Get units Failed, check network')) as any;
    this.initComboboxUnit.Units = (res as any).result.filter(x => x.Status == 1) as Unit[];
    this.initComboboxUnit.FullUnits = (res as any).result as Unit[];
  }

 fnLoadBomByMaster()
 {
    this.api.getBomFactoryByMaster(this.factoryId,this.month,this.helpper.yearConvertToString(new Date(this.year) )).subscribe(res =>
    {
      var operationResult: any = res
      if(operationResult!=null)
      {
        this.bomFactory = res;
        console.log(this.bomFactory);
      }
    }, err => { this.toastr.error(err.statusText) })
  }

  fnEditItem(i, index) { //press a link of Item
    this.editRowNumber = index +1+ i;
    //this.locationEntity = this.entity.WarehouseLocation[index];
  }
  fnCheckItem(){
    this.editRowNumber = 0;
  }

}
