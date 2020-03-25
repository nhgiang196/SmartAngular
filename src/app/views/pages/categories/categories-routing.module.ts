import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { CategoriesComponent } from './categories.component';
import { RoutesResolver } from 'src/app/core/resolvers/routes.resolver';
import { MainViewCategoryComponent } from './main-view-category/main-view-category.component';
import { CustomersComponent } from './customers/customers.component';
import { StageComponent } from './stage/stage.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { ItemTypeComponent } from './item-type/item-type.component';
import { UnitComponent } from './unit/unit.component';
import { ItemComponent } from './item/item.component';

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
            component: CustomersComponent
        },
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
            component: ItemComponent
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
