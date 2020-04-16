import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ProcessLogItem } from 'src/app/core/models/process';
import { ModalDirective } from 'ngx-bootstrap';
import { ProcessLogItemService } from 'src/app/core/services/process-log-item.service';
import { MyHelperService } from 'src/app/core/services/my-helper.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services';

@Component({
  selector: 'app-process-log-item',
  templateUrl: './process-log-item.component.html',
  styleUrls: ['./process-log-item.component.css']
})
export class ProcessLogItemComponent implements OnInit {
  @ViewChild("childModalItem", { static: false }) childModal: ModalDirective;
  @Output() loadInit = new EventEmitter<void>();
  entity: ProcessLogItem
  laddaSubmitLoading = false;
  constructor( private processLogItemService: ProcessLogItemService, private helper: MyHelperService,private toastr: ToastrService,
    private trans: TranslateService, private auth: AuthService) { }

  ngOnInit() {
    this.entity  = new ProcessLogItem();
  }

  fnSave(){
    this.laddaSubmitLoading = true;
    if (this.entity.ProcessLogItemId == 0) {
      this.processLogItemService.add(this.entity).then(
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
      this.processLogItemService.updateDefault(this.entity).subscribe(
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

  showChildModal(item: ProcessLogItem) {
    console.log(item);
    this.entity =JSON.parse(JSON.stringify(item));
    this.childModal.show();
 }



}
