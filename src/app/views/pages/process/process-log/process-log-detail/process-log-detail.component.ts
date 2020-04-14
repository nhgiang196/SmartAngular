import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ProcessLog } from 'src/app/core/models/process';
import { MyHelperService } from 'src/app/core/services/my-helper.service';
import { ProcessLogService, AuthService } from 'src/app/core/services';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-process-log-detail',
  templateUrl: './process-log-detail.component.html',
  styleUrls: ['./process-log-detail.component.css']
})
export class ProcessLogDetailComponent implements OnInit {
  @ViewChild("childModal", { static: false }) childModal: ModalDirective;
  @Output() loadInit = new EventEmitter<void>();
  entity:ProcessLog;
  laddaSubmitLoading = false;
  bsConfig = { dateInputFormat: "YYYY-MM-DD", adaarptivePosition: true };
  optionsTime ={
    format: 'LT',
    locale:'vi'
  }
  logTime: any;
  constructor(private processLogService: ProcessLogService, private helper: MyHelperService,private toastr: ToastrService,
    private trans: TranslateService, private auth: AuthService,) { }

  ngOnInit() {
    this.entity = new ProcessLog();
  }

   showChildModal(item: ProcessLog) {
     console.log(item);
    this.entity = item;
    this.logTime = item.ProcessLogTime;
    this.childModal.show();
  }
  onSwitchStatus() {
    this.entity.Status = this.entity.Status == 0 ? 1 : 0;
  }

  fnSave(){

    if(typeof(this.logTime)=="object"){
      this.entity.ProcessLogTime = this.helper.timeConvert(this.logTime._d);
    }
    if(typeof(this.entity.ProcessLogDate)=="object"){
      this.entity.ProcessLogDate= this.helper.dateConvertToString(this.entity.ProcessLogDate);
    }
    console.log(this.entity);
    this.laddaSubmitLoading = true;
    if (this.entity.ProcessLogId == 0) {
      this.entity.CreateBy = this.auth.currentUser.Username;
      this.entity.CreateDate = this.helper.dateConvertToString(new Date());
      this.processLogService.add(this.entity).then(
        res => {
          let result = res as any;
          if (result.Success) {
            this.toastr.success(this.trans.instant("messg.update.success"));
            this.loadInit.emit();
            this.childModal.hide();
          } else {
            this.toastr.error(this.trans.instant("messg.update.error"));
          }

          this.laddaSubmitLoading = false;
        },
        err => {
          this.toastr.error(this.trans.instant("messg.add.error"));
          this.laddaSubmitLoading = false;
        }
      );
    } else {
      this.entity.ModifyBy = this.auth.currentUser.Username;
      this.entity.ModifyDate=this.helper.dateConvertToString(new Date());
      this.processLogService.updateDefault(this.entity).subscribe(
        res => {
          var result = res as any;
          if (result.Success) {
            this.toastr.success(this.trans.instant("messg.update.success"));
            this.loadInit.emit();
            this.childModal.hide();
          } else {
            this.toastr.error(this.trans.instant("messg.update.error"));
          }
          this.laddaSubmitLoading = false;
        },
        err => {
          this.toastr.error(this.trans.instant("messg.update.error"));
          this.laddaSubmitLoading = false;
        }
      );
    }
  }
}
