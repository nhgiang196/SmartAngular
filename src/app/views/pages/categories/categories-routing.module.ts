import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { CategoriesComponent } from './categories.component';
import { RoutesResolver } from 'src/app/core/resolvers/routes.resolver';
import { MainViewCategoryComponent } from './main-view-category/main-view-category.component';
import { StageComponent } from './stage/stage.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { ItemTypeComponent } from './item-type/item-type.component';
import { UnitComponent } from './unit/unit.component';
import { ItemComponent } from './item/item.component';
import { CustomerComponent } from './customers/customer.component';
import { CustomerDetailComponent } from './customers/customer-detail/customer-detail.component';
import { CustomerDetailResolverService } from 'src/app/core/resolvers/customer-detail.resolver';
import { ItemActionComponent } from './item/item-action/item-action.component';
import { ItemResolver } from 'src/app/core/resolvers/item.resolver';

const routes: Routes = [{
    path: '',
    component: CategoriesComponent,
    children: [
        {
            path: 'main',
            component: MainViewCategoryComponent
        },
        {
            path: 'stage',
            component: StageComponent
        },
        {
            path: 'customer',
            component: CustomerComponent
        },
        {   path: 'customer/:id',
            component: CustomerDetailComponent,
            resolve: { dataResolver: CustomerDetailResolverService }
        },
        {   path: 'newcustomer',
            component: CustomerDetailComponent },
        {
            path: 'warehouse',
            component: WarehouseComponent
        },
        {
            path: 'itemtype',
            component: ItemTypeComponent
        },
        {
            path: 'unit',
            component: UnitComponent
        },
        {
            path: 'item',
            children:[
              {
                path:'',
                component: ItemComponent,
              },
              {
                path:'action',
                component:ItemActionComponent
              },
              {
                path:'action/:id',
                component:ItemActionComponent,
                resolve: { item: ItemResolver }
              }
            ]
        },
        { path: '', redirectTo: 'main', pathMatch: 'full' },
        { path: '**', redirectTo: 'main' },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class CategoriesRoutingModule {
}
