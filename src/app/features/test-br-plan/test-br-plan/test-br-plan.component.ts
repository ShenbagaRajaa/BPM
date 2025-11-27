import { Component } from '@angular/core';
import { SequenceCountCardComponent } from '../../../shared/sequence-count-card/sequence-count-card.component';
import { SequenceAccordianComponent } from '../../../shared/sequence-accordian/sequence-accordian.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { Store } from '@ngrx/store';
import { NgIf } from '@angular/common';
import { appState } from '../../../core/store/app-state/app.state';
import {
  getAllPlan,
  getPlanByStatus,
} from '../../../core/store/plan-state/plan.action';
import {
  selectAllPlans,
  selectPlansByStatus,
} from '../../../core/store/plan-state/plan.selector';
import { MatButtonModule } from '@angular/material/button';
import { PlanDetailsService } from '../../../core/services/plan-details.service';
import { showSnackBar } from '../../../core/store/snackbar-state/snackbar.action';
import { getPermissionIds } from '../../../core/store/auth-state/auth.selector';
import { SearchableDropdownComponent } from '../../../shared/searchable-state-dropdown/searchable-dropdown.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions3 } from '../../dashboard/plan-charts/plan-charts.component';
import { NotificationsService } from '../../../core/services/notifications.service';
import { ApiResponse } from '../../../core/models/dashboard.model';
@Component({
  selector: 'app-test-br-plan',
  standalone: true,
  imports: [
    SequenceCountCardComponent,
    NgIf,
    SequenceAccordianComponent,
    NavigationbarComponent,
    MatButtonModule,
    SearchableDropdownComponent,
    NgApexchartsModule,
  ],
  templateUrl: './test-br-plan.component.html',
  styleUrl: './test-br-plan.component.css',
})
export class TestBRPlanComponent {
  planId: number = 0;
  show = false;
  planName: {
    id: number;
    planIdentifier: string;
    planName: string;
    planStatus: string;
  }[] = [];

  isPlanTested: boolean = false;
  isPlanReadyToBeTested: boolean = false;
  defaultStatus: string = 'PlanReadyToBeTested';
  filterByPlanStatus: { id: string; name: string }[] = [
    { id: 'PlanReadyToBeTested', name: 'Plan Ready To Be Tested' },
    { id: 'PlanTestInProgress', name: 'Plan Test In Progress' },
    { id: 'PlanTested', name: 'Plan Tested' },
  ];
  displayData: Record<
    string,
    { id: number; planName: string; count: number }[]
  > = {};
  selectedPlanId: number | null = null;
  filterByOptions: { id: number; name: string; planStatus: string }[] = [];

  hasPermissionToReTest: boolean = false;

  constructor(
    private store: Store<appState>,
    private planDetailsService: PlanDetailsService,
    private dashBoardService: NotificationsService
  ) {}

  // On component initialization, fetch plans with the status 'PlanReadyToBeTested'
  ngOnInit() {
    this.store.select(getPermissionIds).subscribe((permissionIds) => {
      this.hasPermissionToReTest = permissionIds.includes('68');
    });
    this.listenForInitalize();
    this.listenForUpdates();

    this.store.select(selectAllPlans).subscribe((plans) => {
      this.filterByOptions = plans
        .filter((plan: any) =>
          ['PlanReadyToBeTested', 'PlanTestInProgress', 'PlanTested'].includes(
            plan.planStatus
          )
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
      else this.getPlanByStatus('PlanReadyToBeTested');
    });
  }

  // Event handler to get the selected plan ID from the dropdown
  getPlanByStatus(event: any) {
    this.planName = [];
    this.selectedPlanId = null;
    this.isPlanTested = false;
    this.isPlanReadyToBeTested = false;
    this.planId = 0;
    this.show = false;

    this.defaultStatus = event;
    this.store.dispatch(getPlanByStatus({ status: event }));
    this.store.select(selectPlansByStatus).subscribe((plans) => {
      this.planName = plans;
    });
  }

  removeLS() {
    localStorage.removeItem('sequenceId');
    localStorage.removeItem('taskId');
  }
  getPlanIdentifier(event: any) {
    this.selectedPlanId = event;
    if (event !== 0 && event !== null) {
      this.show = true;
    }

    // Find the selected plan
    const selectedPlan = this.filterByOptions.find((plan) => plan.id === event);

    if (
      ['PlanReadyToBeTested', 'PlanTestInProgress', 'PlanTested'].includes(
        selectedPlan?.planStatus || ''
      )
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
      this.planName = [];
      this.selectedPlanId = null;
      this.isPlanTested = false;
      this.isPlanReadyToBeTested = false;
      this.planId = 0;
      this.show = false;
    }
    // Show the "Re-Execute" button only if the plan status is "PlanExecuted"
    this.isPlanTested = selectedPlan?.planStatus === 'PlanTested';
    this.isPlanReadyToBeTested =
      selectedPlan?.planStatus === 'PlanReadyToBeTested';
  }

  reTestPlan() {
    // Dispatch an action or call API to re-execute the plan
    this.planDetailsService.reTestPlan(this.planId).subscribe({
      next: () => {
        this.store.dispatch(
          showSnackBar({ message: 'Plan ready for testing', status: 'success' })
        );
        this.getPlanByStatus('PlanReadyToBeTested');
      },
      error: (error: any) => {
        this.store.dispatch(
          showSnackBar({ message: error?.error?.details, status: 'error' })
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
        'PlanReadyToBeTested',
        'PlanTestInProgress',
        'PlanTested',
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
      | 'PlanReadyToBeTested'
      | 'PlanTestInProgress'
      | 'PlanTested';

    const statusColors: Record<StatusKey, string> = {
      PlanReadyToBeTested: '#943634',
      PlanTestInProgress: '#f58f0a',
      PlanTested: '#e36c0a',
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
