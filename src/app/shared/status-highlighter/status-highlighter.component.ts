import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ICellRendererParams } from 'ag-grid-community';

interface CustomCellRendererParams extends ICellRendererParams {
  buttonClicked: (rowData: any) => void;
  showButton: boolean;
  status: string;
}

@Component({
  selector: 'app-status-highlighter',
  standalone: true,
  imports: [MatButtonModule, MatChipsModule, NgStyle],
  templateUrl: './status-highlighter.component.html',
  styleUrl: './status-highlighter.component.css',
})
export class StatusHighlighterComponent {
  @Output() buttonClick = new EventEmitter<any>();
  @Input() status: string = '';
  onButtonClickHandler!: (rowData: any) => void;
  params!: CustomCellRendererParams;
  // Handles button click event and calls the provided callback function
  buttonClicked(): void {
    if (this.params?.buttonClicked) {
      this.params.buttonClicked(this.params.data);
    } else {
      // Fallback to emitting the event if no callback is provided
      this.buttonClick.emit(this.params?.data);
    }
    // this.params.buttonClicked(this.params.data);
  }
  //Initializes the component with data from ag-Grid
  agInit(params: CustomCellRendererParams): void {
    this.params = params;
    this.refresh(params);
  }
  //Refreshes the component when ag-Grid updates the cell
  refresh(params: CustomCellRendererParams): boolean {
    this.status = params.value;
    return true;
  }
  //Stores the color settings for various statuses
  private statuses: StatusColors = {
    // Plan statuses
    PlanBuildInProgress: { borderColor: '#00b0f0', textColor: '#00b0f0' },
    PlanBuildReady: { borderColor: '#0070c0', textColor: '#0070c0' },
    PlanReadyToBeTested: { borderColor: '#943634', textColor: '#943634' },
    PlanTestInProgress: { borderColor: '#f58f0a', textColor: '#f58f0a' },
    PlanTested: { borderColor: '#e36c0a', textColor: '#e36c0a' },
    PlanApproved: { borderColor: '#5f497a', textColor: '#5f497a' },
    PlanReadyToBeExecuted: { borderColor: '#76923c', textColor: '#76923c' },
    PlanExecutionInProgress: { borderColor: '#4f6228', textColor: '#4f6228' },
    PlanExecuted: { borderColor: '#00b050', textColor: '#00b050' },
    PlanTestAborted: { borderColor: '#c00000', textColor: '#c00000' },
    InTestPlanFailed: { borderColor: '#c00000', textColor: '#c00000' },
    InExecutePlanFailed: { borderColor: '#c00000', textColor: '#c00000' },

    // Sequence statuses
    SequenceBuildStarted: { borderColor: '#00b0f0', textColor: '#00b0f0' },
    SequenceBuildCompleted: {
      borderColor: '#0070c0',
      textColor: '#0070c0',
    },
    SequenceTestInProgress: { borderColor: '#f58f0a', textColor: '#f58f0a' },
    SequenceTested: { borderColor: '#e36c0a', textColor: '#e36c0a' },
    SequenceExecutionInProgress: {
      borderColor: '#76923c',
      textColor: '#76923c',
    },
    SequenceExecuted: { borderColor: '#00b050', textColor: '#00b050' },
    InTestSequenceFailed: { borderColor: '#c00000', textColor: '#c00000' },
    InExecuteSequenceFailed: { borderColor: '#c00000', textColor: '#c00000' },
    SequenceTestAborted: { borderColor: '#c00000', textColor: '#c00000' },

    // Task statuses
    InBuildNew: { borderColor: '#00b0f0', textColor: '#00b0f0' },
    InTestDispatched: { borderColor: '#5f497a', textColor: '#5f497a' },
    InTestAcknowledged: { borderColor: '#f58f0a', textColor: '#f58f0a' },
    InTestCompleted: { borderColor: '#e36c0a', textColor: '#e36c0a' },
    InTestProblem: { borderColor: '#ff0000', textColor: '#ff0000' },
    InTestProblemResolved: { borderColor: '#5f497a', textColor: '#5f497a' },
    InTestTaskTestFailed: { borderColor: '#c00000', textColor: '#c00000' },
    InExecuteDispatched: { borderColor: 'orange', textColor: 'orange' },
    InExecuteAcknowledged: { borderColor: '#76923c', textColor: '#76923c' },
    InExecuteCompleted: { borderColor: '#00b050', textColor: '#00b050' },
    InExecuteProblem: { borderColor: '#943634', textColor: '#943634' },
    InExecuteProblemResolved: { borderColor: '#5f497a', textColor: '#5f497a' },
    InExecuteFailed: { borderColor: '#c00000', textColor: '#c00000' },
  };
  // Retrieves the border color for the given status
  getBorderColor(status: string): string {
    return this.statuses[status]?.borderColor || 'gray';
  }
  //Retrieves the text color for the given status
  getTextColor(status: string): string {
    return this.statuses[status]?.textColor || 'black';
  }
}
//Defines the structure for status colors
interface StatusColors {
  [key: string]: { borderColor: string; textColor: string };
}
