import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgIf } from '@angular/common';
import {
  getAllPlan,
  getPlanByStatus,
} from '../../../core/store/plan-state/plan.action';
import { appState } from '../../../core/store/app-state/app.state';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { SequenceAccordianComponent } from '../../../shared/sequence-accordian/sequence-accordian.component';
import { SequenceCountCardComponent } from '../../../shared/sequence-count-card/sequence-count-card.component';
import { MatButtonModule } from '@angular/material/button';
import {
  selectAllPlans,
  selectPlansByStatus,
} from '../../../core/store/plan-state/plan.selector';
import { PlanDetailsService } from '../../../core/services/plan-details.service';
import { showSnackBar } from '../../../core/store/snackbar-state/snackbar.action';
import { getPermissionIds } from '../../../core/store/auth-state/auth.selector';
import { SearchableDropdownComponent } from '../../../shared/searchable-state-dropdown/searchable-dropdown.component';
import { ChartOptions3 } from '../../dashboard/plan-charts/plan-charts.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApiResponse } from '../../../core/models/dashboard.model';
import { NotificationsService } from '../../../core/services/notifications.service';

@Component({
  selector: 'app-execute-br-plan',
  standalone: true,
  imports: [
    NavigationbarComponent,
    NgIf,
    SequenceCountCardComponent,
    SequenceAccordianComponent,
    NgApexchartsModule,
    MatButtonModule,
    SearchableDropdownComponent,
  ],
  templateUrl: './execute-br-plan.component.html',
  styleUrl: './execute-br-plan.component.css',
})
export class ExecuteBRPlanComponent {
  planId: number = 0;
  show = false;
  planName: {
    id: number;
    planIdentifier: string;
    planName: string;
    planStatus: string;
  }[] = [];
  isPlanExecuted: boolean = false;
  isPlanReadyToBeExecuted: boolean = false;
  defaultStatus: string = 'PlanReadyToBeExecuted';
  planStatus: { id: string; name: string }[] = [
    { id: 'PlanReadyToBeExecuted', name: 'Plan Ready To Be Executed' },
    { id: 'PlanExecutionInProgress', name: 'Plan Execution In Progress' },
    { id: 'PlanExecuted', name: 'Plan Executed' },
  ];
  hasPermissionToReExecute: boolean = false;
  selectedPlanId: number | null = null;
  filterByOptions: { id: number; name: string; planStatus: string }[] = [];
  displayData: Record<
    string,
    { id: number; planName: string; count: number }[]
  > = {};

  constructor(
    private store: Store<appState>,
    private planDetailsService: PlanDetailsService,
    private dashBoardService: NotificationsService
  ) {}

  ngOnInit() {
    this.store.select(getPermissionIds).subscribe((permissionIds) => {
      this.hasPermissionToReExecute = permissionIds.includes('69');
    });

    this.listenForInitalize();
    this.listenForUpdates();

    this.store.select(selectAllPlans).subscribe((plans) => {
      this.filterByOptions = plans
        .filter((plan: any) =>
          [
            'PlanReadyToBeExecuted',
            'PlanExecutionInProgress',
            'PlanExecuted',
          ].includes(plan.planStatus)
        )
        .map((plan: any) => ({
          id: plan.id,
          name: `${plan.planName} - ${plan.planStatus}`,
          planStatus: plan.planStatus,
        }));

      this.selectedPlanId = localStorage.getItem('selectedPlanId')
        ? Number(localStorage.getItem('selectedPlanId'))
        : 0;
      if (this.selectedPlanId !== 0)
        this.getPlanIdentifier(this.selectedPlanId);
      else this.getPlanByStatus('PlanReadyToBeExecuted');
    });
  }

  ngOnChanges() {}

  getPlanByStatus(event: any) {
    this.isPlanExecuted = false;
    this.isPlanReadyToBeExecuted = false;
    this.planId = 0;
    this.show = false;
    this.planName = [];
    this.selectedPlanId = null;
    this.defaultStatus = event;
    // Re-dispatch the action when changes occur (but this may not be needed)
    this.store.dispatch(getPlanByStatus({ status: event }));
    // Subscribe again to update the list of plans
    this.store.select(selectPlansByStatus).subscribe((plans) => {
      this.planName = plans;
    });
  }

