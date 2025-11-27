import { NgFor } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { IFilterParams, IDoesFilterPassParams } from 'ag-grid-community';
import { selectAllRoles } from '../../core/store/role-state/role.selector';
import { getRoles } from '../../core/store/role-state/role.action';
import { map } from 'rxjs';

@Component({
  selector: 'app-role-filter',
  standalone: true,
  imports: [FormsModule, MatSelectModule, MatFormFieldModule, NgFor],
  templateUrl: './role-filter.component.html',
  styleUrl: './role-filter.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class RoleFilterComponent {
  @ViewChild('eFilterText') eFilterText!: ElementRef;

  options = [{ id: '', value: 'All' }];

  filterParams!: IFilterParams;
  filterText = '';

  agInit(params: IFilterParams): void {
    this.filterParams = params;
  }

  constructor(private store: Store) {
    // Dispatch the action to load roles
    store.dispatch(getRoles());
    this.store
      .select(selectAllRoles)
      .pipe(
        map((roles) => [
          { id: '', value: 'All' }, // Add 'All' option
          ...roles.map((role) => ({
            id: role.roleName, // Assuming role has an id field
            value: role.roleName,
          })),
        ])
      )
      .subscribe((formattedRoles) => {
        this.options = formattedRoles;
      });
  }

  // Method to check if a given row passes the filter criteria
  doesFilterPass(params: IDoesFilterPassParams) {
    let passed = true;
    const { node } = params;

    this.filterText
      .toLowerCase()
      .split(' ')
      .forEach((filterWord) => {
        const value = this.filterParams.getValue(node);

        if (value.toString().toLowerCase().indexOf(filterWord) < 0) {
          passed = false;
        }
      });

    return passed;
  }
  // Method to check if the filter is active (non-empty filter text)
  isFilterActive(): boolean {
    return this.filterText !== null && this.filterText !== '';
  }
  // Method to get the current filter model (the value of the filter)
  getModel() {
    if (!this.isFilterActive()) {
      return null;
    }

    return { value: this.filterText };
  }
  // Method to set the filter model (set the filter text)
  setModel(model: any) {
    this.filterText = model === null ? null : model.value;
  }
  // Method to handle input changes, triggers the filter change callback
  onInputChanged() {
    this.filterParams.filterChangedCallback();
  }
}
