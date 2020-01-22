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
    autoWidth: true,
    responsive: true,
    dom:` <"row"<"col-sm-4 m-b-xs"l><"#myid.col-sm-4 m-b-xs"f><"col-sm-4"p>><t><"row"<"col-sm-4 m-b-xs"><"#myid2.col-sm-4 m-b-xs"f><"col-sm-4"p>>`,
    columns: [
      {data: "Id"},
      {data: "Name"},
      {data: "Gender"},
      {data: "Email"},
      {data: "Address"},
      { data:null, render: function(data, type, full){
        return `<button type="button" class="btn btn-outline btn-danger"><i class="fa fa-trash"></i></button>`
      }},
    ],
    data: data,
  });
}


ngAfterViewInit(){ //CSS
  collapseIboxHelper();
}


/****************************************** MAIN FUNCTION *******************************************/
fnSearch(){ //Search button
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