  removeLS() {
    localStorage.removeItem('sequenceId');
    localStorage.removeItem('taskId');
  }
  getPlanIdentifier(event: any) {
    if (event !== 0 && event !== null) {
      this.show = true;
    }
    // Find the selected plan
    const selectedPlan = this.filterByOptions.find((plan) => plan.id === event);

    if (
      [
        'PlanReadyToBeExecuted',
        'PlanExecutionInProgress',
        'PlanExecuted',
      ].includes(selectedPlan?.planStatus || '')
    ) {
      this.store.dispatch(
        getPlanByStatus({
          status: selectedPlan?.planStatus || this.defaultStatus,
        })
      );
      this.store.select(selectPlansByStatus).subscribe((plans) => {
        this.planName = plans;
      });
      this.planId = event;
      this.selectedPlanId = event;
      localStorage.setItem('selectedPlanId', event.toString());
    } else {
      this.isPlanExecuted = false;
      this.isPlanReadyToBeExecuted = false;
      this.planId = 0;
      this.show = false;
      this.planName = [];
      this.selectedPlanId = null;
    }
    // Show the "Re-Execute" button only if the plan status is "PlanExecuted"
    this.isPlanExecuted = selectedPlan?.planStatus === 'PlanExecuted';
    this.isPlanReadyToBeExecuted =
      selectedPlan?.planStatus === 'PlanReadyToBeExecuted';
  }

  reExecutePlan() {
    // Dispatch an action or call API to re-execute the plan

    this.planDetailsService.reExecutePlan(this.planId).subscribe({
      next: () => {
        this.store.dispatch(
          showSnackBar({
            message: 'Plan ready for executing',
            status: 'success',
          })
        );
        this.getPlanByStatus('PlanReadyToBeExecuted');
      },
      error: (error: any) => {
        this.store.dispatch(
          showSnackBar({ message: error?.error?.detail, status: 'error' })
        );
      },
    });
  }

  notifyAll() {
    // Dispatch an action or call API to re-execute the plan
    this.planDetailsService.notifyAll(this.planId).subscribe({
      next: () => {
        this.store.dispatch(
          showSnackBar({
            message: 'Everyone has been notified successfully.',
            status: 'success',
          })
        );
      },
      error: (error: any) => {
        this.store.dispatch(
          showSnackBar({ message: error?.error?.details, status: 'error' })
        );
      },
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateChart(this.displayData);
    });
  }

  listenForInitalize() {
    this.dashBoardService
      .getDashboardDetails()
      .subscribe((data: ApiResponse[]) => {
        setTimeout(() => {
          this.gettingDataForChart();
        }, 100);
      });
  }

  listenForUpdates() {
    this.dashBoardService.onDashBoardUpdate((data: ApiResponse[]) => {
      setTimeout(() => {
        this.gettingDataForChart();
      }, 100);
    });
  }

  gettingDataForChart() {
    this.store.dispatch(getAllPlan());
    this.store.select(selectAllPlans).subscribe((plans) => {
      const statusKeys = [
        'PlanReadyToBeExecuted',
        'PlanExecutionInProgress',
        'PlanExecuted',
      ] as const;

      const data: Record<
        string,
        { id: number; planName: string; count: number }[]
      > = {};

      // Initialize empty arrays for each status
      statusKeys.forEach((status) => {
        data[status] = [];
      });

      // Populate data
      plans
        .filter((plan: any) => statusKeys.includes(plan.planStatus))
        .forEach((plan: any) => {
          data[plan.planStatus].push({
            id: plan.id,
            planName: plan.planName,
            count: 1, // constant count
          });
        });

      this.displayData = data;
      this.updateChart(data);
    });
  }

