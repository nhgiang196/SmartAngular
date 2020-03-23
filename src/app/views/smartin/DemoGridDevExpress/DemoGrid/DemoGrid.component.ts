import { Component, OnInit, NgModule, Pipe, PipeTransform, enableProdMode, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule,
         DxBulletModule,
         DxTemplateModule,
         DxDataGridComponent} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';

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
import { refreshDescendantViews } from '@angular/core/src/render3/instructions';
if(!/localhost/.test(document.location.host)) {
  enableProdMode();
}
@Component({
  selector: 'app-DemoGrid',
  templateUrl: './DemoGrid.component.html',
  styleUrls: ['./DemoGrid.component.css']
})
export class DemoGridComponent implements OnInit {
  bsConfig: Partial<BsDatepickerConfig>;
  minMode: BsDatepickerViewMode = "year";
  factoryId="169";
  month = 3;
  year=2020;
  initCombobox = { Factories: [], FullFactories: [] };
  initComboboxUnit = { Units: [], FullUnits: [] };
  bomFactory: BomFactory[];
  factory: Factory[];
  editRowNumber: number = 0;
  EditTabNumber: number = 0;
  constructor(
    private api: WaterTreatmentService,
    private toastr: ToastrService,
    private helpper: MyHelperService,
  ) {


  }

  @ViewChild (DxDataGridComponent) dataGrid: DxDataGridComponent;

  logOption (e){
    console.log(e.fullName +': '+ e.value);
  }
  addRow()
  {
    this.dataGrid.instance.addRow();
  }
  ngOnInit() {
    this.fnLoadBomByMaster();
    this.fnLoadFactory();
  }
  fnLoadBomByMaster()
  {//this.helpper.yearConvertToString(new Date(this.year) )
     this.api.getBomFactory().subscribe(res =>
     {
       var operationResult: any = res;
       if(operationResult!=null)
       {
         this.bomFactory = res as any;
         console.log(this.bomFactory);
       }
     }, err => { this.toastr.error(err.statusText) })
   }

   fnLoadFactory()
  {
     this.api.getFactory().subscribe(res =>
     {
       var operationResult: any = res;
       if(operationResult!=null)
       {
         this.factory = res as any;
         console.log(this.factory);
       }
     }, err => { this.toastr.error(err.statusText) })
   }

}
@NgModule({
  imports: [
      BrowserModule,
      DxDataGridModule
  ],
  declarations: [DemoGridComponent],
  bootstrap: [DemoGridComponent]
})
export class AppModule { }

//platformBrowserDynamic().bootstrapModule(DemoGridModule);
