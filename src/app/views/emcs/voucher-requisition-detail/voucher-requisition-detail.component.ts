import { Component, OnInit } from '@angular/core';
import { Requisition, Equipments, Manual } from 'src/app/models/EMCSModels';

import { ApiEMCSService } from 'src/app/services/api-ecms.service';
import { ActivatedRoute } from '@angular/router';
import { EngineService } from 'src/app/services/engine.service';
import { AuthGuard } from 'src/app/services/auth.guard';
import { AuthService } from 'src/app/services/auth.service';
import { debug } from 'util';
const NodeApiUrl = "http://10.20.46.41:4300/api/file";
const TCode: string = 'EMCS-03' // TCode for Submit Voucher
@Component({
  selector: 'app-voucher-requisition-detail',
  templateUrl: './voucher-requisition-detail.component.html',
  styleUrls: ['./voucher-requisition-detail.component.css']
})
export class VoucherRequisitionDetailComponent implements OnInit {
  
  constructor(
    private api: ApiEMCSService,
    private route: ActivatedRoute,
    public engineApi: EngineService,
    private auth:AuthService
  ) { }

  Entity: Requisition;
  equipment: Equipments;
  isValidTCode:boolean=false;
  ngOnInit() {
    this.auth.checkTcode(TCode).subscribe(res=> this.isValidTCode = res)
    this.resetForm();
    this.route.params.subscribe(params => {
      this.fnGetDetail(params['businessKey']);
    });
    // this.engineApi.hiddenApprove = true;
  }

  resetForm() {
    this.Entity = {
      VoucherID: '',
      EQID: '',
      State: '',
      UserID: '',
      Remark: '',
      Profiles: null,
      Department: '',
      MonthAdjust: null,
      YearAdjust: null,
      CreateTime: ''
    }
    this.equipment = {
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
      Methods: [],
      DepartmentName: '',
      ProcessDeptName: ''
    }
  }

  //Download Manual, Method File
  onGetFile(FileName) {
    let url: string = NodeApiUrl;
    url += '/' + FileName;
    window.open(url, '_blank');
  }

  fnGetDetail(item) {
    console.log(item);
    this.api.findVoucher(item).subscribe((res) => {
      this.Entity = res.Header[0];
      this.Entity.Profiles = res.Detail;

      if(res.Equipment[0] != null){
        this.equipment = res.Equipment[0];
        this.equipment.Manuals =res.Manual;
        this.equipment.Methods =  res.Method;
      }      
      
      if (this.Entity.State.trim() == "N" || this.Entity.State.trim() == "M") {
        this.engineApi.hiddenApprove = false; //Show submit button when state is N, M
      } else {
        this.engineApi.hiddenApprove = true; //Hidden Submit button when voucher submitted already
      }
    })
    setTimeout(function () {
      this.loading = false;
    }, 2000);

  }

}
