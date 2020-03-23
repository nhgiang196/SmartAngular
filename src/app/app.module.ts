import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';

import { LayoutsModule } from './components/common/layouts/layouts.module';
import { WorkFlowModule } from './components/common/work-flow/work-flow.module';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';
import { EMCSModule } from './views/emcs/emcs.module';
import { MainViewModule } from './views/main-view/main-view.module';
import { SharedModule } from './shared/shared.module';
import { UserMangamentComponent } from './views/user-mangament/user-mangament.component';
import { AdminModule } from './components/common/admin/admin.module';
import { UserModule } from './components/common/user/user.module';
import { AuthInterceptor } from './helpers/AuthInterceptor';
import { SmartinModule } from './views/smartin/smartin.module';
import { ItemResolver } from './resolvers/item.resolver';
import { TestModule } from './views/test/test.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

@NgModule({
  declarations: [
    AppComponent,
    UserMangamentComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,  
    FormsModule,
    WorkFlowModule,
    MainViewModule,
    UserModule,
    AdminModule, 
    SharedModule,
    SmartinModule,
    //Views
    LayoutsModule,
    EMCSModule,  
    TestModule,
    RouterModule.forRoot(ROUTES)
    
  ],
  exports: [
    CommonModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }, 
    AuthGuard, 
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    ItemResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
// platformBrowserDynamic().bootstrapModule(AppModule);

