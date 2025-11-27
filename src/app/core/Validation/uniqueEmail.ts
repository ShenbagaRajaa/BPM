import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Check email is unique or not
export function uniqueEmail(mainEmailControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) return null; // Ensure parent exists
    const mainEmail = control.parent.get(mainEmailControlName)?.value;
    const emergencyEmail = control.value;

    if (mainEmail && emergencyEmail && mainEmail === emergencyEmail) {
      return { emailNotUnique: true }; // Error key for non-unique email
    }
    return null; // No error
  };
}
