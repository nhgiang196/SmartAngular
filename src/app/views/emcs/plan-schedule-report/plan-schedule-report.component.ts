import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiEMCSService } from 'src/app/services/api-ecms.service';
import { TranslateService } from '@ngx-translate/core';
import { Plans } from 'src/app/models/EMCSModels';


@Component({
  selector: 'app-plan-schedule-report',
  templateUrl: './plan-schedule-report.component.html',
  styleUrls: ['./plan-schedule-report.component.css']
})
export class PlanScheduleReportComponent implements OnInit {


  constructor(
    private route: ActivatedRoute,
    private api: ApiEMCSService,
    public trans: TranslateService) { }
/*******************INIT ******************************************************** */
  lsEquipments: Plans[];
  loading: boolean = true
  lang: string = this.trans.currentLang.toString();
  plansHeader: any[] = []; // header columns

  lsData?: any  //main data
  ngOnInit() {

    $('footer').css('visibility', 'hidden')
    this.route.params.subscribe(params => {
      this.api.getSchedulePlan(
        params['DeptID'] || ''
        , ''
        , params['Year']
        , this.lang
      ).subscribe((res) => {

        this.lsData = res;
        this.lsData.Year = params['Year'];
        this.plansHeader = [];
        for (var key in res[0]) {
          if (['$', 'EQID','Brand','Model','Department','Process Department'].indexOf(key) < 0) {
            this.plansHeader.push({ title: key, data: key });
          }
        }
      })


    })




  }


  btnPrint() {
    window.print();
  }
}



