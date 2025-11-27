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
import { IFilterParams, IDoesFilterPassParams } from 'ag-grid-community';

@Component({
  selector: 'app-status-filter',
  standalone: true,
  imports: [FormsModule, MatSelectModule, MatFormFieldModule, NgFor],
  templateUrl: './status-filter.component.html',
  styleUrl: './status-filter.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class StatusFilterComponent {
  @ViewChild('eFilterText') eFilterText!: ElementRef;

  options = [
    { id: '', name: 'All' },
    { id: 'true', name: 'Active' },
    { id: 'false', name: 'Inactive' },
  ];

  filterParams!: IFilterParams;
  filterText = '';
  //Initializes filter with parameters from ag-Grid
  agInit(params: IFilterParams): void {
    this.filterParams = params;
  }
  // Determines if a row passes the filter conditions
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
  // Checks if the filter is currently active
  isFilterActive(): boolean {
    return this.filterText !== null && this.filterText !== '';
  }
  // Gets the current filter model
  getModel() {
    if (!this.isFilterActive()) {
      return null;
    }

    return { value: this.filterText };
  }
  //Sets the filter model when restoring filter state

  setModel(model: any) {
    this.filterText = model === null ? null : model.value;
  }
  //Handles filter input changes and notifies ag-Grid
  onInputChanged() {
    this.filterParams.filterChangedCallback();
  }
}
