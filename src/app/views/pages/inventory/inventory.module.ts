import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory.component';
import { MainViewInventoryComponent } from './main-view-inventory/main-view-inventory.component';
import { InventoryRoutingModule } from './inventory-routing.module';
import { GoodsIssueComponent } from './goods-issue/goods-issue.component';
import { GoodsReceiptComponent } from './goods-receipt/goods-receipt.component';
import { SummaryInventoryReportComponent } from './summary-inventory-report/summary-inventory-report.component';
import { ItemRequestComponent } from './item-request/item-request.component';

@NgModule({
  imports: [
    InventoryRoutingModule,
    CommonModule
  ],
  declarations: [InventoryComponent,MainViewInventoryComponent, GoodsIssueComponent, GoodsReceiptComponent, SummaryInventoryReportComponent, ItemRequestComponent]
})
export class InventoryModule { }
