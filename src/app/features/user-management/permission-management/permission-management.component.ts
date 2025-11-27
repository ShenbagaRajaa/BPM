import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { Store } from '@ngrx/store';
import { appState } from '../../../core/store/app-state/app.state';
import { permission } from '../../../core/models/permissions.model';
import { ColDef } from 'ag-grid-community';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AgGridAngular } from 'ag-grid-angular';
import { Subject } from 'rxjs';
import { selectAllPermissions } from '../../../core/store/permission-state/permission.selector';
import { getPermissions } from '../../../core/store/permission-state/permission.action';

@Component({
  selector: 'app-permission-management',
  standalone: true,
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
  templateUrl: './permission-management.component.html',
  styleUrl: './permission-management.component.css',
})
export class PermissionManagementComponent {
  permissions: permission[] = [];
  tableData = new MatTableDataSource<any>();
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 20, 50];
  displayedColumns: ColDef[] = [
    { field: 'permissionName', headerName: 'Permission Name', flex: 3 },
    {
      field: 'description',
      headerName: 'Permission Description',
      flex: 3,
      sortable: false,
    },
  ];
  filteredPermissions: permission[] = [];
  destroy$ = new Subject<void>();
  isBrowser: boolean;

  constructor(
    private store: Store<appState>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Dispatch action to fetch permissions from the store
    this.store.dispatch(getPermissions());

    this.store.select(selectAllPermissions).subscribe((permissions) => {
      this.permissions = permissions;
      this.filteredPermissions = [...permissions];
    });
  }
  // Handles filtering the permissions list based on search input
  externalFilterChanged(value: string): void {
    const searchValue = value.toLowerCase();
    this.filteredPermissions = this.permissions.filter((p) =>
      p.permissionName.toLowerCase().includes(searchValue)
    );
  }
  // Handles sorting permissions based on user selection
  onSortChange(event: any) {
    this.filteredPermissions.sort((a, b) => {
      if (event.sortDirection === 'asc') {
        return a.permissionName.localeCompare(b.permissionName);
      } else {
        return b.permissionName.localeCompare(a.permissionName);
      }
    });
  }
  // Cleanup to prevent memory leaks when the component is destroyed
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
