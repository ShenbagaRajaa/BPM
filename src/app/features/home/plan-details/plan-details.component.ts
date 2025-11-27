import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { NgIf } from '@angular/common';
import { SequenceCountCardComponent } from '../../../shared/sequence-count-card/sequence-count-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SequenceAccordianComponent } from '../../../shared/sequence-accordian/sequence-accordian.component';
import { Store } from '@ngrx/store';
import { MatDividerModule } from '@angular/material/divider';
import { getPlanById } from '../../../core/store/plan-state/plan.action';
import { appState } from '../../../core/store/app-state/app.state';
import { selectPlanById } from '../../../core/store/plan-state/plan.selector';
import { take } from 'rxjs';

@Component({
  selector: 'app-plan-details',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NavigationbarComponent,
    NgIf,
    SequenceCountCardComponent,
    SequenceAccordianComponent,
    MatDividerModule,
  ],
  templateUrl: './plan-details.component.html',
  styleUrl: './plan-details.component.css',
})
export class PlanDetailsComponent {
  planId: number = 0;
  editButton: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store<appState>,
    private router: Router
  ) {
    // Subscribe to query parameters to get the plan ID from the URL
    this.route.queryParams.subscribe((params) => {
      this.planId = params['planId'];
    });
  }
  ngOnInit(): void {
    this.getPlanData();
  }

  ngOnChanges() {
    this.getPlanData();
  }

  getPlanData() {
    // Dispatch action to fetch the plan data by plan ID
    this.store.dispatch(getPlanById({ id: this.planId }));
    this.store
      .select(selectPlanById)
      .pipe(take(2))
      .subscribe((planData) => {
        this.editButton = planData?.planStatus === 'PlanBuildInProgress';
      });
  }
  // Method to navigate to the edit plan page
  naviagateEdit() {
    this.router.navigate(['home/buildBRPlan/add-plan'], {
      queryParams: { planId: this.planId },
    });
  }
}
