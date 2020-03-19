import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MonitorChartTracking, Factory, Unit, BomFactory, ProcessLog } from 'src/app/models/SmartInModels';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { ToastrService } from 'ngx-toastr';
import { MyHelperService } from 'src/app/services/my-helper.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
declare let $: any;
@Component({
  selector: 'app-process-logs',
  templateUrl: './process-logs.component.html',
  styleUrls: ['./process-logs.component.css']
})
export class ProcessLogsComponent implements   OnDestroy, OnInit {

  @ViewChild(DataTableDirective)  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();



  entity : MonitorChartTracking = new MonitorChartTracking();
  bsConfig = { dateInputFormat: "YYYY-MM-DD", adaarptivePosition: true };
  initComboboxFactories = { Factories: [], FullFactories: [], FactoriesCopy:[]};
  initComboboxStages = { Stages: [], FullStages: [], StagesCopy:[]};  
  units: Unit[] = [];
  iboxloading = false;
  bomFactory : BomFactory = new BomFactory();
  returnlist : {ProcessLogs: ProcessLog[], Stages : any[],  OutItems: any[]};

  currentStage: number = 0;
  currentOutItem : number = 0;
  

  data: any

  constructor(
            private api: WaterTreatmentService,
            private toastr: ToastrService,
            private helper: MyHelperService
            
            ) { }

  async ngOnInit() {    
    this.data = { Stages : [],  OutItems: []}
    // this.eventOnClick();
    await this.loadFactoryList();
    // await this.loadUnit();
  }
  fnUpdate()
  {
    
    $("#modalIn").modal("show");
  }
  async fnFindBomFactoryId()
  {
    
    
    this.data  = await this.api.searchProcessLog(this.entity.FactoryId,this.helper.dateConvertToString(this.entity.EndDate)).toPromise().then();
    this.currentStage = this.data.Stages[0].StageId;
    this.dtTrigger.next();
    // .subscribe(res=>{
    //   if (res){
    //     this.data = res;
    //     this.currentStage = res.Stages[0].StageId;
    //     console.log(res);
    //     this.dtTrigger.next();
        
        
    //     // this.tableRender();


    //   }
      
    // })
    
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


  /**Event onclick */
  private eventOnClick(){
    var that = this;
    $(document).ready(function() {
      $(".tab-pane").click(()=>{
        console.log('test');
        debugger;
        that.dtTrigger.next();
          //DATA TABLE TRIGGER;
    
        });


    })
    
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe(); 
    
  }

  tableRender(){
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }
  
  ngAfterViewInit(): void {
    this.dtTrigger.next();
    // this.tableRender();
  }






}
