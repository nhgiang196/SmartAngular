import { Component, OnInit } from '@angular/core';
import { ApiEMCSService } from 'src/app/services/api-ecms.service';
import { ToastrService } from 'ngx-toastr';
import { PlanTimeJob } from 'src/app/models/EMCSModels';
import { MyHelperService } from 'src/app/services/my-helper.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';

const TCode: string ='EMCS-02' // TCode for Make Schedule

@Component({
  selector: 'app-plan-schedule',
  templateUrl: './plan-schedule.component.html',
  styleUrls: ['./plan-schedule.component.css']
})
export class PlanScheduleComponent implements OnInit {

  constructor(
    private api: ApiEMCSService,
    private toastr: ToastrService,
    public helperService: MyHelperService,
    private authService: AuthService,
    private trans: TranslateService) {
  }
  /**************************************************INIT *************************************************/
  list: { Departments: any, Years: any, Data?: any, searchYear?: any }; //lists return after Get Data
  searchParams: { Department: string, Type: string, Year: number }; //search params
  choosenEntity: PlanTimeJob; // choose params on edit modal page
  plansHeader: any[] = []; // header columns
  undoList: any[] = []; //list to undo
  loading = false;
  actionstatus = '';
  lang: string = this.trans.currentLang.toString()

  ngOnInit() {
    this.authService.nagClass.emcsViewToogle = true; //nag-toogle
    this.list = { Departments: [], Years: ['2018', '2019', '2020'] }; //lists return after Get Data
    this.choosenEntity = { UserID: this.authService.currentUser.Username, StartTime: new Date(), }; // choosed params on edit modal page
    this.searchParams = { Department: '', Type: '', Year: new Date().getFullYear() }; // search param
    /** command */
    this.fnSearch();
    this.getBasic();

  }

  private getBasic() {
    this.api.getBasic("Department", this.lang).subscribe((res) => {
      if (res.length > 0) {
        this.list.Departments = res;
        console.log(res);
      }
      else this.toastr.error("Failed load Department", "Error");
    })
    this.api.getBasic("WorkingYear", '').subscribe(res => {
      if (res.length > 0) {
        this.list.Years = res;
        console.log(res);
      }
    })
    if (this.list.Departments == null)
      this.loading = false;
  }


  /**************************************************Fuctions *************************************************/
  fnSearch() {
    this.loading = true;
    this.api.getSchedulePlan(
      this.searchParams.Department || ''
      , this.searchParams.Type
      , this.searchParams.Year.toString()
      , this.lang
    ).subscribe((res) => {
      this.list.searchYear = this.searchParams.Year;
      this.list.Data = res;
      console.log(this.list.Data);
      this.plansHeader = [];
      for (var key in this.list.Data[0]) {
        if (['$', 'EQID'].indexOf(key) < 0) {
          this.plansHeader.push({ title: key, data: key });
        }
      }
      this.loading = false;
      this.helperService.dtOptions;
      this.helperService.dtTrigger.next();
    })
  }

  private _UpdateTable(column, row) {
    if (column.indexOf('_') > -1 && this.actionstatus == 'M') {
      if (this.list.Data[row][column] == 'X')
        this.list.Data[row][column] = null;
      else this.list.Data[row][column] = 'X';
    }
  }

  fnToogleCheck(h, index, item) {
    if (this.actionstatus != 'M' && h.indexOf('_')>-1)
      alert(this.trans.instant('PSComponent.alert_noclick'))
    else {
      this._UpdateTable(h, index)
      var param = {
        eqid: item.EQID, month: h, year: this.list.searchYear, index: index
      }
      this.undoList.push(param);
      this.api.checkItem(param.eqid, param.month.replace('_', ''), param.year).subscribe(res => { });
      console.log(this.undoList);
    }
  }
  fnClear() {

  }
  fnUndo() {
    var param = this.undoList[this.undoList.length - 1];
    this._UpdateTable(param.month, param.index)
    this.undoList.pop();
    this.api.checkItem(param.eqid, param.month.replace('_', ''), param.year).subscribe(res => { });
    console.log(this.undoList);
  }


  fnShowEdit(item) {
    this.api.findSchedulePlan(item.EQID).subscribe((res) => {
      this.choosenEntity = res.Header[0];
    })

  }
  fnSubmit() {
    var time = new Date(this.choosenEntity.StartTime);
    this.choosenEntity.StartTime = time.getHours().toString() + ':' + time.getMinutes().toString();
    console.log(this.choosenEntity.StartTime);
    this.api.updateSchedulePlan(this.choosenEntity).subscribe(res => {
      var operationResult: any = res
      if (operationResult.Success) {
        this.toastr.success(operationResult.Message, operationResult.Caption);
        document.getElementById("#closeBtn").click();
      }
      else
        this.toastr.error(operationResult.Message, operationResult.Caption);
    })


  }



}
