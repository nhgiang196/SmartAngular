import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Item } from '../models/item';
import { StoreService } from '../services/store.service';


@Injectable()
export class RoutesResolver implements Resolve<void> {
    constructor(private store: StoreService,
        private toastr: ToastrService) { }

    resolve(router: ActivatedRouteSnapshot): void {
       let cid =  router.params['cid'];
        if(cid!=null && cid!='')
        this.store.loadMenu(cid);
    }
}
