import { NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatError } from '@angular/material/form-field';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [ReactiveFormsModule, MatDividerModule, MatError, NgIf],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.css',
})
export class ImageUploadComponent {
  @Input() path: string = '';
  @Input() formGroup!: FormGroup;
  @Input() controlName: string = '';
  @Input() label: string = '';
  @Output() activeValue = new EventEmitter<File>();
  @Output() valid = new EventEmitter<boolean>();
  @Input() isRequired: boolean = false;
  imagePreview: string | ArrayBuffer | null = null;
  fileError: string | null = null;
  apiUrl = environment.apiUrl;

  @ViewChild('imageInput') imageInput!: any;

  ngOnInit() {
    // Checks if the 'path' input is set. If so, it initializes the image preview with the provided URL.
    if (this.path) {
      this.passValid();
      this.imagePreview = this.apiUrl + '/' + this.path;
    }
  }

  ngOnChanges() {
    // Handles any changes to the component's inputs. If 'path' is updated, it sets the image preview accordingly.
    if (this.path) {
      this.passValid();
      this.imagePreview = this.apiUrl + '/' + this.path;
    }
  }

  triggerImageUpload(): void {
    // Triggers the file input (hidden) to open the file picker dialog.
    // Sets a validation error message if an image is required but hasn't been selected.
    this.imageInput.nativeElement.click();
    this.fileError = 'Profile is required';
  }

  passValid() {
    // Emits an event to indicate that the input is valid. This is likely used by the parent component to track form validity.
    this.valid.emit(true);
  }

  onImageSelected(event: any): void {
    // Handles the file selection event when the user picks an image.
    const file = event.target.files[0];
    this.fileError = null;

    if (file) {
      const validFileTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validFileTypes.includes(file.type)) {
        this.fileError = 'Only JPG, PNG, or WEBP formats are allowed.';
        return;
      }

      const maxSizeInBytes = 2 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        this.fileError = 'The file size must be less than 2MB.';
        return;
      }
      this.activeValue.emit(file);
      this.valid.emit(true);
      this.resizeImage(file);
    }
  }

  removeImage(): void {
    // Clears the image preview and resets the file input.
    // Marks the input as invalid and resets any error message.
    this.imagePreview = null;
    this.fileError = 'Profile is required';
    this.imageInput.nativeElement.value = '';
    this.valid.emit(false);
  }

  resizeImage(file: File): void {
    // Resizes the selected image to fit within a 200x200 pixel box while maintaining the aspect ratio.
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const MAX_WIDTH = 200;
        const MAX_HEIGHT = 200;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const aspectRatio = width / height;
          if (width > height) {
            width = MAX_WIDTH;
            height = width / aspectRatio;
          } else {
            height = MAX_HEIGHT;
            width = height * aspectRatio;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        this.imagePreview = canvas.toDataURL(file.type);
      };
    };

    reader.readAsDataURL(file);
  }
}
