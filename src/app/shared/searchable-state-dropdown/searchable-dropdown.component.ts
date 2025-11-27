import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-searchable-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    NgxMatSelectSearchModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './searchable-dropdown.component.html',
  styleUrl: './searchable-dropdown.component.css',
})
export class SearchableDropdownComponent {
  @Input() label: string = '';
  @Input() options: any[] = [];
  @Input() formGroup?: FormGroup;
  @Input() controlName?: string;
  @Input() disabled: boolean = false;
  @Input() multiple: boolean = false;
  @Input() value: any;
  @Input() blankMsg: string = '';
  @Input() hint : boolean = false;
  @Input() hintText : string = '';
  @Output() activeValue = new EventEmitter<any>();

  selectFormControl = new FormControl();
  searchFormControl = new FormControl();
  filteredOptions: any[] = [];
  selectedValue: any;

  constructor(private store: Store) { }

  ngOnInit() {
    this.filteredOptions = [...this.options];

    // Use existing control from formGroup if provided
    if (this.formGroup && this.controlName) {
      const control = this.formGroup.get(this.controlName);
      if (control instanceof FormControl) {
        this.selectFormControl = control;
      }
    }

    // Disable if input is true
    if (this.disabled) {
      this.selectFormControl.disable();
    }

    // Filter logic
    this.searchFormControl.valueChanges.subscribe((search: string | null) => {
      if (!search) {
        this.filteredOptions = [...this.options];
        return;
      }

      this.filteredOptions = this.options.filter((option) =>
        this.getOptionDisplay(option).toLowerCase().includes(search.toLowerCase())
      );
    });

    // Emit selected value
    this.selectFormControl.valueChanges.subscribe((value) => {
      this.selectedValue = value;
      this.activeValue.emit(value);
    });

    if (this.value !== undefined) {
      this.selectFormControl.setValue(this.value, { emitEvent: false });
      this.selectedValue = this.value;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && changes['value'].currentValue !== undefined) {
      this.selectFormControl.setValue(this.value, { emitEvent: false });
      // this.activeValue.emit(this.value);
    }

    if (changes['options']) {
      this.filteredOptions = [...this.options];
    }

    // Handle disabled state changes through the FormControl
    if (changes['disabled'] && this.formGroup && this.controlName) {
      const control = this.formGroup.get(this.controlName);
      if (control) {
        if (this.disabled) {
          control.disable();
        } else {
          control.enable();
        }
      }
    }

  }

  get control(): AbstractControl | null {
    return this.formGroup && this.controlName
      ? this.formGroup.get(this.controlName)
      : null;
  }

  get shouldShowError(): boolean {
    const control = this.control;
    return !!control && control.touched && control.invalid;
  }

  get hasRequiredError(): boolean {
    const control = this.control;
    return !!control && !!control.errors?.['required'];
  }

  getOptionValue(option: any): any {
    if (option && option.hasOwnProperty('id')) {
      return option.id; // always return the id
    }
    return (
      option?.code ||
      option?.id ||
      option?.type ||
      option?.shortName ||
      option
    );
  }

  getOptionDisplay(option: any): string {
    return (
      option?.planName ||
      option?.name ||
      option?.siteName ||
      option?.type ||
      option?.roleName ||
      option?.sequenceNumber ||
      option?.planIdentifier ||
      option?.toString?.() ||
      ''
    );
  }

  onSelectionChange(event: any) {
  }
}