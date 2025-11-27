import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    MatIconModule,
  ],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.css',
})
export class InputFieldComponent {
  @Input() label = 'Input';
  @Input() placeHolder = 'placeHolder';
  @Input() controlName = '';
  @Input() maxValue = 0;
  @Input() minValue = 0;
  @Input() formGroup!: FormGroup;
  @Input() readOnly = false;
  @Input() pattern = '';
  @Input() patternErrorMessage = '';
  @Input() email = false;
  @Input() countryCode = 0;
  @Output() activeValue = new EventEmitter<any>();
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
  @Input() disabled: boolean = false;

  inputValue: any;
  private onChange: any = () => {};
  // Method to emit the value when it's passed to the component
  passvalue(value: string) {
    this.activeValue.emit(value);
  }

  // Method to handle value changes and emit the updated value
  onValueChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.valueChange.emit(inputElement.value);
  }

  deleteValue() {
    this.inputValue = '';
    this.activeValue.emit('');
  }

  // Method to handle input value change
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    const control = this.formGroup?.get(this.controlName);

    if (value.trim() === '') {
      // Case: only spaces → clear the field
      this.value = '';
      control?.setValue('', { emitEvent: true });
      this.activeValue.emit('');
      this.valueChange.emit('');
    } else {
      // Keep spaces inside words
      this.value = value;
      this.onChange(value);
      control?.setValue(value, { emitEvent: true });
      this.valueChange.emit(value);
    }
  }
}
