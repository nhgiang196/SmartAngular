import { Routes } from "@angular/router";

import { BasicComponent } from './components/common/layouts/basic/basic.component';
import { BlankComponent } from './components/common/layouts/blank/blank.component';


import { AuthGuard } from './services/auth.guard';
import { WorkFlowComponent } from './components/common/work-flow/work-flow/work-flow.component';
import { TaskManageComponent } from './components/common/work-flow/task-manage/task-manage.component';
import { TaskFormComponent } from './components/common/work-flow/task-form/task-form.component';
import { TaskCompleteComponent } from './components/common/work-flow/task-complete/task-complete.component';
import { TimelineLogComponent } from './components/common/work-flow/timeline-log/timeline-log.component';

/**EMCS */
// import { LandingViewComponent } from './views/main-view/landing-view/landing-view.component';
import { PlanScheduleComponent } from './views/emcs/plan-schedule/plan-schedule.component';
import { VoucherRequisitionComponent } from './views/emcs/voucher-requisition/voucher-requisition.component';
import { DiagramComponent } from './components/common/work-flow/diagram/diagram.component';
import { MainViewComponent } from './views/main-view/main-view.component';
import { EquipmentManageComponent } from './views/emcs/equipment-manage/equipment-manage.component';
import { EquipmentDetailComponent } from './views/emcs/equipment-detail/equipment-detail.component';
import { NotFoundComponent } from './components/common/work-flow/not-found/not-found.component';
import { VoucherDetailComponent } from './views/emcs/voucher-detail/voucher-detail.component';
import { EquipmentReportComponent } from './views/emcs/equipment-report/equipment-report.component';
import { StandardEquipmentComponent } from './views/emcs/standard-equipment/standard-equipment.component';

import { VoucherReportComponent } from './views/emcs/voucher-report/voucher-report.component';
import { PlanScheduleReportComponent } from './views/emcs/plan-schedule-report/plan-schedule-report.component';
import { UserMangamentComponent } from './views/user-mangament/user-mangament.component';
import { NavigationComponent } from './components/common/navigation/navigation.component';
import { LoginComponent } from './components/common/user/login/login.component';
import { RegisterComponent } from './components/common/admin/register/register.component';
import { RolesComponent } from './components/common/admin/roles/roles.component';
import { ProfileComponent } from './components/common/user/profile/profile.component';
import { ResetpasswordComponent } from './components/common/admin/resetpassword/resetpassword.component';
import { AdminNavigationComponent } from './components/common/navigation/admin-navigation/admin-navigation.component';
import { FactoryComponent } from './views/smartin/factory/factory.component';
import { UserNavigationComponent } from './components/common/navigation/user-navigation/user-navigation.component';
import { UserResetPasswordComponent } from './components/common/user/user-reset-password/user-reset-password.component';
import { ForgotPasswordComponent } from './components/common/user/forgot-password/forgot-password.component';





/**XLNT */


export const ROUTES: Routes = [
  // Main redirect
  { path: '', redirectTo: 'mainView', pathMatch: 'full' },
  { path: 'admin', redirectTo: '/admin/usersManagment', pathMatch: 'full' },
  { path: 'user', redirectTo: '/user/profile', pathMatch: 'full' },

  // App views
  { //BasicComponent
    path: '', component: BasicComponent,
    children: [
      { path: 'mainView', component: MainViewComponent, canActivate: [AuthGuard] }, //custom

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



      {
        path: 'admin', canActivate: [AuthGuard], children: [
          { path: 'usersManagment', component: UserMangamentComponent },
          { path: 'role', component: RolesComponent },
          { path: 'resetPass', component: ResetpasswordComponent, canActivate: [AuthGuard] },
          { path: 'factory', component: FactoryComponent, canActivate: [AuthGuard] },
          { path: '', component: AdminNavigationComponent, outlet: 'sidemenu' },
        ]
      },
      {
        path: 'user', canActivate: [AuthGuard], children: [
          { path: 'profile', component: ProfileComponent },
          { path: 'changePass', component: RolesComponent },
          { path: '', component: AdminNavigationComponent, outlet: 'sidemenu' },
        ]
      },
    ]
  },
  { //BlankComponent
    path: '', component: BlankComponent,
    children: [
      // { path: 'landingView', component: LandingViewComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgotPassword', component: ForgotPasswordComponent },      
      { path: 'resetPassword', component: UserResetPasswordComponent },

      { path: 'voucherReportView/:VoucherId', component: VoucherReportComponent, canActivate: [AuthGuard] },
      { path: '**', component: NotFoundComponent }
    ]
  },

  // Handle all other routes

];