import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { StatusHighlighterComponent } from '../status-highlighter/status-highlighter.component';
import { selectPlanById } from '../../core/store/plan-state/plan.selector';
import { getPlanById } from '../../core/store/plan-state/plan.action';
import { CommonModule } from '@angular/common';
import { planType } from '../../core/models/planType.model';
import { planLevel } from '../../core/models/planLevel.model';
import { appState } from '../../core/store/app-state/app.state';
import { selectAllPlanTypes } from '../../core/store/plan-type-state/plan-type.selector';
import { selectAllPlanLevels } from '../../core/store/plan-level-state/plan-level.selector';
@Component({
  selector: 'app-sequence-count-card',
  standalone: true,
  imports: [StatusHighlighterComponent, CommonModule],
  templateUrl: './sequence-count-card.component.html',
  styleUrl: './sequence-count-card.component.css',
})
export class SequenceCountCardComponent {
  @Input() planId: number = 0;
  planStatus: string = '';
  planDescription: string = '';
  planType: string = '';
  planLevel: string = '';
  customerCode: string = '';
  planCreationDate: string = '';
  planTypes: planType[] = [];
  planLevels: planLevel[] = [];
  planIdentifier: string = '';
  lastChangedDate: string = '';
  planName: string = '';

  constructor(private store: Store<appState>) {}

  ngOnInit() {
    // Fetch available plan types and store them in `planTypes`
    this.store.select(selectAllPlanTypes).subscribe({
      next: (data) => {
        this.planTypes = data || [];
      },
    });

    this.store.select(selectAllPlanLevels).subscribe({
      next: (data) => {
        this.planLevels = data || [];
      },
    });

    this.getData();
  }

  ngOnChanges() {
    // If planId changes, refetch data
    if (this.planId) {
      this.getData();
    }
  }

  getData() {
    // Dispatch action to load plan details from store
    this.store.dispatch(getPlanById({ id: this.planId }));
    // Select the plan details from the store based on planId
    this.store.select(selectPlanById).subscribe((plan: any) => {
      if (plan) {
        this.planIdentifier = plan.planIdentifier;
        this.planStatus = plan.planStatus;
        this.planDescription = plan.planDescription;
        this.planCreationDate = plan.createdDate;
        this.customerCode = plan.customerCode;
        this.lastChangedDate = plan.lastChangedDate;
        this.planName = plan.planName;

        const selectedPlanType = this.planTypes.find(
          (type) => type.id === plan.planTypeId
        );
        this.planType = selectedPlanType
          ? selectedPlanType.planTypeName
          : 'Unknown';

        const selectedPlanLevel = this.planLevels.find(
          (level) => level.id === plan.planLevelId
        );
        this.planLevel = selectedPlanLevel
          ? selectedPlanLevel.planLevelName
          : 'Unknown';
      }
    });
  }
}
