import { Component } from '@angular/core';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { StatusHighlighterComponent } from '../../../shared/status-highlighter/status-highlighter.component';
import { Store } from '@ngrx/store';
import { Task } from '../../../core/models/task.model';
import { appState } from '../../../core/store/app-state/app.state';
import { getTask } from '../../../core/store/task-state/task.action';
import { selectTask } from '../../../core/store/task-state/task.selector';
import { ActivatedRoute } from '@angular/router';
import { selectAllUsers } from '../../../core/store/user-state/user.selector';
import { environment } from '../../../../environment/environment';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [NavigationbarComponent, StatusHighlighterComponent, NgIf],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css',
})
export class TaskDetailsComponent {
  
  taskDetails: Task = {
    id: 0,
    planIdentifier: '',
    taskDescription: '',
    sequenceId: '',
    taskIdentifier: '',
    status: '',
    taskTitle: '',
    primaryTeamMember: 0,
    backupTeamMember: 0,
    taskEstimates: '',
    actualResponseTimeinMins: '',
    actualTimetoCompletioninMins: '',
    acknowledgedBy: '',
    acknowledgedDate: '',
    completedBy: '',
    completedDate: '',
    reportedProblemBy: '',
    problemReportedDate: '',
    createdBy: 0,
    fileName: '',
    filePath: '',
  };
  userId = 0;
  completedByName = 'N/A';
  reportedProblemByName = 'N/A';

  constructor(private route: ActivatedRoute, private store: Store<appState>) {
    this.route.queryParams.subscribe((params) => {
      this.taskId = params['taskId'];
      this.sequenceId = params['sequenceId'];
    });
  }

  primaryTeamMemberName: string = '';
  backupTeamMemberName: string = '';
  teamMembers: { id: number; employeeName: string }[] = [];
  sequenceId: number = 0;
  taskId: number = 0;

  ngOnInit() {
    // Dispatch action to get task details by taskId
    this.store.dispatch(getTask({ taskId: this.taskId }));
    this.store.select(selectTask).subscribe((data) => {
      this.taskDetails = { ...data };
      if (!this.taskDetails.acknowledgedBy) {
        this.taskDetails.acknowledgedBy = 'N/A';
      }
      this.mapTeamMemberNamesAndFormatEstimates();
    });

    this.store.select(selectAllUsers).subscribe((data) => {
      this.teamMembers = data.map((member) => ({
        id: member.id,
        employeeName: `${member.employeeFirstName} ${member.employeeLastName}`,
      }));
      // Map completedBy user name based on the user ID
      const completedByUser = this.teamMembers.find(
        (member) => member.id === Number(this.taskDetails.completedBy)
      );

      if (completedByUser) {
        this.completedByName = completedByUser.employeeName;
      } else {
        this.completedByName = 'N/A';
      }
      // Map reportedProblemBy user name based on the user ID
      const reportedProblemUser = this.teamMembers.find(
        (member) => member.id === Number(this.taskDetails.reportedProblemBy)
      );
      if (reportedProblemUser) {
        this.reportedProblemByName = reportedProblemUser.employeeName;
      } else {
        this.reportedProblemByName = 'N/A';
      }
    });
  }
  // Helper function to map team member names and format task-related data (estimates, times, dates)
  mapTeamMemberNamesAndFormatEstimates() {
    let primaryMemberName = 'Unknown';
    let backupMemberName = 'Unknown';
    // Find the primary and backup team members by their IDs
    if (this.teamMembers.length) {
      const primaryMember = this.teamMembers.find(
        (member) => member.id === this.taskDetails.primaryTeamMember
      );
      const backupMember = this.teamMembers.find(
        (member) => member.id === this.taskDetails.backupTeamMember
      );

      primaryMemberName = primaryMember
        ? primaryMember.employeeName
        : 'Unknown';
      backupMemberName = backupMember ? backupMember.employeeName : 'Unknown';
    }
    // Format task times and dates to a readable format
    const formattedTaskEstimates = this.formatTime(
      this.taskDetails.taskEstimates
    );

    const formattedActualResponseTime = this.formatTime(
      this.taskDetails.actualResponseTimeinMins
    );
    const formattedActualTimeToCompletion = this.formatTime(
      this.taskDetails.actualTimetoCompletioninMins
    );
    const formattedAcknowledgedDate = this.formatDateToLocal(
      this.taskDetails.acknowledgedDate
    );
    const formattedCompletedDate = this.formatDateToLocal(
      this.taskDetails.completedDate
    );
    const formattedReportedDate = this.formatDateToLocal(
      this.taskDetails.problemReportedDate
    );
    // Update the taskDetails object with formatted values
    this.taskDetails = {
      ...this.taskDetails,
      taskEstimates: formattedTaskEstimates,
      actualResponseTimeinMins: formattedActualResponseTime,
      actualTimetoCompletioninMins: formattedActualTimeToCompletion,
      acknowledgedDate: formattedAcknowledgedDate,
      completedDate: formattedCompletedDate,
      problemReportedDate: formattedReportedDate,
    };
    // Update team member names
    this.primaryTeamMemberName = primaryMemberName;
    this.backupTeamMemberName = backupMemberName;
  }
  // Format time in "hours:minutes" format (e.g., "120" -> "02:00")
  formatTime(value: string | number): string {
    if (!value) return '00:00';
    const time = value.toString().padStart(4, '0');
    return `${time.slice(0, 2)}:${time.slice(2)}`;
  }
  // Format date to local string format (e.g., "2025-02-06T12:34:56Z" -> "2/6/2025, 12:34:56 PM")
  formatDateToLocal(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString();
  }

  getFileUrl(): string | null {
      if (!this.taskDetails.filePath) {
        return null;
      }
      const sanitizedPath = this.taskDetails.filePath.replace(/\\/g, '/');
      return `${environment.apiUrl}/${sanitizedPath}`;
    }
}
