import { Component, OnInit, Input } from '@angular/core';
import { Requisition, Equipments, Manual } from 'src/app/models/EMCSModels';

import { ApiEMCSService } from 'src/app/services/api-ecms.service';
import { ActivatedRoute } from '@angular/router';
import { EngineService } from 'src/app/services/engine.service';
import { AuthGuard } from 'src/app/services/auth.guard';
import { AuthService } from 'src/app/services/auth.service';
const NodeApiUrl = "/engine-file/";
const TCode: string = 'EMCS-03' // TCode for Submit Voucher
@Component({
  selector: 'app-voucher-detail',
  templateUrl: './voucher-detail.component.html',
  styleUrls: ['./voucher-detail.component.css']
})
export class VoucherDetailComponent implements OnInit {

  @Input() voucherid: any;
  constructor(
    private api: ApiEMCSService,
    private route: ActivatedRoute,
    public engineApi: EngineService,
    private auth:AuthService
  ) { }

  list : {header: any, detail: any[]}
  isValidTCode:boolean=false;
  ngOnInit() {
    this.list = {header: {}, detail:[]};
    // this.auth.checkTcode(TCode).subscribe(res=> this.isValidTCode = res)
    this.route.params.subscribe(params => {
      this.fnGetDetail(this.voucherid || params['businessKey']);
    });
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
      console.log(res);
      this.list.header = res.Header[0];
      this.list.detail = res.Detail;
      if (res.Header[0].State.trim() == "N" || res.Header[0].State.trim() == "M") {
        this.engineApi.hiddenApprove = false; //Show submit button when state is N, M
      } else {
        this.engineApi.hiddenApprove = true; //Hidden Submit button when voucher submitted already
      }
    })
  }

}
