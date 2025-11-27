import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ColDef } from 'ag-grid-community';
import { appState } from '../../../core/store/app-state/app.state';
import {
  getSkills,
  deleteSkill,
  deleteSkillSuccess,
  addSkillSuccess,
  editSkillSuccess,
} from '../../../core/store/skills-state/skills.action';
import { selectAllSkills } from '../../../core/store/skills-state/skills.selector';
import { drSkill } from '../../../core/models/drSkill.model';
import { ConfirmDialogComponent } from '../../build-br-plan/confirm-dialog/confirm-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { AgGridAngular } from 'ag-grid-angular';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { CustomButtonComponent } from '../../../shared/custom-button/custom-button.component';
import { getAllUser } from '../../../core/store/user-state/user.action';
import { selectAllUsers } from '../../../core/store/user-state/user.selector';
import { addUserModel } from '../../../core/models/UserCreationTemp.model';
import {
  getPermissionIds,
  selectUser,
} from '../../../core/store/auth-state/auth.selector';
import { Actions, ofType } from '@ngrx/effects';
import { filter, Subject, takeUntil } from 'rxjs';
import { ViewSkillsComponent } from '../view-skills/view-skills.component';
import { CommonModule, DatePipe } from '@angular/common';
import { StatusFilterComponent } from '../../../shared/status-filter/status-filter.component';
import { getDRTeams } from '../../../core/store/drTeam-state/drTeam.action';
import { selectAllDRTeams } from '../../../core/store/drTeam-state/drTeam.selector';

@Component({
  selector: 'app-list-of-skills',
  standalone: true,
  templateUrl: './list-of-skills.component.html',
  styleUrls: ['./list-of-skills.component.css'],
  imports: [
    MatMenuModule,
    MatIconModule,
    InputFieldComponent,
    MatGridListModule,
    MatTableModule,
    NavigationbarComponent,
    MatCardModule,
    HttpClientModule,
    AgGridAngular,
    MatButtonModule,
    CommonModule,
  ],
  providers: [DatePipe],
})
export class ListOfSkillsComponent {
  filterValue = '';
  skills: drSkill[] = [];
  rowData: drSkill[] = [];
  originalRowData: drSkill[] = [];
  drTeamsMap: { [key: number]: string } = {};

