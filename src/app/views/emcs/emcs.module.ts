import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentManageComponent } from './equipment-manage/equipment-manage.component';
import { PlanScheduleComponent } from './plan-schedule/plan-schedule.component';
import { VoucherRequisitionComponent } from './voucher-requisition/voucher-requisition.component';

import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminModule } from 'src/app/components/common/admin/admin.module';
import { EquipmentDetailComponent } from './equipment-detail/equipment-detail.component';
import { UpdateVoucherComponent } from './update-voucher/update-voucher.component';
import { VoucherDetailComponent } from './voucher-detail/voucher-detail.component';
import { EquipmentReportComponent } from './equipment-report/equipment-report.component';
import { StandardEquipmentComponent } from './standard-equipment/standard-equipment.component';
import { VoucherReportComponent } from './voucher-report/voucher-report.component';
import { PlanScheduleReportComponent } from './plan-schedule-report/plan-schedule-report.component';
@NgModule({
  declarations: [EquipmentManageComponent,
    PlanScheduleComponent,
    VoucherRequisitionComponent,
    VoucherDetailComponent,
    EquipmentDetailComponent,
    UpdateVoucherComponent,
    EquipmentReportComponent,
    UpdateVoucherComponent,
    StandardEquipmentComponent,
    PlanScheduleReportComponent,
    VoucherReportComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    AdminModule
  ],
  exports:[EquipmentManageComponent,PlanScheduleComponent,VoucherRequisitionComponent,EquipmentDetailComponent]
})
export class EMCSModule { }
