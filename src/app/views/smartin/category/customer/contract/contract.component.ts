import { Component, OnInit, AfterViewInit, OnDestroy, Input, Output, SimpleChanges , EventEmitter} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Contract } from 'src/app/models/SmartInModels';
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
    private router: Router
  ) {
  }
  entity : Contract;
  files: File[] = [];
  addFiles: { FileList: File[], FileLocalNameList: string[] };
  invalid: any = {};
  uploadReportProgress: any = { progress: 0, message: null, isError: null };
  initCombobox = {  };
  EditRowID = 0;
  laddaSubmitLoading= false;

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
    this.invalid = {};
    this.uploadReportProgress = { progress: 0, message: null, isError: null };
    this.EditRowID = 0;
  }



  private showModal(){
    $('#myModal').modal('show');
  }

  ngAfterViewInit(){
    
  }
  ngOnDestroy(){

  }

}
