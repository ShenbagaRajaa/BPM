import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})

export class CommonService {
  private loading = new BehaviorSubject<boolean>(false);
  public loading$ = this.loading.asObservable();

  constructor(private ngZone: NgZone) {}
  
  show() {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => this.loading.next(true), 0); // push to next tick
    });
  }

  hide() {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => this.loading.next(false), 0);
    });
  }
}
