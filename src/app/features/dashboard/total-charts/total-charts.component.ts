import {
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';

import {
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexNoData,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexTitleSubtitle,
  ApexTooltip,
  ChartComponent,
} from 'ng-apexcharts';

import { NgApexchartsModule } from 'ng-apexcharts';
import { ApiResponse } from '../../../core/models/dashboard.model';
import { NotificationsService } from '../../../core/services/notifications.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchableDropdownComponent } from '../../../shared/searchable-state-dropdown/searchable-dropdown.component';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { selectAllPlans } from '../../../core/store/plan-state/plan.selector';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive?: ApexResponsive[];
  plotOptions?: ApexPlotOptions;
  tooltip?: ApexTooltip;
  dataLabels?: ApexDataLabels;
  colors?: string[];
  title?: ApexTitleSubtitle;
  legend?: ApexLegend;
  noData?: ApexNoData;
};

@Component({
  selector: 'app-total-charts',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule, SearchableDropdownComponent],
  templateUrl: './total-charts.component.html',
  styleUrl: './total-charts.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TotalChartsComponent {
  @ViewChild('chart') chart!: ChartComponent;

  apiResponse: ApiResponse[] = [];
  displayData: ApiResponse | null = null;

  planWithStatus: Partial<ChartOptions> = {
    series: [],
    chart: { type: 'donut', height: 500, redrawOnParentResize: true },
    labels: [],
    noData: {
      text: 'No data available',
      align: 'center',
      verticalAlign: 'middle',
      style: {
        color: '#999',
        fontSize: '16px',
      },
    },
  };
  sequenceWithStatus: Partial<ChartOptions> = {
    series: [],
    chart: { type: 'donut', height: 500, redrawOnParentResize: true },
    labels: [],
    noData: {
      text: 'No data available',
      align: 'center',
      verticalAlign: 'middle',
      style: {
        color: '#999',
        fontSize: '16px',
      },
    },
  };
  taskWithStatus: Partial<ChartOptions> = {
    series: [],
    chart: { type: 'donut', height: 500, redrawOnParentResize: true },
    labels: [],
    noData: {
      text: 'No data available',
      align: 'center',
      verticalAlign: 'middle',
      style: {
        color: '#999',
        fontSize: '16px',
      },
    },
  };

  statusColors: { [key: string]: string } = {
    PlanBuildInProgress: '#00b0f0',
    PlanBuildReady: '#0070c0',
    PlanReadyToBeTested: '#943634',
    PlanTestInProgress: '#f58f0a',
    PlanTested: '#e36c0a',
    PlanApproved: '#5f497a',
    PlanReadyToBeExecuted: '#76923c',
    PlanExecutionInProgress: '#4f6228',
    PlanExecuted: '#00b050',
    PlanTestAborted: '#c00000',
    SequenceBuildStarted: '#00b0f0',
    SequenceBuildCompleted: '#0070c0',
    SequenceTestInProgress: '#f58f0a',
    SequenceTested: '#e36c0a',
    SequenceExecutionInProgress: '#76923c',
    SequenceExecuted: '#00b050',
    SequenceTestAborted: '#c00000',
    InBuildNew: '#00b0f0',
    InTestDispatched: '#5f497a',
    InTestAcknowledged: '#f58f0a',
    InTestCompleted: '#e36c0a',
    InTestProblem: '#ff0000',
    InTestProblemResolved: 'rgb(76, 247, 133)',
    InTestTaskTestFailed: '#c00000',
    InExecuteDispatched: 'orange',
    InExecuteAcknowledged: '#76923c',
    InExecuteCompleted: '#00b050',
    InExecuteProblem: '#943634',
    InExecuteProblemResolved: 'rgb(4, 126, 4)',
  };

  isBrowser!: boolean;
  filterByOptions: { id: number; name: string }[] = [{ id: 0, name: 'All' }];
  private lastClickTime: number = 0;
  primaryFilter: number = 0;
  selectedPlan: number = 0;
  @Output() planSelected = new EventEmitter<number>();
  existingSequenceStatus: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private dashBoardService: NotificationsService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private store: Store
  ) {
  }

  ngOnInit() {
    this.loadPlanNames();
    this.listenForInitalize();
    this.listenForUpdates();
    this.selectedPlan = localStorage.getItem('selectedPlanId')
      ? Number(localStorage.getItem('selectedPlanId'))
      : (this.selectedPlan = 0);
    this.planSelected.emit(this.selectedPlan);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateAllCharts();
    });
  }

  listenForInitalize() {
    this.displayData =
      this.apiResponse.filter((d) => d.planId === this.selectedPlan)[0] || null;
    this.dashBoardService
      .getDashboardDetails()
      .subscribe((data: ApiResponse[]) => {
        this.apiResponse = data;
        this.displayData =
          data.filter((d) => d.planId === this.selectedPlan)[0] || null;
        setTimeout(() => {
          this.updateAllCharts();
        }, 500);
      });
  }

  listenForUpdates() {
    this.dashBoardService.onDashBoardUpdate((data: ApiResponse[]) => {
      this.apiResponse = data;
      this.displayData =
        data.filter((d) => d.planId === this.selectedPlan)[0] || null;
      setTimeout(() => {
        this.updateAllCharts();
      }, 500);
      this.cdr.detectChanges();
    });
  }

  updateAllCharts() {
    this.planWithStatus = this.buildChartConfig(
      this.displayData?.planWithStatus ?? [],
      'Plan Pulse Tracker',
      true,
      false,
      false
    );
    this.sequenceWithStatus = this.buildChartConfig(
      this.displayData?.sequenceWithStatus ?? [],
      'Sequence Progression Tracker',
      false,
      true,
      false
    );
    this.taskWithStatus = this.buildChartConfig(
      (this.displayData?.taskWithStatus ?? []).filter((item) => item.count > 0),
      'Task Execution Tracker',
      false,
      false,
      true
    );
  }

  buildChartConfig(
    data: any[],
    title: string,
    isPlan: boolean,
    isSequence: boolean,
    isTask: boolean
  ): Partial<ChartOptions> {
    const series = data.map((item) => item.count);
    const rawLabels = data.map((item) => item.status);
    const labels =
      rawLabels.map((status) => this.formatStatusLabel(status)) || [];
    const colors = rawLabels.map(
      (status) => this.statusColors[status] || '#CCCCCC'
    );

    return {
      series,
      labels,
      colors,
      chart: {
        type: 'donut',
        height: 500,
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            const clickedIndex = config.dataPointIndex;
            const status = data[clickedIndex].status;
            if (isPlan) {
              if (this.selectedPlan) {
                this.router.navigate(['home/buildBRPlan/add-plan'], {
                  queryParams: { planId: this.selectedPlan },
                });
                this.selectedPlan = 0;
              } else {
                this.router.navigate(['home/buildBRPlan/add-plan'], {
                  queryParams: { planStatus: status },
                });
              }
            }
            if (isSequence) {
              const now = Date.now();
              if (now - this.lastClickTime < 300) {
                // double-click detected (within 300ms)
                if (this.selectedPlan) {
                  this.router.navigate(['home/buildBRPlan/add-plan'], {
                    queryParams: { planId: this.selectedPlan },
                  });
                } else {
                  this.router.navigate(['home/buildBRPlan/add-plan']);
                }
                this.lastClickTime = 0; // reset
                return;
              }
              this.lastClickTime = now;
              if (this.existingSequenceStatus !== status) {
                this.existingSequenceStatus = status;
                this.getTaskCount(status);
              } else {
                this.existingSequenceStatus = 'All';
                this.getTaskCount('All');
              }
            }
            if (isTask) {
              if (this.selectedPlan) {
                this.router.navigate(['home/buildBRPlan/add-plan'], {
                  queryParams: { planId: this.selectedPlan },
                });
              } else {
                this.router.navigate(['home/buildBRPlan/add-plan']);
              }
            }
          },
          mouseMove: (event: any, chartContext: any, config: any) => {
            (event.target as HTMLElement).style.cursor = 'pointer';
          },
        },
      },
      title: {
        text: title,
        align: 'left',
        style: {
          color: '#3a3a81',
          fontSize: '18px',
          fontWeight: 'bold',
        },
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'left',
        fontSize: '14px',
        labels: {
          colors: '#333',
        },
        itemMargin: {
          horizontal: 10,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              value: {
                show: true,
                fontSize: '14px',
                fontWeight: 600,
                formatter: (val: string) => `${val}`,
              },
              name: {
                show: false,
              },
              total: {
                show: true,
                fontSize: '16px',
                label: 'Total',
                formatter: function (w) {
                  return w.globals.seriesTotals
                    .reduce((a: any, b: any) => a + b, 0)
                    .toString();
                },
              },
            },
          },
        },
      },
      dataLabels: {
        formatter: (val: number, opts: any) => {
          const index = opts.seriesIndex;
          return data[index].count.toFixed(0);
        },
        dropShadow: {
          enabled: false,
        },
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val: number) => val.toString(),
        },
      },
      noData: {
        text: 'No data available',
        align: 'center',
        verticalAlign: 'middle',
        style: {
          color: '#999',
          fontSize: '16px',
        },
      },
    };
  }

  formatStatusLabel(status: string): string {
    return status.replace(/([A-Z])/g, ' $1').trim();
  }

  removeLS() {
    localStorage.removeItem('sequenceId');
    localStorage.removeItem('taskId');
  }
  getSelectedPlan(event: number) {
    this.selectedPlan = event;
    localStorage.setItem('selectedPlanId', this.selectedPlan.toString());
    this.planSelected.emit(event);

    this.displayData =
      this.apiResponse.find((d) => d.planId === this.selectedPlan) || null;
    this.updateAllCharts();
  }

  loadPlanNames() {
    this.store
      .select(selectAllPlans)
      .pipe(takeUntil(this.destroy$))
      .subscribe((plans) => {
        const plansOptions = plans.map((plan) => ({
          id: plan.id,
          name: plan.planName,
        }));
        this.filterByOptions = [...this.filterByOptions, ...plansOptions];
      });
  }

  getTaskCount(status: string) {
    if (status === 'All') {
      const taskData = (this.displayData?.taskWithStatus ?? []).filter(
        (item) => item.count > 0
      );
      this.taskWithStatus = this.buildChartConfig(
        taskData,
        'Task Execution Tracker',
        false,
        false,
        true
      );
    } else {
      const taskData =
        this.displayData?.sequenceWithStatus.find(
          (seq) => seq.status === status
        )?.taskWithStatus || [];
      const taskData2 = taskData.filter((item) => item.count > 0);
      this.taskWithStatus = this.buildChartConfig(
        taskData2,
        'Task Execution Tracker',
        false,
        false,
        true
      );
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
