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
import { ChangePasswordComponent } from './components/common/user/change-password/change-password.component';
import { ItemTypeComponent } from './views/smartin/item-type/item-type.component';
import { CategoryNavigationComponent } from './components/common/navigation/category-navigation/category-navigation.component';
import { UnitMeasurementComponent } from './views/smartin/unit-measurement/unit-measurement.component';
import { WarehouseComponent } from './views/smartin/warehouse/warehouse.component';
import { ItemListComponent } from './views/smartin/item/item-list/item-list.component';
import { ItemActionComponent } from './views/smartin/item/item-action/item-action.component';
import { ItemGridComponent } from './views/smartin/item/item-grid/item-grid.component';
import { ItemDetailComponent } from './views/smartin/item/item-detail/item-detail.component';
import { ItemResolver } from './resolvers/item.resolver';
import { StageComponent } from './views/smartin/stage/stage.component';
import { CustomerComponent } from './views/smartin/customer/customer.component';
import { ContractComponent } from './views/smartin/category/contract/contract.component';
import { CustomerDetailComponent } from './views/smartin/customer/customer-detail/customer-detail.component';


/**XLNT */


export const ROUTES: Routes = [
  // Main redirect
  { path: '', redirectTo: 'mainView', pathMatch: 'full' },
  { path: 'admin', redirectTo: '/admin/factory', pathMatch: 'full' },
  { path: 'user', redirectTo: '/user/profile', pathMatch: 'full' },

  // App views
  { //BasicComponent
    path: '', component: BasicComponent,
    children: [
      { path: 'mainView', component: MainViewComponent, canActivate: [AuthGuard]}, //custom

      { path: 'workFlowView', component: WorkFlowComponent , canActivate: [AuthGuard]},
      { path: 'taskManageView', component: TaskManageComponent, canActivate: [AuthGuard]},
      { path: 'taskCompleteView', component: TaskCompleteComponent , canActivate: [AuthGuard]},
      { path: 'showDiagram/:id', component: DiagramComponent , canActivate: [AuthGuard]},//Show Diagram
      { path: 'taskFormView/:formKey/:id/:businessKey', component: TaskFormComponent , canActivate: [AuthGuard]},//Open detail form Approve by Key
      { path: 'timelineLog/:businessKey', component: TimelineLogComponent , canActivate: [AuthGuard]},//Open detail form TimeLine Log by Key
      /**
       * EMCS ComponentRoutes
       */
      { path: 'EQManageView', component: EquipmentManageComponent},
      { path: 'planScheduleView', component: PlanScheduleComponent},
      { path: 'voucherRequisitionView', component: VoucherRequisitionComponent},
      { path: 'equipmentReportView/:DeptID', component: EquipmentReportComponent},
      { path: 'EquipmentView/:EQID', component: EquipmentDetailComponent },//Open detail form Approve by Key
      { path: 'VoucherView/:businessKey', component: VoucherDetailComponent },//Open detail form Approve by Key
      { path: 'NonAdjustEQView', component: StandardEquipmentComponent },//Open detail form Approve by Key
      { path: 'planScheduleReportView/:DeptID/:Year', component: PlanScheduleReportComponent},



      {
        path: 'admin' , canActivate: [AuthGuard], children: [
          { path: 'usersManagment', component: UserMangamentComponent },
          { path: 'role', component: RolesComponent },
          { path: 'resetPass', component: ResetpasswordComponent},
          { path: 'factory', component: FactoryComponent},
          { path: '', component: AdminNavigationComponent, outlet: 'sidemenu' },
        ]
      },
      //user config
      {
        path: 'user', canActivate: [AuthGuard], children: [
          { path: 'profile', component: ProfileComponent },
          { path: 'changePass', component: ChangePasswordComponent },
          { path: '', component: AdminNavigationComponent, outlet: 'sidemenu' },
        ]
      },
      //category
      {
        path: 'category', canActivate: [AuthGuard], children: [
          { path: 'itemType', component: ItemTypeComponent },
          { path: 'unit', component: UnitMeasurementComponent },
          { path: 'stage', component: StageComponent },
          { path: 'item',
            children:[
              {path:'', component: ItemListComponent},
              {path:'list', component: ItemListComponent},
              {path:'grid',component: ItemGridComponent},
              {path:'detail/:id',component: ItemDetailComponent ,resolve: { item: ItemResolver}},
              {path:'action',component: ItemActionComponent},
              {path:'action/:id',component: ItemActionComponent, resolve: { item: ItemResolver}}
            ]
           },
          { path: 'item/:id', component: ItemListComponent },
          { path: 'warehouse', component: WarehouseComponent },
          { path: 'customer', component: CustomerComponent },
          { path: 'customer/:id', component: CustomerDetailComponent },
          { path: 'contract', component: ContractComponent },
          { path: '', component: CategoryNavigationComponent, outlet: 'sidemenu' },
        ]
      },
    ]
  },
  { //BlankComponent
    path: '', component: BlankComponent,
    children: [
      // { path: 'landingView', component: LandingViewComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register',  component: RegisterComponent },
      { path: 'forgotPassword', component: ForgotPasswordComponent },      
      { path: 'resetPassword', component: UserResetPasswordComponent },

      { path: 'voucherReportView/:VoucherId', component: VoucherReportComponent},
      { path: '**', component: NotFoundComponent }
    ]
  },

  // Handle all other routes

];