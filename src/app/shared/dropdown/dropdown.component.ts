import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgFor,
    OverlayModule,
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class DropdownComponent {
  isOpen = false;
  @Input() label = 'Input';
  @Input() controlName = '';
  @Input() formGroup!: FormGroup;
  @Input() options: any[] = [];
  @Input() multiple: boolean = false;
  @Input() disabled: boolean = false;
  @Output() activeValue = new EventEmitter<any>();
  @Input() filterValue: string = '';
  @Output() change = new EventEmitter<string>();
  @Input() selectedValue: any;
  @Input() value: any;
  @Input() valueField: any;
  @Input() displayField: any;
  @Input() blankMsg: string = '';

  constructor() {}
  // Handles selection changes in the dropdown
  onSelectionChange(event: MatSelectChange) {
    this.activeValue.emit(event.value);
  }

  ngOnChanges(changes: SimpleChanges) {
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
}
