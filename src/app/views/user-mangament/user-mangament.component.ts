import { Component, OnInit } from '@angular/core';
import { collapseIboxHelper } from '../../app.helpers';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';





@Component({
  selector: 'app-user-mangament',
  templateUrl: './user-mangament.component.html',
  styleUrls: ['./user-mangament.component.css']
})
export class UserMangamentComponent implements OnInit {

  constructor(
    private api: WaterTreatmentService,
    private toastr: ToastrService,
    private trans: TranslateService
    
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
    dom:` <"row"<"col-sm-4 m-b-xs"l>
    <"#myid.col-sm-4 m-b-xs"f><"col-sm-4"p>>
    <t>
    <"row"<"col-sm-4 m-b-xs"i><"#myid2.col-sm-4 m-b-xs"f><"col-sm-4"p>>`,
    columns: [
      {data: "Id"},
      {data: "Name"},
      {data: "Gender"},
      {data: "Email"},
      {data: "Address"},
      { render: (data, type, full)=>{
        return `<button type="button" class="btn btn-outline btn-danger"><i class="fa fa-trash"></i></button>`
      }},
    ],
    language:  {
      emptyTable:     this.trans.instant('DefaultTable.emptyTable'),
      info:           this.trans.instant('DefaultTable.info'),
      infoEmpty:      this.trans.instant('DefaultTable.infoEmpty'),
      infoFiltered:   this.trans.instant('DefaultTable.infoFiltered'),
      infoPostFix:    this.trans.instant('DefaultTable.infoPostFix'),
      thousands:      this.trans.instant('DefaultTable.thousands'),
      lengthMenu:     this.trans.instant('DefaultTable.lengthMenu'),
      loadingRecords: this.trans.instant('DefaultTable.loadingRecords'),
      processing:     this.trans.instant('DefaultTable.processing'),
      search:         this.trans.instant('DefaultTable.search'),
      searchPlaceholder: 'Nhập nội dung tìm kiếm',
      zeroRecords:    this.trans.instant('DefaultTable.zeroRecords'),
      url:            this.trans.instant('DefaultTable.url'),
      paginate:  {
          first: 'Đầu tiên',
          last: "Cuối cùng",
          next: ">",
          previous: "<"
      },
      aria:{
        sortAscending: "sắp xếp  tăng dần",
        sortDescending: "sắp xếp giảm dần"
    }
  },
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
