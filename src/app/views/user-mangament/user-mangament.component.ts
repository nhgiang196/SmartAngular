import { Component, OnInit } from '@angular/core';
import { collapseIboxHelper } from '../../app.helpers';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { ToastrService } from 'ngx-toastr';





@Component({
  selector: 'app-user-mangament',
  templateUrl: './user-mangament.component.html',
  styleUrls: ['./user-mangament.component.css']
})
export class UserMangamentComponent implements OnInit {

  constructor(
    private api: WaterTreatmentService,
    private toastr: ToastrService,
    
    
    ) { }
/****************************************** DECLARATION *******************************************/
param = {
  p1: ''
};
resultdata = {
  User: []
}
loading= false;
/****************************************** STARTUP FUNCTION *******************************************/
ngOnInit() {
  this.dataTableContruct(null);
  

}

private dataTableContruct (data){
  $('#myTable').DataTable().clear().destroy();
  $('#myTable').DataTable({
    columns: [
      {data: "Id"},
      {data: "Name"},
      { data:null, render: function(data, type, full){
        return `<button type="button" class="btn btn-outline btn-danger"><i class="fa fa-trash"></i></button>`
      }},
    ],
    data: data
  });
}

ngAfterViewInit(){ //CSS
  collapseIboxHelper();
}



/****************************************** MAIN FUNCTION *******************************************/
fnSearch(){
  this.loading= true;
  this.api.getUser().toPromise().then(res=>{
    this.resultdata.User = res;
    console.log(res);
    this.loading= false;
    this.dataTableContruct(res);
    

  }).catch(err=>{
    this.toastr.error(err.message,err.statusText+': '+err.status);
    this.loading= false;
  });
}






/****************************************** ON CHANGE EVENT *******************************************/

  
  
  

}
