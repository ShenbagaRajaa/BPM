import { Component } from '@angular/core';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { TotalChartsComponent } from '../total-charts/total-charts.component';
import { PlanChartsComponent } from '../plan-charts/plan-charts.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavigationbarComponent, TotalChartsComponent, PlanChartsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  selectedPlanId: number = 323;

  onPlanSelected(planId: number) {
    this.selectedPlanId = planId;
  }
}
