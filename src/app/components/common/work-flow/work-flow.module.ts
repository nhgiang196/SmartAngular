import { NgModule } from '@angular/core';
import { StartProcessComponent } from './start-process/start-process.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskItemComponent } from './task-item/task-item.component';
import { TaskManageComponent } from './task-manage/task-manage.component';
import { WorkFlowComponent } from './work-flow/work-flow.component';
import { TaskCompleteComponent } from './task-complete/task-complete.component';
import { DiagramComponent } from './diagram/diagram.component';
import { CheckListComponent } from './check-list/check-list.component';
import { TaskApprovalComponent } from './task-approval/task-approval.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TimelineLogComponent } from './timeline-log/timeline-log.component';
import { HistoryLogComponent } from './history-log/history-log.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UpdateVoucherComponent } from 'src/app/views/emcs/update-voucher/update-voucher.component';

@NgModule({
  declarations: [StartProcessComponent,
     TaskFormComponent, 
     TaskItemComponent, 
     TaskManageComponent, 
     WorkFlowComponent, 
     TaskCompleteComponent, 
     DiagramComponent, 
     CheckListComponent, 
     TaskApprovalComponent, 
     TimelineLogComponent, 
     HistoryLogComponent, 
	 NotFoundComponent],
  imports: [  
    SharedModule
  ],
  exports:[CheckListComponent,StartProcessComponent,HistoryLogComponent],
  entryComponents:[UpdateVoucherComponent],//Add here for new Approve component
})
export class WorkFlowModule { }
