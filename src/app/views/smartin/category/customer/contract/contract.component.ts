import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
declare let $: any;
@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit, AfterViewInit, OnDestroy {

  destroy = new Subject<any>();
  currentDialog = null;
  laddaSubmitLoading= false;


  constructor(
    route: ActivatedRoute,
    private router: Router
  ) {
    // route.params.pipe(takeUntil(this.destroy)).subscribe(params => {

    //   // When router navigates on this component is takes the params and opens up the photo detail modal
    //   // this.currentDialog = this.modalService.open(ContractComponent, {centered: true});
    //   this.currentDialog.componentInstance.photo = params.id;

    //   // Go back to home page after the modal is closed
    //   this.currentDialog.result.then(result => {
    //       router.navigateByUrl('/');
    //   }, reason => {
    //       router.navigateByUrl('/');
    //   });
    //   });
  }
  

  ngOnInit() {
    // $('.modal').modal('show');
  }


  ngAfterViewInit(){
    
  }
  ngOnDestroy(){
    // $('.modal').modal('hide');
    // this.destroy.next();
  }

}
