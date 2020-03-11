import { Component, OnInit, AfterViewInit, OnDestroy, Input, Output, SimpleChanges , EventEmitter} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Contract, ContractPrice, ContractBreach } from 'src/app/models/SmartInModels';
import { collapseIboxHelper } from 'src/app/app.helpers';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
declare let $: any;
@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('contractid') contractId : string;
  @Output('listvalue') listValue: any =[];
  @Output('contract') send_entity = new EventEmitter<Contract>();

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private api: WaterTreatmentService
  ) {
  }
  private pathFile = 'uploadFileContract'
  entity : Contract;
  files: File[] = [];
  addFiles: { FileList: File[], FileLocalNameList: string[] };
  invalid: any = {};
  uploadReportProgress: any = { progress: 0, message: null, isError: null };
  initCombobox = {  };
  EditRowID = 0;
  laddaSubmitLoading= false;
  bsConfig = { dateInputFormat: 'YYYY-MM-DD', adaptivePosition: true };


  subEntity_ContractPrice : ContractPrice = new ContractPrice();
  newEntity_ContractPrice : ContractPrice = new ContractPrice();
  subEntity_ContractBreach: ContractBreach = new ContractBreach();
  newEntity_ContractBreach :ContractBreach= new ContractBreach();

  ngOnInit() {
    this.resetEntity();
    
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes',changes);
    if (changes.contractId.firstChange || changes.contractId.currentValue==null ) return;
  }

  

  

  private async resetEntity() { //reset entity values
    this.entity = new Contract();
    this.files = [];
    this.addFiles = { FileList: [], FileLocalNameList: [] }
    this.invalid = { Existed_ContractNo: false};
    this.uploadReportProgress = { progress: 0, message: null, isError: null };
    this.EditRowID = 0;
  }



  private showModal(){
    $('#myContractModal').modal('show');
  }


  fnAddItemPrice(item){

  }
  fnAddItemBreach(item){
    

  }

  fnDownloadFile(filename) { //press FILES preview
    this.api.downloadFile(this.pathFile + '/' + filename);
  }

  ngAfterViewInit(){
    // this.showModal();
  }
  ngOnDestroy(){

  }

}
