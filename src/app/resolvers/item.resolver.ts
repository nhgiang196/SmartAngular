import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WaterTreatmentService } from '../services/api-watertreatment.service';
import { ToastrService } from 'ngx-toastr';
import { Item } from '../models/SmartInModels';


@Injectable()
export class ItemResolver implements Resolve<Item> {
    constructor(private api: WaterTreatmentService,
        private toastr: ToastrService) { }

    resolve(router: ActivatedRouteSnapshot): Observable<Item> {
        return  this.api.findItemById(router.params['id']).pipe(
            catchError(error => {
                this.toastr.error(error);
                return of(null);
            })
        );
    }
}
