import { Routes } from "@angular/router";

import { BasicComponent } from './components/common/layouts/basic/basic.component';
import { BlankComponent } from './components/common/layouts/blank/blank.component';

import { LoginComponent } from './views/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { WorkFlowComponent } from './components/common/admin/work-flow/work-flow.component';
import { TaskManageComponent } from './components/common/admin/task-manage/task-manage.component';
import { TaskFormComponent } from './components/common/admin/task-form/task-form.component';
import { TaskCompleteComponent } from './components/common/admin/task-complete/task-complete.component';
import { TimelineLogComponent } from './components/common/admin/timeline-log/timeline-log.component';

/**EMCS */
import { PlanScheduleComponent } from './views/emcs/plan-schedule/plan-schedule.component';
import { VoucherRequisitionComponent } from './views/emcs/voucher-requisition/voucher-requisition.component';
import { DiagramComponent } from './components/common/admin/diagram/diagram.component';
import { MainViewComponent } from './views/main-view/main-view.component';
import { EquipmentManageComponent } from './views/emcs/equipment-manage/equipment-manage.component';
import { VoucherRequisitionDetailComponent } from './views/emcs/voucher-requisition-detail/voucher-requisition-detail.component';
import { EquipmentDetailComponent } from './views/emcs/equipment-detail/equipment-detail.component';
import { NotFoundComponent } from './components/common/admin/not-found/not-found.component';

export const ROUTES: Routes = [
  // Main redirect
  { path: '', redirectTo: 'mainView', pathMatch: 'full' },

  // App views
  {
    path: '', component: BasicComponent,
    children: [
      { path: 'mainView', component: MainViewComponent },
      { path: 'workFlowView', component: WorkFlowComponent, canActivate: [AuthGuard] },
      { path: 'taskManageView', component: TaskManageComponent, canActivate: [AuthGuard] },
      { path: 'taskCompleteView', component: TaskCompleteComponent },
      { path: 'showDiagram/:id', component: DiagramComponent },//Show Diagram
      { path: 'taskFormView/:formKey/:id/:businessKey', component: TaskFormComponent },//Open detail form Approve by Key
      { path: 'timelineLog/:businessKey', component: TimelineLogComponent },//Open detail form TimeLine Log by Key


      /**
       * EMCS ComponentRoutes
       */
      { path: 'EQManageView', component: EquipmentManageComponent, canActivate: [AuthGuard] },
      { path: 'planScheduleView', component: PlanScheduleComponent, canActivate: [AuthGuard] },
      { path: 'voucherRequisitionView', component: VoucherRequisitionComponent, canActivate: [AuthGuard] },
      { path: 'EquipmentView/:EQID', component: EquipmentDetailComponent },//Open detail form Approve by Key
      { path: 'VoucherView/:businessKey', component: VoucherRequisitionDetailComponent }//Open detail form Approve by Key

    ]
  },
  {
    path: '', component: BlankComponent,
    children: [
      
      { path: 'login', component: LoginComponent } ,
      { path: '404', component: NotFoundComponent }
    ]
  },
  // Handle all other routes
  { path: '**', component: NotFoundComponent }

];
