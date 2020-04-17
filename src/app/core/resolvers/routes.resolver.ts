import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Item } from '../models/item';
import { StoreService } from '../services/general/store.service';


@Injectable()
export class RoutesResolver implements Resolve<void> {
    constructor(private store: StoreService,
        private toastr: ToastrService,private route: Router) {
         }

    resolve(router: ActivatedRouteSnapshot): void {
      //  let code =  router.routeConfig.path;
      //  console.log(code);
      //   if(code!=null && code!='')
      //     this.store.loadMenu(code);
    }
}
