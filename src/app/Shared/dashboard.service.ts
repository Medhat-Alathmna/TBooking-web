import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private dashboardSource = new BehaviorSubject<any>(null);
  dashboard$ = this.dashboardSource.asObservable();

  createDashboard(data: any) {
    this.dashboardSource.next(data);
  }

  clearDashboard() {
    this.dashboardSource.next(null);
  }
}
