import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { RoutesResolver } from 'src/app/core/resolvers/routes.resolver';
import { InventoryComponent } from './inventory.component';
import { MainViewInventoryComponent } from './main-view-inventory/main-view-inventory.component';
import { GoodsReceiptComponent } from './goods-receipt/goods-receipt.component';
import { GoodsIssueComponent } from './goods-issue/goods-issue.component';
import { SummaryInventoryReportComponent } from './summary-inventory-report/summary-inventory-report.component';
import { ItemRequestComponent } from './item-request/item-request.component';

const routes: Routes = [{
    path: '',
    component: InventoryComponent,
    children: [
        {
            path: 'main',
            resolve: { menu: RoutesResolver },
            component: MainViewInventoryComponent
        },
        {
            path: 'goods-receipt', // nhập kho
            component: GoodsReceiptComponent
        },
        {
            path: 'goods-issue', // xuất kho
            component: GoodsIssueComponent
        },
        {
            path: 'summary-inventory', // báo cáo kho
            component: SummaryInventoryReportComponent
        },
        {
            path: 'item-request', // yêu cầu máy móc thiết bị
            component: ItemRequestComponent
        },
        { path: '', redirectTo: 'main', pathMatch: 'full' },
        { path: '**', redirectTo: 'main' },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class InventoryRoutingModule {
}
