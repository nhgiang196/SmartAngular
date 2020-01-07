import { Component, OnInit } from '@angular/core';
import { ApiEMCSService } from 'src/app/services/api-ecms.service';
import { ActivatedRoute } from '@angular/router';
import { MongoApiService } from 'src/app/services/mongo-api.service';
import { debug } from 'util';

@Component({
  selector: 'app-voucher-report',
  templateUrl: './voucher-report.component.html',
  styleUrls: ['./voucher-report.component.css']
})
export class VoucherReportComponent implements OnInit {

  constructor(
    private api :ApiEMCSService,
    private route:ActivatedRoute,
    private mogoApi :MongoApiService) { }

  header:any ={};
  detail:any =[];
  mogoDetail:any =[]
  ngOnInit() {

    this.route.params.subscribe(params=>{
      this.loadDetailReportInfo(params['VoucherId'])
      this.loadMongoDetail(params['VoucherId'])
    })
    
  }

  loadDetailReportInfo(VoucherId){
    this.api.findVoucherReport(VoucherId).subscribe(res=>{
      this.header =res.Header[0]||null;
      this.detail =res.Detail ||[]
    })
  }

  loadMongoDetail(VoucherId){
    var obj ={
      voucherId :VoucherId
    }
    this.mogoApi.findCollection(obj).subscribe(res=>{
      this.mogoDetail = res;
      console.log(res);
    })
  }

}
