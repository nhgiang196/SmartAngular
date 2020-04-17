import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ProcessLogItem } from 'src/app/core/models/process';
import { ModalDirective } from 'ngx-bootstrap';
import { ProcessLogItemService } from 'src/app/core/services/process-log-item.service';
import { MyHelperService } from 'src/app/core/services/utility/my-helper.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, UnitService } from 'src/app/core/services';
import { async } from 'rxjs/internal/scheduler/async';
import { NotifyService } from 'src/app/core/services/utility/notify.service';

@Component({
  selector: 'app-process-log-item',
  templateUrl: './process-log-item.component.html',
  styleUrls: ['./process-log-item.component.css']
})
export class ProcessLogItemComponent implements OnInit {
  @ViewChild("childModalItem", { static: false }) childModal: ModalDirective;
  @Output() loadInit = new EventEmitter<void>();
  entity: ProcessLogItem
  dataSourceUnit: any;
  laddaSubmitLoading = false;
  constructor(private processLogItemService: ProcessLogItemService, private unitService: UnitService, private helper: MyHelperService, private toastr: ToastrService,
    private trans: TranslateService, private auth: AuthService, private notifyService: NotifyService) { }

  async ngOnInit() {
    this.entity = new ProcessLogItem();
  }

  async fnSave() {
    this.laddaSubmitLoading = true;
    if (!await this.validate()) {
      if (this.entity.ProcessLogItemId == 0) {
        this.processLogItemService.add(this.entity).then(
          res => {
            let result = res as any;
            if (result.Success) {
              this.notifyService.success(this.trans.instant("messg.update.success"));
              this.loadInit.emit();
              this.childModal.hide();
            } else {
              this.notifyService.error(this.trans.instant("messg.update.error"));
            }

            this.laddaSubmitLoading = false;
          },
          err => {
            this.notifyService.error(this.trans.instant("messg.update.error"));
            this.laddaSubmitLoading = false;
          }
        );
      } else {
        this.processLogItemService.updateDefault(this.entity).subscribe(
          res => {
            var result = res as any;
            if (result.Success) {
              this.notifyService.success(this.trans.instant("messg.update.success"));
              this.loadInit.emit();
              this.childModal.hide();
            } else {
              this.notifyService.error(this.trans.instant("messg.update.error"));
            }
            this.laddaSubmitLoading = false;
          },
          err => {
            this.notifyService.error(this.trans.instant("messg.update.error"));
            this.laddaSubmitLoading = false;
          }
        );
      }
    }
    else {
      this.notifyService.warning("Process log item already exist");
      this.laddaSubmitLoading = false;
    }

  }

  async showChildModal(item: ProcessLogItem) {
    this.entity = JSON.parse(JSON.stringify(item));
    this.childModal.show();
  }

  async getUnitByItem(itemId) {
    this.dataSourceUnit = await this.unitService.getAllUnitByItemId(itemId).toPromise().then();
  }

  async validate() {
    return await this.processLogItemService.validate(this.entity).then();
  }

}
