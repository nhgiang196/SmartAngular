import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Customer } from 'src/app/models/SmartInModels';
import { Injectable } from '@angular/core';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class CustomerDetailResolverService implements Resolve<Customer> {

constructor(private api: WaterTreatmentService, private router: Router) {}

  resolve(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Customer> {
    return null;

    
    // return this.cs.getCrisis(id).pipe( //SERVICES
    //   take(1),
    //   mergeMap(crisis => {
    //     if (crisis) {
    //       return of(crisis);
    //     } else { // id not found
    //       this.router.navigate(['/crisis-center']);
    //       return EMPTY;
    //     }
    //   })
    // );


  }


}

