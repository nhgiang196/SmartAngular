import { Component, OnInit } from '@angular/core';
import { Equipments, Manual, Method } from 'src/app/models/EMCSModels';
import { ApiEMCSService } from 'src/app/services/api-ecms.service';
import { ActivatedRoute } from '@angular/router';
import { MyHelperService } from 'src/app/services/my-helper.service';

@Component({
  selector: 'app-equipment-detail',
  templateUrl: './equipment-detail.component.html',
  styleUrls: ['./equipment-detail.component.css']
})
export class EquipmentDetailComponent implements OnInit {

  constructor(
    private api: ApiEMCSService,
    private route: ActivatedRoute,
    private helper: MyHelperService
  ) { }

  Equipment: Equipments;
  Today:string;

  ngOnInit() {

    this.Today = this.helper.getCurrentDate(); 
    this.Equipment = {
      EQID: null,
      AssetID: '',
      Name: '',
      Brand: '',
      Model: '',
      UsedDate: null,
      Stamp: null,
      UserID: '',
      IsAdjust: null,
      State: '',
      Remark: '',
      Department: '',
      ProcessDepartment: '',
      Manuals: [],
      Methods:[],
      DepartmentName:'',
      ProcessDeptName:''
    }
    this.route.params.subscribe(params => {
      this.GetEQ(params['EQID']);
    });    
    
  }


  GetEQ(EQID: string){
    
    this.api.getDetailEquipment(EQID).toPromise().then((res) => {
      this.Equipment = res.Header[0];
      this.Equipment.Manuals = res.Manuals;
      this.Equipment.Methods = res.Methods;
    })
  }

  //Download File without RestAPI
  onGetFile(FileName) {
    let url: string = 'http://10.20.46.41:4300/api/file';
    url += '/' + FileName;
    window.open(url, '_blank');
  }

}
