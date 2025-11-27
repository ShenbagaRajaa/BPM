import {
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexTooltip,
  ApexFill,
  ApexLegend,
  NgApexchartsModule,
  ApexNoData,
} from 'ng-apexcharts';
import { DashBoardPlan } from '../../../core/models/dashboard.model';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectAllPlans } from '../../../core/store/plan-state/plan.selector';
import { Subject, takeUntil } from 'rxjs';
import { NotificationsService } from '../../../core/services/notifications.service';
import { CommonModule } from '@angular/common';

export type ChartOptions3 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
  colors: any[];
  labels: any[];
  markers: any;
  noData: ApexNoData;
};
@Component({
  selector: 'app-plan-charts',
  standalone: true,
  imports: [NgApexchartsModule, MatIconModule, CommonModule],
  templateUrl: './plan-charts.component.html',
  styleUrl: './plan-charts.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class PlanChartsComponent {
  @Input() plan!: DashBoardPlan;
  @ViewChild('chart') chart!: ChartComponent;
  public sequenceChart: Partial<ChartOptions3> = {
    series: [{ name: '', data: [] }],
    chart: { type: 'bar' },
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
  public taskChart: Partial<ChartOptions3> = {
    series: [{ name: '', data: [] }],
    chart: { type: 'bar', height: 400 },
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
  public testTaskMetrices: Partial<ChartOptions3> = {
    series: [{ name: '', data: [] }],
    chart: { type: 'bar' },
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
  public executeTaskMetrices: Partial<ChartOptions3> = {
    series: [{ name: '', data: [] }],
    chart: { type: 'bar' },
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
  private destroy$ = new Subject<void>();
  @Input() selectedPlan: number = 0;
  planOptions: { id: number; planName: string; planStatus: string }[] = [];
  planName: string = '';
  sequenceName: string = '';
  taskName: string = '';

  statusColors: { [key: string]: string } = {
    inBuildNew: '#00b0f0',
    inTestDispatched: '#5f497a',
    inTestAcknowledged: '#f58f0a',
    inTestCompleted: '#e36c0a',
    inTestProblem: '#ff0000',
    inTestProblemResolved: 'rgb(76, 247, 133)',
    inTestTaskTestFailed: '#c00000',
    inExecuteDispatched: 'orange',
    inExecuteAcknowledged: '#76923c',
    inExecuteCompleted: '#00b050',
    inExecuteProblem: '#943634',
    inExecuteProblemResolved: 'rgb(4, 126, 4)',
  };

  constructor(
    private dashboardService: NotificationsService,
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.loadPlanNames();
      this.listenForUpdates();
    }, 2000);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.listenForUpdates();
    });
  }

  ngOnChanges() {
    if (this.selectedPlan !== 0) {
      this.getSelectedPlan(this.selectedPlan);
    } else if (this.selectedPlan === 0) {
      if (this.planOptions && this.planOptions.length > 0) {
        this.selectedPlan = this.planOptions[this.planOptions.length - 1].id;
      } else {
        this.selectedPlan = 0;
      }
      this.dashboardService.sendPlanIdToGet(this.selectedPlan);
      this.listenForUpdates();
    }
  }

  loadPlanNames() {
    this.store
      .select(selectAllPlans)
      .pipe(takeUntil(this.destroy$))
      .subscribe((plans) => {
        this.planOptions = plans.map((plan) => ({
          id: plan.id,
          planName: plan.planName,
          planStatus: plan.planStatus,
        }));

        if (this.planOptions.length) {
          this.selectedPlan = localStorage.getItem('selectedPlanId')
            ? Number(localStorage.getItem('selectedPlanId')) === 0
              ? this.planOptions[this.planOptions.length - 1].id
              : Number(localStorage.getItem('selectedPlanId'))
            : this.planOptions[this.planOptions.length - 1].id;
          this.dashboardService.sendPlanIdToGet(this.selectedPlan);
        }
        this.listenForUpdates();
      });
  }

  getSelectedPlan(event: number) {
    this.dashboardService.sendPlanIdToLeave(this.selectedPlan);
    this.selectedPlan = event;
    this.dashboardService.sendPlanIdToGet(event);
    this.sequenceBarChart(event);
    this.cdr.detectChanges();
  }

  listenForUpdates() {
    this.dashboardService.onDashBoardPlanUpdate((planResponse: any) => {
      this.plan = planResponse.planData ?? [];
      this.sequenceBarChart(planResponse.planData.planId);
    });
  }

  formatStatusLabel(status: string): string {
    return status
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  sequenceBarChart(planId: number) {
    const sequences = this.plan?.sequences;
    this.planName = this.plan?.planName || '';
    const sequenceNames =
      sequences?.map((sequence) => sequence.sequenceName) || [];

    const statusLabels = [
      'inBuildNew',
      'inTestDispatched',
      'inTestAcknowledged',
      'inTestCompleted',
      'inTestProblem',
      'inTestProblemResolved',
      'inTestTaskTestFailed',
      'inExecuteDispatched',
      'inExecuteAcknowledged',
      'inExecuteCompleted',
      'inExecuteProblem',
      'inExecuteProblemResolved',
    ];

    const filteredStatuses = statusLabels.filter(
      (status) =>
        Array.isArray(sequences) &&
        sequences.some((sequence) => {
          const value = sequence[status as keyof typeof sequence];
          return typeof value === 'number' && value > 0;
        })
    );

    const colors = filteredStatuses.map(
      (status) => this.statusColors[status] || '#CCCCCC'
    );

    let series = filteredStatuses.map((status) => {
      return {
        name: this.formatStatusLabel(status),
        data:
          sequences?.map((sequence) => {
            const value = sequence[status as keyof typeof sequence];
            return typeof value === 'number' ? value : 0;
          }) ?? [],
      };
    }) || [{ name: '', data: [] }];

    if (series.length === 0) {
      series = [{ name: '', data: [] }];
    }

    this.sequenceChart = {
      series: series || [{ name: '', data: [] }],
      colors: colors,
      chart: {
        type: 'bar',
        height: 400,
        stacked: true,
        toolbar: { show: false },
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            const clickedIndex = config.dataPointIndex;
            const sequenceId = sequences?.[clickedIndex]?.sequenceId;
            if (sequenceId !== undefined) {
              localStorage.setItem('sequenceId', sequenceId.toString());
              localStorage.removeItem('taskId');
              this.getTaskChart(planId, sequenceId);
            }
          },
          mouseMove: (event: any, chartContext: any, config: any) => {
            (event.target as HTMLElement).style.cursor = 'pointer';
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      xaxis: {
        categories: sequenceNames || [],
        title: {
          text: 'Task count',
        },
      },
      yaxis: {
        title: {
          text: 'Sequences',
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        position: 'bottom',
        horizontalAlign: 'left',
        offsetX: 0,
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          return val > 0 ? val.toString() : '';
        },
        style: {
          colors: ['#fff'],
        },
      },
    };

    if (sequences && sequences.length > 0) {
      const sequenceId =
        Number(localStorage.getItem('sequenceId')) || sequences[0].sequenceId;
      setTimeout(() => {
        this.getTaskChart(planId, sequenceId);
      }, 500);
    }
  }

  getTaskChart(planId: number, sequenceId: number) {
    const sequences = this.plan.sequences;

    let taskData: any[] = [];
    if (sequences) {
      const sequenceDataTemp = sequences.find(
        (plan) => plan.sequenceId === sequenceId
      );
      taskData = sequenceDataTemp?.taskData || [];
      this.sequenceName = sequenceDataTemp?.sequenceName || '';
    }

    const statusPercentMap: { [key: string]: number } = {
      InBuildNew: 5,
      InTestDispatched: 10,
      InTestTaskTestFailed: 10,
      InTestAcknowledged: 20,
      InTestProblem: 30,
      InTestProblemResolved: 40,
      InTestCompleted: 50,
      InExecuteDispatched: 60,
      InExecuteTaskExecuteFailed: 60,
      InExecuteProblem: 80,
      InExecuteAcknowledged: 70,
      InExecuteProblemResolved: 90,
      InExecuteCompleted: 100,
    };

    const statusColorMap: { [key: string]: string } = {
      InBuildNew: '#00b0f0',
      InTestDispatched: '#5f497a',
      InTestAcknowledged: '#f58f0a',
      InTestCompleted: '#e36c0a',
      InTestProblem: '#ff0000',
      InTestProblemResolved: '#5f497a',
      InTestTaskTestFailed: '#c00000',
      InExecuteDispatched: 'orange',
      InExecuteAcknowledged: '#76923c',
      InExecuteCompleted: '#00b050',
      InExecuteProblem: '#943634',
      InExecuteProblemResolved: '#5f497a',
      InExecuteTaskExecuteFailed: '#c00000',
    };

    const categories: string[] = taskData.map((task) => task.taskTitle);

    // ✅ Prepare data for every status (even if not present)
    const statusGroups: { [status: string]: number[] } = {};
    Object.keys(statusPercentMap).forEach((status) => {
      // Default fill with null values for all tasks (Apex will skip rendering)
      statusGroups[status] = new Array(categories.length).fill(null);
    });

    // Fill data for tasks that exist
    taskData.forEach((task) => {
      const percent = statusPercentMap[task.status] || 0;
      const index = categories.indexOf(task.taskTitle);
      statusGroups[task.status][index] = percent;
    });

    // Store a mapping between formatted names and raw status keys
    const formattedStatusMap: { [key: string]: string } = {};

    const series = Object.keys(statusGroups).map((status) => {
      const formattedLabel = this.formatStatusLabel(status);
      formattedStatusMap[formattedLabel] = status; // ✅ save mapping
      return {
        name: formattedLabel,
        data: statusGroups[status],
        color: statusColorMap[status],
      };
    });

    this.taskChart = {
      series,
      chart: {
        type: 'bar',
        height: 400,
        stacked: true,
        toolbar: { show: false },
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            const clickedIndex = config.dataPointIndex;
            const taskId = taskData?.[clickedIndex]?.taskId;
            if (taskId !== undefined) {
              // this.getTaskMetrices(planId, sequenceId, taskId);
              localStorage.setItem('taskId', taskId);
              this.getExecuteTaskMetrices(planId, sequenceId, taskId);
              this.getTestTaskMetrices(planId, sequenceId, taskId);
            }
          },
          mouseMove: (event: any) => {
            (event.target as HTMLElement).style.cursor = 'pointer';
          },
        },
      },
      plotOptions: {
        bar: { horizontal: true },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => (val ? val + '%' : ''),
      },
      xaxis: {
        type: 'category',
        max: 100,
        categories,
      },
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'left',
        formatter: (seriesName: string) => {
          // ✅ Get original status key from formatted name
          const rawStatus = formattedStatusMap[seriesName];
          const percent = statusPercentMap[rawStatus] || 0;
          return `${seriesName} (${percent}%)    `;
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const taskTitle = categories[dataPointIndex];
          const status = taskData[dataPointIndex].status;
          const dotColor = statusColorMap[status] || '#CCCCCC';

          return `
              <div class="task-card" style='background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              padding: 8px;
              width: 200px;'>
          <div class="task-header" style='color: #333;
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 12px;'>${taskTitle}</div>
          <div class="progress-container" style='display: flex;
              align-items: center;
              gap: 12px;'>
              <div class="progress-dot" style='width: 12px;
              height: 12px;
              background-color: ${dotColor};
              border-radius: 50%;'></div>
              <div class="progress-text">${taskData[dataPointIndex].status}</div>
          </div>
      </div>
            `;
        },
      },
    };

    if (taskData.length > 0) {
      setTimeout(() => {
        const taskId =
          Number(localStorage.getItem('taskId')) || taskData[0].taskId;
        if (taskId) {
          this.getExecuteTaskMetrices(planId, sequenceId, taskId);
          this.getTestTaskMetrices(planId, sequenceId, taskId);
        }
      }, 500);
    }
  }

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  private lastClickedSeries: string | null = null;
  private chartInstance: any = null;
  getTestTaskMetrices(planId: number, sequenceId: number, taskId: any) {
    this.getTaskMetrices(planId, sequenceId, taskId, 'test');
  }

  getExecuteTaskMetrices(planId: number, sequenceId: number, taskId: any) {
    this.getTaskMetrices(planId, sequenceId, taskId, 'execute');
  }

  getTaskMetrices(
    planId: number,
    sequenceId: number,
    taskId: any,
    type: 'test' | 'execute'
  ) {
    // Task states based on type
    const taskStates =
      type === 'test'
        ? ['inTestDispatched', 'inTestAcknowledged', 'inTestCompleted']
        : [
            'inExecuteDispatched',
            'inExecuteAcknowledged',
            'inExecuteCompleted',
          ];

    const getStateIndex = (status: string) => taskStates.indexOf(status);

    // Define colors for different types
    const chartColor = type === 'test' ? '#1f77b4' : '#2ca02c'; // Blue for test, Green for execute

    // Find selected task's metric data
    const taskData =
      this.plan.sequences?.find((p) => p.sequenceId === sequenceId)?.taskData ||
      [];

    const taskDataTemp = taskData.find((task) => task.taskId === taskId);

    const taskMetrices =
      taskDataTemp?.taskMetrices?.find((task) => task.name === type) || [];

    this.taskName = taskDataTemp?.taskTitle || '';
    const task = taskMetrices;

    // Build chart series data
    const processedSeriesData =
      task && !Array.isArray(task)
        ? {
            name: task.name,
            data: ['dispatched', 'acknowledged', 'completed']
              .filter((status) => (task as any)[status] !== null)
              .map((status) => {
                const originalDate = new Date((task as any)[status]); // ✅ exact date from API
                const timestamp = originalDate.getTime(); // ✅ local timestamp (no UTC shift)
                return {
                  actualx: timestamp, // ✅ store as number (ms)
                  x: timestamp, // ✅ use directly for x-axis
                  y: getStateIndex(
                    `in${this.capitalize(task.name)}${this.capitalize(status)}`
                  ),
                  status,
                  stateKey: `in${this.capitalize(task.name)}${this.capitalize(
                    status
                  )}`,
                };
              })
              .sort((a, b) => a.x - b.x), // ✅ simple numeric sort
          }
        : { name: '', data: [] };

    const chartOptions = {
      series: [processedSeriesData],
      chart: {
        height: 350,
        type: 'area' as ApexChart['type'],
        toolbar: { show: false },
        zoom: { enabled: false },
        events: {
          mounted: (chartContext: any) => {
            this.chartInstance = chartContext;
          },
          mouseMove: (event: any) => {
            (event.target as HTMLElement).style.cursor = 'pointer';
          },
        },
      },
      // Color configuration for area chart
      colors: [chartColor],
      fill: {
        type: 'solid',
        opacity: 0.3, // Adjust opacity for area fill
      },
      stroke: {
        curve: 'smooth' as 'smooth',
        width: 2,
        colors: [chartColor],
      },
      legend: {
        onItemClick: { toggleDataSeries: false }, // Disable legend toggling
      },
      dataLabels: { enabled: false },
      xaxis: {
        type: 'datetime' as 'datetime',
        labels: {
          formatter: (value: string, timestamp?: number, opts?: any) => {
            // value is a string, but we expect a timestamp, so use timestamp if provided
            const date = new Date(timestamp ?? Number(value));
            return date.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });
          },
        },
        min: processedSeriesData.data.length
          ? processedSeriesData.data[0].x
          : undefined,
        max: processedSeriesData.data.length
          ? processedSeriesData.data[processedSeriesData.data.length - 1].x
          : undefined,
      },
      yaxis: {
        labels: {
          formatter: (val: number) => {
            const index = Math.floor(val);
            return index >= 0 && index < taskStates.length
              ? this.formatStatusLabel(taskStates[index])
              : '';
          },
        },
        min: 0,
        max: taskStates.length - 1,
        tickAmount: taskStates.length - 1,
      },
      noData: {
        text: 'No data available',
        style: {
          color: '#999',
          fontSize: '16px',
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        custom: ({
          seriesIndex,
          dataPointIndex,
          w,
        }: {
          seriesIndex: number;
          dataPointIndex: number;
          w: any;
        }) => {
          const dataPoint = w.config.series[seriesIndex].data[dataPointIndex];
          if (!dataPoint) return '';

          const timestamp = dataPoint.x;
          const formattedDate = new Date(
            dataPoint.actualx || timestamp
          ).toLocaleString();

          // Collect all points at same timestamp
          const allPoints = w.config.series
            .flatMap((s: any) => s.data)
            .filter((dp: any) => dp.x === timestamp)
            .sort((a: any, b: any) => a.y - b.y);

          return `
          <div class="apexcharts-tooltip-title" style="font-weight: semibold; margin-bottom: 5px; text-align: center;">
            ${formattedDate}
          </div>
          ${allPoints
            .map((point: any) => {
              const stateIndex = Math.floor(point.y);
              const stateName =
                stateIndex >= 0 && stateIndex < taskStates.length
                  ? taskStates[stateIndex]
                  : point.stateKey;

              return `
              <div style="display: flex; align-items: center; margin: 4px 0; padding-left: 6px; padding-right:6px">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: ${chartColor}; margin-right: 5px;"></span>
                <span style="margin-left: 5px;">${this.formatStatusLabel(
                  stateName
                )}</span>
              </div>`;
            })
            .join('')}
        `;
        },
      },
    };

    if (type === 'test') {
      this.testTaskMetrices = chartOptions;
    } else {
      this.executeTaskMetrices = chartOptions;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