  private updateChart(
    data: Record<string, { id: number; planName: string; count: number }[]>
  ) {
    type StatusKey =
      | 'PlanReadyToBeExecuted'
      | 'PlanExecutionInProgress'
      | 'PlanExecuted';

    const statusColors: Record<StatusKey, string> = {
      PlanReadyToBeExecuted: '#76923c',
      PlanExecutionInProgress: '#4f6228',
      PlanExecuted: '#00b050',
    };

    const shadeColor = (color: string, percent: number): string => {
      let R = parseInt(color.substring(1, 3), 16);
      let G = parseInt(color.substring(3, 5), 16);
      let B = parseInt(color.substring(5, 7), 16);

      R = Math.min(255, Math.max(0, Math.round(R + (R * percent) / 100)));
      G = Math.min(255, Math.max(0, Math.round(G + (G * percent) / 100)));
      B = Math.min(255, Math.max(0, Math.round(B + (B * percent) / 100)));

      return `rgb(${R},${G},${B})`;
    };

    // categories in the order provided by data object
    const categories: StatusKey[] = Object.keys(data) as StatusKey[];

    // Build ordered unique plan names by iterating categories (so color generation can match order)
    const allPlanNames: string[] = [];
    categories.forEach((status) => {
      (data[status] ?? []).forEach((p) => {
        if (!allPlanNames.includes(p.planName)) allPlanNames.push(p.planName);
      });
    });

    // Build series: each plan has a single id and a data array across categories (1 or 0)
    let series = allPlanNames.map((planName) => {
      // find plan entry once (exists only in one status)
      let foundId: number | null = null;
      for (const status of categories) {
        const f = (data[status] ?? []).find((p) => p.planName === planName);
        if (f) {
          foundId = f.id;
          break;
        }
      }

      const values = categories.map((status) =>
        (data[status] ?? []).some((p) => p.planName === planName) ? 1 : 0
      );

      return { id: foundId, name: planName, data: values };
    });

    // Generate colors aligned to series order: iterate categories and push color for each new plan encountered
    const colors: string[] = [];
    const seen = new Set<string>();
    categories.forEach((status) => {
      const baseColor = statusColors[status];
      (data[status] ?? []).forEach((p, idx) => {
        if (!seen.has(p.planName)) {
          seen.add(p.planName);
          const percent = idx * 15;
          colors.push(shadeColor(baseColor, percent));
        }
      });
    });

    if (!categories.length || !series.length) {
      this.sequenceChart = {
        ...this.sequenceChart,
        xaxis: { ...this.sequenceChart.xaxis, categories: [] },
        series: [{ name: '', data: [] }],
        colors: [],
      };
      return;
    }

    if (series.length === 0) {
      series = [{ id: 0, name: '', data: [] }];
    }

    // assign series (ApexCharts expects number[] for data; we've kept that)
    // note: we include `id` as an extra property on each series object for later retrieval
    this.sequenceChart = {
      ...this.sequenceChart,
      xaxis: {
        ...this.sequenceChart.xaxis,
        categories,
      },
      series: series as { id: number; name: string; data: number[] }[],
      colors,
    };
  }

  public sequenceChart: Partial<ChartOptions3> = {
    series: [{ name: '', data: [] }],
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: { show: false },
      events: {
        dataPointSelection: (event: any, chartContext: any, config: any) => {
          const seriesIndex = config.seriesIndex;
          const pointIndex = config.dataPointIndex; // corresponds to a status (category)

          const seriesItem = this.sequenceChart.series?.[seriesIndex] as any;
          const planId = seriesItem?.id;
          const planName = seriesItem?.name;

          // only proceed if the clicked bar actually has value 1
          const value = Array.isArray(seriesItem?.data)
            ? seriesItem.data[pointIndex]
            : 0;
          if (value === 1) {
            this.getPlanIdentifier(planId);
            // do navigation or open details using planId
          }
        },
        mouseMove: (event: any, chartContext: any, config: any) => {
          (event.target as HTMLElement).style.cursor = 'pointer';
        },
      },
    },
    plotOptions: {
      bar: { horizontal: true },
    },
    xaxis: {
      categories: [],
      labels: { show: false },
    },
    legend: { show: true, position: 'bottom' },
    fill: { opacity: 1 },
    dataLabels: {
      enabled: true,
      formatter: (_val: any, opts: any) => {
        const seriesArr = opts?.w?.config?.series ?? [];
        if (!seriesArr[opts.seriesIndex]) return '';
        return seriesArr[opts.seriesIndex].name;
      },
      style: { colors: ['#fff'], fontSize: '12px', fontWeight: 'bold' },
    },
    noData: { text: 'No data available' },
  };
}