  displayedColumns: ColDef[] = [];
  users: addUserModel[] = [];
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 20, 50];
  hasPermissionToCreate: boolean = false;
  hasPermissionToDelete: boolean = false;
  hasPermissionToEdit: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<appState>,
    private router: Router,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private actions$: Actions,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges() {}

  ngOnInit() {
    // Dispatch action to fetch DR Skills
    this.store.dispatch(getSkills());

    this.store.dispatch(getDRTeams());

    this.store
      .select(selectAllDRTeams)
      .pipe(
        takeUntil(this.destroy$),
        filter((data) => data.length > 0)
      )
      .subscribe((drTeams) => {
        this.drTeamsMap = this.createDrTeamsMap(drTeams);
        this.store.dispatch(getSkills());
      });

    this.store.select(selectAllSkills).subscribe((data) => {
      this.rowData = this.mapSkillsWithDrTeamName(data);
      this.originalRowData = this.rowData;
    });

    this.store
      .select(getPermissionIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissionIds) => {
        this.hasPermissionToCreate = permissionIds.includes('54');
        this.hasPermissionToEdit = permissionIds.includes('55');
        this.hasPermissionToDelete = permissionIds.includes('56');
        this.updateColumnDefinitions();
      });

    this.store.select(selectAllDRTeams).subscribe((data) => {
      this.drTeamsMap = this.createDrTeamsMap(data);
    });

    this.store.select(selectAllSkills).subscribe((data) => {
      this.rowData = this.mapSkillsWithDrTeamName(data);
      this.originalRowData = this.rowData;
    });

    this.store.dispatch(getAllUser());
    this.store.select(selectAllUsers).subscribe((data) => (this.users = data));

    this.actions$
      .pipe(
        ofType(deleteSkillSuccess, addSkillSuccess, editSkillSuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.store.dispatch(getSkills());
      });

    this.cdr.detectChanges();
  }
  // Helper function to create a map of DR team names by ID
  createDrTeamsMap(drTeams: { id: number; teamName: string }[]): {
    [key: number]: string;
  } {
    const map: { [key: number]: string } = {};
    drTeams.forEach((team) => {
      map[team.id] = team.teamName;
    });

    return map;
  }
  // Helper function to map skills with DR team names and user names
  mapSkillsWithDrTeamName(skills: drSkill[]): drSkill[] {
    return skills.map((skill) => ({
      ...skill,
      drTeamName: this.drTeamsMap[skill.drTeamId],
      createdByName:
        this.users.find((user) => user.id === skill.createdBy)
          ?.employeeFirstName +
        ' ' +
        this.users.find((user) => user.id === skill.createdBy)
          ?.employeeLastName,
    }));
  }

  openDRSkillsDetails(skill: drSkill) {
    // Find users who created/last changed the department
    const createdByDetails = this.users.find(
      (user) => user.id === skill.createdBy
    );
    const lastchangedByDetails = this.users.find(
      (user) => user.id === skill.lastChangedBy
    );

    const createdByName = createdByDetails
      ? `${createdByDetails.employeeFirstName} ${createdByDetails.employeeLastName}`
      : 'N/A';

    const lastchangedByName = lastchangedByDetails
      ? `${lastchangedByDetails.employeeFirstName} ${lastchangedByDetails.employeeLastName}`
      : 'N/A';

    const history = {
      createdBy: `Created By: ${createdByName}`,
      createdDate: `Created Date: ${
        skill.createdDate
          ? this.datePipe.transform(skill.createdDate, 'yyyy-MM-dd')
          : 'N/A'
      }`,
      lastChangedBy: `Last Changed By: ${lastchangedByName}`,
      lastChangedDate: `Last Changed Date: ${
        skill.lastChangedDate
          ? this.datePipe.transform(skill.lastChangedDate, 'yyyy-MM-dd')
          : 'N/A'
      }`,
    };

    const status = skill.status ? 'Active' : 'Inactive';

    const detailedDepartment = {
      ...skill,
      status,
      history,
    };

    this.dialog.open(ViewSkillsComponent, {
      width: '720px',
      data: detailedDepartment,
    });
  }
  // Update column definitions based on user permissions
  updateColumnDefinitions() {
    this.displayedColumns = [
      {
        field: 'skillName',
        headerName: 'DR Skill Name',
        flex: 2,
        cellRenderer: (params: any) => {
          const link = document.createElement('a');
          link.innerText = params.value;
          link.addEventListener('click', () => {
            this.ngZone.run(() => this.openDRSkillsDetails(params.data));
          });
          return link;
        },
      },
      {
        headerName: 'Status',
        field: 'status',
        flex: 1,
        sortable: false,
        cellRenderer: (params: any) => {
          return params.value ? 'Active' : 'Inactive';
        },
        filter: StatusFilterComponent,
      },
    ];

    // Add an action column if the user has edit permissions
    if (this.hasPermissionToEdit) {
      this.displayedColumns.push({
        field: 'Action',
        sortable: false,
        cellRenderer: CustomButtonComponent,
        flex: 1,
        cellRendererParams: () => {
          return {
            buttonClicked: (rowData: drSkill) => {
              this.createOrUpdateSkill(rowData);
            },
          };
        },
      });
    }

    // Add a delete column if the user has delete permissions
    if (this.hasPermissionToDelete) {
      this.displayedColumns.push({
        field: 'delete',
        headerName: 'Delete',
        flex: 1,
        sortable: false,
        cellRenderer: (params: any) => {
          const button = document.createElement('button');
          button.innerHTML = `<i class="material-icons text-text">delete_forever</i>`;
          button.style.border = 'none';
          button.style.padding = '10px 10px';
          button.style.cursor = 'pointer';

          button.addEventListener('click', () => {
            this.ngZone.run(() => {
              this.confirmDelete(params.data.id);
            });
          });

          return button;
        },
      });
    }
  }
  // Handle changes in the external search filter
  externalFilterChanged(value: string) {
    this.filterValue = value.toLowerCase();
    this.rowData = this.originalRowData.filter((row) =>
      row.skillName.toLowerCase().includes(this.filterValue)
    );
  }
  // Confirm deletion of a DR skill through a dialog
  confirmDelete(skillId: number) {
    let userId = 0;
    this.store.select(selectUser).subscribe((data) => {
      userId = data.user.id;
    });
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete DR Skill',
        message: 'Are you sure you want to delete this DR Skill?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(deleteSkill({ skillId, userId: userId }));
      }
    });
  }

  createOrUpdateSkill(skill?: drSkill) {
    if (skill) {
      this.router.navigate(['/home/skillManagement/newSkillsCreation'], {
        queryParams: { id: skill.id },
      });
    } else {
      this.router.navigate(['/home/skillManagement/newSkillsCreation']);
    }
  }

  viewSkillDetails(skill: drSkill) {
    this.dialog.open(ViewSkillsComponent, {
      width: '720px',
      data: skill,
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
