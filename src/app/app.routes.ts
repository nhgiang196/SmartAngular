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
// import { LandingViewComponent } from './views/main-view/landing-view/landing-view.component';
import { PlanScheduleComponent } from './views/emcs/plan-schedule/plan-schedule.component';
import { VoucherRequisitionComponent } from './views/emcs/voucher-requisition/voucher-requisition.component';
import { DiagramComponent } from './components/common/admin/diagram/diagram.component';
import { MainViewComponent } from './views/main-view/main-view.component';
import { EquipmentManageComponent } from './views/emcs/equipment-manage/equipment-manage.component';
import { EquipmentDetailComponent } from './views/emcs/equipment-detail/equipment-detail.component';
import { NotFoundComponent } from './components/common/admin/not-found/not-found.component';
import { VoucherDetailComponent } from './views/emcs/voucher-detail/voucher-detail.component';
import { EquipmentReportComponent } from './views/emcs/equipment-report/equipment-report.component';
import { StandardEquipmentComponent } from './views/emcs/standard-equipment/standard-equipment.component';

import { VoucherReportComponent } from './views/emcs/voucher-report/voucher-report.component';
import { PlanScheduleReportComponent } from './views/emcs/plan-schedule-report/plan-schedule-report.component';

export const ROUTES: Routes = [
  // Main redirect
  { path: '', redirectTo: 'mainView', pathMatch: 'full' },

  // App views
  {
    path: '', component: BasicComponent,
    children: [
      { path: 'mainView', component: MainViewComponent, canActivate: [AuthGuard] },
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
        { path: 'equipmentReportView/:DeptID', component: EquipmentReportComponent, canActivate: [AuthGuard] },
      { path: 'EquipmentView/:EQID', component: EquipmentDetailComponent },//Open detail form Approve by Key
      { path: 'VoucherView/:businessKey', component: VoucherDetailComponent },//Open detail form Approve by Key
      { path: 'NonAdjustEQView', component: StandardEquipmentComponent },//Open detail form Approve by Key
      { path: 'planScheduleReportView/:DeptID/:Year', component: PlanScheduleReportComponent, canActivate: [AuthGuard] },

    ]
  },
  {
    path: '', component: BlankComponent,
    children: [
      // { path: 'landingView', component: LandingViewComponent },
      { path: 'login', component: LoginComponent },

      { path: 'voucherReportView/:VoucherId', component: VoucherReportComponent, canActivate: [AuthGuard] },
      { path: '**', component: NotFoundComponent }
    ]
  },
  // Handle all other routes

];