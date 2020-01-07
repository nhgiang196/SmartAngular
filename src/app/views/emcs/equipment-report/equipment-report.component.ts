import { Component, OnInit } from '@angular/core';
import { ApiEMCSService } from 'src/app/services/api-ecms.service';
import { Equipments } from 'src/app/models/EMCSModels';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-equipment-report',
  templateUrl: './equipment-report.component.html',
  styleUrls: ['./equipment-report.component.css']
})
export class EquipmentReportComponent implements OnInit {

  lsEquipments: Equipments[];
  loading:boolean =true
  lang: string = this.trans.currentLang.toString();
  constructor(
    private route: ActivatedRoute,
    private api:ApiEMCSService,
    public trans: TranslateService) { }

  ngOnInit() {
    $('footer').css('visibility','hidden')
    this.route.params.subscribe(params => {
      this.api.getAllEquipment('','','',params['DeptID'],'','',this.lang).subscribe(res=>{
        this.lsEquipments = res as Equipments[];
        this.loading = false;
      })
    })

  }
  btnPrint(){
    window.print();
  }

}
