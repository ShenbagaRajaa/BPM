import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Check phone number is unique or not
export function uniquePhoneNumber(mobileControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) return null; // Parent might not exist yet
    const mobileNumber = control.parent.get(mobileControlName)?.value;
    const emergencyPhone = control.value;

    if (mobileNumber && emergencyPhone && mobileNumber === emergencyPhone) {
      return { phoneNumberNotUnique: true }; // Error key for invalid uniqueness
    }
    return null; // No error
  };
}
