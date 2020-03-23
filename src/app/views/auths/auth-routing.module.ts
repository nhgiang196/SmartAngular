import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthsComponent } from './auths.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [{
    path: '',
    component: AuthsComponent,
    children: [
        {
            path: 'login',
            component: LoginComponent
        },
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: '**', redirectTo: 'login' },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class AuthRoutingModule {
}
